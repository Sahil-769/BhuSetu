import './page.css'

const roles = [
  ['/roles/project-officer/', 'Project Officer', 'Create projects and submit GIS boundaries.', '01'],
  ['/roles/LandAcqOfficer/', 'Land Acquisition Officer', 'Review parcels and acquisition progress.', '02'],
  ['/roles/nodal-officer/', 'Nodal Officer', 'Monitor risk, actions and project closure.', '03'],
  ['/roles/admin', 'Admin', 'Manage users, jurisdictions and controls.', '04'],
  ['/roles/super-admin', 'Super Admin', 'Verify projects and make final decisions.', '05'],
]

export default function Page() {
  return (
    <main className="portal-shell">
      <div className="portal-grid" aria-hidden="true" />
      <section className="portal-content">
        <header className="portal-header">
          <div className="brand-mark"><span className="brand-dot" /> BHOOMI-AI</div>
          <div className="header-status"><span className="status-dot" /> Secure operations portal</div>
        </header>

        <div className="portal-intro">
          <div>
            <p className="eyebrow">LAND ACQUISITION INTELLIGENCE</p>
            <h1>Land acquisition<br /><em>monitoring, made clear.</em></h1>
            <p className="intro-copy">One connected workspace for project planning, parcel progress and explainable delay-risk decisions.</p>
          </div>
          <div className="intro-index"><strong>05</strong><span>workspaces<br />available</span></div>
        </div>

        <div className="workspace-heading">
          <span>Choose a workspace</span>
          <span className="heading-line" />
          <small>Access is role-based</small>
        </div>

        <div className="role-grid">
          {roles.map(([href, label, description, number]) => (
            <a className="role-card" key={href} href={href}>
              <span className="role-number">{number}</span>
              <span className="role-label">{label}</span>
              <span className="role-description">{description}</span>
              <span className="role-arrow" aria-hidden="true">-&gt;</span>
            </a>
          ))}
        </div>

        <footer className="portal-footer">
          <span>GIS planning</span><span>AI risk intelligence</span><span>Workflow visibility</span>
          <span className="footer-version">BHOOMI-AI / 2026</span>
        </footer>
      </section>
    </main>
  )
}
