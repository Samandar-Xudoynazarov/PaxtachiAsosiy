import React, { useEffect, useState, Suspense, lazy } from 'react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LineChart, Line, ResponsiveContainer,
} from 'recharts'
import {
  Map, Leaf, Tractor, Droplets, Sprout, Layers,
} from 'lucide-react'
import { dashboardApi, specializationsApi } from '../../services/api'
import { StatCard, ErrorAlert } from '../../components/ui'
import { formatNumber } from '../../utils/helpers'
import type { LandSummary, SpecializationSummary } from '../../types'

const PaxtachiMap = lazy(() => import('../../components/PaxtachiMap'))

const COLORS = ['#16a34a', '#2563eb', '#0891b2', '#7c3aed', '#d97706', '#dc2626']

const mockCropStats = [
  { name: 'Paxta', maydon: 1420, hosildorlik: 32 },
  { name: "G'alla", maydon: 980, hosildorlik: 48 },
  { name: 'Sabzavot', maydon: 560, hosildorlik: 65 },
  { name: 'Meva', maydon: 340, hosildorlik: 28 },
  { name: 'Kartoshka', maydon: 210, hosildorlik: 52 },
]

const mockGrowthData = [
  { month: 'Yan', fermerlar: 120, maydon: 3200 },
  { month: 'Fev', fermerlar: 132, maydon: 3450 },
  { month: 'Mar', fermerlar: 141, maydon: 3800 },
  { month: 'Apr', fermerlar: 155, maydon: 4100 },
  { month: 'May', fermerlar: 168, maydon: 4380 },
  { month: 'Iyn', fermerlar: 172, maydon: 4520 },
]

