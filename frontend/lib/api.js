const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  health: () => request("/api/health"),
  listProjects: (query = "") => request(`/api/projects${query}`),
  createProject: (project) => request("/api/projects", { method: "POST", body: JSON.stringify(project) }),
  getProject: (id) => request(`/api/projects/${id}`),
  getGeometry: (id) => request(`/api/projects/${id}/geometry`),
  updateProjectWorkflow: (id, data) => request(`/api/projects/${id}/workflow`, { method: "PUT", body: JSON.stringify(data) }),
  updateAcquisition: (id, data) => request(`/api/projects/${id}/acquisition`, { method: "PUT", body: JSON.stringify(data) }),
  predict: (id) => request(`/api/ai/predict/${id}`, { method: "POST" }),
  getAssessment: (id) => request(`/api/ai/assessment/${id}`),
  getHistory: (id) => request(`/api/ai/history/${id}`),
  createIntervention: (intervention) => request("/api/interventions", { method: "POST", body: JSON.stringify(intervention) }),
  getRiskDistribution: () => request("/api/analytics/risk-distribution"),
};
