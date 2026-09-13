# BHOOMI-AI Judge Questions and Answers

Use these answers during the SIH presentation. Keep answers direct, honest, and connected to the implemented workflow.

## A. Problem and Solution

### 1. What problem does BHOOMI-AI solve?

BHOOMI-AI helps authorities monitor land-acquisition projects from project creation to final closure. It combines GIS location data, parcel and acquisition information, explainable AI risk prediction, officer interventions, and administrative approval in one workflow.

### 2. Why is this problem important?

Land-acquisition projects are delayed by ownership disputes, compensation issues, missing documents, legal cases, R&R requirements, and approval dependencies. These issues are usually tracked across disconnected files and departments. BHOOMI-AI brings them into one traceable system.

### 3. Who are the users?

The main users are:

- Project Officer: creates the project and GIS location.
- Land Acquisition Officer: verifies parcels and acquisition information.
- Nodal Officer: monitors risk and records interventions.
- Super Admin: performs final administrative verification and closure.

### 4. What is the main innovation?

The innovation is the connection between project geography, acquisition progress, explainable risk prediction, and role-based workflow. The system does not only show an AI score; it connects the score to factors and recommended administrative actions.

### 5. How is this better than a normal project-management system?

A normal project-management system tracks tasks and status. BHOOMI-AI adds land-acquisition-specific information such as parcels, ownership, compensation, legal disputes, R&R, GIS geometry, and delay-risk prediction.

### 6. Is this a replacement for government officers?

No. It is a decision-support system. Officers remain responsible for verification, legal decisions, compensation decisions, and final administrative approval. AI only highlights risk and recommends follow-up actions.

## B. Complete Workflow

### 7. Explain the complete workflow.

1. Project Officer creates a project.
2. Project Officer enters location, land requirement, documents, and GIS geometry.
3. LAO reviews parcels and acquisition information.
4. AI predicts delay probability and explains risk factors.
5. Nodal Officer monitors the project and records interventions.
6. Nodal Officer selects **Recommend Closure** when monitoring is complete.
7. The project moves to `Closure Recommended / Pending Final Verification`.
8. Super Admin reviews the complete project folder.
9. Super Admin either verifies the project or sends it back for correction.
10. Verification changes the project status to `Verified` and closes it.

### 8. What happens when the Nodal Officer recommends closure?

The project is marked as `Closure Recommended / Pending Final Verification`. It becomes visible in the Super Admin review queue. The Nodal Officer's activity, remarks, interventions, and recommendation are shown to the Super Admin.

### 9. What can the Super Admin do?

The Super Admin can:

- Review project information.
- Review GIS data.
- Review acquisition summaries.
- Review AI risk and recommendations.
- Review interventions and activity history.
- Approve and close the project.
- Send the project back for correction with a mandatory reason.

### 10. What can the Super Admin not do?

The Super Admin does not verify individual parcels, change AI scores, enter legal decisions, enter compensation data, or perform Nodal Officer interventions.

### 11. What happens after verification?

The project status and workflow status become `Verified`. A verification record stores the verifier and timestamp. The project is treated as closed and read-only for the operational workflow.

### 12. What happens after sending the project back?

The system requires a correction reason, changes the status to `Sent Back for Correction`, clears the closure-ready state, records the reason in the activity timeline, and returns the project to the Nodal Officer workflow.

## C. GIS Questions

### 13. How does the GIS feature work?

The application uses Leaflet with OpenStreetMap tiles. The Project Officer selects an area or linear project and draws a polygon or route on the map. The drawing is converted to GeoJSON and stored with the project.

### 14. What is stored for GIS?

The backend stores the project geometry in the `projects.geometry` JSON column. Geometry can be a GeoJSON `Point`, `Polygon`, or `LineString`.

Example:

```json
{
  "type": "LineString",
  "coordinates": [
    [77.20, 28.61],
    [77.24, 28.63]
  ]
}
```

### 15. What coordinate order does GeoJSON use?

GeoJSON uses `[longitude, latitude]`. Leaflet normally displays coordinates as `[latitude, longitude]`, so the frontend converts them correctly when rendering.

