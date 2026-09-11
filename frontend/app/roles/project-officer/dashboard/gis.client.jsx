'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, Polygon, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Card from '../../../component/common/Card'
import { PROJECTS, districtOptions, projectTypeOptions, riskOptions, statusOptions } from '../../project-officer/my-project/projects-data'

const riskColor = (risk) => {
  switch (risk) {
    case 'Critical':
      return '#dc2626'
    case 'High':
      return '#ef4444'
    case 'Medium':
      return '#f59e0b'
    case 'Low':
      return '#10b981'
    default:
      return '#64748b'
  }
}

const getStatusProgress = (status) => {
  switch (status) {
    case 'Completed':
      return 100
    case 'Under Acquisition':
      return 68
    case 'Pending LAO Verification':
      return 41
    case 'On Hold':
      return 33
    case 'Draft':
      return 18
    default:
      return 0
  }
}

const isLinearProject = (type) => ['Highway', 'Railway', 'Metro', 'Road'].includes(type)

const buildGeometry = (project) => {
  const lat = Number(project.coordinates?.latitude ?? 20.5937)
  const lng = Number(project.coordinates?.longitude ?? 78.9629)

  if (isLinearProject(project.type)) {
    return {
      route: [
        [lat - 0.12, lng - 0.18],
        [lat - 0.04, lng - 0.02],
        [lat + 0.06, lng + 0.16],
        [lat + 0.14, lng + 0.28],
      ],
      polygon: null,
    }
  }

  const delta = 0.12
  return {
    route: null,
    polygon: [
      [lat + delta, lng - delta],
      [lat + delta, lng + delta],
      [lat - delta, lng + delta],
      [lat - delta, lng - delta],
    ],
  }
}

const buildParcelData = (project) => {
  const baseLat = Number(project.coordinates?.latitude ?? 20.5937)
  const baseLng = Number(project.coordinates?.longitude ?? 78.9629)
  const candidate = [
    [baseLat + 0.10, baseLng - 0.12],
    [baseLat + 0.12, baseLng + 0.04],
    [baseLat + 0.08, baseLng + 0.14],
    [baseLat + 0.02, baseLng + 0.10],
  ]

  const verified = [
    [baseLat - 0.04, baseLng - 0.05],
    [baseLat + 0.02, baseLng - 0.02],
    [baseLat + 0.03, baseLng + 0.09],
    [baseLat - 0.02, baseLng + 0.06],
  ]

  return {
    available: project.id % 2 === 0 || project.id === 1 || project.id === 8,
    candidate,
    verified,
  }
}

function MapBoundsController({ projects }) {
  const map = useMap()

  useEffect(() => {
    if (!projects.length) return

    const points = projects.flatMap((project) => {
      const geometry = buildGeometry(project)
      const coords = []

      if (geometry.route) coords.push(...geometry.route)
      if (geometry.polygon) coords.push(...geometry.polygon)
      coords.push([project.coordinates.latitude, project.coordinates.longitude])
      return coords
    })

    if (points.length) {
      map.fitBounds(points, { padding: [28, 28], maxZoom: 7 })
    }
  }, [projects, map])

  return null
}

