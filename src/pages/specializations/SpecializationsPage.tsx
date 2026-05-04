import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { specializationsApi } from '../../services/api'
import { Table, PageHeader, ErrorAlert } from '../../components/ui'
import type { SpecializationSummary, Column } from '../../types'
import { formatNumber } from '../../utils/helpers'

const COLORS = ['#16a34a', '#2563eb', '#0891b2', '#7c3aed', '#d97706', '#dc2626', '#f43f5e', '#06b6d4', '#84cc16', '#f59e0b', '#a855f7']

const SpecializationsPage: React.FC = () => {
  const [data, setData] = useState<SpecializationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await specializationsApi.getSummary()
      const d = res.data
      const raw: SpecializationSummary[] = Array.isArray(d)
        ? d
        : Array.isArray(d?.items)
        ? d.items
        : Array.isArray(d?.content)
        ? d.content
        : []

      const totalFarmers = raw.reduce((s, r) => s + (r.farmersCount ?? 0), 0)
      const withPct = raw.map(r => ({
        ...r,
        percentage: totalFarmers > 0 ? Math.round((r.farmersCount / totalFarmers) * 100) : 0,
      }))
      setData(withPct)
    } catch {
      setError("Ma'lumotlarni yuklashda xatolik")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const chartData = data.map((d, i) => ({
    name: d.name,
    value: d.farmersCount,
    color: COLORS[i % COLORS.length],
  }))

  const columns: Column<SpecializationSummary>[] = [
    { key: 'id',           title: 'Kod',            render: (v) => <span className="text-xs font-mono text-slate-400">{String(v)}</span> },
    { key: 'name',         title: 'Ixtisoslik nomi' },
    { key: 'farmersCount', title: 'Fermerlar',       render: (v) => `${formatNumber(v as number)} ta` },
    { key: 'totalLandHa',  title: 'Maydon (ga)',     render: (v) => formatNumber(v as number) },
    {
      key: 'percentage',
      title: 'Ulushi',
      render: (v: unknown) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-24">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 rounded-full"
              style={{ width: `${v ?? 0}%` }}
            />
          </div>
          <span className="text-xs font-semibold">{String(v ?? 0)}%</span>
        </div>
      ),
    },
  ]

  if (error) return <ErrorAlert message={error} onRetry={fetchData} />

  return (
    <div className="animate-fade-in">
      <PageHeader title="Ixtisosliklar" subtitle="Qishloq xo'jaligi ixtisosliklar statistikasi" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-display font-bold text-slate-700 mb-4">Ixtisosliklar taqsimoti</h3>
          {loading ? (
            <div className="skeleton h-[280px] w-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100}
                  paddingAngle={3} dataKey="value"
                >
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: unknown) => [`${formatNumber(v as number)} ta fermer`, '']} />
                <Legend formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3 className="font-display font-bold text-slate-700 mb-4">Tafsilotlar</h3>
          <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-12 w-full rounded-xl" />
            ))}
            {!loading && data.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{formatNumber(item.farmersCount)} ta</p>
                  <p className="text-xs text-slate-400">{formatNumber(item.totalLandHa)} ga</p>
                </div>
              </div>
            ))}
            {!loading && !data.length && (
              <p className="text-slate-400 text-sm text-center py-8">Ma'lumot yo'q</p>
            )}
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <Table<SpecializationSummary>
          columns={columns}
          data={data}
          loading={loading}
          emptyText="Ixtisosliklar topilmadi"
        />
      </div>
    </div>
  )
}

export default SpecializationsPage
