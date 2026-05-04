import React, { useState, useEffect, useCallback } from 'react'
import { usersApi } from '../../services/api'
import { Table, Pagination, SearchBar, PageHeader, ErrorAlert } from '../../components/ui'
import type { User, Column } from '../../types'
import { formatDate } from '../../utils/helpers'

const PAGE_SIZE = 20

const UsersPage: React.FC = () => {
  const [data, setData]           = useState<User[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [page, setPage]           = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearchState]  = useState('')

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true)
    setError('')
    try {
      const res = await usersApi.getAdminUsers({ page: p, size: PAGE_SIZE })
      const d = res.data
      if (Array.isArray(d)) {
        setData(d)
        setTotalPages(1)
      } else if (d?.content) {
        setData(d.content)
        setTotalPages(d.totalPages ?? 1)
      } else {
        setData([])
      }
    } catch {
      setError("Ma'lumotlarni yuklashda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPage(page) }, [page, fetchPage])

  const setSearch = (s: string) => setSearchState(s)

  // Client-side filter on current page only (users list is typically small)
  const filtered = search.trim()
    ? data.filter(u =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.role?.toLowerCase().includes(search.toLowerCase())
      )
    : data

  const columns: Column<User>[] = [
    { key: 'id', title: '#', width: '60px' },
    { key: 'username', title: 'Foydalanuvchi nomi' },
    { key: 'email',    title: 'Email',  render: (v) => String(v || '—') },
    { key: 'role',     title: 'Roli',   render: (v) => (
      <span className={`badge ${v === 'ADMIN' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
        {String(v || '')}
      </span>
    )},
    { key: 'isActive', title: 'Holat',  render: (v) => (
      <span className={`badge ${v ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {v ? 'Faol' : 'Nofaol'}
      </span>
    )},
    { key: 'createdAt', title: "Ro'yxatdan o'tgan", render: (v) => formatDate(v as string) },
  ]

  if (error) return <ErrorAlert message={error} onRetry={() => fetchPage(page)} />

  return (
    <div className="animate-fade-in">
      <PageHeader title="Foydalanuvchilar" subtitle="Tizim foydalanuvchilari boshqaruvi" />
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Foydalanuvchi qidirish…" />
        </div>
        <Table<User>
          columns={columns}
          data={filtered}
          loading={loading}
          emptyText="Foydalanuvchilar topilmadi"
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  )
}

export default UsersPage
