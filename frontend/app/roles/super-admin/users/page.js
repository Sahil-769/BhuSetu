"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Plus, Search, ShieldCheck, UserCheck, UserX, X } from "lucide-react";
import { Header } from "../../../component/layout";

const initialUsers = [
  { id: "SA-100", name: "System Administrator", email: "admin@bhoomi.gov.in", role: "Super Admin", district: "All States", status: "Active", lastLogin: "Today, 06:20 AM" },
  { id: "PO-001", name: "Khalid Umar", email: "khalid.umar@bhoomi.gov.in", role: "Project Officer", district: "Delhi", status: "Active", lastLogin: "Today, 09:42 AM" },
  { id: "LAO-021", name: "Ali Arzan Zaidi", email: "ali.zaidi@bhoomi.gov.in", role: "Land Acquisition Officer", district: "Delhi", status: "Active", lastLogin: "Yesterday, 08:15 AM" },
  { id: "NO-001", name: "Sahil Alvi", email: "sahil.alvi@bhoomi.gov.in", role: "Nodal Officer", district: "Delhi", status: "Active", lastLogin: "Yesterday, 07:58 AM" },
  { id: "PO-014", name: "Meera Nair", email: "meera.nair@bhoomi.gov.in", role: "Project Officer", district: "Pune", status: "Suspended", lastLogin: "Sep 04, 04:18 PM" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All roles");
  const [status, setStatus] = useState("All statuses");
  const [showInvite, setShowInvite] = useState(false);
  const [menuId, setMenuId] = useState(null);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesQuery = `${user.name} ${user.email} ${user.id}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (role === "All roles" || user.role === role) && (status === "All statuses" || user.status === status);
  }), [users, query, role, status]);

  const toggleStatus = (id) => {
    setUsers((current) => current.map((user) => user.id === id ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" } : user));
    setMenuId(null);
  };

  return (
    <>
      <Header title="User Management" />
      <main className="page-shell">
        <div className="page-container">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Access control</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">User management</h1><p className="mt-2 text-sm text-slate-500">Review accounts, roles, and access permissions.</p></div>
            <button onClick={() => setShowInvite(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"><Plus className="h-4 w-4" /> Invite user</button>
          </div>

          <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[{ label: "Total users", value: users.length, icon: ShieldCheck }, { label: "Active now", value: users.filter((user) => user.status === "Active").length, icon: UserCheck }, { label: "Suspended", value: users.filter((user) => user.status === "Suspended").length, icon: UserX }].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Icon className="h-5 w-5 text-sky-600" /><p className="mt-3 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p></div>)}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row">
              <label className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, or employee ID" className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" /></label>
              <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"><option>All roles</option><option>Super Admin</option><option>Project Officer</option><option>Land Acquisition Officer</option><option>Nodal Officer</option></select>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none"><option>All statuses</option><option>Active</option><option>Suspended</option></select>
            </div>
            <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">User</th><th className="px-5 py-3 font-semibold">Role</th><th className="px-5 py-3 font-semibold">District</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Last login</th><th className="px-5 py-3" /></tr></thead><tbody className="divide-y divide-slate-100">{filteredUsers.map((user) => <tr key={user.id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-semibold text-slate-800">{user.name}</p><p className="mt-1 text-xs text-slate-500">{user.id} · {user.email}</p></td><td className="px-5 py-4 text-slate-600">{user.role}</td><td className="px-5 py-4 text-slate-600">{user.district}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{user.status}</span></td><td className="px-5 py-4 text-slate-500">{user.lastLogin}</td><td className="relative px-5 py-4 text-right"><button aria-label={`Actions for ${user.name}`} onClick={() => setMenuId(menuId === user.id ? null : user.id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><MoreHorizontal className="h-4 w-4" /></button>{menuId === user.id && <div className="absolute right-5 top-12 z-10 w-36 rounded-xl border border-slate-200 bg-white p-1 text-left shadow-lg"><button onClick={() => toggleStatus(user.id)} className="w-full rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{user.status === "Active" ? "Suspend user" : "Restore user"}</button><button onClick={() => setMenuId(null)} className="w-full rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">View profile</button></div>}</td></tr>)}</tbody></table></div>
            {!filteredUsers.length && <div className="p-10 text-center text-sm text-slate-500">No users match the selected filters.</div>}
          </section>

          {showInvite && <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/40 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Invite a user</h2><button aria-label="Close invite form" onClick={() => setShowInvite(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><p className="mt-1 text-sm text-slate-500">Send a secure onboarding link to a new administrator.</p><div className="mt-5 space-y-3"><input placeholder="Full name" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" /><input placeholder="Work email" type="email" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" /><select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option>Project Officer</option><option>Land Acquisition Officer</option><option>Nodal Officer</option></select></div><button onClick={() => setShowInvite(false)} className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Send invitation</button></div></div>}
        </div>
      </main>
    </>
  );
}