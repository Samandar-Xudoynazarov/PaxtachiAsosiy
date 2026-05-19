import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import paxtachiGeoJSON from '../data/paxtachi.geojson.ts'

const LAYERS = {
  osm: {
    label: 'Xarita',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    label: 'Sputnik',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
  topo: {
    label: 'Relyef',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>',
  },
} as const

type LayerKey = keyof typeof LAYERS

const PaxtachiMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const tileRef = useRef<L.TileLayer | null>(null)
  const [activeLayer, setActiveLayer] = useState<LayerKey>('osm')

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [39.97, 65.48],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: false,
    })

    const tile = L.tileLayer(LAYERS.osm.url, { attribution: LAYERS.osm.attribution }).addTo(map)
    tileRef.current = tile

    const layer = L.geoJSON(paxtachiGeoJSON as any, {
      style: {
        color: '#2563eb',
        weight: 2.5,
        opacity: 1,
        fillColor: '#3b82f6',
        fillOpacity: 0.08,
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

    // Inverted mask: dims everything outside the district polygon
    const geo = paxtachiGeoJSON as any
    const coords: number[][][][] = geo.geometry?.coordinates ?? geo.coordinates ?? []
    if (coords.length > 0) {
      const toLatlng = (ring: number[][]): L.LatLngExpression[] =>
        ring.map(([lng, lat]) => [lat, lng] as L.LatLngExpression)

      const worldRing: L.LatLngExpression[] = [[-90, -180], [-90, 180], [90, 180], [90, -180]]
      const holes = coords.map(polygon => toLatlng(polygon[0]))

      L.polygon([worldRing, ...holes], {
        fillColor: '#0f172a',
        fillOpacity: 0.5,
        stroke: false,
        interactive: false,
      }).addTo(map)
    }

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      tileRef.current = null
    }
  }, [])

  const switchLayer = (key: LayerKey) => {
    const map = mapRef.current
    if (!map || key === activeLayer) return
    if (tileRef.current) {
      map.removeLayer(tileRef.current)
    }
    const cfg = LAYERS[key]
    tileRef.current = L.tileLayer(cfg.url, { attribution: cfg.attribution }).addTo(map)
    tileRef.current.bringToBack()
    setActiveLayer(key)
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />

      {/* Layer switcher */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        background: 'white',
        borderRadius: 10,
        padding: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        border: '1px solid #e2e8f0',
      }}>
        {(Object.keys(LAYERS) as LayerKey[]).map(key => (
          <button
            key={key}
            onClick={() => switchLayer(key)}
            style={{
              padding: '5px 12px',
              borderRadius: 7,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              background: activeLayer === key ? '#2563eb' : 'transparent',
              color: activeLayer === key ? '#fff' : '#475569',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {LAYERS[key].label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PaxtachiMap
