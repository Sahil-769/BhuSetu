'use client'

import React, { useMemo } from 'react'

const jurisdictionMap = {
  'All States': {
    projects: 52,
    routes: 18,
    coverage: '92%',
    markers: [
      { top: '24%', left: '24%', tone: 'low' },
      { top: '36%', left: '46%', tone: 'medium' },
      { top: '55%', left: '68%', tone: 'high' },
      { top: '72%', left: '34%', tone: 'low' }
    ]
  },
  'State Level': {
    projects: 31,
    routes: 11,
    coverage: '87%',
    markers: [
      { top: '30%', left: '30%', tone: 'low' },
      { top: '42%', left: '58%', tone: 'medium' },
      { top: '61%', left: '75%', tone: 'high' }
    ]
  },
  'District Level': {
    projects: 16,
    routes: 7,
    coverage: '79%',
    markers: [
      { top: '28%', left: '38%', tone: 'low' },
      { top: '57%', left: '62%', tone: 'medium' }
    ]
  },
  'Tehsil Level': {
    projects: 8,
    routes: 4,
    coverage: '71%',
    markers: [
      { top: '32%', left: '46%', tone: 'low' },
      { top: '66%', left: '62%', tone: 'medium' }
    ]
  }
}

const resolveAdminJurisdiction = () => {
  if (typeof window === 'undefined') {
    return 'All States'
  }

  const storedProfile = window.localStorage.getItem('adminProfile') || window.localStorage.getItem('currentProfile') || window.localStorage.getItem('selectedProfile')

  if (!storedProfile) return 'All States'

  try {
    const parsedProfile = JSON.parse(storedProfile)
    if (parsedProfile?.jurisdiction) return parsedProfile.jurisdiction
  } catch {
    return 'All States'
  }

  return 'All States'
}

const GisOverview = () => {
  const summary = useMemo(() => {
    const jurisdiction = resolveAdminJurisdiction()
    return jurisdictionMap[jurisdiction] || jurisdictionMap['All States']
  }, [])

  return (
    <section className="dashboard-card">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Spatial</p>
          <h2>GIS Overview</h2>
        </div>
        <span className="section-badge">Coverage {summary.coverage}</span>
      </div>

      <div className="gis-panel" aria-label="Jurisdiction map coverage panel">
        <svg viewBox="0 0 360 220" className="gis-map-svg" aria-hidden="true">
          <path d="M52 30 C112 55, 136 44, 180 80 S266 124, 288 88 S326 64, 340 110 L340 176 C300 150, 258 154, 210 174 S120 184, 82 164 S42 124, 52 30 Z" />
          <path d="M72 86 L126 104 L154 148 L228 128 L284 142 L290 188" />
          <path d="M108 50 L156 86 L200 60 L244 96 L282 72" />
        </svg>

        {summary.markers.map((marker, index) => (
          <span
            key={`${marker.top}-${marker.left}-${index}`}
            className={`gis-marker ${marker.tone}`}
            style={{ top: marker.top, left: marker.left }}
          />
        ))}
      </div>

      <div className="gis-legend">
        <span className="gis-legend-item"><span className="gis-dot gis-dot--low" /> Projects {summary.projects}</span>
        <span className="gis-legend-item"><span className="gis-dot gis-dot--medium" /> Routes {summary.routes}</span>
        <span className="gis-legend-item"><span className="gis-dot gis-dot--high" /> Coverage {summary.coverage}</span>
      </div>
    </section>
  )
}

export default GisOverview
