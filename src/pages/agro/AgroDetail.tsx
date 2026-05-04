import React from 'react'
import { Truck, User, MapPin, Settings } from 'lucide-react'
import type { AgroTechnic } from '../../types'

const InfoItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div className="space-y-0.5">
    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-slate-700">{value != null && value !== '' ? value : '—'}</p>
  </div>
)

const AgroDetail: React.FC<{ technic: AgroTechnic }> = ({ technic }) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-primary-50 p-5 flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shrink-0 shadow-md">
        <Truck size={24} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="font-display font-bold text-slate-800 text-base leading-tight truncate">
          {technic.model || '—'}
        </p>
        <p className="text-sm text-slate-500 mt-0.5">{technic.technicType || '—'}</p>
        {technic.productionYear && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-white rounded-full text-xs font-semibold text-primary-700 shadow-sm">
            {technic.productionYear}
          </span>
        )}
      </div>
    </div>

    {/* Owner info */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <User size={14} className="text-primary-600" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Egasi haqida</p>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <InfoItem label="Fermer nomi"    value={technic.ownerName} />
        <InfoItem label="Mulkchilik turi" value={technic.ownershipType} />
        <InfoItem label="INN"            value={technic.inn} />
        <InfoItem label="Tuman"          value={technic.district} />
      </div>
    </div>

    {/* Location */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={14} className="text-accent-600" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Joylashuv</p>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <InfoItem label="Viloyat kodi" value={technic.regionCode} />
        <InfoItem label="Ish turi"     value={technic.workType} />
      </div>
    </div>

    {/* Technical specs */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Settings size={14} className="text-slate-500" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Texnik ma'lumotlar</p>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <InfoItem label="Dvigatel raqami" value={technic.engineNumber} />
        <InfoItem label="Dvigatel quvvati" value={technic.enginePower} />
        <InfoItem label="Shassi raqami"   value={technic.chassisNumber} />
        <InfoItem label="Rang"            value={technic.color} />
      </div>
    </div>

    {/* Plate number */}
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Davlat raqami</p>
      <div className="flex items-center gap-3">
        <div className="flex-1 rounded-xl bg-white border-2 border-slate-200 px-4 py-3 text-center shadow-sm">
          <p className="text-xs text-slate-400 mb-0.5">Seriya</p>
          <p className="font-display font-bold text-xl text-slate-800">{technic.series || '—'}</p>
        </div>
        <span className="text-slate-300 font-bold text-2xl">·</span>
        <div className="flex-1 rounded-xl bg-white border-2 border-slate-200 px-4 py-3 text-center shadow-sm">
          <p className="text-xs text-slate-400 mb-0.5">Raqam</p>
          <p className="font-display font-bold text-xl text-slate-800">{technic.number || '—'}</p>
        </div>
      </div>
    </div>
  </div>
)

export default AgroDetail
