import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { representativesApi } from '../../services/api'
import { useCrud } from '../../utils/useCrud'
import { Table, Pagination, SearchBar, PageHeader, ErrorAlert, Drawer } from '../../components/ui'
import type { FarmRepresentative, Column } from '../../types'
import { formatNumber } from '../../utils/helpers'
import RepresentativeDetail from './RepresentativeDetail'

const RepresentativesPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { data, total, loading, error, page, totalPages, search, setSearch, setPage, refetch } =
    useCrud<FarmRepresentative>({ fetchFn: representativesApi.getAll })

  useEffect(() => { const q = searchParams.get('q'); if (q) setSearch(q) }, [])

  const [detailRow, setDetailRow] = useState<FarmRepresentative | null>(null)

  const columns: Column<FarmRepresentative>[] = [
    { key: 'id',               title: '#',              width: '55px' },
    { key: 'farmName',         title: "Fermer xo'jaligi", render: (v) => String(v || '—') },
    { key: 'farmerFullName',   title: 'F.I.O',           render: (v) => String(v || '—') },
    { key: 'activityType',     title: 'Faoliyat turi',   render: (v) => String(v || '—') },
    { key: 'farmerPhone',      title: 'Telefon',         render: (v) => String(v || '—') },
    { key: 'landManagerFullName', title: 'Yer boshqaruvchi', render: (v) => String(v || '—') },
    { key: 'inn',              title: 'INN',             render: (v) => String(v || '—') },
    {
      key: 'livestockCount',
      title: 'Chorva soni',
      render: (v) => v != null ? formatNumber(v as number) : '—',
    },
  ]

  if (error) return <ErrorAlert message={error} onRetry={refetch} />

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Fermer vakillari"
        subtitle="Fermer xo'jaliklarining vakillar ro'yxati"
      />
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Fermer xo'jaligi, F.I.O, INN bo'yicha qidirish…"
          />
          {!loading && (
            <span className="text-xs text-slate-400 shrink-0">
              Jami: <strong className="text-slate-600">{total}</strong> ta
            </span>
          )}
        </div>
        <Table<FarmRepresentative>
          columns={columns}
          data={data}
          loading={loading}
          emptyText="Fermer vakillari topilmadi"
          onRowClick={setDetailRow}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Drawer
        isOpen={!!detailRow}
        onClose={() => setDetailRow(null)}
        title={detailRow?.farmName || detailRow?.farmerFullName || 'Vakil'}
        subtitle={detailRow?.activityType || undefined}
      >
        {detailRow && <RepresentativeDetail record={detailRow} />}
      </Drawer>
    </div>
  )
}

export default RepresentativesPage
