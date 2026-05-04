export const formatNumber = (n: number, decimals = 2): string => {
  if (n === null || n === undefined) return '—'
  return new Intl.NumberFormat('uz-UZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(n)
}

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const truncate = (str: string, len = 30): string =>
  str?.length > len ? str.slice(0, len) + '…' : str || '—'

export const statusColor = (status?: string): string => {
  const s = status?.toLowerCase()
  if (s === 'active' || s === 'faol') return 'bg-green-100 text-green-700'
  if (s === 'inactive' || s === 'nofaol') return 'bg-red-100 text-red-700'
  return 'bg-slate-100 text-slate-600'
}

export const getInitials = (name: string): string =>
  name
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || '?'
