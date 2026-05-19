import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Upload, Pencil, Trash2 } from 'lucide-react'
import { agroTechnicsApi } from '../../services/api'
import { useCrud } from '../../utils/useCrud'
import { Table, Modal, Pagination, SearchBar, PageHeader, ErrorAlert, Drawer } from '../../components/ui'
import type { AgroTechnic, Column } from '../../types'
import AgroDetail from './AgroDetail'

const empty: Partial<AgroTechnic> = {
  ownerName: '',
  ownershipType: '',
  inn: '',
  district: '',
  model: '',
  technicType: '',
  productionYear: undefined,
  engineNumber: '',
  chassisNumber: '',
  color: '',
  regionCode: '',
  series: '',
  number: '',
}

const AgroTechnicsPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { data, loading, error, page, totalPages, search, setSearch, setPage, refetch } =
    useCrud<AgroTechnic>({
      fetchFn: agroTechnicsApi.getAll,
      filterFn: (item, q) => {
        const qt = q.trim()
        const inn = String(item.inn ?? '').trim()
        return (
          (!!inn && inn.includes(qt)) ||
          item.ownerName?.toLowerCase().includes(qt) ||
          item.model?.toLowerCase().includes(qt) ||
          item.technicType?.toLowerCase().includes(qt) ||
          item.ownershipType?.toLowerCase().includes(qt) ||
          item.district?.toLowerCase().includes(qt) ||
          item.engineNumber?.toLowerCase().includes(qt) ||
          item.chassisNumber?.toLowerCase().includes(qt) ||
          false
        )
      },
    })

  useEffect(() => { const q = searchParams.get('q'); if (q) setSearch(q) }, [])

  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<AgroTechnic | null>(null)
  const [detailRow, setDetailRow] = useState<AgroTechnic | null>(null)
  const [form, setForm] = useState<Partial<AgroTechnic>>(empty)
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState('')

  const openAdd = () => { setForm(empty); setSelected(null); setModal('add') }
  const openEdit = (e: React.MouseEvent, row: AgroTechnic) => {
    e.stopPropagation()
    setSelected(row)
    setForm({
      ownerName: row.ownerName || '',
      ownershipType: row.ownershipType || '',
      inn: row.inn || '',
      district: row.district || '',
      model: row.model || '',
      technicType: row.technicType || '',
      productionYear: row.productionYear ?? undefined,
      engineNumber: row.engineNumber || '',
      chassisNumber: row.chassisNumber || '',
      color: row.color || '',
      regionCode: row.regionCode || '',
      series: row.series || '',
      number: row.number || '',
    })
    setModal('edit')
  }
  const close = () => { setModal(null); setSelected(null); setSaveErr('') }

  const handleSave = async () => {
    setSaving(true); setSaveErr('')
    try {
      if (modal === 'add') await agroTechnicsApi.create(form)
      else if (modal === 'edit' && selected) await agroTechnicsApi.update(selected.id, form)
      close(); refetch()
    } catch {
      setSaveErr('Saqlashda xatolik yuz berdi')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await agroTechnicsApi.delete(selected.id)
      close(); refetch()
    } catch {
      setSaveErr("O'chirishda xatolik")
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) agroTechnicsApi.importExcel(file).then(() => { refetch(); e.target.value = '' })
  }

  const columns: Column<AgroTechnic>[] = [
    { key: 'id', title: '#', width: '60px' },
    { key: 'ownerName',     title: 'Nomi',   render: (v) => String(v || '—') },
    { key: 'ownershipType', title: 'Turi',   render: (v) => String(v || '—') },
    { key: 'technicType',   title: 'Brend',  render: (v) => String(v || '—') },
    { key: 'model',         title: 'Model',  render: (v) => String(v || '—') },
    { key: 'district',      title: 'Hudud',  render: (v) => String(v || '—') },
    { key: 'productionYear',title: 'Yili',   render: (v) => String(v || '—') },
    {
      key: 'actions' as keyof AgroTechnic,
      title: 'Amallar',
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

  if (error) return <ErrorAlert message={error} onRetry={refetch} />

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Agro texnikalar"
        subtitle="Fermer xo'jaliklaridagi texnika parki"
        actions={
          <>
            <label className="btn-secondary cursor-pointer text-sm">
              <Upload size={16} /> Excel import
              <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
            </label>
            <button onClick={openAdd} className="btn-primary text-sm"><Plus size={16} /> Qo'shish</button>
          </>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Texnika qidirish…" />
        </div>
        <Table<AgroTechnic>
          columns={columns}
          data={data}
          loading={loading}
          emptyText="Agro texnikalar topilmadi"
          onRowClick={setDetailRow}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Detail drawer */}
      <Drawer
        isOpen={!!detailRow}
        onClose={() => setDetailRow(null)}
        title={detailRow?.ownerName || detailRow?.model || 'Texnika'}
        subtitle={detailRow?.technicType || undefined}
      >
        {detailRow && <AgroDetail technic={detailRow} />}
      </Drawer>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modal === 'add' || modal === 'edit'}
        onClose={close}
        title={modal === 'add' ? "Yangi texnika qo'shish" : 'Texnikani tahrirlash'}
        size="lg"
      >
        <div className="space-y-4">
          {saveErr && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{saveErr}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fermer nomi</label>
              <input className="input-field" placeholder="Fermer nomi" value={form.ownerName || ''} onChange={e => setForm({...form, ownerName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mulkchilik turi</label>
              <input className="input-field" placeholder="Fermer xo'jaligi" value={form.ownershipType || ''} onChange={e => setForm({...form, ownershipType: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">INN</label>
              <input className="input-field" placeholder="INN raqami" value={form.inn || ''} onChange={e => setForm({...form, inn: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tuman</label>
              <input className="input-field" placeholder="Tuman" value={form.district || ''} onChange={e => setForm({...form, district: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Model (ish turi)</label>
              <input className="input-field" placeholder="Chopiq traktori" value={form.model || ''} onChange={e => setForm({...form, model: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Texnika turi</label>
              <input className="input-field" placeholder="Т-28Х4М" value={form.technicType || ''} onChange={e => setForm({...form, technicType: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ishlab chiqarilgan yili</label>
              <input type="number" className="input-field" placeholder="2020" value={form.productionYear || ''} onChange={e => setForm({...form, productionYear: Number(e.target.value) || undefined})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Dvigatel raqami</label>
              <input className="input-field" placeholder="Dvigatel raqami" value={form.engineNumber || ''} onChange={e => setForm({...form, engineNumber: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Shassi raqami</label>
              <input className="input-field" placeholder="Shassi raqami" value={form.chassisNumber || ''} onChange={e => setForm({...form, chassisNumber: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Rang</label>
              <input className="input-field" placeholder="Rang" value={form.color || ''} onChange={e => setForm({...form, color: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Viloyat kodi</label>
              <input className="input-field" placeholder="Ko'k" value={form.regionCode || ''} onChange={e => setForm({...form, regionCode: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Seriya / Raqam</label>
              <div className="flex gap-2">
                <input className="input-field" placeholder="Seriya" value={form.series || ''} onChange={e => setForm({...form, series: e.target.value})} />
                <input className="input-field" placeholder="Raqam" value={form.number || ''} onChange={e => setForm({...form, number: e.target.value})} />
              </div>
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
          <strong>{selected?.ownerName}</strong> texnikasini o'chirasizmi?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={close} className="btn-secondary text-sm">Bekor qilish</button>
          <button onClick={handleDelete} className="btn-danger text-sm">O'chirish</button>
        </div>
      </Modal>
    </div>
  )
}

export default AgroTechnicsPage
