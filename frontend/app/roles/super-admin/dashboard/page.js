"use client";

import Link from "next/link";
import { Activity, FolderKanban, ShieldCheck, Users } from "lucide-react";
import { Header } from "../../../component/layout";

const metrics = [
    { label: "Active users", value: "248", detail: "+12 this month", icon: Users, tone: "sky" },
    { label: "Total projects", value: "134", detail: "Across 8 districts", icon: FolderKanban, tone: "emerald" },
    { label: "System health", value: "99.98%", detail: "Last 30 days", icon: ShieldCheck, tone: "violet" },
    { label: "Audit events", value: "1,284", detail: "Today", icon: Activity, tone: "amber" },
];

const actions = [
    { label: "Manage users", href: "/roles/super-admin/users", description: "Review accounts and permissions" },
    { label: "Review projects", href: "/roles/super-admin/projects", description: "Monitor every project in the system" },
    { label: "Open audit log", href: "/roles/super-admin/audit-log", description: "Trace administrative activity" },
];

const toneClasses = {
    sky: "bg-sky-50 text-sky-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
};

export default function Dashboard() {
    return (
        <>
            <Header title="Super Admin Dashboard" />
            <main className="page-shell">
                <div className="page-container">
                    <header className="mb-6 rounded-2xl border border-slate-200 bg-white/80 px-5 py-5 shadow-sm backdrop-blur-sm">
                        <p className="mb-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-slate-500">Central administration</p>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">System overview</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-500">Manage access, monitor platform activity, and keep land acquisition workflows running smoothly.</p>
                    </header>

                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {metrics.map(({ label, value, detail, icon: Icon, tone }) => (
                            <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium text-slate-500">{label}</p>
                                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
                                <p className="mt-2 text-xs text-slate-500">{detail}</p>
                            </article>
                        ))}
                    </section>

                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-base font-semibold text-slate-800">Administration tools</h2>
                            <p className="mt-1 text-sm text-slate-500">Common controls for the platform administrator.</p>
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                            {actions.map(({ label, href, description }) => (
                                <Link key={label} href={href} className="rounded-xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50">
                                    <p className="font-semibold text-slate-800">{label}</p>
                                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}