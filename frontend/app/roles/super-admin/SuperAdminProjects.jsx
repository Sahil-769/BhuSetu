"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Construction, FolderKanban, MapPin, Search, ShieldCheck } from "lucide-react";
import { Header } from "../../component/layout/index";
import { getSuperAdminState, subscribeToSuperAdminState } from "./superAdminStore";
import { projectTypeMeta } from "../project-officer/my-project/projects-data";
import styles from "./superAdmin.module.css";

const statusTone = {
  Ongoing: "border-slate-200 bg-slate-100 text-slate-700",
  Completed: "border-sky-200 bg-sky-50 text-sky-700",
  Verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Submitted to Super Admin": "border-sky-200 bg-sky-50 text-sky-700",
  Verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Sent Back for Correction": "border-amber-200 bg-amber-50 text-amber-700",
};

function getProjectCategory(project) {
  const status = project.workflowStatus || project.status;
  if (status === "Verified") return "Verified";
  if (status === "Completed" || status === "Submitted to Super Admin") return "Completed";
  return "Ongoing";
}

function StatusBadge({ status }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusTone[status] || "border-slate-200 bg-slate-100 text-slate-600"}`}>{status}</span>;
}

function ProjectCard({ project }) {
  const ProjectIcon = projectTypeMeta[project.type]?.icon || Construction;
  const category = getProjectCategory(project);
  return <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"><ProjectIcon className="h-5 w-5" /></div><div className="min-w-0"><h2 className="truncate text-lg font-semibold text-slate-900">{project.name}</h2><p className="mt-1 text-sm font-medium text-slate-500">{project.projectId}</p></div></div><span className="text-base font-bold text-slate-900">{project.riskProbability}%</span></div><div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"><MapPin className="h-4 w-4 text-slate-500" />{project.district}, {project.state}</div><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Category</p><div className="mt-2"><StatusBadge status={category} /></div></div><div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">AI assessment</p><p className="mt-2 text-sm font-semibold text-slate-800">{project.riskCategory} risk</p></div></div><div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500"><span>{category === "Verified" ? `Verified ${project.verification?.verifiedAt ? "on " + new Date(project.verification.verifiedAt).toLocaleString("en-IN") : ""}` : category === "Completed" ? "Ready for Super Admin review" : "View-only during workflow"}</span><Link href={`/roles/super-admin/projects/${project.id}`} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800">View Details <ArrowRight className="h-4 w-4" /></Link></div></article>;
}

export default function SuperAdminProjects() {
  const [state, setState] = useState(() => getSuperAdminState());
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  useEffect(() => subscribeToSuperAdminState(setState), []);
  const projects = state.projects.filter((project) => {
    const matchesQuery = `${project.name} ${project.projectId} ${project.state} ${project.district} ${project.type}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === "All" || getProjectCategory(project) === categoryFilter;
    return matchesQuery && matchesCategory;
  });
  const categories = ["Ongoing", "Completed", "Verified"];
  return <div className={`${styles.shell} min-h-screen bg-slate-50 text-slate-800`}><Header title="Super Admin · Projects" /><main className="mx-auto max-w-8xl px-4 pb-12 pt-4 sm:px-6 lg:px-8"><div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between"><div><p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">Global Overview</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Super Admin Projects</h1><p className="mt-2 text-sm text-slate-600">Review project progress and verify completed Nodal submissions. AI scores are read-only.</p></div><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"><ShieldCheck className="h-4 w-4 text-emerald-600" />{projects.length} visible</div></div><section className="mt-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, ID, district or type" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400" /></div><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"><option value="All">All categories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></div></section><div className="mt-6 grid gap-4 xl:grid-cols-2">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>{projects.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center"><FolderKanban className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-3 text-sm text-slate-600">No projects match the current filters.</p></div> : null}</main></div>;
}
