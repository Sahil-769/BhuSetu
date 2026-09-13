import json
import logging
import math
from datetime import datetime, timezone
from pathlib import Path

import joblib

logger = logging.getLogger(__name__)


def explainable_factors(data: dict) -> list[dict]:
    checks = [
        (data.get("legal_case_exists") or data.get("legal_status") in {"Dispute Identified", "Under Review", "Pending Authority"}, 20, "Legal dispute or case pending", "Track the next legal milestone through the competent authority."),
        (data.get("ownership_conflict") or data.get("ownership_status") not in {None, "Verified", "Clear"}, 18, "Ownership verification incomplete", "Complete ownership, title and mutation verification."),
        (data.get("compensation_status") not in {None, "Paid", "Awarded"}, 18, "Compensation is not complete", "Close assessment, award and payment records with the responsible authority."),
        (data.get("rr_status") not in {None, "Completed", "Not Applicable"}, 14, "R&R actions remain pending", "Review entitlements, relocation and support milestones."),
        (data.get("approval_status") not in {None, "Approved", "Not Applicable"}, 12, "Approval dependency remains", "Follow up with the pending approving authority."),
        (data.get("documents_status") not in {None, "Complete", "Available"}, 10, "Documentation is incomplete", "Request and record the missing acquisition documents."),
    ]
    factors = [{"factor": label, "importance": weight, "explanation": label, "recommendation": recommendation} for active, weight, label, recommendation in checks if active]
    return factors or [{"factor": "No blocking acquisition factor reported", "importance": 5, "explanation": "The submitted acquisition statuses do not currently identify a blocking issue.", "recommendation": "Continue routine monitoring and keep acquisition records current."}]


class Predictor:
    def __init__(self, model_path: str, metadata_path: str):
        self.model = None
        self.metadata = {}
        self.model_version = "unavailable"
        try:
            self.metadata = json.loads(Path(metadata_path).read_text(encoding="utf-8"))
            self.model = joblib.load(model_path)
            self.model_version = "xgb-existing-model"
        except Exception as exc:
            logger.exception("Unable to load configured ML model; fallback will be used: %s", exc)

    @staticmethod
    def _fallback(data: dict) -> dict:
        checks = [
            (data.get("legal_case_exists") or data.get("legal_status") in {"Dispute Identified", "Under Review", "Pending Authority"}, 20, "Legal dispute or case pending", "Track the next legal milestone through the competent authority."),
            (data.get("ownership_conflict") or data.get("ownership_status") not in {"Verified", "Clear"}, 18, "Ownership verification incomplete", "Complete ownership, title and mutation verification."),
            (data.get("compensation_status") not in {"Paid", "Awarded"}, 18, "Compensation is not complete", "Close assessment, award and payment records with the responsible authority."),
            (data.get("rr_status") not in {"Completed", "Not Applicable"}, 14, "R&R actions remain pending", "Review entitlements, relocation and support milestones."),
            (data.get("approval_status") not in {"Approved", "Not Applicable"}, 12, "Approval dependency remains", "Follow up with the pending approving authority."),
            (data.get("documents_status") not in {"Complete", "Available"}, 10, "Documentation is incomplete", "Request and record the missing acquisition documents."),
        ]
        probability = min(95, max(5, 18 + sum(weight for active, weight, _, _ in checks if active)))
        factors = [{"factor": label, "importance": weight, "explanation": label, "recommendation": recommendation} for active, weight, label, recommendation in checks if active]
        category = "CRITICAL" if probability >= 75 else "HIGH" if probability >= 50 else "MEDIUM" if probability >= 25 else "LOW"
        return {"delay_probability": float(probability), "risk_category": category, "top_risk_factors": factors[:5], "factor_importance": {item["factor"]: item["importance"] for item in factors[:5]}, "recommendations": [item["recommendation"] for item in factors[:5]], "risk_trend": "STABLE", "model_version": "rule-based-fallback-v1", "confidence": None, "prediction_source": "RULE_BASED_FALLBACK", "last_updated": datetime.now(timezone.utc).isoformat()}

    def predict(self, data: dict) -> dict:
        if self.model is None or not self.metadata.get("feature_columns"):
            return self._fallback(data)
        try:
            import pandas as pd
            features = {name: data.get(name, 0 if name in self.metadata.get("numeric_cols", []) else "Unknown") for name in self.metadata["feature_columns"]}
            frame = pd.DataFrame([features], columns=self.metadata["feature_columns"])
            probability = float(self.model.predict_proba(frame)[0][1] * 100) if hasattr(self.model, "predict_proba") else float(self.model.predict(frame)[0])
            probability = max(0, min(100, probability))
            category = "CRITICAL" if probability >= 75 else "HIGH" if probability >= 50 else "MEDIUM" if probability >= 25 else "LOW"
            factors = explainable_factors(data)
            return {"delay_probability": round(probability, 2), "risk_category": category, "top_risk_factors": factors[:5], "factor_importance": {item["factor"]: item["importance"] for item in factors[:5]}, "recommendations": [item["recommendation"] for item in factors[:5]], "risk_trend": "STABLE", "model_version": self.model_version, "confidence": None, "prediction_source": "ML_MODEL", "last_updated": datetime.now(timezone.utc).isoformat()}
        except Exception as exc:
            logger.exception("Model prediction failed; fallback will be used: %s", exc)
            return self._fallback(data)
