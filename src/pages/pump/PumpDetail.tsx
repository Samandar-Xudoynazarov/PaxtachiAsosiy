import React from 'react'
import { Droplets } from 'lucide-react'
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts'
import type { PumpStation } from '../../types'
import { formatNumber } from '../../utils/helpers'

const InfoRow: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
    <span className="text-sm font-semibold text-slate-700">{value != null && value !== '' ? value : '—'}</span>
  </div>
)

const PumpDetail: React.FC<{ station: PumpStation }> = ({ station }) => {
  const installed = station.installedAggregateCount ?? 0
  const working   = station.workingAggregateCount   ?? 0
  const broken    = Math.max(0, installed - working)
  const workPct   = installed > 0 ? Math.round((working / installed) * 100) : 0

  const pieData = [
    { name: 'Ishlamoqda', value: working, color: '#10b981' },
    { name: "Ishlamayapti", value: broken,  color: '#f87171' },
  ].filter(d => d.value > 0)

  const radialData = [
    { name: 'Ish samaradorligi', value: workPct, fill: workPct >= 70 ? '#10b981' : workPct >= 40 ? '#f59e0b' : '#ef4444' },
  ]

  return (
    <div className="space-y-6 pb-4">

      {/* ── Header ─────────────────────────────── */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
          <Droplets size={26} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-slate-800 text-base leading-tight">{station.stationName}</p>
          <p className="text-xs text-slate-500 mt-0.5">ID: {station.id}</p>
        </div>
        <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
          workPct >= 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        }`}>
          {workPct}% faol
        </span>
      </div>

      {/* ── 3 ta stat karta ─────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-indigo-50 p-3 text-center">
          <p className="text-xs text-indigo-400 font-semibold mb-1">O'rnatilgan</p>
          <p className="font-display font-bold text-2xl text-indigo-700">{formatNumber(installed)}</p>
          <p className="text-xs text-indigo-400 mt-0.5">agregat</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3 text-center">
          <p className="text-xs text-emerald-400 font-semibold mb-1">Ishlayapti</p>
          <p className="font-display font-bold text-2xl text-emerald-700">{formatNumber(working)}</p>
          <p className="text-xs text-emerald-400 mt-0.5">agregat</p>
        </div>
        <div className="rounded-xl bg-red-50 p-3 text-center">
          <p className="text-xs text-red-400 font-semibold mb-1">Ishlamayapti</p>
          <p className="font-display font-bold text-2xl text-red-500">{formatNumber(broken)}</p>
          <p className="text-xs text-red-400 mt-0.5">agregat</p>
        </div>
      </div>

      {/* ── Radial (samaradorlik %) ──────────────── */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ish samaradorligi</p>
        <div className="relative">
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart
              cx="50%" cy="100%"
              innerRadius="60%" outerRadius="100%"
              barSize={18}
              startAngle={180} endAngle={0}
              data={radialData}
            >
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#f1f5f9' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
            <p className="font-display font-bold text-3xl text-slate-800">{workPct}%</p>
            <p className="text-xs text-slate-400">samaradorlik</p>
          </div>
        </div>
      </div>

      {/* ── Pie chart ─────────────────────────────── */}
      {pieData.length >= 2 && (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Agregatlar holati</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={75}
                dataKey="value" paddingAngle={3}
              >
                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v: unknown) => [`${v} ta`, '']} />
              <Legend formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Progress bar: ishlayapti / o'rnatilgan ── */}
      {installed > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Agregatlar holati</p>
          <div className="space-y-3">
            {[
              { label: 'Ishlamoqda', value: working,  max: installed, color: '#10b981' },
              { label: "Ishlamayapti", value: broken,  max: installed, color: '#f87171' },
            ].map(({ label, value, max, color }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-28 shrink-0">{label}</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-xs font-bold tabular-nums w-10 text-right text-slate-700">
                  {value} ta
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Qo'shimcha ma'lumot ──────────────────── */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Qo'shimcha</p>
        <div className="rounded-xl border border-slate-100 px-3 py-1">
          <InfoRow label="Suv manbai"     value={station.waterSource} />
          <InfoRow label="O'rnatilgan"    value={installed ? `${formatNumber(installed)} ta agregat` : null} />
          <InfoRow label="Ishlayapti"     value={working   ? `${formatNumber(working)} ta agregat`   : null} />
        </div>
      </div>

    </div>
  )
}

export default PumpDetail
