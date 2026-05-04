import React, { useState, useEffect, useMemo } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { farmersApi } from '../../services/api'
import { Table, Pagination, PageHeader, ErrorAlert, Drawer } from '../../components/ui'
import type { Farmer, Column } from '../../types'
import { formatNumber } from '../../utils/helpers'
import FarmerDetail from '../farmers/FarmerDetail'

const PAGE_SIZE = 15

const HUDUDLAR = [
  'Обод Дехконобод',
  'Октепа истиклол машъали',
  'Ш,Қаҳҳоров шогирдлари',
  'Навруз-Пулатчи',
  'Р,Махманов Курбонович',
  'Янги Диёр ЖУТ',
  'Султонобод Пахтакор',
  'Нодим Зиёвуддин',
  'Ш,Назаров шогирдлари',
  'Бархаёт К,Ражабов',
  'А,Аллаёров олтин даласи',
  'Тош Кенжа таъмирчи',
  'Зиёвуддин-Санакул',
]

const isJami = (f: Farmer) =>
  f.name?.toLowerCase().includes('жами') ||
  f.name?.toLowerCase().includes('jami')

const fmt = (v: number | null | undefined) => formatNumber(v ?? 0)

const SumCard: React.FC<{ label: string; value?: number | null; color: string }> = ({ label, value, color }) => (
  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: `${color}18` }}>
    <p className="text-xs font-semibold mb-1 leading-tight" style={{ color }}>{label}</p>
    <p className="font-display font-bold text-lg" style={{ color }}>{fmt(value)}</p>
    <p className="text-xs mt-0.5" style={{ color, opacity: 0.7 }}>ga</p>
  </div>
)