### 16. What GIS calculations are performed?

For polygons, the frontend calculates approximate area in hectares. For routes, it calculates approximate route length in kilometers. It also calculates a center point for the project marker.

### 17. Does the system modify official cadastral maps?

No. The project geometry is a planning and review overlay. It does not edit official cadastral boundaries or land records.

### 18. What happens if GIS data is missing?

The system marks GIS as unavailable and displays a clear empty state. The project can still be reviewed, but the missing location data is visible as a risk or data-quality issue.

### 19. Can the system support real cadastral GIS data?

Yes. The current design stores standard GeoJSON, so it can be connected to authorized cadastral layers, PostGIS, state GIS services, WMS, WFS, or official land-record APIs after access and security approval.

### 20. Is the current parcel map official?

No. Candidate parcel shapes shown in the demo are planning overlays. They demonstrate the workflow and visualization. Official parcel geometry must come from authorized cadastral data.

### 21. Why use GeoJSON?

GeoJSON is an open, widely supported format. It works with Leaflet, PostGIS, GIS servers, browser maps, and government spatial systems. It also makes future integration easier.

## D. Prediction and AI Questions

### 22. What does the AI predict?

The AI predicts the probability that a land-acquisition project may face delay. It also classifies the risk as Low, Medium, High, or Critical.

### 23. What model is used?

The backend is designed to load an XGBoost classification model using Joblib. The configured model file is `land_acquisition_xgb_model.pkl`, and the feature definition is loaded from `model_metadata.json`.

### 24. What features are used by the model?

The model metadata includes features related to:

- Project type and location.
- Required land area.
- Project age and prediction period.
- Parcel area and land use.
- Number of owners and joint ownership.
- Ownership verification and title status.
- Mutation and inheritance issues.
- Compensation amount, payment delay, and disputes.
- Legal cases, injunctions, stays, and case age.
- R&R families, rehabilitation, resettlement, and payment status.
- Pending approvals and missing documents.
- Verification and officer-action delays.
- Land-use and state-level indicators.

### 25. How is the risk category calculated?

The prediction probability is mapped to categories:

```text
0-24%   LOW
25-49%  MEDIUM
50-74%  HIGH
75-100% CRITICAL
```

The classification threshold stored in the model metadata is also respected by the trained model pipeline.

### 26. Does the AI only return a number?

No. The API returns the probability, category, risk factors, factor importance, recommendations, model version, prediction source, confidence, and trend.

### 27. How is explainability implemented?

The system maps detected acquisition conditions to understandable factors. For example, incomplete ownership produces an ownership verification factor and a recommendation to complete title and mutation verification.

### 28. What happens if the ML model is unavailable?

The backend uses a rule-based fallback. It assigns weighted risk points to legal, ownership, compensation, R&R, approval, and document issues. The response identifies `RULE_BASED_FALLBACK` as the prediction source.

### 29. Why is the fallback important?

It keeps the system available during a demo or temporary model failure. It is also transparent because each rule and weight can be explained to an officer.

### 30. How does the prediction update over time?

When acquisition data changes, the backend recalculates the prediction, stores a new assessment, compares it with the previous assessment, and writes a risk-history record containing changed fields and the new trend.

### 31. What does risk trend mean?

Risk trend compares the latest prediction with the previous prediction:

- Higher probability: Increasing.
- Lower probability: Decreasing.
- Same or first prediction: Stable.

### 32. Can an officer manually change the AI score?

No. Officers can update source information such as acquisition status, but the AI score is generated by the prediction service. The Super Admin cannot edit the score or prediction logic.

### 33. Can AI make legal or compensation decisions?

No. AI only identifies risk and recommends follow-up. Legal, compensation, ownership, and R&R decisions remain with authorized human officers and competent authorities.

### 34. How do you prevent AI bias?

The system exposes the prediction source, model version, factors, and recommendations. The result is reviewable rather than automatic. For production deployment, we would add fairness testing across states, districts, land-use groups, and project types, plus periodic model monitoring.

