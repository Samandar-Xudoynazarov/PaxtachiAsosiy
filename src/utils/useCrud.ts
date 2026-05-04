import { useState, useEffect, useCallback, useMemo } from 'react'
import type { AxiosResponse } from 'axios'

interface UseCrudOptions<T> {
  fetchFn: (params?: Record<string, unknown>) => Promise<AxiosResponse>
  pageSize?: number
}

interface UseCrudReturn<T> {
  data: T[]
  total: number
  loading: boolean
  error: string
  page: number
  totalPages: number
  search: string
  setSearch: (s: string) => void
  setPage: (p: number) => void
  refetch: () => void
}

function localFilter<T>(items: T[], q: string): T[] {
  return items.filter(item =>
    Object.values(item as Record<string, unknown>).some(v =>
      typeof v === 'string' && v.toLowerCase().includes(q)
    )
  )
}

export function useCrud<T>({ fetchFn, pageSize = 10 }: UseCrudOptions<T>): UseCrudReturn<T> {
  const [allItems, setAllItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [search, setSearchState] = useState('')
  const [fetchKey, setFetchKey] = useState(0)

  const setSearch = useCallback((s: string) => {
    setSearchState(s)
    setPage(0)
  }, [])

  const refetch = useCallback(() => setFetchKey(k => k + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    ;(async () => {
      try {
        const res = await fetchFn({ page: 0, size: 10000 })
        if (cancelled) return
        const d = res.data
        if (Array.isArray(d))  setAllItems(d)
        else if (d?.content)   setAllItems(d.content)
        else if (d?.items)     setAllItems(d.items)
        else                   setAllItems(d ? [d] : [])
      } catch {
        if (!cancelled) {
          setError("Ma'lumotlarni yuklashda xatolik yuz berdi")
          setAllItems([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
    // fetchFn is a stable api reference — intentionally omitted from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey])

  const filteredItems = useMemo(() => {
    if (!search.trim()) return allItems
    return localFilter(allItems, search.toLowerCase())
  }, [allItems, search])

  const data = useMemo(
    () => filteredItems.slice(page * pageSize, (page + 1) * pageSize),
    [filteredItems, page, pageSize]
  )

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredItems.length / pageSize)),
    [filteredItems, pageSize]
  )

  return {
    data,
    total: filteredItems.length,
    loading,
    error,
    page,
    totalPages,
    search,
    setSearch,
    setPage,
    refetch,
  }
}
