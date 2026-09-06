import React from 'react'
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Card from '../../../component/common/Card'

const riskColor = (r) => {
  switch (r) {
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

const sampleMarkers = [
  { id: 1, name: 'Proj A', coord: [12.9716, 77.5946], risk: 'High' },
  { id: 2, name: 'Proj B', coord: [13.0827, 80.2707], risk: 'Medium' },
  { id: 3, name: 'Proj C', coord: [15.3173, 75.7139], risk: 'Low' },
]

export default function GisClient({ markers = sampleMarkers }) {
  return (
    <Card className="w-full max-w-full overflow-hidden p-0">
      <div className="h-64 w-full min-w-0 md:h-80">
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={6}
          scrollWheelZoom={true}
          className="h-full w-full min-w-0"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {markers.map((m) => (
            <CircleMarker
              key={m.id}
              center={m.coord}
              radius={8}
              pathOptions={{
                color: riskColor(m.risk),
                fillColor: riskColor(m.risk),
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-slate-600">Risk: {m.risk}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="flex min-w-0 flex-col gap-3 border-t border-slate-100 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-3 text-sm text-slate-700">
          <span className="font-semibold">Legend</span>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: '#ef4444' }} />
            <span className="text-xs">High</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: '#f59e0b' }} />
            <span className="text-xs">Medium</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: '#10b981' }} />
            <span className="text-xs">Low</span>
          </div>
        </div>

        <div className="min-w-0 text-xs leading-relaxed text-slate-500 sm:max-w-[16rem]">
          <span className="wrap-break-word">
            Markers indicate risk level near project location
          </span>
        </div>
      </div>
    </Card>
  )
}