const fmt = (v?: number | null) => formatNumber(v ?? 0)

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<LandSummary | null>(null)
  const [specSummary, setSpecSummary] = useState<SpecializationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [summaryRes, specRes] = await Promise.allSettled([
        dashboardApi.getLandSummary(),
        specializationsApi.getSummary(),
      ])
      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data)
      if (specRes.status === 'fulfilled') {
        const d = specRes.value.data
        const raw: SpecializationSummary[] = Array.isArray(d)
          ? d
          : Array.isArray(d?.items)
          ? d.items
          : Array.isArray(d?.content)
          ? d.content
          : []
        setSpecSummary(raw)
      }
    } catch {
      setError("Ma'lumotlarni yuklashda xatolik")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const stats = [
    {
      title: 'Umumiy yer maydoni',
      value: summary?.totalArea ?? 0,
      unit: 'ga',
      icon: <Map size={20} />,
      gradient: 'from-primary-500 to-primary-700',
      trend: { value: 0, label: 'jami yer' },
    },
    {
      title: "Sug'oriladigan yer",
      value: summary?.irrigatedArea ?? 0,
      unit: 'ga',
      icon: <Droplets size={20} />,
      gradient: 'from-accent-500 to-accent-700',
      trend: { value: 0, label: "sug'oriladigan" },
    },
    {
      title: "G'o'za maydoni",
      value: summary?.cottonArea ?? 0,
      unit: 'ga',
      icon: <Sprout size={20} />,
      gradient: 'from-amber-500 to-amber-700',
      trend: { value: 0, label: "g'o'za" },
    },
    {
      title: "Bug'doy maydoni",
      value: summary?.wheatArea ?? 0,
      unit: 'ga',
      icon: <Leaf size={20} />,
      gradient: 'from-yellow-500 to-yellow-700',
      trend: { value: 0, label: "bug'doy" },
    },
    {
      title: "Bog' va uzumzor",
      value: (summary?.orchardArea ?? 0) + (summary?.grapeArea ?? 0),
      unit: 'ga',
      icon: <Tractor size={20} />,
      gradient: 'from-rose-500 to-rose-700',
      trend: { value: 0, label: "bog' + uzum" },
    },
    {
      title: 'Lalmi yer',
      value: summary?.lalmiArea ?? 0,
      unit: 'ga',
      icon: <Layers size={20} />,
      gradient: 'from-violet-500 to-violet-700',
      trend: { value: 0, label: 'lalmi' },
    },
  ]

  // Land distribution from real summary data
  const buildLandDist = () => {
    if (!summary) return [
      { name: "Sug'oriladigan", value: 6800, color: '#16a34a' },
      { name: "Lalmi", value: 2100, color: '#f59e0b' },
      { name: 'Boshqa', value: 900, color: '#94a3b8' },
    ]
    const irrigated = summary.irrigatedArea ?? 0
    const lalmi = summary.lalmiArea ?? 0
    const cotton = summary.cottonArea ?? 0
    const wheat = summary.wheatArea ?? 0
    const orchard = (summary.orchardArea ?? 0) + (summary.grapeArea ?? 0)
    const total = summary.totalArea ?? 0
    const other = Math.max(0, total - cotton - wheat - orchard - lalmi - (irrigated - cotton - wheat - orchard < 0 ? 0 : irrigated - cotton - wheat - orchard))
    return [
      { name: "G'o'za", value: cotton, color: '#16a34a' },
      { name: "Bug'doy", value: wheat, color: '#2563eb' },
      { name: "Bog' & uzum", value: orchard, color: '#ec4899' },
      { name: 'Lalmi', value: lalmi, color: '#f59e0b' },
      { name: 'Boshqa', value: other, color: '#94a3b8' },
    ].filter(d => d.value > 0)
  }

  const landDist = buildLandDist()
  const cropStats = summary?.cropStats?.length ? summary.cropStats : mockCropStats
  const growthData = summary?.growthData?.length ? summary.growthData : mockGrowthData
  const specData = specSummary.length
    ? specSummary.slice(0, 5).map((s, i) => ({ name: s.name, value: s.farmersCount, color: COLORS[i % COLORS.length] }))
    : [
        { name: 'Paxtachilik', value: 68, color: COLORS[0] },
        { name: "G'allachilik", value: 45, color: COLORS[1] },
        { name: 'Sabzavotchilik', value: 32, color: COLORS[2] },
        { name: 'Mevazorlik', value: 18, color: COLORS[3] },
        { name: 'Boshqa', value: 9, color: COLORS[4] },
      ]

  if (error) return <ErrorAlert message={error} onRetry={fetchData} />

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} loading={loading} />
        ))}
      </div>

      {/* Area breakdown summary */}
      {!loading && summary && (
        <div className="card">
          <h3 className="font-display font-bold text-slate-700 mb-3">Yer turlari bo'yicha taqsimot</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { label: 'Issiqxona', val: summary.orchardArea, color: '#ec4899' },
              { label: 'Meliorasiya', val: summary.meliorationArea, color: '#06b6d4' },
              { label: 'Kanal', val: summary.canalArea, color: '#3b82f6' },
              { label: 'Yaylov', val: summary.pastureArea, color: '#84cc16' },
              { label: 'Hovuz', val: summary.pondArea, color: '#0891b2' },
              { label: 'Terak', val: summary.poplarArea, color: '#7c3aed' },
              { label: 'Boshqa', val: summary.otherArea, color: '#94a3b8' },
            ].map(({ label, val, color }) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ backgroundColor: `${color}18` }}>
                <p className="text-xs font-semibold mb-1 leading-tight" style={{ color }}>{label}</p>
                <p className="font-bold text-base" style={{ color }}>{fmt(val)}</p>
                <p className="text-xs mt-0.5" style={{ color, opacity: 0.7 }}>ga</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart - land dist */}
        <div className="card">
          <h3 className="font-display font-bold text-slate-700 mb-5">Yer taqsimoti</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={landDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {landDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color || COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${fmt(v)} ga`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {landDist.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color || COLORS[i] }} />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{fmt(item.value)} ga</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donut - specializations */}
        <div className="card">
          <h3 className="font-display font-bold text-slate-700 mb-5">Ixtisosliklar bo'yicha fermerlar</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={specData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {specData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {specData.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{item.value} ta</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Map size={18} className="text-primary-600" />
          <h3 className="font-display font-bold text-slate-700">Paxtachi tumani xaritasi</h3>
        </div>
        <div style={{ height: 420 }}>
          <Suspense fallback={
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Xarita yuklanmoqda…
            </div>
          }>
            <PaxtachiMap />
          </Suspense>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="card">
          <h3 className="font-display font-bold text-slate-700 mb-5">Ekin turlari bo'yicha statistika</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cropStats} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="maydon" name="Maydon (ga)" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hosildorlik" name="Hosildorlik (s/ga)" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart */}
        <div className="card">
          <h3 className="font-display font-bold text-slate-700 mb-5">Fermerlar o'sish dinamikasi</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={growthData} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="fermerlar" name="Fermerlar" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="maydon" name="Maydon (ga)" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
