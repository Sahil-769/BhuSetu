import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, String, create_engine, func, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship, sessionmaker

from .ml.predictor import Predictor

logging.basicConfig(level=logging.INFO)
ROOT = Path(__file__).resolve().parents[2]
database_url = os.getenv("DATABASE_URL", f"sqlite:///{ROOT / 'bhoomi_ai.db'}")
engine = create_engine(database_url, connect_args={"check_same_thread": False} if database_url.startswith("sqlite") else {})
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
model_path = os.getenv("MODEL_PATH", str(ROOT / "machine-learning-algo" / "land_acquisition_xgb_model.pkl"))
metadata_path = os.getenv("MODEL_METADATA_PATH", str(ROOT / "machine-learning-algo" / "model_metadata.json"))
predictor = Predictor(model_path, metadata_path)


class Base(DeclarativeBase):
    pass


class Project(Base):
    __tablename__ = "projects"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    type: Mapped[str] = mapped_column(String(80))
    state: Mapped[str] = mapped_column(String(100))
    district: Mapped[str] = mapped_column(String(100))
    village: Mapped[str | None] = mapped_column(String(200), nullable=True)
    tehsil: Mapped[str | None] = mapped_column(String(100), nullable=True)
    required_land_area: Mapped[float] = mapped_column(Float, default=0)
    geometry: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    status: Mapped[str] = mapped_column(String(80), default="Draft")
    risk_probability: Mapped[float | None] = mapped_column(Float, nullable=True)
    risk_category: Mapped[str | None] = mapped_column(String(20), nullable=True)
    acquisition_data: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    assessments: Mapped[list["Assessment"]] = relationship(cascade="all, delete-orphan")


class Assessment(Base):
    __tablename__ = "assessments"
    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), index=True)
    delay_probability: Mapped[float] = mapped_column(Float)
    risk_category: Mapped[str] = mapped_column(String(20))
    risk_factors: Mapped[list] = mapped_column(JSON, default=list)
    factor_importance: Mapped[dict] = mapped_column(JSON, default=dict)
    recommendations: Mapped[list] = mapped_column(JSON, default=list)
    risk_trend: Mapped[str] = mapped_column(String(20), default="STABLE")
    model_version: Mapped[str] = mapped_column(String(80))
    prediction_source: Mapped[str] = mapped_column(String(40))
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class RiskHistory(Base):
    __tablename__ = "risk_history"
    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), index=True)
    previous_probability: Mapped[float | None] = mapped_column(Float, nullable=True)
    new_probability: Mapped[float] = mapped_column(Float)
    previous_risk: Mapped[str | None] = mapped_column(String(20), nullable=True)
    new_risk: Mapped[str] = mapped_column(String(20))
    changed_fields: Mapped[list] = mapped_column(JSON, default=list)
    prediction_source: Mapped[str] = mapped_column(String(40))
    model_version: Mapped[str] = mapped_column(String(80))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class Intervention(Base):
    __tablename__ = "interventions"
    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), index=True)
    intervention_type: Mapped[str] = mapped_column(String(100))
    action_taken: Mapped[str] = mapped_column(String(500))
    responsible_officer: Mapped[str] = mapped_column(String(120))
    priority: Mapped[str] = mapped_column(String(30), default="Medium")
    due_date: Mapped[str | None] = mapped_column(String(30), nullable=True)
    remarks: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="Open")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class ProjectIn(BaseModel):
    projectId: str = Field(min_length=1)
    projectName: str = Field(min_length=1)
    projectType: str = Field(min_length=1)
    state: str = Field(min_length=1)
    district: str = Field(min_length=1)
    village: str | None = None
    villages: str | None = None
    tehsil: str | None = None
    requiredLandArea: float = Field(gt=0)
    unit: str = "Hectare"
    locationType: str = "linear"
    latitude: float | None = None
    longitude: float | None = None
    geometry: dict | None = None
    status: str = "Pending LAO Verification"


class InterventionIn(BaseModel):
    project_id: int
    intervention_type: str
    action_taken: str
    responsible_officer: str
    priority: str = "Medium"
    due_date: str | None = None
    remarks: str | None = None


class WorkflowIn(BaseModel):
    status: str = Field(min_length=1)
    workflowStatus: str | None = None
    nodalReviewCompleted: bool | None = None
    submittedAt: str | None = None
    submittedBy: str | None = None
    correctionReason: str | None = None
    verification: dict | None = None
    workflowActivity: list[dict] | None = None