export default function GisClient() {
  const [query, setQuery] = useState('')
  const [districtFilter, setDistrictFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [riskFilter, setRiskFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showMarkers, setShowMarkers] = useState(true)
  const [showRoutes, setShowRoutes] = useState(true)
  const [showRiskZones, setShowRiskZones] = useState(true)
  const [showParcels, setShowParcels] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0]?.id ?? null)

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      const matchesQuery = `${project.projectId} ${project.name} ${project.village} ${project.district}`
        .toLowerCase()
        .includes(query.toLowerCase())

      const matchesDistrict = districtFilter === 'All' || project.district === districtFilter
      const matchesType = typeFilter === 'All' || project.type === typeFilter
      const matchesRisk = riskFilter === 'All' || project.riskCategory === riskFilter
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter

      return matchesQuery && matchesDistrict && matchesType && matchesRisk && matchesStatus
    })
  }, [districtFilter, query, riskFilter, statusFilter, typeFilter])

  useEffect(() => {
    if (!filteredProjects.length) return

    if (!filteredProjects.some((project) => project.id === selectedProjectId)) {
      setSelectedProjectId(filteredProjects[0].id)
    }
  }, [filteredProjects, selectedProjectId])

  const selectedProject = filteredProjects.find((project) => project.id === selectedProjectId) ?? filteredProjects[0] ?? null

  const hasAuthorizedParcelData = useMemo(
    () => filteredProjects.some((project) => buildParcelData(project).available),
    [filteredProjects],
  )

  return (
    <Card className="w-full max-w-full overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-slate-50 px-3 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
          <label className="relative block min-w-[180px] flex-1">
            <span className="sr-only">Search project</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search project or district"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pl-9 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          </label>

          <select
            value={districtFilter}
            onChange={(event) => setDistrictFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            {['All', ...districtOptions].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            {['All', ...projectTypeOptions.filter((type) => type !== 'All')].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={riskFilter}
            onChange={(event) => setRiskFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            {['All', ...riskOptions.filter((risk) => risk !== 'All')].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            {['All', ...statusOptions.filter((status) => status !== 'All')].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setQuery('')
              setDistrictFilter('All')
              setTypeFilter('All')
              setRiskFilter('All')
              setStatusFilter('All')
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
          >
            Reset
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setShowMarkers((value) => !value)}
            className={`rounded-full px-2.5 py-1.5 ${showMarkers ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-600'}`}
          >
            Markers
          </button>
          <button
            type="button"
            onClick={() => setShowRoutes((value) => !value)}
            className={`rounded-full px-2.5 py-1.5 ${showRoutes ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}
          >
            Routes
          </button>
          <button
            type="button"
            onClick={() => setShowRiskZones((value) => !value)}
            className={`rounded-full px-2.5 py-1.5 ${showRiskZones ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'}`}
          >
            Risk zones
          </button>
          <button
            type="button"
            onClick={() => setShowParcels((value) => !value)}
            className={`rounded-full px-2.5 py-1.5 ${showParcels ? 'bg-violet-100 text-violet-800' : 'bg-slate-200 text-slate-600'}`}
          >
            Parcel overviews
          </button>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[1.65fr_0.9fr]">
        <div className="h-[330px] w-full md:h-[380px]">
          {filteredProjects.length ? (
            <MapContainer
              center={[23.0225, 78.5714]}
              zoom={5}
              scrollWheelZoom
              className="relative z-0 h-full w-full"
              attributionControl={false}
              style={{ overscrollBehavior: "contain", zIndex: 1 }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapBoundsController projects={filteredProjects} />

              {filteredProjects.map((project) => {
                const geometry = buildGeometry(project)
                const parcelData = buildParcelData(project)
                const projectRisk = riskColor(project.riskCategory)

                return (
                  <React.Fragment key={project.id}>
                    {showRiskZones && (
                      <Circle
                        center={[project.coordinates.latitude, project.coordinates.longitude]}
                        radius={Math.max(18000, project.riskProbability * 800)}
                        pathOptions={{
                          color: projectRisk,
                          fillColor: projectRisk,
                          fillOpacity: 0.09,
                          weight: 1,
                        }}
                      />
                    )}

                    {geometry.polygon && showRoutes && (
                      <Polygon
                        positions={geometry.polygon}
                        pathOptions={{
                          color: projectRisk,
                          fillColor: projectRisk,
                          fillOpacity: 0.18,
                          weight: 2,
                        }}
                        eventHandlers={{
                          click: () => setSelectedProjectId(project.id),
                        }}
                      />
                    )}

                    {geometry.route && showRoutes && (
                      <Polyline
                        positions={geometry.route}
                        pathOptions={{
                          color: projectRisk,
                          weight: 4,
                          opacity: 0.8,
                        }}
                        eventHandlers={{
                          click: () => setSelectedProjectId(project.id),
                        }}
                      />
                    )}

                    {showParcels && parcelData.available && (
                      <React.Fragment>
                        <Polygon
                          positions={parcelData.candidate}
                          pathOptions={{
                            color: '#f59e0b',
                            fillColor: '#f59e0b',
                            fillOpacity: 0.12,
                            weight: 1,
                          }}
                        />
                        <Polygon
                          positions={parcelData.verified}
                          pathOptions={{
                            color: '#16a34a',
                            fillColor: '#16a34a',
                            fillOpacity: 0.14,
                            weight: 1,
                          }}
                        />
                      </React.Fragment>
                    )}

                    {showMarkers && (
                      <CircleMarker
                        center={[project.coordinates.latitude, project.coordinates.longitude]}
                        radius={7}
                        pathOptions={{
                          color: projectRisk,
                          fillColor: projectRisk,
                          fillOpacity: 0.95,
                          weight: 2,
                        }}
                        eventHandlers={{
                          click: () => setSelectedProjectId(project.id),
                        }}
                      >
                        <Popup>
                          <div className="min-w-[180px] text-sm">
                            <div className="font-semibold text-slate-800">{project.name}</div>
                            <div className="mt-1 text-xs text-slate-600">{project.projectId}</div>
                            <div className="mt-2 text-xs">
                              <span className="font-medium text-slate-600">Risk:</span>{' '}
                              <span className="font-semibold" style={{ color: projectRisk }}>
                                {project.riskCategory}
                              </span>
                            </div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    )}
                  </React.Fragment>
                )
              })}
            </MapContainer>
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-50 p-6 text-sm text-slate-600">
              No projects match the selected filters.
            </div>
          )}
        </div>

        {selectedProject && (
          <aside className="border-t border-slate-200 bg-white p-4 xl:border-l xl:border-t-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Selected project
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{selectedProject.name}</h3>
              </div>
              <span
                className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
                style={{
                  color: riskColor(selectedProject.riskCategory),
                  borderColor: `${riskColor(selectedProject.riskCategory)}30`,
                  backgroundColor: `${riskColor(selectedProject.riskCategory)}10`,
                }}
              >
                {selectedProject.riskCategory}
              </span>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Project ID</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedProject.projectId}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Type</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedProject.type}</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5">
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Location</p>
                <p className="mt-1 font-medium text-slate-800">
                  {selectedProject.village}, {selectedProject.district}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Status</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedProject.status}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">AI risk</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedProject.riskProbability}%</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5">
                <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-slate-500">
                  <span>Acquisition progress</span>
                  <span>{getStatusProgress(selectedProject.status)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${getStatusProgress(selectedProject.status)}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Intervention status</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {selectedProject.riskProbability >= 75 ? 'Escalation recommended' : 'Monitoring normal'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={`/projects/${selectedProject.id}`}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          </aside>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-3 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <span className="font-semibold text-slate-800">Legend</span>
          {['Critical', 'High', 'Medium', 'Low'].map((risk) => (
            <div key={risk} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: riskColor(risk) }} />
              <span className="text-xs">{risk}</span>
            </div>
          ))}
        </div>

        <div className="text-xs leading-relaxed text-slate-500">
          {hasAuthorizedParcelData
            ? 'Parcel overlays indicate candidate and verified acquisition coverage where cadastral GIS data is available.'
            : 'Cadastral GIS data unavailable for the current project set; project geometry remains visible for monitoring.'}
        </div>
      </div>
    </Card>
  )
}
