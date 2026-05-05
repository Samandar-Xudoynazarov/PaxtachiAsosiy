import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import paxtachiGeoJSON from '../data/paxtachi.geojson.ts'

const PaxtachiMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [39.97, 65.48],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    const layer = L.geoJSON(paxtachiGeoJSON as any, {
      style: {
        color: '#2563eb',
        weight: 2,
        opacity: 0.9,
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
      },
      onEachFeature: (_, leafletLayer) => {
        leafletLayer.bindTooltip('Paxtachi tumani', {
          permanent: false,
          direction: 'center',
          className: 'leaflet-tooltip-custom',
        })
      },
    }).addTo(map)

    const bounds = layer.getBounds()
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] })
    }

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
}

export default PaxtachiMap
