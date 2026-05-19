import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Upload } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { farmersApi, specializationsApi } from '../../services/api'
import { Table, Modal, Pagination, SearchBar, PageHeader, StatusBadge, ErrorAlert, Drawer } from '../../components/ui'
import type { Farmer, SpecializationSummary, Column } from '../../types'
import { formatDate, formatNumber } from '../../utils/helpers'
import FarmerDetail from './FarmerDetail'

const PAGE_SIZE = 20
const COLORS = ['#16a34a', '#2563eb', '#0891b2', '#7c3aed', '#d97706', '#dc2626', '#f43f5e', '#06b6d4', '#84cc16', '#f59e0b']

const FarmersPage: React.FC = () => {
  const [searchParams] = useSearchParams()

  const [allItems, setAllItems] = useState<Farmer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPageState] = useState(0)
  const [serverTotal, setServerTotal] = useState(0)
  const [fetchKey, setFetchKey] = useState(0)

  const [search, setSearchState] = useState(searchParams.get('q') || '')
  const [specFilter, setSpecFilter] = useState('')

  const setSearch = useCallback((s: string) => { setSearchState(s); setPageState(0) }, [])
  const setPage = useCallback((p: number) => { setPageState(p) }, [])
  const refetch = useCallback(() => setFetchKey(k => k + 1), [])
  const handleSpecFilter = useCallback((id: string) => { setSpecFilter(id); setPageState(0); setSearchState('') }, [])

  // Always fetch ALL farmers (all backend pages in parallel) → client-side pagination
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    ;(async () => {
      try {
        const firstRes = await farmersApi.getAll({ page: 0, size: PAGE_SIZE })
        if (cancelled) return
        const d0 = firstRes.data
        const first: Farmer[] = Array.isArray(d0) ? d0 : d0?.content ?? d0?.items ?? []
        const total: number = d0?.total ?? d0?.totalElements ?? d0?.page?.totalElements ?? first.length
        const ps: number = d0?.pageSize ?? PAGE_SIZE
        setServerTotal(total)

        let allRaw = [...first]
        const totalPg = Math.ceil(total / ps)
        if (totalPg > 1) {
          const rest = await Promise.all(
            Array.from({ length: totalPg - 1 }, (_, i) =>
              farmersApi.getAll({ page: i + 1, size: ps })
            )
          )
          if (cancelled) return
          rest.forEach(r => {
            const rd = r.data
            const chunk: Farmer[] = Array.isArray(rd) ? rd : rd?.content ?? rd?.items ?? []
            allRaw = allRaw.concat(chunk)
          })
        }
        setAllItems(allRaw)
      } catch {
        if (!cancelled) setError("Ma'lumotlarni yuklashda xatolik yuz berdi")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [fetchKey])

  const filteredAll = useMemo(() => {
    let res = allItems
    if (specFilter) res = res.filter(r => r.specialization === specFilter)
    if (!search.trim()) return res
    const q = search.toLowerCase()
    return res.filter(r =>
      r.name?.toLowerCase().includes(q) ||
      r.stir?.toLowerCase().includes(q) ||
      r.farmType?.toLowerCase().includes(q) ||
      r.specialization?.toLowerCase().includes(q)
    )
  }, [allItems, search, specFilter])

  const data = filteredAll.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(filteredAll.length / PAGE_SIZE))

  // Modals & detail
  const [addModal, setAddModal] = useState(false)
  const [editRow, setEditRow] = useState<Farmer | null>(null)
  const [deleteRow, setDeleteRow] = useState<Farmer | null>(null)
  const [detailRow, setDetailRow] = useState<Farmer | null>(null)
  const [form, setForm] = useState({ name: '', stir: '', farmType: '', rightType: '', totalArea: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Specializations
  const [specData, setSpecData] = useState<SpecializationSummary[]>([])

  useEffect(() => {
    specializationsApi.getSummary().then(res => {
      const d = res.data
      const raw: SpecializationSummary[] = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : Array.isArray(d?.content) ? d.content : []
      const total = raw.reduce((s, r) => s + (r.farmersCount ?? 0), 0)
      setSpecData(raw.map(r => ({ ...r, percentage: total > 0 ? Math.round((r.farmersCount / total) * 100) : 0 })))
    }).catch(() => {})
  }, [])

  const chartData = specData.map((d, i) => ({ name: d.name, value: d.farmersCount, color: COLORS[i % COLORS.length] }))

  const openAdd = () => { setForm({ name: '', stir: '', farmType: '', rightType: '', totalArea: '' }); setAddModal(true) }
  const openEdit = (e: React.MouseEvent, row: Farmer) => {
    e.stopPropagation()
    setEditRow(row)
    setForm({ name: row.name, stir: row.stir, farmType: row.farmType || '', rightType: row.rightType || '', totalArea: String(row.totalArea || '') })
  }
  const closeAll = () => { setAddModal(false); setEditRow(null); setDeleteRow(null); setSaveError('') }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) farmersApi.upload(file).then(() => { refetch(); e.target.value = '' })
  }

  const handleSave = async () => {
    setSaving(true); setSaveError('')
    try { closeAll(); refetch() }
    catch { setSaveError('Saqlashda xatolik yuz berdi') }
    finally { setSaving(false) }
  }

  const columns: Column<Farmer>[] = [
    { key: 'id', title: '#', width: '60px', render: (_, __, idx) => String(page * PAGE_SIZE + (idx as number) + 1) },
    { key: 'name', title: 'F.I.O' },
    { key: 'stir', title: 'INN' },
    { key: 'farmType', title: 'Ferma turi', render: (v) => String(v || '—') },
    { key: 'totalArea', title: 'Maydon (ga)', render: (v) => v != null ? formatNumber(v as number) : '—' },
    { key: 'specialization', title: 'Ixtisoslik', render: (v) => String(v || '—') },
    { key: 'deleted', title: 'Holat', render: (v) => <StatusBadge status={v ? 'inactive' : 'active'} /> },
    { key: 'createdAt', title: 'Sana', render: (v) => formatDate(v as string) },
    {
      key: 'actions' as keyof Farmer,
      title: 'Amallar',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button onClick={(e) => openEdit(e, row)} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">Tahrir</button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteRow(row) }} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors">O'chir</button>
        </div>
      ),
    },
  ]

  if (error) return <ErrorAlert message={error} onRetry={refetch} />

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Fermerlar"
        subtitle={serverTotal ? `Jami: ${serverTotal} ta fermer` : 'Fermerlar ro\'yxati'}
        actions={
          <>
            <label className="btn-secondary cursor-pointer text-sm">
              <Upload size={16} /> Excel import
              <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
            </label>
            <button onClick={openAdd} className="btn-primary text-sm"><Plus size={16} /> Yangi fermer</button>
          </>
        }
      />

      {/* Specialization breakdown */}
      {specData.length > 0 && (
        <div className="card mb-4">
          <h3 className="font-display font-bold text-slate-700 mb-4">Ixtisoslik bo'yicha taqsimot</h3>
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: unknown) => [`${v} ta fermer`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {specData.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => handleSpecFilter(specFilter === item.id ? '' : item.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${specFilter === item.id ? 'bg-primary-50 ring-1 ring-primary-300' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-200 rounded-full h-1">
                        <div className="h-1 rounded-full" style={{ width: `${item.percentage ?? 0}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                      </div>
                      <span className="text-xs text-slate-500 shrink-0">{item.percentage ?? 0}%</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-800">{formatNumber(item.farmersCount)} ta</p>
                    {item.totalLandHa > 0 && <p className="text-xs text-slate-400">{formatNumber(item.totalLandHa)} ga</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <SearchBar value={search} onChange={setSearch} placeholder="Fermer nomi, INN, ixtisoslik…" />
            {specData.length > 0 && (
              <select
                value={specFilter}
                onChange={e => handleSpecFilter(e.target.value)}
                className="input-field text-sm py-2 shrink-0 min-w-[170px]"
              >
                <option value="">Barcha ixtisosliklar</option>
                {specData.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}
          </div>
          {!loading && (
            <span className="text-xs text-slate-400 shrink-0">
              {(search || specFilter)
                ? <><strong className="text-slate-600">{filteredAll.length}</strong> ta topildi · Jami {serverTotal} ta</>
                : <>Sahifa <strong className="text-slate-600">{page + 1}</strong> / {totalPages} · Jami {serverTotal} ta</>
              }
            </span>
          )}
        </div>
        <Table<Farmer>
          columns={columns}
          data={data}
          loading={loading}
          emptyText="Fermerlar topilmadi"
          onRowClick={setDetailRow}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Drawer isOpen={!!detailRow} onClose={() => setDetailRow(null)} title={detailRow?.name || ''} subtitle={`INN/STIR: ${detailRow?.stir || '—'}`}>
        {detailRow && <FarmerDetail farmer={detailRow} />}
      </Drawer>

      <Modal isOpen={addModal || !!editRow} onClose={closeAll} title={editRow ? 'Farmerni tahrirlash' : "Yangi fermer qo'shish"}>
        <div className="space-y-4">
          {saveError && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{saveError}</div>}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomi *</label>
            <input className="input-field" placeholder="Fermer nomi" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">STIR *</label>
            <input className="input-field" placeholder="STIR raqami" value={form.stir} onChange={e => setForm({...form, stir: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ferma turi</label>
              <input className="input-field" placeholder="Fermer xo'jaligi" value={form.farmType} onChange={e => setForm({...form, farmType: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Maydon (ga)</label>
              <input type="number" className="input-field" placeholder="0.00" value={form.totalArea} onChange={e => setForm({...form, totalArea: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Haq turi</label>
            <input className="input-field" placeholder="Ijara" value={form.rightType} onChange={e => setForm({...form, rightType: e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={closeAll} className="btn-secondary text-sm">Bekor qilish</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">{saving ? 'Saqlanmoqda…' : 'Saqlash'}</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteRow} onClose={closeAll} title="O'chirishni tasdiqlash" size="sm">
        <p className="text-slate-600 mb-6"><strong>{deleteRow?.name}</strong> fermerini o'chirishni xohlaysizmi?</p>
        <div className="flex justify-end gap-3">
          <button onClick={closeAll} className="btn-secondary text-sm">Bekor qilish</button>
          <button onClick={closeAll} className="btn-danger text-sm">O'chirish</button>
        </div>
      </Modal>
    </div>
  )
}

export default FarmersPage
