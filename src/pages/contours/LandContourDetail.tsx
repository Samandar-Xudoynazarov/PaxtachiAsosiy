import React from 'react'
import { Map } from 'lucide-react'
import type { LandContour } from '../../types'
import { formatNumber } from '../../utils/helpers'

type AreaField = { key: keyof LandContour; label: string; color: string }

const AREA_FIELDS: AreaField[] = [
  { key: 'totalArea',                   label: 'Umumiy maydon',              color: '#6366f1' },
  { key: 'irrigatedAgricultureArea',    label: "Sug'oril. qishloq xo'jaligi", color: '#10b981' },
  { key: 'irrigatedTomorqaArea',        label: "Sug'oril. tomorqa",           color: '#34d399' },
  { key: 'orchardArea',                 label: "Bog'",                        color: '#ec4899' },
  { key: 'vineyardArea',                label: 'Uzumzor',                     color: '#a855f7' },
  { key: 'mulberryArea',                label: 'Tutzor',                      color: '#f97316' },
  { key: 'nurseryArea',                 label: 'Ko\'chatxona',                color: '#22c55e' },
  { key: 'meliorationArea',             label: 'Meliorasiya',                 color: '#06b6d4' },
  { key: 'grayLandAgricultureArea',     label: 'Lalmi qishloq xo\'jaligi',   color: '#84cc16' },
  { key: 'grayLandPastureArea',         label: 'Lalmi yaylov',               color: '#a3e635' },
  { key: 'commonYardArea',              label: 'Umumiy hovli',               color: '#fbbf24' },
  { key: 'agricultureTotalArea',        label: "Qishloq xo'j. jami",         color: '#3b82f6' },
  { key: 'agricultureArableArea',       label: "Haydaladigan yer",           color: '#60a5fa' },
  { key: 'agricultureIrrigatedArea',    label: "Sug'oriladigan ekin",        color: '#93c5fd' },
  { key: 'tomorqaTotalArea',            label: 'Tomorqa jami',               color: '#f59e0b' },
  { key: 'tomorqaInsideSettlementArea', label: 'Aholi punkti tomorqasi',     color: '#fcd34d' },
  { key: 'treePlantationArea',          label: 'Daraxt eko\'ish',            color: '#16a34a' },
  { key: 'pastureArea',                 label: 'Yaylov',                     color: '#15803d' },
  { key: 'lakeFishArea',                label: 'Ko\'l va baliqchilik',        color: '#0284c7' },
  { key: 'publicBuildingsArea',         label: 'Jamoat binolari',            color: '#64748b' },
  { key: 'streetsArea',                 label: 'Ko\'cha va yo\'llar',         color: '#94a3b8' },
  { key: 'cemeteryArea',                label: 'Qabristон',                  color: '#475569' },
  { key: 'constructionArea',            label: 'Qurilish',                   color: '#f87171' },
  { key: 'forestArea',                  label: 'O\'rmon',                    color: '#4ade80' },
  { key: 'canalsArea',                  label: 'Kanallar',                   color: '#38bdf8' },
  { key: 'roadsArea',                   label: 'Avtomobil yo\'llari',        color: '#a78bfa' },
  { key: 'otherLandsArea',              label: 'Boshqa yerlar',              color: '#cbd5e1' },
  { key: 'buildingUnderArea',           label: 'Bino ostidagi yer',          color: '#fb923c' },
  { key: 'agriculturalServiceArea',     label: 'Qishloq xo\'j. xizmati',    color: '#e879f9' },
  { key: 'cottonReceptionArea',         label: 'Paxta qabul punkti',         color: '#facc15' },
  { key: 'abandonedFarmBuildingArea',   label: 'Tashlandiq farm binolari',   color: '#9ca3af' },
  { key: 'auxiliaryFarmArea',           label: 'Yordamchi xo\'jalik',        color: '#d1d5db' },
]

const LandContourDetail: React.FC<{ record: LandContour }> = ({ record }) => {
  const get = (key: keyof LandContour) => (record[key] as number | null) ?? 0

  const nonZeroFields = AREA_FIELDS.filter(f => get(f.key) > 0)
  const maxVal = Math.max(...AREA_FIELDS.map(f => get(f.key)), 1)

  return (
    <div className="space-y-6 pb-4">

      {/* Header */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shrink-0 shadow-md">
          <Map size={26} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-slate-800 text-base">
            Kontur № {record.contourNumber || record.id}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">ID: {record.id}</p>
        </div>
        <div className="rounded-xl bg-teal-100 px-3 py-2 text-center shrink-0">
          <p className="font-display font-bold text-xl text-teal-700">{formatNumber(get('totalArea'))}</p>
          <p className="text-xs text-teal-500">ga</p>
        </div>
      </div>

      {/* Summary stat cards — top 4 largest non-zero areas */}
      {nonZeroFields.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {nonZeroFields.slice(0, 4).map(({ key, label, color }) => (
            <div key={key} className="rounded-xl p-3 text-center" style={{ backgroundColor: `${color}18` }}>
              <p className="text-xs font-semibold mb-1 truncate" style={{ color }}>{label}</p>
              <p className="font-display font-bold text-xl" style={{ color }}>{formatNumber(get(key))}</p>
              <p className="text-xs mt-0.5" style={{ color, opacity: 0.7 }}>ga</p>
            </div>
          ))}
        </div>
      )}

      {/* All fields as progress bars */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Barcha maydonlar (ga)
        </p>
        <div className="space-y-2">
          {AREA_FIELDS.map(({ key, label, color }) => {
            const val = get(key)
            const pct = maxVal > 0 ? (val / maxVal) * 100 : 0
            return (
              <div key={key} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 w-44 shrink-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs text-slate-500 truncate">{label}</span>
                </div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(pct, val > 0 ? 2 : 0)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span
                  className="text-xs font-bold tabular-nums w-12 text-right"
                  style={{ color: val > 0 ? '#1e293b' : '#cbd5e1' }}
                >
                  {formatNumber(val)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default LandContourDetail
