import { PROJECTS as SEEDED_PROJECTS } from "../app/roles/LandAcqOfficer/assigned-projects/projects-data";

const STORAGE_KEY = "bhoomi-ai-workflow-state";
const EVENT_NAME = "bhoomi-ai-workflow-updated";

const clone = (value) => JSON.parse(JSON.stringify(value));

const makeAssessment = (project, workspace = {}) => {
  const acquisition = workspace.acquisition || {};
  const parcels = workspace.parcels || [];
  const verifiedParcels = parcels.filter((parcel) => parcel.status === "Verified").length;
  const unresolved = [acquisition.ownership, acquisition.compensation, acquisition.legal, acquisition.rr, acquisition.approvals, acquisition.possession]
    .filter((value) => !value || /pending|not started|in review|dispute|unresolved/i.test(String(value))).length;
  const score = Math.min(95, Math.max(18, 35 + unresolved * 10 - verifiedParcels * 4));
  const category = score >= 75 ? "Critical" : score >= 60 ? "High" : score >= 40 ? "Medium" : "Low";
  const factors = [
    { factor: "Ownership verification", explanation: "Unverified ownership can delay parcel clearance.", recommendation: "Complete ownership and document verification." },
    { factor: "Compensation pending", explanation: "Unresolved compensation can delay acquisition timelines.", recommendation: "Follow up on assessment, award and payment records." },
    { factor: "Approval dependency", explanation: "Pending approvals can block the next acquisition stage.", recommendation: "Escalate the approval with the responsible authority." },
  ].slice(0, Math.max(1, Math.min(3, unresolved)));
  return { probability: score, category, factors, explanation: factors.map((item) => item.explanation).join(" "), recommendations: factors.map((item) => item.recommendation), modelVersion: "rule-based-v1", confidence: "Transparent heuristic", updatedAt: new Date().toISOString() };
};

const seedWorkspace = (project) => ({
  projectId: project.id,
  parcels: [
    { id: `${project.id}-parcel-1`, khasra: "K-102/4", area: 2.4, location: project.village, landUse: "Agricultural", owner: "Owner reference pending", status: "Pending" },
    { id: `${project.id}-parcel-2`, khasra: "K-108/2", area: 1.8, location: project.village, landUse: "Residential", owner: "Owner reference pending", status: "Pending" },
  ],
  acquisition: { ownership: "Pending verification", compensation: "Not started", legal: "No dispute recorded", rr: "Not started", approvals: "In review", documents: "Project documents available", possession: "Not started" },
  activity: [{ id: `${project.id}-activity-1`, action: "Project Assigned", actor: "Admin", timestamp: project.createdAt, status: "Completed" }],
  submittedAt: null,
});

const initialState = {
  projects: SEEDED_PROJECTS.map((project) => ({ ...project, workflowStatus: project.status, assignment: { lao: "Rajesh Kumar", nodal: "Amit Sharma" }, workspace: seedWorkspace(project), aiAssessment: makeAssessment(project, seedWorkspace(project)), riskHistory: [], interventions: [], notifications: [], audit: [] })),
};

export function getWorkflowState() {
  if (typeof window === "undefined") return clone(initialState);
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...clone(initialState), ...JSON.parse(saved) } : clone(initialState);
  } catch {
    return clone(initialState);
  }
}

export function updateWorkflow(updater) {
  if (typeof window === "undefined") return;
  const next = updater(getWorkflowState());
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function subscribeToWorkflow(callback) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback(getWorkflowState());
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

export function createWorkflowProject(payload) {
  const project = { id: `project-${Date.now()}`, projectId: payload.projectId, name: payload.projectName, type: payload.projectType, description: payload.description, department: payload.department, state: payload.state, district: payload.district, tehsil: payload.tehsil, village: payload.villages, requiredLandArea: Number(payload.requiredLandArea), landUnit: payload.unit, locationType: payload.locationType, coordinates: payload.latitude && payload.longitude ? { latitude: Number(payload.latitude), longitude: Number(payload.longitude) } : null, status: payload.status || "Submitted", workflowStatus: payload.status || "Submitted", assignment: { lao: "Unassigned", nodal: "Unassigned" }, workspace: seedWorkspace({ ...payload, id: `project-${Date.now()}`, village: payload.villages }), aiAssessment: makeAssessment(payload), riskHistory: [], interventions: [], notifications: [], audit: [] };
  updateWorkflow((state) => ({ ...state, projects: [project, ...state.projects] }));
  return project;
}

export function updateWorkflowProject(projectId, updater, auditAction) {
  updateWorkflow((state) => ({ ...state, projects: state.projects.map((project) => {
    if (String(project.id) !== String(projectId)) return project;
    const next = updater(clone(project));
    const audit = auditAction ? { id: `audit-${Date.now()}`, action: auditAction, actor: "Current Officer", timestamp: new Date().toISOString() } : null;
    return { ...next, audit: audit ? [audit, ...(next.audit || [])] : next.audit };
  }) }));
}

export function recalculateProjectRisk(projectId, workspace, reason = "Acquisition data updated") {
  updateWorkflowProject(projectId, (project) => {
    const nextAssessment = makeAssessment(project, workspace);
    return { ...project, workspace, status: "AI Analyzed", workflowStatus: "AI Analyzed", aiAssessment: nextAssessment, riskHistory: [{ previous: project.aiAssessment?.probability, next: nextAssessment.probability, category: nextAssessment.category, reason, timestamp: nextAssessment.updatedAt, modelVersion: nextAssessment.modelVersion }, ...(project.riskHistory || [])] };
  }, "AI risk recalculated");
}
