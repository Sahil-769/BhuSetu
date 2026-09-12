from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import json
import shap


# ==========================================
# LOAD MODEL
# ==========================================

model = joblib.load("land_acquisition_xgb_model.pkl")

with open("model_metadata.json", "r") as f:
    metadata = json.load(f)

feature_columns = metadata["feature_columns"]
numeric_cols = metadata["numeric_cols"]
categorical_cols = metadata["categorical_cols"]
classification_threshold = metadata["classification_threshold"]


# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="Land Acquisition Delay Prediction API",
    description="ML API for early detection of land acquisition delays",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "XGBoost",
        "service": "Land Acquisition Delay Prediction API"
    }


# ==========================================
# REQUEST MODEL
# ==========================================

class PredictionRequest(BaseModel):
    project_id: str

    # We'll initially accept arbitrary case
    # data through a dictionary.
    case_data: dict


# ==========================================
# RISK CATEGORY
# ==========================================

def get_risk_category(probability):

    if probability < 25:
        return "LOW"

    elif probability < 50:
        return "MODERATE"

    elif probability < 75:
        return "HIGH"

    else:
        return "CRITICAL"


# ==========================================
# RECOMMENDATION ENGINE
# ==========================================

def generate_recommendations(features):

    recommendations = []

    for feature in features:

        if feature == "legal_case_exists":
            recommendations.append(
                "Prioritize legal-case resolution and route the case for legal review."
            )

        elif feature == "missing_ownership_documents":
            recommendations.append(
                "Verify and complete missing ownership documents before proceeding."
            )

        elif feature == "gis_available":
            recommendations.append(
                "Improve GIS/data availability and verify the parcel's spatial information."
            )

        elif feature == "compensation_status":
            recommendations.append(
                "Review the compensation case and resolve pending or disputed compensation issues."
            )

        elif feature == "ownership_complexity":
            recommendations.append(
                "Perform detailed ownership verification and resolve ownership-related complexity."
            )

        elif feature == "ownership_dispute":
            recommendations.append(
                "Prioritize resolution of ownership disputes with the concerned stakeholders."
            )

        elif feature == "mutation_status":
            recommendations.append(
                "Verify and expedite the land mutation process."
            )

        elif feature == "pending_approval_count":
            recommendations.append(
                "Follow up on pending approvals and escalate delayed approvals where necessary."
            )

    return recommendations


# ==========================================
# PREDICTION ENDPOINT
# ==========================================

@app.post("/predict")
def predict(request: PredictionRequest):

    # Convert incoming data to DataFrame
    case_X = pd.DataFrame([request.case_data])

    
    
    # Make sure all model features are present
    for column in feature_columns:
     if column not in case_X.columns:
        case_X[column] = None

# Keep exactly the same column order used during training
    case_X = case_X[feature_columns]



    # ======================================
    # MODEL PREDICTION
    # ======================================

    probability = model.predict_proba(case_X)[0][1]

    probability_percent = probability * 100

    risk_category = get_risk_category(
        probability_percent
    )

    # ======================================
    # SHAP
    # ======================================

    preprocessor = model.named_steps["preprocessor"]
    classifier = model.named_steps["classifier"]

    transformed = preprocessor.transform(case_X)

    explainer = shap.TreeExplainer(classifier)

    shap_values = explainer.shap_values(transformed)[0]

    feature_names = (
        preprocessor
        .get_feature_names_out()
    )

    # ======================================
    # CLEAN SHAP FEATURES
    # ======================================

    shap_data = []

    for feature, value in zip(
        feature_names,
        shap_values
    ):

        if feature.startswith("num__"):

            original_feature = feature.replace(
                "num__",
                ""
            )

        elif feature.startswith("cat__"):

            cat_feature = feature.replace(
                "cat__",
                ""
            )

            original_feature = cat_feature

            for col in categorical_cols:

                if (
                    cat_feature.startswith(col + "_")
                    or cat_feature == col
                ):
                    original_feature = col
                    break

        else:

            original_feature = feature

        shap_data.append({
            "feature": original_feature,
            "shap_value": float(value)
        })


    shap_df = pd.DataFrame(shap_data)

    # Aggregate one-hot encoded features
    shap_df = (
        shap_df
        .groupby("feature", as_index=False)
        ["shap_value"]
        .sum()
    )

    shap_df["abs_shap"] = (
        shap_df["shap_value"].abs()
    )

    shap_df = shap_df.sort_values(
        "abs_shap",
        ascending=False
    )

    # Only factors increasing risk
    top_risk = (
        shap_df[
            shap_df["shap_value"] > 0
        ]
        .head(5)
    )

    # ======================================
    # RECOMMENDATIONS
    # ======================================

    top_features = (
        top_risk["feature"]
        .tolist()
    )

    recommendations = generate_recommendations(
        top_features
    )

    # ======================================
    # FINAL RESPONSE
    # ======================================

    return {
        "project_id": request.project_id,

        "delay_probability":
            round(float(probability_percent), 2),

        "risk_category":
            risk_category,

        "top_risk_factors": [
            {
                "feature": str(row["feature"]),
                "shap_value":
                    round(float(row["shap_value"]), 4)
            }

            for _, row in top_risk.iterrows()
        ],

        "recommendations":
            recommendations
    }