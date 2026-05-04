import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { greenhouseApi } from '../../services/api'
import { useCrud } from '../../utils/useCrud'
import { Table, Pagination, SearchBar, PageHeader, ErrorAlert, Drawer } from '../../components/ui'
import type { GreenhouseRecord, Column } from '../../types'
import { formatNumber } from '../../utils/helpers'
import GreenhouseDetail from './GreenhouseDetail'

const GreenhousePage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { data, total, loading, error, page, totalPages, search, setSearch, setPage, refetch } =
    useCrud<GreenhouseRecord>({ fetchFn: greenhouseApi.getAll })

  useEffect(() => { const q = searchParams.get('q'); if (q) setSearch(q) }, [])

  const [detailRow, setDetailRow] = useState<GreenhouseRecord | null>(null)

  const columns: Column<GreenhouseRecord>[] = [
    { key: 'id',             title: '#',              width: '55px' },
    { key: 'ownerName',      title: 'Egasi',          render: (v) => String(v || '—') },
    { key: 'cropName',       title: 'Ekin turi',      render: (v) => String(v || '—') },
    { key: 'greenhouseArea', title: 'Maydon (ga)',     render: (v) => formatNumber(v as number) },
    { key: 'totalArea',      title: 'Umumiy yer (ga)', render: (v) => formatNumber(v as number) },
    { key: 'mfy',            title: 'MFY',            render: (v) => String(v || '—') },
    { key: 'phoneNumber',    title: 'Telefon',        render: (v) => String(v || '—') },
    {
      key: 'seedlingCount',
      title: "Ko'chat",
      render: (v) => v != null ? `${formatNumber(v as number)} ta` : '—',
    },
  ]

  if (error) return <ErrorAlert message={error} onRetry={refetch} />

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Issiqxona yozuvlari"
        subtitle="Issiqxona xo'jaliklari monitoringi"
      />

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Egasi, ekin turi, MFY bo'yicha qidirish…" />
          {!loading && (
            <span className="text-xs text-slate-400 shrink-0">
              Jami: <strong className="text-slate-600">{total}</strong> ta
            </span>
          )}
        </div>
        <Table<GreenhouseRecord>
          columns={columns}
          data={data}
          loading={loading}
          emptyText="Issiqxona yozuvlari topilmadi"
          onRowClick={setDetailRow}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Drawer
        isOpen={!!detailRow}
        onClose={() => setDetailRow(null)}
        title={detailRow?.ownerName || 'Issiqxona'}
        subtitle={detailRow?.mfy ? `MFY: ${detailRow.mfy}` : undefined}
      >
        {detailRow && <GreenhouseDetail record={detailRow} />}
      </Drawer>
    </div>
  )
}

export default GreenhousePage