const LandBalancePage: React.FC = () => {
  const [allRows, setAllRows]       = useState<Farmer[]>([])
  const [jamiRow, setJamiRow]       = useState<Farmer | null>(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [hudud, setHudud]           = useState('')
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(0)
  // server-side pagination (no-hudud mode)
  const [serverTotal, setServerTotal]     = useState(0)
  const [serverTotalPages, setServerTotalPages] = useState(1)
  const [detailRow, setDetailRow]   = useState<Farmer | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setJamiRow(null)
    setSearch('')

    const promise = hudud
      ? farmersApi.getHududSection({ name: hudud })
      : farmersApi.getAll({ page, size: PAGE_SIZE })

    promise
      .then(res => {
        if (cancelled) return
        const d = res.data
        let rows: Farmer[] = []

        if (Array.isArray(d)) {
          rows = d
          setServerTotal(d.length)
          setServerTotalPages(1)
        } else if (d?.content) {
          rows = d.content
          setServerTotal(d.totalElements ?? d.content.length)
          setServerTotalPages(d.totalPages ?? 1)
        }

        const jami = rows.find(isJami) ?? null
        setJamiRow(jami)
        setAllRows(rows.filter(r => !isJami(r)))
      })
      .catch(() => { if (!cancelled) setError("Ma'lumotlarni yuklashda xatolik yuz berdi") })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [hudud, page])

  // Client-side search + pagination (hudud mode only)
  const filtered = useMemo(() => {
    if (!hudud || !search.trim()) return allRows
    const q = search.toLowerCase()
    return allRows.filter(r =>
      r.name?.toLowerCase().includes(q) ||
      r.stir?.toLowerCase().includes(q) ||
      r.specialization?.toLowerCase().includes(q)
    )
  }, [allRows, hudud, search])

  const clientPage  = hudud ? page : 0
  const clientPages = hudud ? Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)) : serverTotalPages
  const displayData = hudud
    ? filtered.slice(clientPage * PAGE_SIZE, (clientPage + 1) * PAGE_SIZE)
    : allRows

  const handleHududChange = (val: string) => { setHudud(val); setPage(0); setSearch('') }
  const handleSearch = (val: string) => { setSearch(val); setPage(0) }

  const columns: Column<Farmer>[] = [
    {
      key: 'id', title: '#', width: '50px',
      render: (_, __, idx) => String(clientPage * PAGE_SIZE + (idx as number) + 1),
    },
    { key: 'name',            title: 'Fermer nomi' },
    { key: 'totalArea',       title: 'Jami',           render: (v) => fmt(v as number) },
    { key: 'irrigatedArea',   title: "Sug'oril.",       render: (v) => fmt(v as number) },
    { key: 'cottonArea',      title: "G'o'za",          render: (v) => fmt(v as number) },
    { key: 'wheatArea',       title: "Bug'doy",         render: (v) => fmt(v as number) },
    { key: 'orchardArea',     title: "Bog'",            render: (v) => fmt(v as number) },
    { key: 'grapeArea',       title: 'Uzum',            render: (v) => fmt(v as number) },
    { key: 'greenhouseArea',  title: 'Issiqxona',       render: (v) => fmt(v as number) },
    { key: 'lalmiArea',       title: 'Lalmi',           render: (v) => fmt(v as number) },
    { key: 'poplarArea',      title: 'Terak',           render: (v) => fmt(v as number) },
    { key: 'otherTreeArea',   title: 'Boshqa daraxt',   render: (v) => fmt(v as number) },
    { key: 'pastureArea',     title: 'Yaylov',          render: (v) => fmt(v as number) },
    { key: 'hayfieldArea',    title: 'Xashakzor',       render: (v) => fmt(v as number) },
    { key: 'meliorationArea', title: 'Meliorasiya',     render: (v) => fmt(v as number) },
    { key: 'pondArea',        title: 'Hovuz',           render: (v) => fmt(v as number) },
    { key: 'reservoirArea',   title: 'Suv ombori',      render: (v) => fmt(v as number) },
    { key: 'canalArea',       title: 'Kanal',           render: (v) => fmt(v as number) },
    { key: 'houseArea',       title: 'Uy',              render: (v) => fmt(v as number) },
    { key: 'yardArea',        title: 'Hovli',           render: (v) => fmt(v as number) },
    { key: 'buildingArea',    title: 'Bino',            render: (v) => fmt(v as number) },
    { key: 'otherArea',       title: 'Boshqa',          render: (v) => fmt(v as number) },
  ]

  if (error) return <ErrorAlert message={error} onRetry={() => { setError(''); setHudud(''); setPage(0) }} />

  return (
    <div className="animate-fade-in">
      <PageHeader title="Yer balansi" subtitle="Hudud bo'yicha yer balansi ma'lumotlari" />

      <div className="space-y-4">
        {/* Filters bar */}
        <div className="card py-3 px-4 flex items-center gap-3 flex-wrap">
          {/* Hudud dropdown */}
          <div className="relative min-w-[240px]">
            <select
              value={hudud}
              onChange={e => handleHududChange(e.target.value)}
              className="input-field appearance-none pr-9 cursor-pointer text-sm"
            >
              <option value="">— Barcha hududlar —</option>
              {HUDUDLAR.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Search (only when hudud selected) */}
          {hudud && (
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Fermer nomi, STIR bo'yicha qidirish…"
                className="input-field pl-9 text-sm w-full"
              />
              {search && (
                <button onClick={() => handleSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* Count badge */}
          {!loading && (
            <span className="text-xs text-slate-400 shrink-0">
              {hudud
                ? <><strong className="text-slate-600">{filtered.length}</strong> ta fermer{search ? ` (jami ${allRows.length})` : ''}</>
                : <>Jami: <strong className="text-slate-600">{serverTotal}</strong> ta</>
              }
            </span>
          )}

          {hudud && (
            <button onClick={() => handleHududChange('')} className="text-xs text-primary-600 hover:text-primary-700 font-medium shrink-0">
              Tozalash ×
            </button>
          )}
        </div>

        {/* Hudud jami summary card */}
        {hudud && !loading && jamiRow && (
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hudud jami</p>
                <p className="font-display font-bold text-slate-800 text-base mt-0.5">{hudud}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                {allRows.length} ta fermer
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              <SumCard label="Umumiy"       value={jamiRow.totalArea}       color="#6366f1" />
              <SumCard label="Sug'orilgan"  value={jamiRow.irrigatedArea}   color="#10b981" />
              <SumCard label="G'o'za"       value={jamiRow.cottonArea}      color="#f59e0b" />
              <SumCard label="Bug'doy"      value={jamiRow.wheatArea}       color="#eab308" />
              <SumCard label="Bog'"         value={jamiRow.orchardArea}     color="#ec4899" />
              <SumCard label="Meliorasiya"  value={jamiRow.meliorationArea} color="#06b6d4" />
              <SumCard label="Kanal"        value={jamiRow.canalArea}       color="#3b82f6" />
            </div>
          </div>
        )}

        {/* Loading skeleton for jami */}
        {hudud && loading && (
          <div className="card">
            <div className="skeleton h-5 w-48 mb-3" />
            <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table<Farmer>
              columns={columns}
              data={displayData}
              loading={loading}
              emptyText="Yer balansi ma'lumotlari topilmadi"
              onRowClick={setDetailRow}
            />
          </div>
          <Pagination
            page={clientPage}
            totalPages={hudud ? clientPages : serverTotalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      <Drawer
        isOpen={!!detailRow}
        onClose={() => setDetailRow(null)}
        title={detailRow?.name || ''}
        subtitle={`STIR: ${detailRow?.stir || '—'}`}
      >
        {detailRow && <FarmerDetail farmer={detailRow} />}
      </Drawer>
    </div>
  )
}

export default LandBalancePage
