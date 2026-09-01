# 🏛️ Land Acquisition Intelligence Platform

> **AI-powered predictive analytics system for identifying and preventing delays in land acquisition projects.**

## 📌 Overview

The **Land Acquisition Intelligence Platform** is an AI-powered decision-support system designed to help government officials monitor land acquisition projects and identify projects that are likely to face delays.

Instead of waiting for a project to become delayed, the system analyzes project data and historical patterns to:

* Predict the probability of delay
* Assign a risk score to each project
* Identify the major reasons behind the predicted delay
* Recommend possible corrective actions
* Display high-risk projects on a GIS map
* Generate alerts for critical projects
* Provide district-wise and state-wise analytics

The main goal is to change land acquisition monitoring from **reactive decision-making to predictive decision-making**.

---

## 🎯 Problem Statement

Land acquisition is an important part of infrastructure projects such as:

* Highways
* Railways
* Metro projects
* Airports
* Other public infrastructure

Projects can be delayed because of:

* Pending approvals
* Legal disputes
* Delayed compensation
* Incomplete documentation
* Rehabilitation and resettlement issues
* Delayed possession of land
* Administrative bottlenecks
* Stakeholder coordination problems

Currently, authorities may identify many problems only after they have already caused significant delays.

Our system aims to identify these risks **before they become critical**.

---

## 💡 Our Solution

The platform follows this workflow:

```text
Project Data
     ↓
Data Processing
     ↓
AI/ML Prediction
     ↓
Delay Probability
     ↓
Risk Classification
     ↓
Explainable AI
     ↓
Identify Delay Drivers
     ↓
Recommendations
     ↓
Alerts & Monitoring
```

For example:

```text
Project: Highway Expansion

Delay Probability: 87%
Risk Level: 🔴 Critical

Major Risk Factors:
1. Legal disputes
2. Compensation pending
3. Land possession incomplete

Recommended Actions:
- Review pending compensation cases
- Escalate unresolved legal disputes
- Prioritize possession-related issues
```

---

# 🚀 Key Features

## 1. AI-Based Delay Prediction

The system analyzes project information and predicts the probability that a project will experience a delay.

Example:

```text
Delay Probability: 87%
Risk Level: HIGH
Expected Delay: 126 Days
```

---

## 2. Project Risk Scoring

Every project receives a risk score based on multiple factors.

```text
0–30%     → Low
31–60%    → Medium
61–80%    → High
81–100%   → Critical
```

---

## 3. Explainable AI

The system does not only provide a prediction.

It also explains **why** a project is considered risky.

Example:

```text
Legal Disputes       → 31%
Compensation Pending → 26%
Possession Delay     → 19%
Approval Delay       → 14%
Rehabilitation       → 7%
```

SHAP is used to provide explainability for ML predictions.

---

## 4. GIS-Based Visualization

Projects are displayed on an interactive map.

Risk levels can be represented using different markers:

```text
🟢 Low
🟡 Medium
🟠 High
🔴 Critical
```

Officials can select a project on the map and view its important information and risk level.

---

## 5. Project Monitoring

Officials can monitor:

* Land acquisition progress
* Compensation progress
* Approval status
* Legal disputes
* Rehabilitation progress
* Land possession
* Documentation
* Project timeline

---

## 6. District & State Analytics

The platform provides analytics at different administrative levels.

Examples:

* District-wise project risk
* State-wise project risk
* Average project delay
* Number of high-risk projects
* Major delay causes
* Historical delay trends

---

## 7. AI/Rule-Based Recommendations

For high-risk projects, the system provides possible actions based on the detected risk factors.

Example:

```text
Risk Factor:
Compensation pending

Recommendation:
Prioritize pending compensation cases.
```

---

## 8. Alerts & Notifications

Officials can receive alerts when:

* A project becomes high risk
* Risk increases significantly
* An important milestone is delayed
* A critical issue remains unresolved

---

## 9. Role-Based Access Control

The platform uses role-based access.

### Super Admin

* Manage users
* Manage permissions
* Monitor the complete system
* View all projects

### State Officer

* Monitor projects within the state
* View state-level analytics
* Monitor district performance

### District Officer

* Monitor projects within the district
* Update project information
* Handle project alerts

### Project Officer

* Update project progress
* Upload project information/documents
* Monitor individual projects

All roles use the **same web application**, but their access and available features are different.

---

# 🏗️ System Architecture