### 35. How would you improve the model with more data?

We would collect historical project outcomes, standardize acquisition fields, validate labels such as actual delay or completion time, retrain using approved data, compare precision/recall and calibration, and version each model before deployment.

### 36. What metric would you use to evaluate the model?

Because delay risk is a classification and probability problem, we would use precision, recall, F1-score, ROC-AUC, PR-AUC, calibration error, and confusion matrices. We would also measure whether high-risk alerts lead to earlier interventions.

## E. Data and Architecture

### 37. Where is project information stored?

The FastAPI backend uses SQLite by default through SQLAlchemy. The main database file is `bhoomi_ai.db`. Production can use another SQLAlchemy-supported database through `DATABASE_URL`.

### 38. What database tables are used?

The main backend records are:

- `projects`: project details, status, risk values, acquisition JSON, and GeoJSON geometry.
- `assessments`: current and previous AI assessment outputs.
- `risk_history`: prediction changes over time.
- `interventions`: Nodal Officer intervention records.

### 39. Is MongoDB currently the main application database?

No. The `database` folder contains a MongoDB connection utility, but the current FastAPI application uses SQLAlchemy and SQLite by default. MongoDB can be integrated later if required by the deployment architecture.

### 40. What does the frontend store locally?

For demo continuity, the frontend uses browser localStorage for workflow state, Super Admin state, user data, jurisdictions, and admin activity. Backend API data remains the preferred production source of truth.

### 41. Why do you have both backend and localStorage?

The backend is used for API and database integration. localStorage provides a working offline/demo fallback so the user interface remains usable when the backend is unavailable. In production, localStorage fallback should be restricted or disabled for authoritative records.

### 42. How does the frontend communicate with the backend?

The frontend uses a shared API client. The base URL defaults to `http://localhost:8000` and can be changed with `NEXT_PUBLIC_API_URL`.

### 43. What are the important APIs?

```text
GET  /api/health
GET  /api/projects
POST /api/projects
GET  /api/projects/{id}
GET  /api/projects/{id}/geometry
PUT  /api/projects/{id}/acquisition
PUT  /api/projects/{id}/workflow
POST /api/ai/predict/{id}
GET  /api/ai/assessment/{id}
GET  /api/ai/history/{id}
POST /api/interventions
GET  /api/analytics/risk-distribution
```

### 44. How is the project status synchronized?

Workflow actions update the shared workflow state and Super Admin state in the frontend. When the API is available, final workflow actions are also sent to the backend workflow endpoint. The project status, workflow status, activity, and verification data are kept together.

## F. Security and Governance

### 45. How is role separation implemented?

The interface exposes different workspaces for Project Officer, LAO, Nodal Officer, and Super Admin. Each role has a different responsibility in the workflow. The Super Admin screen is review-only except for final verification and correction routing.

### 46. Is the current demo production-secure?

The current repository is a functional prototype and demo system. Production deployment would require authenticated sessions, server-side authorization, role checks on every API endpoint, audit-log protection, encrypted secrets, HTTPS, database backups, and stronger input validation.

### 47. How would you secure government data?

We would use government-approved identity integration, RBAC, MFA, encryption in transit and at rest, least-privilege database access, immutable audit logs, backups, network isolation, API rate limits, and monitoring.

### 48. Can a frontend user bypass permissions?

In a production system, permissions must never rely only on hidden buttons or frontend routing. Every mutation endpoint must verify the authenticated user role and jurisdiction on the server.

### 49. How are audit activities tracked?

Workflow activities record the action, actor, role, timestamp, status, and correction reason where relevant. Administrative changes are also recorded in audit logs.

### 50. How would you protect the audit log?

In production, audit records should be append-only, server-generated, access-controlled, timestamped using a trusted clock, and optionally stored in a separate immutable or write-once system.

## G. Scalability and Deployment

### 51. Can this scale beyond a demo?

Yes, with production changes. The API is separated from the Next.js frontend, the data model separates projects, assessments, history, and interventions, and geometry uses a standard spatial format. Scaling would require PostgreSQL/PostGIS, migrations, authentication, background prediction jobs, caching, and monitoring.

