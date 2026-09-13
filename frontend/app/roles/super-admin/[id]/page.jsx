"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  FileText,
  FolderKanban,
  Landmark,
  MapPinned,
  MessageSquareText,
  Paperclip,
  ShieldAlert,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Header } from "../../../component/layout/index";
import {
  addAuditLog,
  getSuperAdminState,
  subscribeToSuperAdminState,
  updateSuperAdminState,
} from "../superAdminStore";
import { projectTypeMeta } from "../../project-officer/my-project/projects-data";
import styles from "../superAdmin.module.css";

const formatDateTime = (value) => value
  ? new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value))
  : "Not recorded";

const riskTone = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  High: "border-orange-200 bg-orange-50 text-orange-700",
  Critical: "border-red-200 bg-red-50 text-red-700",
};

function getProjectCategory(project) {
  const status = project.workflowStatus || project.status;
  if (status === "Verified") return "Verified";
  if (status === "Completed" || status === "Submitted to Super Admin") return "Completed";
  return "Ongoing";
}

function Panel({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-slate-300">
      <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        <Icon className="h-4 w-4" />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailsList({ items }) {
  return (
    <ul className="space-y-2 text-sm text-slate-600">
      {items.map(([label, value]) => (
        <li key={label}>
          <span className="font-medium text-slate-800">{label}:</span> {value || "Not available"}
        </li>
      ))}
    </ul>
  );
}

function RiskFactors({ project }) {
  const factors = [
    "Pending compensation cases",
    "Ownership verification and legal disputes",
    "R&R actions for affected households",
    "District approvals and agency coordination",
  ];

  return (
    <div className="space-y-3">
      {factors.slice(0, project.riskCategory === "Critical" ? 4 : 3).map((factor, index) => (
        <div key={factor} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-medium text-slate-800">{index + 1}. {factor}</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            This factor contributes to the read-only AI delay-risk assessment.
          </p>
        </div>
      ))}
    </div>
  );
}

export default function SuperAdminProjectDetails() {
  const params = useParams();
  const projectId = Number(params?.id ?? 0);
  const [state, setState] = useState(() => getSuperAdminState());
  const [reason, setReason] = useState("");
  const [showSendBack, setShowSendBack] = useState(false);

  useEffect(() => subscribeToSuperAdminState(setState), []);

  const project = state.projects.find((item) => item.id === projectId);
  const assignment = state.assignments.find((item) => item.projectId === projectId);
  const riskHistory = useMemo(() => project ? [
    { date: project.createdAt, value: `${Math.max(35, project.riskProbability - 12)}%`, note: "Initial AI assessment" },
    { date: project.updatedAt, value: `${project.riskProbability}%`, note: "Latest AI assessment after acquisition data updates" },
  ] : [], [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Super Admin · Projects" />
        <main className="mx-auto max-w-3xl px-4 pt-24">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">Project not found</h1>
            <Link href="/roles/super-admin/projects" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const category = getProjectCategory(project);
  const canVerify = category === "Completed";
  const ProjectIcon = projectTypeMeta[project.type]?.icon || FolderKanban;

  const updateWorkflow = (action, mutate) => {
    updateSuperAdminState((current) => addAuditLog(current, action, project.name, "Project verification", mutate));
  };

  const verifyProject = () => {
    if (!canVerify) return;
    const verifiedAt = new Date().toISOString();
    updateWorkflow("Project verified", (current) => ({
      ...current,
      projects: current.projects.map((item) => item.id === project.id ? {
        ...item,
        status: "Verified",
        workflowStatus: "Verified",
        verification: { verifiedBy: "Super Admin", verifiedAt },
        workflowActivity: [{
          id: `workflow-${Date.now()}`,
          action: "Project verified",
          actor: "Super Admin",
          role: "Super Admin",
          timestamp: verifiedAt,
          status: "Completed",
        }, ...(item.workflowActivity || [])],
      } : item),
    }));
  };

  const sendBack = () => {
    if (!canVerify || !reason.trim()) return;
    const sentBackAt = new Date().toISOString();
    updateWorkflow("Project sent back for correction", (current) => ({
      ...current,
      projects: current.projects.map((item) => item.id === project.id ? {
        ...item,
        status: "Sent Back for Correction",
        workflowStatus: "Sent Back for Correction",
        nodalReviewCompleted: false,
        correctionReason: reason.trim(),
        verification: null,
        workflowActivity: [{
          id: `workflow-${Date.now()}`,
          action: "Sent back for correction",
          actor: "Super Admin",
          role: "Super Admin",
          timestamp: sentBackAt,
          status: "Correction required",
          remark: reason.trim(),
        }, ...(item.workflowActivity || [])],
      } : item),
    }));
    setReason("");
    setShowSendBack(false);
  };

  return (
    <div className={`${styles.shell} min-h-screen bg-slate-50 text-slate-800`}>
      <Header title="Super Admin · Project Details" />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/roles/super-admin/projects" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{project.projectId}</span>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700"><ProjectIcon className="h-6 w-6" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{project.type}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{project.name}</h1>
                <p className="mt-2 text-sm text-slate-600">Project Officer → LAO → Nodal Officer → Super Admin verification</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] ${category === "Verified" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : category === "Completed" ? "border-sky-200 bg-sky-50 text-sky-700" : "border-slate-200 bg-slate-100 text-slate-700"}`}>{category}</span>
              <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] ${riskTone[project.riskCategory] || "border-slate-200 bg-slate-100 text-slate-600"}`}>{project.riskProbability}% {project.riskCategory} risk</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Panel title="Project overview / PO information" icon={FolderKanban}><p className="text-sm leading-6 text-slate-600">{project.description}</p><div className="mt-4"><DetailsList items={[["Project type", project.type], ["Land required", `${project.requiredLandArea} ${project.landUnit}`], ["State", project.state], ["District", project.district], ["Village", project.village]]} /></div></Panel>
            <Panel title="LAO acquisition information" icon={Landmark}><DetailsList items={[["Project Officer", assignment?.projectOfficer], ["LAO", assignment?.lao], ["Nodal Officer", assignment?.nodalOfficer], ["Assignment status", assignment?.status], ["Jurisdiction", assignment?.jurisdiction]]} /></Panel>
            <Panel title="GIS information" icon={MapPinned}><DetailsList items={[["Latitude", project.coordinates?.latitude], ["Longitude", project.coordinates?.longitude], ["Boundary / route", project.coordinates ? "Available for review" : "Missing"], ["Cadastral changes", "Not modified"]]} /></Panel>
          </div>
        </section>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <Panel title="Parcel verification" icon={Users}><DetailsList items={[["Total parcels", 48], ["Verified parcels", project.riskProbability > 75 ? 29 : 34], ["Pending verification", 19], ["Verification status", "LAO review recorded"]]} /></Panel>
          <Panel title="Ownership and compensation" icon={Landmark}><DetailsList items={[["Ownership issues", project.riskCategory === "Critical" ? 8 : 5], ["Compensation progress", `${project.riskCategory === "Critical" ? 42 : 58}%`], ["Pending cases", "Compensation verification"]]} /></Panel>
          <Panel title="Legal / Disputes, R&R and Approvals" icon={FileText}><DetailsList items={[["Legal cases", project.riskCategory === "Critical" ? 7 : 4], ["R&R", project.riskCategory === "Critical" ? "Pending" : "In progress"], ["Approvals", "In review"]]} /></Panel>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <Panel title="AI risk assessment and factors" icon={ShieldAlert}><div className="flex items-center justify-between gap-4"><div><p className="text-3xl font-semibold text-slate-900">{project.riskProbability}%</p><p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-red-700">{project.riskCategory} risk</p><p className="mt-2 text-xs text-slate-500">Read-only review. Super Admin cannot alter AI scores or prediction logic.</p></div><Bot className="h-10 w-10 text-slate-400" /></div><div className="mt-5"><RiskFactors project={project} /></div></Panel>
          <Panel title="AI recommendations and risk history" icon={TrendingUp}><div className="space-y-3">{["Prioritize unresolved compensation records", "Request focused ownership verification", "Track pending district approvals"].map((item) => <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{item}</div>)}{riskHistory.map((item) => <div key={item.date} className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm"><span className="font-semibold text-slate-800">{item.value}</span><span className="text-xs text-slate-500">{item.date} · {item.note}</span></div>)}</div></Panel>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <Panel title="Documents, monitoring and interventions" icon={Paperclip}><DetailsList items={[["Documents", project.documents?.length || "Project documents available"], ["Nodal monitoring", project.nodalReviewCompleted ? "Completed" : "In progress"], ["Interventions", "Review recorded in Nodal workflow"], ["Approvals", "Available for verification"]]} /></Panel>
          <Panel title="Activity / audit timeline" icon={MessageSquareText}><div className="space-y-3">{[...(project.workflowActivity || []), { id: "created", action: "Project record available", actor: "BHOOMI-AI", timestamp: project.updatedAt, status: "Recorded" }].map((item) => <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-800">{item.action}</span><span className="text-[11px] text-slate-500">{formatDateTime(item.timestamp)}</span></div><p className="mt-1 text-xs text-slate-600">{item.actor} · {item.role || "System"}{item.remark ? ` · ${item.remark}` : ""}</p></div>)}</div></Panel>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Final verification</p><h2 className="mt-2 text-xl font-semibold text-slate-900">Review the complete analysis before advancing</h2><p className="mt-1 text-sm text-slate-600">Verification confirms review completion; it does not modify AI analysis.</p></div>
            <div className="flex flex-wrap gap-2">
              {category === "Verified" ? <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-4 w-4" />Verified by {project.verification?.verifiedBy}</span> : canVerify ? <><button type="button" onClick={verifyProject} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-emerald-800"><CheckCircle2 className="h-4 w-4" />Verify Project</button><button type="button" onClick={() => setShowSendBack(true)} className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800 transition duration-200 hover:bg-amber-100">Send Back for Correction</button></> : <span className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600">Ongoing projects are view-only</span>}
            </div>
          </div>
          {project.verification ? <p className="mt-4 text-xs text-slate-500">Verified on {formatDateTime(project.verification.verifiedAt)}</p> : null}
          {project.correctionReason ? <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Correction reason: {project.correctionReason}</p> : null}
        </section>

        {showSendBack ? <div className="fixed inset-0 z-1100 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={() => setShowSendBack(false)}><div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Send back for correction</h2><button type="button" onClick={() => setShowSendBack(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button></div><textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={5} placeholder="Enter the correction reason" className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-slate-400" /><div className="mt-4 flex justify-end"><button type="button" disabled={!reason.trim()} onClick={sendBack} className="rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300">Send Back</button></div></div></div> : null}
      </main>
    </div>
  );
}
