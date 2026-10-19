"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderKanban,
  Gauge,
  Globe2,
  LayoutDashboard,
  Menu,
  MapPinned,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import "./page.css";

const roleLinks = [
  {
    href: "/roles/project-officer/",
    title: "Project Officer",
    description: "Create projects and submit GIS boundaries.",
    icon: FolderKanban,
  },
  {
    href: "/roles/LandAcqOfficer/",
    title: "Land Acquisition Officer",
    description: "Review parcels and acquisition progress.",
    icon: MapPinned,
  },
  {
    href: "/roles/nodal-officer/",
    title: "Nodal Officer",
    description: "Monitor risk, actions and project closure.",
    icon: Gauge,
  },
  {
    href: "/roles/admin",
    title: "System Administrator",
    description: "Manage users, jurisdictions and controls.",
    icon: Settings,
  },
  {
    href: "/roles/super-admin",
    title: "Super Admin",
    description: "Verify projects and make final decisions.",
    icon: ShieldCheck,
  },
];

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#dashboard" },
  { label: "My Projects", icon: FolderKanban, href: "#projects" },
  { label: "GIS Overview", icon: MapPinned, href: "#gis" },
  { label: "Notifications", icon: Bell, href: "#notifications", badge: "3" },
];

const projects = [
  { code: "BH-2026-AUTO", name: "Delhi-Meerut Highway Expansion", location: "Uttar Pradesh", status: "In progress", risk: "High", progress: 68 },
  { code: "BH-2026-IRR", name: "Yamuna Irrigation Corridor", location: "Haryana", status: "Under review", risk: "Medium", progress: 44 },
  { code: "BH-2026-METRO", name: "Regional Metro Link", location: "Delhi NCR", status: "Draft", risk: "Low", progress: 22 },
];

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rolePickerOpen, setRolePickerOpen] = useState(false);

  return (
    <main className="dashboard-landing">
      <aside className={`dashboard-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-logo"><img src="/images/logo.png" alt="" /></span>
          <span>
            <strong>BHOOMI-AI</strong>
            <small>Land Intelligence</small>
          </span>
        </div>

        <button className="sidebar-back" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation">
          <ChevronRight size={20} />
        </button>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon, href, badge }, index) => (
            <a className={`sidebar-link ${index === 0 ? "active" : ""}`} href={href} key={label} onClick={() => setSidebarOpen(false)}>
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
              {badge && <em>{badge}</em>}
            </a>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <a className="sidebar-link" href="#settings">
            <Settings size={18} />
            <span>Settings</span>
          </a>
          <div className="sidebar-status">
            <span className="status-dot" />
            <span><strong>System operational</strong><small>All services are online</small></span>
          </div>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-scrim" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

      <section className="dashboard-workspace">
        <header className="dashboard-header">
          <div className="header-heading">
            <button className="mobile-menu-button" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
              <Menu size={21} />
            </button>
            <div>
              <span className="eyebrow">Project Officer workspace</span>
              <h1>Good morning, Khalid</h1>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-button" type="button" aria-label="Search"><Search size={18} /></button>
            <button className="icon-button notification-button" type="button" aria-label="Notifications"><Bell size={18} /><i /></button>
            <button className="location-pill" type="button"><MapPinned size={16} /><strong>Ujwa</strong><span>Delhi</span><ChevronDown size={15} /></button>
            <button className="profile-pill" type="button">
              <span className="avatar">KU</span>
              <span><strong>Khalid Umar</strong><small>Project Officer</small></span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="welcome-row">
            <div>
              <span className="eyebrow">Monday, 19 October 2026</span>
              <h2>Project overview</h2>
              <p>Track your land-acquisition projects and keep every milestone moving.</p>
            </div>
            <button className="primary-action" type="button" onClick={() => setRolePickerOpen(true)}>
              <Plus size={18} /> Create Project
            </button>
          </div>

          <div className="stat-grid" id="dashboard">
            <article className="stat-card stat-blue"><span className="stat-icon"><FolderKanban size={19} /></span><strong>12</strong><span>Active projects</span><small><b>+3</b> this month</small></article>
            <article className="stat-card stat-purple"><span className="stat-icon"><MapPinned size={19} /></span><strong>08</strong><span>GIS mapped</span><small><b>67%</b> of total projects</small></article>
            <article className="stat-card stat-amber"><span className="stat-icon"><FileText size={19} /></span><strong>24</strong><span>Pending reviews</span><small><b>6</b> need attention</small></article>
            <article className="stat-card stat-green"><span className="stat-icon"><Sparkles size={19} /></span><strong>82%</strong><span>On-track health</span><small><b>+8%</b> from last month</small></article>
          </div>

          <div className="content-grid">
            <section className="panel projects-panel" id="projects">
              <div className="panel-heading">
                <div><span className="panel-kicker">Portfolio</span><h3>Recent projects</h3></div>
                <a href="#projects">View all <ChevronRight size={15} /></a>
              </div>
              <div className="project-list">
                {projects.map((project) => (
                  <article className="project-row" key={project.code}>
                    <span className="project-symbol"><Globe2 size={19} /></span>
                    <div className="project-name"><strong>{project.name}</strong><small>{project.code} · {project.location}</small></div>
                    <span className={`risk-chip risk-${project.risk.toLowerCase()}`}>{project.risk} risk</span>
                    <div className="project-progress"><span><i style={{ width: `${project.progress}%` }} /></span><small>{project.progress}%</small></div>
                    <span className="project-status">{project.status}</span>
                    <ChevronRight size={17} className="row-arrow" />
                  </article>
                ))}
              </div>
            </section>

            <section className="panel quick-panel" id="gis">
              <div className="panel-heading"><div><span className="panel-kicker">Shortcuts</span><h3>Quick access</h3></div></div>
              <div className="quick-grid">
                <button type="button" onClick={() => setRolePickerOpen(true)}><span className="quick-icon blue"><Plus size={18} /></span><strong>New project</strong><small>Start a new acquisition case</small></button>
                <a href="#gis"><span className="quick-icon teal"><MapPinned size={18} /></span><strong>Open GIS map</strong><small>Review mapped locations</small></a>
                <a href="#reports"><span className="quick-icon orange"><FileText size={18} /></span><strong>View reports</strong><small>Download project summaries</small></a>
                <a href="#team"><span className="quick-icon violet"><Users size={18} /></span><strong>Team activity</strong><small>See recent collaboration</small></a>
              </div>
            </section>
          </div>

          <section className="insight-banner" id="notifications">
            <div className="insight-icon"><Sparkles size={23} /></div>
            <div><span className="panel-kicker">AI monitoring insight</span><strong>6 projects need attention this week</strong><p>Compensation and ownership verification are the leading delay factors across your portfolio.</p></div>
            <a href="#projects">Review risks <ChevronRight size={16} /></a>
          </section>
        </div>
      </section>

      {rolePickerOpen && (
        <div className="role-modal-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && setRolePickerOpen(false)}>
          <section className="role-modal" role="dialog" aria-modal="true" aria-labelledby="role-picker-title">
            <button className="modal-close" type="button" onClick={() => setRolePickerOpen(false)} aria-label="Close role selection"><X size={19} /></button>
            <span className="panel-kicker">Platform access</span>
            <h2 id="role-picker-title">Choose your workspace</h2>
            <p>Select a role to continue into the relevant BHOOMI-AI workspace.</p>
            <div className="role-grid">
              {roleLinks.map(({ href, title, description, icon: Icon }) => (
                <Link href={href} className="role-option" key={title} onClick={() => setRolePickerOpen(false)}>
                  <span><Icon size={19} /></span><strong>{title}</strong><small>{description}</small><ChevronRight size={16} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