### 52. Why use PostGIS in production?

PostGIS would provide spatial indexing, geometry validation, intersection queries, buffer operations, area calculations, and efficient filtering by state, district, corridor, or jurisdiction.

### 53. How would you handle large map data?

Use vector tiles or tiled GeoJSON, spatial indexes, server-side bounding-box queries, geometry simplification for display, and separate authoritative cadastral layers from project planning overlays.

### 54. What happens if many users update the same project?

A production version would use optimistic locking or version columns, transactional updates, conflict detection, and an activity history. The current prototype uses local events and database updates suitable for the demonstration workflow.

### 55. How would you run prediction at scale?

Small predictions can run synchronously through the API. Large batch predictions should run through a background queue such as Celery, Redis Queue, or a cloud job service, with prediction status and retry handling.

### 56. How would you deploy it?

The frontend can be deployed as a Next.js application. The FastAPI backend can run in a container behind a reverse proxy. A production database such as PostgreSQL/PostGIS should be used, with environment-managed model paths, secrets, CORS origins, logging, and backups.

## H. Testing and Reliability

### 57. What have you tested?

The frontend production build has been run successfully. The main routes compile, including project creation, GIS views, Nodal project details, and Super Admin project review.

### 58. What tests should be added next?

The next tests should cover:

- GeoJSON polygon and route conversion.
- Area and route-length calculations.
- Prediction feature preparation.
- Model fallback behavior.
- Project status transitions.
- Nodal closure recommendation.
- Super Admin verification.
- Send-back correction flow.
- Role-based API authorization.

### 59. What if the API is down during the demo?

The frontend shows an API warning and can use local demo workflow state for core UI interactions. For a reliable final demo, start the backend first and verify `/api/health` before opening the frontend.

### 60. What if the map tiles are unavailable?

The project geometry is still stored as GeoJSON and remains available in the database. The visual tile layer requires network access to OpenStreetMap. A production version should provide approved tile hosting or cached/offline tiles.

## I. Limitations and Honest Answers

### 61. Is the AI prediction fully production-ready?

The architecture supports the trained model and explainable output, but production readiness depends on validated historical labels, complete feature coverage, model evaluation, monitoring, and approved training data.

### 62. Is all displayed project data real?

The application supports real API and database data. Some demo screens use seeded or deterministic dummy values to demonstrate the complete workflow when production records are not available. This should be clearly labeled in a real deployment.

### 63. Are the parcel boundaries real?

No. The demo candidate parcel overlays are generated planning shapes. Real cadastral boundaries must be loaded from authorized government land records.

### 64. What is the biggest current technical limitation?

The prototype has both API-backed and local demo state paths. A production release should consolidate the source of truth in the backend, add authentication and authorization, and ensure every role action is validated server-side.

### 65. What would you build next?

The next priorities are:

1. Production authentication and RBAC.
2. PostgreSQL/PostGIS integration.
3. Official cadastral and jurisdiction GIS layers.
4. Automated model evaluation and monitoring.
5. Automated tests for workflow and prediction APIs.
6. Notifications through approved email/SMS or government messaging channels.
7. Deployment logging, backups, and disaster recovery.

## J. Strong Final Answer

### 66. Give the complete project explanation in one answer.

BHOOMI-AI is an explainable land-acquisition decision-support platform. A Project Officer creates a project and draws its route or boundary, which is stored as GeoJSON. The LAO records parcel, ownership, compensation, legal, R&R, approval, and document information. The AI uses these project, GIS, and acquisition features to predict delay probability, classify risk, explain the main causes, and recommend actions. The Nodal Officer monitors the project and records interventions. When monitoring is complete, the Nodal Officer recommends closure. The Super Admin then performs the final administrative review and either verifies the project, changing its status to `Verified` and closing it, or sends it back with a correction reason. The system supports human accountability, GIS traceability, and explainable risk-based prioritization without replacing statutory officers or official cadastral records.