def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def serialize_project(project: Project) -> dict:
    workflow = (project.acquisition_data or {}).get("workflow", {})
    return {"id": project.id, "projectId": project.project_id, "name": project.name, "type": project.type, "state": project.state, "district": project.district, "village": project.village, "tehsil": project.tehsil, "requiredLandArea": project.required_land_area, "geometry": project.geometry, "status": project.status, "workflowStatus": workflow.get("workflowStatus", project.status), "nodalReviewCompleted": workflow.get("nodalReviewCompleted", False), "submittedAt": workflow.get("submittedAt"), "submittedBy": workflow.get("submittedBy"), "correctionReason": workflow.get("correctionReason"), "verification": workflow.get("verification"), "workflowActivity": workflow.get("workflowActivity", []), "riskProbability": project.risk_probability, "riskCategory": project.risk_category, "createdAt": project.created_at.isoformat(), "updatedAt": project.updated_at.isoformat()}


app = FastAPI(title="BHOOMI-AI API", version="1.0.0", docs_url="/docs", openapi_url="/api/openapi.json")
origins = [item.strip() for item in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"], allow_credentials=True)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(engine)


@app.get("/api/health")
def health():
    return {"status": "ok", "model_loaded": predictor.model is not None, "prediction_source": "ML_MODEL" if predictor.model is not None else "RULE_BASED_FALLBACK"}


@app.get("/api/projects")
def list_projects(session: Session = Depends(db), risk: str | None = Query(None), district: str | None = Query(None)):
    statement = select(Project).order_by(Project.updated_at.desc())
    if risk: statement = statement.where(Project.risk_category == risk.upper())
    if district: statement = statement.where(Project.district == district)
    return [serialize_project(item) for item in session.scalars(statement).all()]


@app.post("/api/projects", status_code=201)
def create_project(payload: ProjectIn, session: Session = Depends(db)):
    if session.scalar(select(Project).where(Project.project_id == payload.projectId)):
        raise HTTPException(409, "Project ID already exists")
    geometry = payload.geometry or ({"type": "Point", "coordinates": [payload.longitude, payload.latitude]} if payload.latitude is not None and payload.longitude is not None else None)
    project = Project(project_id=payload.projectId, name=payload.projectName, type=payload.projectType, state=payload.state, district=payload.district, village=payload.village or payload.villages, tehsil=payload.tehsil, required_land_area=payload.requiredLandArea, geometry=geometry, status=payload.status)
    session.add(project)
    session.commit()
    session.refresh(project)
    return serialize_project(project)


@app.get("/api/projects/{project_id}")
def get_project(project_id: int, session: Session = Depends(db)):
    project = session.get(Project, project_id)
    if not project: raise HTTPException(404, "Project not found")
    return serialize_project(project)


@app.get("/api/projects/{project_id}/geometry")
def get_geometry(project_id: int, session: Session = Depends(db)):
    project = session.get(Project, project_id)
    if not project: raise HTTPException(404, "Project not found")
    return {"geometry": project.geometry, "gis_available": project.geometry is not None, "label": "Demo GIS data"}


@app.put("/api/projects/{project_id}/workflow")
def update_project_workflow(project_id: int, payload: WorkflowIn, session: Session = Depends(db)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    current_data = project.acquisition_data or {}
    current_workflow = current_data.get("workflow", {})
    next_workflow = {**current_workflow, **payload.model_dump(exclude_none=True)}
    project.acquisition_data = {**current_data, "workflow": next_workflow}
    project.status = payload.status
    project.updated_at = datetime.now(timezone.utc)
    session.commit()
    session.refresh(project)
    return serialize_project(project)


@app.put("/api/projects/{project_id}/acquisition")
def update_acquisition(project_id: int, data: dict, session: Session = Depends(db)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    project.acquisition_data = {**(project.acquisition_data or {}), **data}
    return _save_prediction(session, project, list(data.keys()))


def _save_prediction(session: Session, project: Project, changed_fields: list[str]):
    result = predictor.predict({"project_type": project.type, "state": project.state, "district": project.district, "tehsil": project.tehsil or "Unknown", "required_land_area_acres": project.required_land_area, "gis_available": bool(project.geometry), **(project.acquisition_data or {})})
    previous = session.scalars(select(Assessment).where(Assessment.project_id == project.id).order_by(Assessment.created_at.desc())).first()
    result["risk_trend"] = "INCREASING" if previous and result["delay_probability"] > previous.delay_probability else "DECREASING" if previous and result["delay_probability"] < previous.delay_probability else "STABLE"
    session.add(Assessment(project_id=project.id, delay_probability=result["delay_probability"], risk_category=result["risk_category"], risk_factors=result["top_risk_factors"], factor_importance=result["factor_importance"], recommendations=result["recommendations"], risk_trend=result["risk_trend"], model_version=result["model_version"], prediction_source=result["prediction_source"], confidence=result["confidence"]))
    session.add(RiskHistory(project_id=project.id, previous_probability=previous.delay_probability if previous else None, new_probability=result["delay_probability"], previous_risk=previous.risk_category if previous else None, new_risk=result["risk_category"], changed_fields=changed_fields, prediction_source=result["prediction_source"], model_version=result["model_version"]))
    project.risk_probability = result["delay_probability"]
    project.risk_category = result["risk_category"]
    project.updated_at = datetime.now(timezone.utc)
    session.commit()
    return {"project": serialize_project(project), "assessment": result}


@app.post("/api/ai/predict/{project_id}")
def predict(project_id: int, session: Session = Depends(db)):
    project = session.get(Project, project_id)
    if not project: raise HTTPException(404, "Project not found")
    result = predictor.predict({"project_type": project.type, "state": project.state, "district": project.district, "tehsil": project.tehsil or "Unknown", "required_land_area_acres": project.required_land_area, "gis_available": bool(project.geometry), **(project.acquisition_data or {})})
    previous = session.scalars(select(Assessment).where(Assessment.project_id == project.id).order_by(Assessment.created_at.desc())).first()
    result["risk_trend"] = "INCREASING" if previous and result["delay_probability"] > previous.delay_probability else "DECREASING" if previous and result["delay_probability"] < previous.delay_probability else "STABLE"
    assessment = Assessment(project_id=project.id, delay_probability=result["delay_probability"], risk_category=result["risk_category"], risk_factors=result["top_risk_factors"], factor_importance=result["factor_importance"], recommendations=result["recommendations"], risk_trend=result["risk_trend"], model_version=result["model_version"], prediction_source=result["prediction_source"], confidence=result["confidence"])
    session.add(assessment)
    session.add(RiskHistory(project_id=project.id, previous_probability=previous.delay_probability if previous else None, new_probability=result["delay_probability"], previous_risk=previous.risk_category if previous else None, new_risk=result["risk_category"], changed_fields=[], prediction_source=result["prediction_source"], model_version=result["model_version"]))
    project.risk_probability = result["delay_probability"]
    project.risk_category = result["risk_category"]
    project.updated_at = datetime.now(timezone.utc)
    session.commit()
    return result


@app.get("/api/ai/assessment/{project_id}")
def assessment(project_id: int, session: Session = Depends(db)):
    item = session.scalars(select(Assessment).where(Assessment.project_id == project_id).order_by(Assessment.created_at.desc())).first()
    if not item: raise HTTPException(404, "No assessment available")
    return {"delay_probability": item.delay_probability, "risk_category": item.risk_category, "top_risk_factors": item.risk_factors, "factor_importance": item.factor_importance, "recommendations": item.recommendations, "risk_trend": item.risk_trend, "model_version": item.model_version, "prediction_source": item.prediction_source, "confidence": item.confidence, "last_updated": item.created_at.isoformat()}


@app.get("/api/ai/history/{project_id}")
def history(project_id: int, session: Session = Depends(db)):
    return [{"previous_probability": item.previous_probability, "new_probability": item.new_probability, "previous_risk": item.previous_risk, "new_risk": item.new_risk, "changed_fields": item.changed_fields, "timestamp": item.created_at.isoformat(), "model_version": item.model_version, "prediction_source": item.prediction_source} for item in session.scalars(select(RiskHistory).where(RiskHistory.project_id == project_id).order_by(RiskHistory.created_at.desc())).all()]


@app.post("/api/interventions", status_code=201)
def create_intervention(payload: InterventionIn, session: Session = Depends(db)):
    if not session.get(Project, payload.project_id): raise HTTPException(404, "Project not found")
    item = Intervention(**payload.model_dump())
    session.add(item)
    session.commit()
    session.refresh(item)
    return {"id": item.id, **payload.model_dump(), "status": item.status, "created_at": item.created_at.isoformat()}


@app.get("/api/analytics/risk-distribution")
def risk_distribution(session: Session = Depends(db)):
    rows = session.execute(select(Project.risk_category, func.count(Project.id)).where(Project.risk_category.is_not(None)).group_by(Project.risk_category)).all()
    return [{"risk_category": category, "count": count} for category, count in rows]
