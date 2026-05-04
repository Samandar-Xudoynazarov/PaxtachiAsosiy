import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { cadastreApi } from '../../services/api'
import { Table, Modal, Pagination, SearchBar, PageHeader, ErrorAlert, Drawer } from '../../components/ui'
import type { CadastreRecord, Column } from '../../types'
import { formatNumber } from '../../utils/helpers'
import CadastreDetail from './CadastreDetail'

const PAGE_SIZE = 20

const empty = {
  regionName: '',
  districtName: '',
  neighborhoodName: '',
  contourNumber: '',
  area: '',
  landType: '',
  landNumber: '',
  cadastreNumber: '',
}

const CadastrePage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [allData, setAllData] = useState<CadastreRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [search, setSearchState] = useState(searchParams.get('q') || '')
  const [detailRow, setDetailRow] = useState<CadastreRecord | null>(null)

  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<CadastreRecord | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await cadastreApi.getAll()
      const d = res.data
      if (Array.isArray(d)) setAllData(d)
      else if (Array.isArray(d?.content)) setAllData(d.content)
      else if (Array.isArray(d?.data)) setAllData(d.data)
      else setAllData([])
    } catch {
      setError("Ma'lumotlarni yuklashda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return allData
    const q = search.toLowerCase()
    return allData.filter(row =>
      row.cadastreNumber?.toLowerCase().includes(q) ||
      row.contourNumber?.toLowerCase().includes(q) ||
      row.regionName?.toLowerCase().includes(q) ||
      row.districtName?.toLowerCase().includes(q) ||
      row.neighborhoodName?.toLowerCase().includes(q) ||
      row.landNumber?.toLowerCase().includes(q) ||
      row.farmName?.toLowerCase().includes(q)
    )
  }, [allData, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const setSearch = (s: string) => { setSearchState(s); setPage(0) }

  const openAdd = () => { setForm(empty); setSelected(null); setModal('add') }
  const openEdit = (e: React.MouseEvent, row: CadastreRecord) => {
    e.stopPropagation()
    setSelected(row)
    setForm({
      regionName: row.regionName || '',
      districtName: row.districtName || '',
      neighborhoodName: row.neighborhoodName || '',
      contourNumber: row.contourNumber || '',
      area: String(row.area || ''),
      landType: row.landType || '',
      landNumber: row.landNumber || '',
      cadastreNumber: row.cadastreNumber || '',
    })
    setModal('edit')
  }
  const close = () => { setModal(null); setSelected(null) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form, area: Number(form.area) }
      if (modal === 'add') await cadastreApi.create(payload)
      else if (selected) await cadastreApi.update(selected.id, payload)
      close(); fetchAll()
    } catch {
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (selected) { await cadastreApi.delete(selected.id); close(); fetchAll() }
  }

  const columns: Column<CadastreRecord>[] = [
    { key: 'id',               title: '#',              width: '55px' },
    { key: 'regionName',       title: 'Viloyat',        render: (v) => String(v || '—') },
    { key: 'districtName',     title: 'Tuman',          render: (v) => String(v || '—') },
    { key: 'neighborhoodName', title: 'Mahalla',        render: (v) => String(v || '—') },
    { key: 'contourNumber',    title: 'Kontur raqami',  render: (v) => String(v || '—') },
    { key: 'area',             title: 'Maydon (ga)',    render: (v) => formatNumber(v as number) },
    { key: 'landType',         title: 'Yer turi',       render: (v) => String(v || '—') },
    { key: 'cadastreNumber',   title: 'Kadastr raqami', render: (v) => String(v || '—') },
    { key: 'landNumber',       title: 'Yer raqami',     render: (v) => String(v || '—') },
    { key: 'farmName',         title: 'Fermer',         render: (v) => String(v || '—') },
    {
      key: 'actions' as keyof CadastreRecord,
      title: 'Amallar',
      width: '90px',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => openEdit(e, row)}
            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setSelected(row); setModal('delete') }}
            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  if (error) return <ErrorAlert message={error} onRetry={fetchAll} />

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Kadastr yer yozuvlari"
        subtitle="Yer kadastri va ro'yxatga olish ma'lumotlari"
        actions={
          <button onClick={openAdd} className="btn-primary text-sm">
            <Plus size={16} /> Qo'shish
          </button>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Kadastr, kontur, viloyat bo'yicha qidirish…"
          />
          {!loading && (
            <span className="text-xs text-slate-400 shrink-0">
              Jami: <strong className="text-slate-600">{filtered.length}</strong> ta
              {search && allData.length !== filtered.length && ` (${allData.length} tadan)`}
            </span>
          )}
        </div>

        <Table<CadastreRecord>
          columns={columns}
          data={pageData}
          loading={loading}
          emptyText="Kadastr yozuvlari topilmadi"
          onRowClick={setDetailRow}
        />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Detail drawer */}
      <Drawer
        isOpen={!!detailRow}
        onClose={() => setDetailRow(null)}
        title={detailRow?.cadastreNumber || detailRow?.contourNumber || 'Kadastr yozuvi'}
        subtitle={[detailRow?.regionName, detailRow?.districtName].filter(Boolean).join(' · ')}
      >
        {detailRow && <CadastreDetail record={detailRow} />}
      </Drawer>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modal === 'add' || modal === 'edit'}
        onClose={close}
        title={modal === 'add' ? 'Yangi kadastr yozuvi' : 'Kadastr yozuvini tahrirlash'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Viloyat</label>
              <input className="input-field" value={form.regionName} onChange={e => setForm({ ...form, regionName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tuman</label>
              <input className="input-field" value={form.districtName} onChange={e => setForm({ ...form, districtName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mahalla</label>
              <input className="input-field" value={form.neighborhoodName} onChange={e => setForm({ ...form, neighborhoodName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kontur raqami</label>
              <input className="input-field" value={form.contourNumber} onChange={e => setForm({ ...form, contourNumber: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Maydon (ga)</label>
              <input type="number" className="input-field" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Yer turi</label>
              <input className="input-field" value={form.landType} onChange={e => setForm({ ...form, landType: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kadastr raqami</label>
              <input className="input-field" value={form.cadastreNumber} onChange={e => setForm({ ...form, cadastreNumber: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Yer raqami</label>
              <input className="input-field" value={form.landNumber} onChange={e => setForm({ ...form, landNumber: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={close} className="btn-secondary text-sm">Bekor qilish</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
              {saving ? 'Saqlanmoqda…' : 'Saqlash'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={modal === 'delete'} onClose={close} title="O'chirishni tasdiqlash" size="sm">
        <p className="text-slate-600 mb-6">
          <strong>{selected?.cadastreNumber || selected?.contourNumber}</strong> yozuvini o'chirasizmi?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={close} className="btn-secondary text-sm">Bekor qilish</button>
          <button onClick={handleDelete} className="btn-danger text-sm">O'chirish</button>
        </div>
      </Modal>
    </div>
  )
}

export default CadastrePage
