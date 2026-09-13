"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { Layers3, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((module) => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((module) => module.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((module) => module.Marker), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((module) => module.Polygon), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((module) => module.Popup), { ssr: false });

const getCoordinates = (project) => {
  const latitude = Number(project.coordinates?.latitude);
  const longitude = Number(project.coordinates?.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude) ? [latitude, longitude] : null;
};

const getProjectBoundary = ([latitude, longitude]) => {
  const spread = 0.055;
  return [
    [latitude + spread, longitude - spread * 1.25],
    [latitude + spread * 0.8, longitude + spread * 1.3],
    [latitude - spread * 0.85, longitude + spread],
    [latitude - spread, longitude - spread * 1.1],
  ];
};

const getParcelShape = ([latitude, longitude], index, total) => {
  const step = total > 4 ? 0.012 : 0.016;
  const columns = Math.min(3, total);
  const row = Math.floor(index / columns);
  const column = index % columns;
  const centerLatitude = latitude + (row - (Math.ceil(total / columns) - 1) / 2) * step * 2.4;
  const centerLongitude = longitude + (column - (columns - 1) / 2) * step * 2.2;
  const height = step * 0.9;
  const width = step * 1.05;
  return [[centerLatitude + height, centerLongitude - width], [centerLatitude + height, centerLongitude + width], [centerLatitude - height, centerLongitude + width], [centerLatitude - height, centerLongitude - width]];
};

function FitProject({ points }) {
  const { useMap } = require("react-leaflet");
  const map = useMap();

  useEffect(() => {
    if (points.length > 1) map.fitBounds(points, { padding: [24, 24], maxZoom: 14 });
    if (points.length === 1) map.setView(points[0], 12);
  }, [map, points]);

  return null;
}

export default function LaoGISPanel({ project, parcels }) {
  const coordinates = getCoordinates(project);
  const boundary = coordinates ? getProjectBoundary(coordinates) : [];
  const parcelShapes = useMemo(() => coordinates ? parcels.map((parcel, index) => ({ parcel, shape: getParcelShape(coordinates, index, parcels.length) })) : [], [coordinates, parcels]);
  const points = useMemo(() => coordinates ? [coordinates, ...boundary, ...parcelShapes.flatMap((item) => item.shape)] : [], [coordinates, boundary, parcelShapes]);

  if (!coordinates) {
    return <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center"><div><MapPin className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-2 text-sm font-semibold text-slate-700">GIS coordinates unavailable</p><p className="mt-1 text-xs text-slate-500">This project cannot be placed on the map until a valid latitude and longitude are recorded.</p></div></div>;
  }

  return <div className="relative h-72 overflow-hidden rounded-xl border border-slate-200 sm:h-80">
    <MapContainer center={coordinates} zoom={12} scrollWheelZoom className="h-full w-full" attributionControl>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      <FitProject points={points} />
      <Polygon positions={boundary} pathOptions={{ color: "#0284c7", fillColor: "#38bdf8", fillOpacity: 0.1, weight: 2, dashArray: "8 6" }}>
        <Popup><strong>Project requirement area</strong><br />{project.requiredLandArea} {project.landUnit} required</Popup>
      </Polygon>
      {parcelShapes.map(({ parcel, shape }, index) => <Polygon key={parcel.id || index} positions={shape} pathOptions={{ color: parcel.status === "Verified" ? "#059669" : "#d97706", fillColor: parcel.status === "Verified" ? "#34d399" : "#fbbf24", fillOpacity: 0.42, weight: 1.5 }}><Popup><strong>{parcel.khasra || `Candidate parcel ${index + 1}`}</strong><br />{parcel.area} ha · {parcel.landUse}<br />{parcel.owner || "Owner reference pending"}<br />Status: {parcel.status}</Popup></Polygon>)}
      <Marker position={coordinates}><Popup><strong>{project.name}</strong><br />{project.projectId}<br />Project reference point</Popup></Marker>
    </MapContainer>
    <div className="absolute bottom-3 left-3 z-[500] rounded-xl border border-slate-200 bg-white/95 p-3 text-xs shadow-lg backdrop-blur-sm"><p className="mb-2 flex items-center gap-2 font-bold text-slate-800"><Layers3 className="h-4 w-4" />GIS layers</p><p className="flex items-center gap-2 text-slate-600"><span className="h-3 w-3 rounded-sm border-2 border-sky-600 bg-sky-200/50" />Required project area</p><p className="mt-1 flex items-center gap-2 text-slate-600"><span className="h-3 w-3 rounded-sm border border-amber-600 bg-amber-300/70" />Pending parcel</p><p className="mt-1 flex items-center gap-2 text-slate-600"><span className="h-3 w-3 rounded-sm border border-emerald-600 bg-emerald-300/70" />Verified parcel</p></div>
  </div>;
}
