# BHOOMI-AI Connected Workflow

BHOOMI-AI is a role-based land acquisition intelligence workflow. Its purpose is to identify acquisition delay risk early, explain the drivers, recommend corrective actions, and track whether interventions improve the risk.

## End-to-End Flow

```text
Project Officer
  Create project and capture location geometry
        |
        v
Admin
  Verify project and assign LAO and Nodal Officer
        |
        v
LAO
  Verify project parcels and maintain acquisition data
        |
        v
AI Engine
  Calculate delay probability, risk category, factors, and recommendations
        |
        v
Nodal Officer
  Monitor risk, review GIS, and record interventions
        |
        v
LAO
  Resolve issues and update acquisition data
        |
        v
AI Engine
  Recalculate risk and append risk history
        |
        v
Nodal Officer
  Monitor improvement and recommend closure
        |
        v
Super Admin
  Perform final verification and close the project
```

## Role Responsibilities

### Project Officer

- Creates projects and project location information.
- Selects project type, state, district, village/tehsil, required land area, and location type.
- Captures latitude/longitude and route or area values from the project GIS step.
- Uploads project documents.
- Does not manage acquisition decisions, legal decisions, or AI scores.

### Admin

- Verifies submitted projects.
- Assigns LAO and Nodal Officer users.
- Manages workflow visibility, assignments, users, jurisdictions, and audit activity.
- Does not make acquisition or legal decisions.

### Land Acquisition Officer

LAO work is project-centric. The assigned project workspace contains:

- **Overview**: PO information, assignment, project status, progress, GIS availability, and activity timeline.
- **Parcels**: project-specific parcel records, manual parcel entry, and parcel verification.
- **Acquisition**: ownership, compensation, legal/disputes, R&R, approvals, documents, and possession information.
- **Final Overview**: verified parcel count, acquisition progress, section progress, and read-only AI assessment.

LAO may update acquisition data after submission. Submission does not close the project. Official cadastral boundaries are never modified.

### Nodal Officer

- Monitors project status, acquisition progress, AI risk, GIS information, and risk history.
- Records interventions with type, action, assigned officer, priority, due date, and remarks.
- Interventions are persisted in the shared project record and create an LAO notification.
- Does not manually edit or calculate AI risk scores.

### Super Admin

- Reviews all projects and the complete lifecycle.
- Reviews acquisition completion, risk history, and interventions.
- Performs final verification and closure.
- Closed projects should be treated as read-only/archive records.
- Does not make acquisition or legal decisions and cannot edit AI scores.

## Project Status and AI Risk

Project status and AI risk are separate values.

### Workflow Status

The workflow uses status values such as:

```text
Draft
Submitted
Assigned
Under Acquisition
Acquisition Data Submitted
AI Analyzed
Under Monitoring
Intervention Required
Action In Progress
Acquisition Completed
Closure Requested
Closure Recommended
Closed
```

### Risk Category

Risk is generated separately:

```text
Low
Medium
High
Critical
```

A project can therefore be `Under Acquisition` while its AI risk is `82% High`.

## Shared Browser Storage

The current frontend demo uses browser localStorage so all role pages can read the same project records without duplicating data models.

Storage key:

```text
bhoomi-ai-workflow-state
```

Primary implementation:

- `frontend/components/workflowStore.js`

The store contains project records with:

```text
project
assignment
workspace
parcels
acquisition
aiAssessment
riskHistory
interventions
notifications
audit
```

The store dispatches `bhoomi-ai-workflow-updated` so open role pages can refresh immediately after another role changes a project.

## AI Assessment

The current demo uses a transparent rule-based heuristic because it does not claim fabricated government-level model accuracy.

The assessment contains:

- Delay probability
- Risk category
- Risk factors
- Factor explanation
- Recommended action
- Model version
- Confidence description
- Last updated timestamp

The score is recalculated when LAO workspace data changes. Each recalculation appends a risk-history record containing:

- Previous probability
- New probability
- Resulting category
- Change reason
- Timestamp
- Model version

AI output is read-only in the UI.

## Demo Sequence

1. Open Project Officer → Create Project.
2. Complete the project information, administrative location, GIS location, land requirement, and document steps.
3. Submit the project. The project is persisted in `bhoomi-ai-workflow-state`.
4. Open LAO → My Assigned Projects and open the project workspace.
5. Verify parcels and update acquisition information.
6. Open Final Overview to see the recalculated AI assessment and recommendations.
7. Open the same project in Nodal Officer → Projects.
8. Record a Nodal intervention. The intervention is stored on the project and a notification is created for LAO.
9. Return to LAO and update acquisition information. The AI assessment recalculates and risk history grows.
10. Super Admin reviews the project lifecycle, intervention history, acquisition progress, and AI risk history before final verification and closure.

## Development

From the frontend directory:

```powershell
npm install
npm run dev
```

Production build:

```powershell
npm run build
```

The application currently has an unrelated existing build limitation in the LAO acquisition-cases page: Next.js requires its `useSearchParams()` usage to be placed behind a Suspense boundary. The shared workflow files and connected role routes compile successfully before that existing page-level prerender failure.
