"use client";

import { useMemo, useState } from "react";
import { Activity, CheckCircle2, Eye, Search, ShieldAlert, X } from "lucide-react";
import { Header } from "../../../component/layout";

const initialEvents = [
  { id: "EVT-1048", action: "User role updated", actor: "System Administrator", target: "PO-014 · Meera Nair", timestamp: "Sep 13, 2026 · 10:42 AM", type: "Access", severity: "Info", details: "Project Officer permissions were reviewed and updated for the Pune district." },
  { id: "EVT-1047", action: "Project status changed", actor: "Sahil Alvi", target: "BH-2026-001 · Delhi–Meerut Highway Expansion", timestamp: "Sep 13, 2026 · 10:18 AM", type: "Project", severity: "Info", details: "Project status changed from Pending LAO Verification to Under Acquisition." },
  { id: "EVT-1046", action: "Failed login attempt", actor: "Unknown account", target: "admin@bhoomi.gov.in", timestamp: "Sep 13, 2026 · 09:56 AM", type: "Security", severity: "Warning", details: "A failed login attempt was recorded from an unrecognized browser session." },
  { id: "EVT-1045", action: "User suspended", actor: "System Administrator", target: "PO-014 · Meera Nair", timestamp: "Sep 12, 2026 · 04:20 PM", type: "Access", severity: "Critical", details: "Account access was suspended pending an administrator review." },
  { id: "EVT-1044", action: "Project created", actor: "Khalid Umar", target: "BH-2026-011 · Yamuna Link Road", timestamp: "Sep 12, 2026 · 02:05 PM", type: "Project", severity: "Info", details: "A new project record was submitted for initial administrative review." },
  { id: "EVT-1043", action: "Report exported", actor: "System Administrator", target: "Portfolio risk report", timestamp: "Sep 12, 2026 · 11:32 AM", type: "System", severity: "Info", details: "The portfolio risk report was exported as a CSV file." },
];

const severityStyles = { Info: "bg-sky-50 text-sky-700", Warning: "bg-amber-50 text-amber-700", Critical: "bg-rose-50 text-rose-700" };

export default function AuditLogPage() {
  const [events] = useState(initialEvents);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All event types");
  const [severity, setSeverity] = useState("All severity");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = useMemo(() => events.filter((event) => {
    const searchable = `${event.action} ${event.actor} ${event.target} ${event.id}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (type === "All event types" || event.type === type) && (severity === "All severity" || event.severity === severity);
  }), [events, query, type, severity]);

  return (
    <>
      <Header title="Audit Log" />
      <main className="page-shell">
        <div className="page-container">
          <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Governance trail</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Audit log</h1><p className="mt-2 text-sm text-slate-500">Trace administrative actions, security events, and changes across the platform.</p></div>

          <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[{ label: "Events today", value: "42", icon: Activity, tone: "text-sky-600" }, { label: "Successful actions", value: "39", icon: CheckCircle2, tone: "text-emerald-600" }, { label: "Security alerts", value: "3", icon: ShieldAlert, tone: "text-rose-600" }].map(({ label, value, icon: Icon, tone }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Icon className={`h-5 w-5 ${tone}`} /><p className="mt-3 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p></div>)}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search event, actor, target, or ID" className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" /></label><select value={type} onChange={(event) => setType(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"><option>All event types</option><option>Access</option><option>Project</option><option>Security</option><option>System</option></select><select value={severity} onChange={(event) => setSeverity(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"><option>All severity</option><option>Info</option><option>Warning</option><option>Critical</option></select></div>
            <div className="overflow-x-auto"><table className="w-full min-w-212.5 text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Event</th><th className="px-5 py-3 font-semibold">Actor</th><th className="px-5 py-3 font-semibold">Target</th><th className="px-5 py-3 font-semibold">Time</th><th className="px-5 py-3 font-semibold">Severity</th><th className="px-5 py-3" /></tr></thead><tbody className="divide-y divide-slate-100">{filteredEvents.map((event) => <tr key={event.id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-semibold text-slate-800">{event.action}</p><p className="mt-1 text-xs text-slate-500">{event.id} · {event.type}</p></td><td className="px-5 py-4 text-slate-600">{event.actor}</td><td className="max-w-[260px] px-5 py-4 text-slate-600">{event.target}</td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{event.timestamp}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${severityStyles[event.severity]}`}>{event.severity}</span></td><td className="px-5 py-4 text-right"><button onClick={() => setSelectedEvent(event)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"><Eye className="h-4 w-4" /> Details</button></td></tr>)}</tbody></table></div>
            {!filteredEvents.length && <div className="p-10 text-center text-sm text-slate-500">No audit events match the selected filters.</div>}
          </section>

          {selectedEvent && <div className="fixed inset-0 z-1100 flex justify-end bg-slate-950/40"><aside className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Event details</p><h2 className="mt-1 text-xl font-bold text-slate-900">{selectedEvent.action}</h2><p className="mt-1 text-sm text-slate-500">{selectedEvent.id}</p></div><button aria-label="Close event details" onClick={() => setSelectedEvent(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="mt-6 rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Recorded event</p><p className="mt-2 text-sm leading-6 text-slate-700">{selectedEvent.details}</p></div><dl className="mt-5 divide-y divide-slate-100">{[["Actor", selectedEvent.actor], ["Target", selectedEvent.target], ["Event type", selectedEvent.type], ["Severity", selectedEvent.severity], ["Timestamp", selectedEvent.timestamp]].map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-3 text-sm"><dt className="text-slate-500">{label}</dt><dd className="text-right font-semibold text-slate-800">{value}</dd></div>)}</dl><button onClick={() => setSelectedEvent(null)} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Close details</button></aside></div>}
        </div>
      </main>
    </>
  );
}