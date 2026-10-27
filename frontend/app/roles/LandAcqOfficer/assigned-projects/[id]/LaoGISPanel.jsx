"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Layers3, LocateFixed, MapPin, Minus, Plus } from "lucide-react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((module) => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((module) => module.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((module) => module.Marker), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((module) => module.Polygon), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((module) => module.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((module) => module.Popup), { ssr: false });

const getCoordinates = (value) => {
  if (Array.isArray(value) && value.length >= 2) {
    const latitude = Number(value[0]);
    const longitude = Number(value[1]);
    return Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
      ? [latitude, longitude]
      : null;
  }

  const latitude = Number(value?.latitude ?? value?.lat);
  const longitude = Number(value?.longitude ?? value?.lng ?? value?.lon);
  return Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
    ? [latitude, longitude]
    : null;
};

const getParcelPosition = (parcel) => getCoordinates(parcel.coordinates || parcel.locationCoordinates || parcel.centroid);

const getParcelBoundary = (parcel) => {
  const rawBoundary = parcel.boundary || parcel.coordinates?.boundary || parcel.geometry?.coordinates?.[0];
  if (!Array.isArray(rawBoundary) || rawBoundary.length < 3) return null;

  const positions = rawBoundary.map((coordinate) => {
    if (parcel.geometry?.coordinates?.[0] === rawBoundary) {
      const [longitude, latitude] = coordinate || [];
      return getCoordinates({ latitude, longitude });
    }
    return getCoordinates(coordinate);
  });
  return positions.every(Boolean) ? positions : null;
};

function MapActions({ points, onReady }) {
  const { useMap } = require("react-leaflet");
  const map = useMap();

  useEffect(() => {
    onReady(map);
    map.invalidateSize();
  }, [map, onReady]);

  return null;
}

export default function LaoGISPanel({ project, parcels }) {
  const coordinates = getCoordinates(project.coordinates);
  const [map, setMap] = useState(null);
  const [showParcels, setShowParcels] = useState(true);
  const parcelFeatures = useMemo(() => parcels.map((parcel) => ({
    parcel,
    position: getParcelPosition(parcel),
    boundary: getParcelBoundary(parcel),
  })).filter(({ position, boundary }) => position || boundary), [parcels]);
  const points = useMemo(() => [
    ...(coordinates ? [coordinates] : []),
    ...(showParcels ? parcelFeatures.flatMap(({ position, boundary }) => boundary || (position ? [position] : [])) : []),
  ], [coordinates, parcelFeatures, showParcels]);
  const fitMap = useCallback(() => {
    if (!map || points.length === 0) return;
    if (points.length === 1) map.setView(points[0], 14);
    else map.fitBounds(points, { padding: [32, 32], maxZoom: 14 });
  }, [map, points]);

  useEffect(() => {
    fitMap();
  }, [fitMap]);

  if (!coordinates) return <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center"><div><MapPin className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-2 text-sm font-semibold text-slate-700">GIS coordinates unavailable</p><p className="mt-1 text-xs text-slate-500">Add a valid project latitude and longitude to place this project on the map.</p></div></div>;

  return <div className="relative h-72 overflow-hidden rounded-xl border border-slate-200 sm:h-80">
    <MapContainer center={coordinates} zoom={12} scrollWheelZoom className="h-full w-full" attributionControl>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      <MapActions points={points} onReady={setMap} />
      {showParcels && parcelFeatures.map(({ parcel, position, boundary }, index) => {
        const color = parcel.status === "Verified" ? "#059669" : "#d97706";
        const popup = <Popup><strong>{parcel.khasra || `Parcel ${index + 1}`}</strong><br />{parcel.area} ha · {parcel.landUse}<br />{parcel.owner || "Owner reference pending"}<br />Status: {parcel.status}</Popup>;
        return boundary
          ? <Polygon key={parcel.id || index} positions={boundary} pathOptions={{ color, fillColor: color, fillOpacity: 0.28, weight: 2 }}>{popup}</Polygon>
          : <CircleMarker key={parcel.id || index} center={position} radius={7} pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 2 }}>{popup}</CircleMarker>;
      })}
      <Marker position={coordinates}><Popup><strong>{project.name}</strong><br />{project.projectId}<br />Project reference point</Popup></Marker>
    </MapContainer>
    <div className="absolute right-3 top-3 z-[500] flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
      <button type="button" title="Zoom in" aria-label="Zoom in" onClick={() => map?.zoomIn()} className="flex h-9 w-9 items-center justify-center text-slate-700 hover:bg-slate-100"><Plus className="h-4 w-4" /></button>
      <button type="button" title="Zoom out" aria-label="Zoom out" onClick={() => map?.zoomOut()} className="flex h-9 w-9 items-center justify-center border-t border-slate-200 text-slate-700 hover:bg-slate-100"><Minus className="h-4 w-4" /></button>
      <button type="button" title="Fit project and parcel data" aria-label="Fit project and parcel data" onClick={fitMap} className="flex h-9 w-9 items-center justify-center border-t border-slate-200 text-slate-700 hover:bg-slate-100"><LocateFixed className="h-4 w-4" /></button>
    </div>
    <div className="absolute bottom-3 left-3 z-[500] max-w-[calc(100%-5.5rem)] rounded-lg border border-slate-200 bg-white/95 p-3 text-xs shadow-md backdrop-blur-sm">
      <p className="mb-2 flex items-center gap-2 font-bold text-slate-800"><Layers3 className="h-4 w-4" />Map layers</p>
      <p className="flex items-center gap-2 text-slate-600"><span className="h-3 w-3 shrink-0 rounded-full border-2 border-sky-600 bg-sky-200" />Project reference</p>
      <label className="mt-2 flex cursor-pointer items-center gap-2 text-slate-700"><input type="checkbox" checked={showParcels} onChange={(event) => setShowParcels(event.target.checked)} className="accent-emerald-600" />Parcel locations ({parcelFeatures.length})</label>
      {parcelFeatures.length === 0 && <p className="mt-2 max-w-48 text-[11px] leading-4 text-amber-700">No parcel coordinates recorded. Add parcel GIS coordinates to display them here.</p>}
    </div>
  </div>;
}
