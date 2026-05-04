import React from 'react'
import type { ModalProps, TableProps } from '../../types'
import { X, ChevronLeft, ChevronRight, Search, Inbox } from 'lucide-react'

// ─── Stat Card ────────────────────────────────────────────
interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  gradient: string
  trend?: { value: number; label: string }
  loading?: boolean
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon, gradient, trend, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="skeleton h-4 w-24 mb-4" />
        <div className="skeleton h-8 w-32 mb-2" />
        <div className="skeleton h-3 w-20" />
      </div>
    )
  }
  return (
    <div className="card hover:shadow-card-hover transition-shadow duration-200 group cursor-default">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        </div>
        <div className={`rounded-xl p-2.5 bg-gradient-to-br ${gradient} shadow-md group-hover:scale-110 transition-transform duration-200`}>
          <span className="text-white">{icon}</span>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="font-display text-3xl font-bold text-slate-800">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-sm font-medium text-slate-400 mb-1">{unit}</span>}
      </div>
      {trend && (
        <p className={`text-xs mt-2 font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} animate-scale-in max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-display font-bold text-slate-800 text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

// ─── Drawer ───────────────────────────────────────────────
interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, subtitle, children }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-lg leading-tight">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors ml-4 mt-0.5 shrink-0"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── Table ────────────────────────────────────────────────
export function Table<T extends object>({
  columns, data, loading, emptyText = "Ma'lumot topilmadi", onRowClick,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-full" />
        ))}
      </div>
    )
  }
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <Inbox className="w-12 h-12 mb-3 opacity-40" />
        <p className="font-medium">{emptyText}</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="table-header text-left px-4 py-3 whitespace-nowrap"
                style={{ width: col.width }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-slate-50 transition-colors ${
                onRowClick
                  ? 'cursor-pointer hover:bg-primary-50/60 active:bg-primary-100/60'
                  : 'hover:bg-slate-50/70'
              }`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-sm text-slate-700">
                  {col.render
                    ? col.render(row[col.key as keyof T], row, i)
                    : String(row[col.key as keyof T] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────
interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center gap-1 justify-end px-4 py-3 border-t border-slate-100">
      <button
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        const p = totalPages <= 5 ? i : Math.max(0, page - 2) + i
        if (p >= totalPages) return null
        return (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-sm'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            {p + 1}
          </button>
        )
      })}
      <button
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

// ─── Search Bar ───────────────────────────────────────────
interface SearchBarProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Qidirish…' }) => (
  <div className="relative">
    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-field pl-10 py-2 text-sm w-full min-w-[200px]"
    />
  </div>
)

// ─── Page Header ──────────────────────────────────────────
interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h2 className="font-display font-bold text-2xl text-slate-800">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
)

// ─── Status Badge ─────────────────────────────────────────
export const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  const s = status?.toLowerCase()
  const cls =
    s === 'active' || s === 'faol'
      ? 'bg-green-100 text-green-700 border-green-200'
      : s === 'inactive' || s === 'nofaol'
      ? 'bg-red-100 text-red-700 border-red-200'
      : 'bg-slate-100 text-slate-600 border-slate-200'
  return (
    <span className={`badge border ${cls}`}>
      {status || '—'}
    </span>
  )
}

// ─── Error Alert ──────────────────────────────────────────
export const ErrorAlert: React.FC<{ message?: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
      <span className="text-2xl">⚠️</span>
    </div>
    <p className="text-red-600 font-medium">{message || "Xatolik yuz berdi"}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary text-sm">
        Qayta urinish
      </button>
    )}
  </div>
)
