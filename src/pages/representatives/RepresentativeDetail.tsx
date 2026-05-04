import React from 'react'
import { Users, Phone, Briefcase } from 'lucide-react'
import type { FarmRepresentative } from '../../types'
import { formatNumber } from '../../utils/helpers'

const InfoRow: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
    <span className="text-sm font-semibold text-slate-700 text-right max-w-[60%] break-words">
      {value != null && value !== '' ? value : '—'}
    </span>
  </div>
)

const RepresentativeDetail: React.FC<{ record: FarmRepresentative }> = ({ record }) => {
  return (
    <div className="space-y-6 pb-4">

      {/* Header */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
          <Users size={26} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-slate-800 text-base leading-tight">
            {record.farmName || '—'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">ID: {record.id}</p>
          {record.activityType && (
            <p className="text-xs text-violet-600 font-medium mt-0.5">{record.activityType}</p>
          )}
        </div>
      </div>

      {/* Livestock card */}
      {record.livestockCount != null && (
        <div className="rounded-xl bg-amber-50 p-4 text-center">
          <p className="text-xs text-amber-400 font-semibold uppercase tracking-wide mb-1">Chorva soni</p>
          <p className="font-display font-bold text-3xl text-amber-700">{formatNumber(record.livestockCount)}</p>
          <p className="text-xs text-amber-400 mt-0.5">bosh</p>
        </div>
      )}

      {/* Farmer info */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Fermer ma'lumotlari</p>
        <div className="rounded-xl border border-slate-100 px-3 py-1">
          <InfoRow label="Xo'jalik nomi" value={record.farmName} />
          <InfoRow label="F.I.O"          value={record.farmerFullName} />
          <InfoRow label="INN"            value={record.inn} />
          <InfoRow label="Faoliyat turi"  value={record.activityType} />
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-xs text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Phone size={12} /> Telefon
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {record.farmerPhone || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Land manager info */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Yer boshqaruvchi</p>
        <div className="rounded-xl border border-slate-100 px-3 py-1">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-xs text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Briefcase size={12} /> F.I.O
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {record.landManagerFullName || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Phone size={12} /> Telefon
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {record.landManagerPhone || '—'}
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default RepresentativeDetail
