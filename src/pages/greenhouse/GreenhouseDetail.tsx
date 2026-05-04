import React from 'react'
import { Leaf, MapPin, Phone, User, ExternalLink } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts'
import type { GreenhouseRecord } from '../../types'
import { formatNumber } from '../../utils/helpers'

const InfoRow: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
    <span className="text-sm font-semibold text-slate-700 text-right max-w-[60%] break-words">
      {value != null && value !== '' ? value : '—'}
    </span>
  </div>
)

const GreenhouseDetail: React.FC<{ record: GreenhouseRecord }> = ({ record }) => {
  const greenhouse = record.greenhouseArea ?? 0
  const total      = record.totalArea ?? 0
  const other      = Math.max(0, total - greenhouse)

  const areaData = [
    { name: 'Issiqxona', value: greenhouse, color: '#10b981' },
    { name: 'Qolgan yer', value: other,     color: '#6366f1' },
  ].filter(d => d.value > 0)

  const seedData = [
    { name: 'Mavjud ko\'chat', value: record.seedlingCount ?? 0, color: '#10b981' },
    { name: 'Kerakli ko\'chat', value: record.requiredSeedlingCount ?? 0, color: '#f59e0b' },
  ].filter(d => d.value > 0)

  return (
    <div className="space-y-6 pb-4">

      {/* Header */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shrink-0 shadow-md">
          <Leaf size={26} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-slate-800 text-base leading-tight">
            {record.ownerName || '—'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">ID: {record.id}</p>
          {record.cropName && (
            <p className="text-xs text-emerald-600 font-medium mt-0.5">{record.cropName}</p>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-emerald-50 p-3 text-center">
          <p className="text-xs text-emerald-400 font-semibold mb-1">Issiqxona maydoni</p>
          <p className="font-display font-bold text-2xl text-emerald-700">{formatNumber(greenhouse)}</p>
          <p className="text-xs text-emerald-400 mt-0.5">ga</p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-3 text-center">
          <p className="text-xs text-indigo-400 font-semibold mb-1">Umumiy maydon</p>
          <p className="font-display font-bold text-2xl text-indigo-700">{formatNumber(total)}</p>
          <p className="text-xs text-indigo-400 mt-0.5">ga</p>
        </div>
      </div>

      {/* Area bar chart */}
      {areaData.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Maydon taqsimoti (ga)</p>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={areaData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v: unknown) => [`${formatNumber(v as number)} ga`, '']} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={48}>
                {areaData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Seedling bar chart */}
      {seedData.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ko'chat holati</p>
          <div className="space-y-3">
            {seedData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-32 shrink-0">{name}</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(...seedData.map(d => d.value)) > 0
                        ? (value / Math.max(...seedData.map(d => d.value))) * 100
                        : 0}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span className="text-xs font-bold tabular-nums w-12 text-right text-slate-700">
                  {formatNumber(value)} ta
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Owner info */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Egasi haqida</p>
        <div className="rounded-xl border border-slate-100 px-3 py-1">
          <div className="flex items-center gap-2 py-2 border-b border-slate-50">
            <User size={14} className="text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 uppercase tracking-wide w-28">Ism-sharif</span>
            <span className="text-sm font-semibold text-slate-700 ml-auto">{record.ownerName || '—'}</span>
          </div>
          <div className="flex items-center gap-2 py-2 border-b border-slate-50">
            <Phone size={14} className="text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 uppercase tracking-wide w-28">Telefon</span>
            <span className="text-sm font-semibold text-slate-700 ml-auto">{record.phoneNumber || '—'}</span>
          </div>
          <InfoRow label="Pasport seriyasi" value={record.passportSeries} />
          <InfoRow label="JSHSHIR" value={record.jshshir} />
        </div>
      </div>

      {/* Location info */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Joylashuv</p>
        <div className="rounded-xl border border-slate-100 px-3 py-1">
          <InfoRow label="MFY" value={record.mfy} />
          <InfoRow label="Kontur raqami" value={record.contourNumber} />
          {record.locationUrl && (
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Xaritada</span>
              <a
                href={record.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                onClick={e => e.stopPropagation()}
              >
                <MapPin size={12} /> Ko'rish <ExternalLink size={10} />
              </a>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default GreenhouseDetail
