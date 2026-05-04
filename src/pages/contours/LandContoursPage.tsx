import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { landContoursApi } from '../../services/api'
import { useCrud } from '../../utils/useCrud'
import { Table, Pagination, SearchBar, PageHeader, ErrorAlert, Drawer } from '../../components/ui'
import type { LandContour, Column } from '../../types'
import { formatNumber } from '../../utils/helpers'
import LandContourDetail from './LandContourDetail'

const LandContoursPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { data, total, loading, error, page, totalPages, search, setSearch, setPage, refetch } =
    useCrud<LandContour>({ fetchFn: landContoursApi.getAll })

  useEffect(() => { const q = searchParams.get('q'); if (q) setSearch(q) }, [])

  const [detailRow, setDetailRow] = useState<LandContour | null>(null)

  const columns: Column<LandContour>[] = [
    { key: 'id',                        title: '#',                   width: '55px' },
    { key: 'contourNumber',             title: 'Kontur raqami',       render: (v) => String(v || '—') },
    { key: 'totalArea',                 title: 'Maydon (ga)',         render: (v) => formatNumber(v as number) },
    { key: 'agricultureTotalArea',      title: "Qishloq xo'jaligi",  render: (v) => formatNumber(v as number) },
    { key: 'irrigatedAgricultureArea',  title: "Sug'orilgan",        render: (v) => formatNumber(v as number) },
    { key: 'pastureArea',               title: 'Yaylov',             render: (v) => formatNumber(v as number) },
    { key: 'orchardArea',               title: "Bog'",               render: (v) => formatNumber(v as number) },
    { key: 'forestArea',                title: "O'rmon",             render: (v) => formatNumber(v as number) },
  ]

  if (error) return <ErrorAlert message={error} onRetry={refetch} />

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Yer konturlari"
        subtitle="Qishloq xo'jaligi yer konturlari"
      />
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Kontur raqami bo'yicha qidirish…"
          />
          {!loading && (
            <span className="text-xs text-slate-400 shrink-0">
              Jami: <strong className="text-slate-600">{total}</strong> ta
            </span>
          )}
        </div>
        <Table<LandContour>
          columns={columns}
          data={data}
          loading={loading}
          emptyText="Yer konturlari topilmadi"
          onRowClick={setDetailRow}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Drawer
        isOpen={!!detailRow}
        onClose={() => setDetailRow(null)}
        title={`Kontur № ${detailRow?.contourNumber || detailRow?.id}`}
        subtitle={detailRow?.totalArea ? `Umumiy maydon: ${formatNumber(detailRow.totalArea)} ga` : undefined}
      >
        {detailRow && <LandContourDetail record={detailRow} />}
      </Drawer>
    </div>
  )
}

export default LandContoursPage
