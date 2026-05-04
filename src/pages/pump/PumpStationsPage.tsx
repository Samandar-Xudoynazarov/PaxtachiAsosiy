import React, { useState } from 'react'
import { Upload } from 'lucide-react'
import { pumpApi } from '../../services/api'
import { useCrud } from '../../utils/useCrud'
import { Table, Pagination, SearchBar, PageHeader, ErrorAlert, Drawer } from '../../components/ui'
import type { PumpStation, Column } from '../../types'
import { formatNumber } from '../../utils/helpers'
import PumpDetail from './PumpDetail'

const PumpStationsPage: React.FC = () => {
  const { data, total, loading, error, page, totalPages, search, setSearch, setPage, refetch } =
    useCrud<PumpStation>({ fetchFn: pumpApi.getStations })

  const [detailRow, setDetailRow] = useState<PumpStation | null>(null)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) pumpApi.importExcel(file).then(() => { refetch(); e.target.value = '' })
  }

  const columns: Column<PumpStation>[] = [
    { key: 'id', title: '#', width: '60px' },
    { key: 'stationName', title: 'Stansiya nomi', render: (v) => String(v || '—') },
    {
      key: 'installedAggregateCount',
      title: "O'rnatilgan",
      render: (v) => v != null ? `${formatNumber(v as number)} ta` : '—',
    },
    {
      key: 'workingAggregateCount',
      title: 'Ishlayapti',
      render: (v) => v != null ? `${formatNumber(v as number)} ta` : '—',
    },
    { key: 'waterSource', title: 'Suv manbai', render: (v) => String(v || '—') },
    {
      key: 'workingAggregateCount' as keyof PumpStation,
      title: 'Holat',
      render: (_, row) => {
        const installed = row.installedAggregateCount ?? 0
        const working   = row.workingAggregateCount   ?? 0
        const pct       = installed > 0 ? Math.round((working / installed) * 100) : 0
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            pct >= 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
          }`}>
            {pct}% faol
          </span>
        )
      },
    },
  ]

  if (error) return <ErrorAlert message={error} onRetry={refetch} />

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Nasos stansiyalari"
        subtitle="Sug'orish infratuzilmasi monitoringi"
        actions={
          <label className="btn-secondary cursor-pointer text-sm">
            <Upload size={16} /> Excel import
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
          </label>
        }
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Nasos stansiyasi qidirish…" />
          {!loading && (
            <span className="text-xs text-slate-400 shrink-0">
              Jami: <strong className="text-slate-600">{total}</strong> ta
            </span>
          )}
        </div>
        <Table<PumpStation>
          columns={columns}
          data={data}
          loading={loading}
          emptyText="Nasos stansiyalari topilmadi"
          onRowClick={setDetailRow}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Drawer
        isOpen={!!detailRow}
        onClose={() => setDetailRow(null)}
        title={detailRow?.stationName || 'Nasos stansiyasi'}
        subtitle={detailRow?.waterSource ? `Suv manbai: ${detailRow.waterSource}` : undefined}
      >
        {detailRow && <PumpDetail station={detailRow} />}
      </Drawer>
    </div>
  )
}

export default PumpStationsPage
