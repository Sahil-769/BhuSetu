"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Circle, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowRight, ExternalLink, Layers3, LocateFixed, MapPinned, ZoomIn, ZoomOut } from "lucide-react";

import {
  PROJECTS,
  createClusterIcon,
  createMarkerIcon,
  getAcquisitionProgress,
  getClusteredProjects,
  getInterventionStatus,
  getProjectGeometry,
  getRiskTrend,
  hasValidProjectCoordinates,
  isLinearProject,
  riskColors,
  riskTone,
} from "../../risk-map/page";

function MapBoundsController({ projects, mapRef }) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;

    if (!projects.length) return;

    const points = projects.flatMap((project) => {
      const geometry = getProjectGeometry(project);
      if (!geometry) return [];
      if (geometry.route) return [...geometry.route, geometry.point];
      if (geometry.polygon) return [...geometry.polygon, geometry.point];
      return [geometry.point];
    });

    if (points.length) {
      map.fitBounds(points, { padding: [28, 28], maxZoom: 6 });
    }
  }, [map, mapRef, projects]);

  return null;
}

const gis = () => {
  const mapRef = useRef(null);
  const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0]?.id ?? null);
  const [visibleLayers, setVisibleLayers] = useState({
    markers: true,
    routes: true,
    parcels: true,
    riskZones: true,
  });

  const scopedProjects = useMemo(
    () => PROJECTS.filter((project) => hasValidProjectCoordinates(project)),
    []
  );

  const clusterGroups = useMemo(() => getClusteredProjects(scopedProjects), [scopedProjects]);

  const selectedProject = useMemo(
    () => scopedProjects.find((project) => project.id === selectedProjectId) ?? scopedProjects[0] ?? null,
    [scopedProjects, selectedProjectId]
  );

  useEffect(() => {
    if (!scopedProjects.length) return;
    if (!selectedProjectId || !scopedProjects.some((project) => project.id === selectedProjectId)) {
      setSelectedProjectId(scopedProjects[0].id);
    }
  }, [scopedProjects, selectedProjectId]);

  const resetMapView = () => {
    if (!mapRef.current || !scopedProjects.length) return;

    const points = scopedProjects.flatMap((project) => {
      const geometry = getProjectGeometry(project);
      if (!geometry) return [];
      if (geometry.route) return [...geometry.route, geometry.point];
      if (geometry.polygon) return [...geometry.polygon, geometry.point];
      return [geometry.point];
    });

    if (points.length) {
      mapRef.current.fitBounds(points, { padding: [24, 24], maxZoom: 6 });
    }
  };

  const handleMapZoom = (direction) => {
    if (!mapRef.current) return;
    if (direction === "in") mapRef.current.zoomIn();
    else mapRef.current.zoomOut();
  };

  const toggleLayer = (layerId) => {
    setVisibleLayers((current) => ({ ...current, [layerId]: !current[layerId] }));
  };

  if (!scopedProjects.length) {
    return (
      <section className="dashboard-card">
        <div className="panel-header">
          <div>
            <p className="section-kicker">Spatial view</p>
            <h2>Mini GIS Risk Map</h2>
          </div>
          <span className="section-badge">No data</span>
        </div>
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          No valid project geometry available for the current role.
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-card">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Spatial view</p>
          <h2>Mini GIS Risk Map</h2>
        </div>
        <Link
          href="/roles/nodal-officer/risk-map"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-100"
        >
          Open Risk Map
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-2">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            <MapPinned className="h-3.5 w-3.5" />
            Live GIS
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => handleMapZoom("out")} className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100" aria-label="Zoom out">
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={() => handleMapZoom("in")} className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100" aria-label="Zoom in">
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={resetMapView} className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100" aria-label="Reset map view">
              <LocateFixed className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="relative h-[280px] w-full">
          <MapContainer
            center={[23.0, 78.0]}
            zoom={5}
            scrollWheelZoom
            className="h-full w-full"
            attributionControl={false}
            style={{ zIndex: 1 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapBoundsController projects={scopedProjects} mapRef={mapRef} />

            {scopedProjects.map((project) => {
              const geometry = getProjectGeometry(project);
              if (!geometry) return null;

              const projectRiskColor = riskColors[project.riskCategory] || riskColors["N/A"];

              return (
                <div key={project.id}>
                  {visibleLayers.riskZones && (
                    <Circle
                      center={geometry.point}
                      radius={Math.max(12000, (project.riskProbability ?? 30) * 650)}
                      pathOptions={{
                        color: projectRiskColor,
                        fillColor: projectRiskColor,
                        fillOpacity: 0.1,
                        weight: 1,
                      }}
                    />
                  )}

                  {visibleLayers.routes && isLinearProject(project.type) && geometry.route && (
                    <>
                      <Polyline
                        positions={geometry.route}
                        pathOptions={{ color: projectRiskColor, weight: 3, opacity: 0.85 }}
                        eventHandlers={{ click: () => setSelectedProjectId(project.id) }}
                      />
                      <Circle
                        center={geometry.bufferCenter}
                        radius={geometry.bufferRadius}
                        pathOptions={{
                          color: projectRiskColor,
                          fillColor: projectRiskColor,
                          fillOpacity: 0.05,
                          weight: 1,
                        }}
                      />
                    </>
                  )}

                  {visibleLayers.routes && !isLinearProject(project.type) && geometry.polygon && (
                    <Polygon
                      positions={geometry.polygon}
                      pathOptions={{
                        color: projectRiskColor,
                        fillColor: projectRiskColor,
                        fillOpacity: 0.15,
                        weight: 2,
                      }}
                      eventHandlers={{ click: () => setSelectedProjectId(project.id) }}
                    />
                  )}

                  {visibleLayers.parcels && Array.isArray(project.cadastralParcels) && project.cadastralParcels.length > 0 && (
                    <>
                      {project.cadastralParcels
                        .filter((parcel) => Array.isArray(parcel?.candidate) && parcel.candidate.length > 0)
                        .map((parcel, index) => (
                          <Polygon
                            key={`${project.id}-candidate-${index}`}
                            positions={parcel.candidate}
                            pathOptions={{ color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.1, weight: 1 }}
                          />
                        ))}
                      {project.cadastralParcels
                        .filter((parcel) => Array.isArray(parcel?.verified) && parcel.verified.length > 0)
                        .map((parcel, index) => (
                          <Polygon
                            key={`${project.id}-verified-${index}`}
                            positions={parcel.verified}
                            pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 0.08, weight: 1 }}
                          />
                        ))}
                    </>
                  )}

                  {visibleLayers.markers && (
                    <Marker
                      position={geometry.point}
                      icon={createMarkerIcon(project, selectedProject?.id === project.id)}
                      eventHandlers={{ click: () => setSelectedProjectId(project.id) }}
                    >
                      <Popup>
                        <div className="min-w-[180px] text-xs text-slate-700">
                          <div className="font-semibold text-slate-800">{project.name}</div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">{project.projectId}</div>
                          <div className="mt-2">
                            <span className="font-medium text-slate-500">Risk:</span>{" "}
                            <span className="font-semibold" style={{ color: projectRiskColor }}>
                              {project.riskCategory}
                            </span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </div>
              );
            })}

            {clusterGroups
              .filter((cluster) => cluster.projects.length > 1)
              .map((cluster) => {
                const selected = cluster.projects.some((project) => project.id === selectedProjectId);
                return (
                  <Marker
                    key={`cluster-${cluster.projects.map((project) => project.id).join("-")}`}
                    position={cluster.center}
                    icon={createClusterIcon(cluster.projects.length, selected)}
                    eventHandlers={{ click: () => setSelectedProjectId(cluster.projects[0].id) }}
                  >
                    <Popup>
                      <div className="min-w-[170px] text-xs text-slate-700">
                        <div className="font-semibold text-slate-800">{cluster.projects.length} projects</div>
                        <div className="mt-2 space-y-1">
                          {cluster.projects.slice(0, 3).map((project) => (
                            <div key={project.id} className="text-[10px] text-slate-600">
                              {project.projectId} • {project.riskCategory}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>
        </div>
      </div>

      {/* <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries({ markers: "Project markers", routes: "Routes / buffers", parcels: "Cadastral parcels", riskZones: "Risk zones" }).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => toggleLayer(key)}
            className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              visibleLayers[key]
                ? "border-slate-200 bg-slate-50 text-slate-700"
                : "border-slate-200 bg-white text-slate-400"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${visibleLayers[key] ? "bg-emerald-500" : "bg-slate-300"}`} />
            {label}
          </button>
        ))}
      </div> */}

      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(riskColors).map(([label, color]) => (
          <span key={label} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      {/* {selectedProject && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900">{selectedProject.name}</h3>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${riskTone[selectedProject.riskCategory] || riskTone["N/A"]}`}>
                  {selectedProject.riskCategory}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{selectedProject.projectId} • {selectedProject.district}</p>
            </div>
            <Link
              href={`/roles/nodal-officer/projects/${selectedProject.id}`}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-slate-800"
            >
              View Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Project Type</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{selectedProject.type}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Acquisition Progress</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{getAcquisitionProgress(selectedProject)}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Current Status</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{selectedProject.status}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">AI Delay Risk %</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{selectedProject.riskProbability}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Risk Category</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{selectedProject.riskCategory}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Risk Trend</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{getRiskTrend(selectedProject)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-2.5 sm:col-span-2 xl:col-span-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Last Updated</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{selectedProject.updatedAt}</p>
            </div>
          </div>
        </div>
      )} */}

      {/* <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
        <div className="flex items-center gap-2">
          <Layers3 className="h-3.5 w-3.5" />
          {selectedProject ? "Mapped project selected" : "No project selected"}
        </div>
        <span>{getInterventionStatus(selectedProject || PROJECTS[0]) === "Yes" ? "Intervention required" : "Monitoring"}</span>
      </div> */}
    </section>
  );
};

export default gis;