```text
                     ┌─────────────────────┐
                     │      Next.js        │
                     │   Web Application   │
                     └──────────┬──────────┘
                                │
                                ↓
                     ┌─────────────────────┐
                     │      FastAPI        │
                     │      Backend        │
                     └──────────┬──────────┘
                                │
             ┌──────────────────┼──────────────────┐
             ↓                  ↓                  ↓
      ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
      │ PostgreSQL   │   │   ML Engine  │   │    Redis     │
      │  + PostGIS   │   │ XGBoost/SHAP │   │    Cache     │
      └──────────────┘   └──────────────┘   └──────────────┘
                                │
                                ↓
                       ┌─────────────────┐
                       │ Risk Prediction │
                       └─────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Recharts
* React-Leaflet

## Backend

* Python
* FastAPI
* REST APIs

## Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* XGBoost
* SHAP

## Database

* PostgreSQL
* PostGIS

## Additional Technologies

* Redis
* JWT Authentication
* Role-Based Access Control
* Docker
* Git & GitHub

## Maps

* OpenStreetMap
* Leaflet
* PostGIS

---

# 📊 Machine Learning Pipeline

```text
Historical Project Data
          ↓
    Data Cleaning
          ↓
   Feature Engineering
          ↓
    Train/Test Split
          ↓
    ML Model Training
          ↓
      XGBoost
          ↓
    Model Evaluation
          ↓
       SHAP
          ↓
   Explain Predictions
          ↓
   Deploy Prediction API
```

### Possible Input Features

* Project type
* Land area
* Number of affected families
* Compensation percentage
* Approval status
* Number of legal disputes
* Documentation status
* Rehabilitation progress
* Possession status
* Stakeholder responsiveness
* Historical district performance
* Project timeline

### Model Outputs

```text
Delay Probability
        +
Risk Category
        +
Expected Delay
        +
Major Risk Factors
```

---

# 🗂️ Project Structure

```text
land-acquisition-intelligence/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   └── public/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── ml/
│   ├── data/
│   ├── notebooks/
│   ├── models/
│   ├── preprocessing/
│   ├── training/
│   └── prediction/
│
├── database/
│   ├── migrations/
│   └── seed/
│
├── docs/
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# 🔄 Application Workflow

### Step 1 — Project Data

Project information is entered or received through the system.

### Step 2 — Data Processing

The backend validates and processes the information.

### Step 3 — AI Prediction

The ML model analyzes the project.

### Step 4 — Risk Calculation

The system generates a delay probability and risk category.

### Step 5 — Explanation

SHAP identifies the factors contributing most to the prediction.

### Step 6 — Recommendation

The system suggests possible corrective actions.

### Step 7 — Visualization

The project appears on the dashboard and GIS map.

### Step 8 — Alert

If the project reaches a critical risk level, the responsible officer can receive an alert.

### Step 9 — Monitoring

Officials continue updating the project, allowing the system to track changes over time.

---

# 🔐 Security

The platform is designed with:

* JWT authentication
* Role-Based Access Control
* Secure API endpoints
* Password protection
* Data validation
* Audit logs
* Protected administrative operations

---

# 📈 Future Improvements

Possible future improvements include:

* Integration with real government databases
* Automated model retraining
* Advanced NLP for legal documents
* OCR-based document extraction
* SMS notifications
* Advanced satellite/geospatial analysis
* More sophisticated delay forecasting
* Mobile application
* Large-scale cloud deployment

---

# ⚠️ Data Disclaimer

For development and demonstration purposes, the project may use **synthetic or publicly available datasets** when real government land-acquisition data is not available.

Synthetic data should not be presented as actual government data.

---

# 🎯 Project Goal

The ultimate goal of the platform is:

> **Predict problems before they become delays, explain the risks clearly, and help officials take timely action.**

```text
             MONITOR
                ↓
             PREDICT
                ↓
             EXPLAIN
                ↓
           RECOMMEND
                ↓
              ALERT
                ↓
              ACT
                ↓
            MONITOR
```

---

## 👥 Team

**Project:** Land Acquisition Intelligence Platform

**Developed for:** Smart India Hackathon (SIH)

**Team Members:**

* SAHIL
* ALI
* KHALID
* ANKITA
* SAQIB
* FAHAD

---

## 📄 License

This project is developed as part of a Smart India Hackathon project and is intended for educational, research, and demonstration purposes.
