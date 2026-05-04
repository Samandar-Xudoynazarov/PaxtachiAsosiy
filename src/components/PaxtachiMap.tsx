import React, { useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import type { GeoJsonObject } from 'geojson'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import paxtachiGeoJSON from '../data/paxtachi.geojson'

// Fix default marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const FitBounds: React.FC = () => {
  const map = useMap()
  useEffect(() => {
    const layer = L.geoJSON(paxtachiGeoJSON as GeoJsonObject)
    const bounds = layer.getBounds()
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] })
  }, [map])
  return null
}

const polygonStyle = {
  color: '#2563eb',
  weight: 2,
  opacity: 0.9,
  fillColor: '#3b82f6',
  fillOpacity: 0.15,
}

const PaxtachiMap: React.FC = () => {
  const center: [number, number] = [39.97, 65.48]

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
      zoomControl={true}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <GeoJSON
        data={paxtachiGeoJSON as GeoJsonObject}
        style={polygonStyle}
        onEachFeature={(_, layer) => {
          layer.bindTooltip('Paxtachi tumani', {
            permanent: false,
            direction: 'center',
            className: 'leaflet-tooltip-custom',
          })
        }}
      />
      <FitBounds />
    </MapContainer>
  )
}

export default PaxtachiMap
