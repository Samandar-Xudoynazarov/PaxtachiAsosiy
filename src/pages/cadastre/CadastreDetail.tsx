import React from 'react'
import { MapPin, FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import type { CadastreRecord } from '../../types'
import { formatNumber } from '../../utils/helpers'

const InfoItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div className="space-y-0.5">
    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-slate-700">{value != null && value !== '' ? value : '—'}</p>
  </div>
)

const CadastreDetail: React.FC<{ record: CadastreRecord }> = ({ record }) => {
  const isRegistered =
    record.cadastralRegistered != null &&
    record.cadastralRegistered !== '' &&
    record.cadastralRegistered !== 'false' &&
    record.cadastralRegistered !== '0'

  const hasProblem =
    record.problem != null &&
    record.problem !== '' &&
    record.problem !== 'false' &&
    record.problem !== '0'

  return (
    <div className="space-y-6">
      {/* Area hero */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 p-5 text-center">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Umumiy maydon</p>
        <p className="font-display font-bold text-4xl text-slate-800">
          {record.area != null ? formatNumber(record.area) : '—'}
          <span className="text-lg font-normal text-slate-400 ml-2">ga</span>
        </p>
        {record.landType && (
          <span className="inline-block mt-2 px-3 py-1 bg-white rounded-full text-xs font-semibold text-primary-700 shadow-sm">
            {record.landType}
          </span>
        )}
      </div>

      {/* Location */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={14} className="text-primary-600" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Joylashuv</p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <InfoItem label="Viloyat"  value={record.regionName} />
          <InfoItem label="Tuman"    value={record.districtName} />
          <InfoItem label="Mahalla"  value={record.neighborhoodName} />
          <InfoItem label="Fermer"   value={record.farmName} />
        </div>
      </div>

      {/* Land details */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText size={14} className="text-accent-600" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Yer ma'lumotlari</p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <InfoItem label="Kontur raqami"  value={record.contourNumber} />
          <InfoItem label="Kadastr raqami" value={record.cadastreNumber} />
          <InfoItem label="Yer raqami"     value={record.landNumber} />
          <InfoItem label="Yer turi"       value={record.landType} />
        </div>
      </div>

      {/* Registration status */}
      <div className="rounded-xl border border-slate-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          {isRegistered
            ? <CheckCircle size={16} className="text-green-500" />
            : <XCircle    size={16} className="text-red-400" />}
          <p className="text-sm font-semibold text-slate-700">Kadastr ro'yxatga olish</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isRegistered
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-600'
        }`}>
          {isRegistered ? "Ro'yxatga olingan" : "Ro'yxatga olinmagan"}
        </span>
        {record.notRegisteredReason && (
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">{record.notRegisteredReason}</p>
        )}
      </div>

      {/* Problem */}
      {hasProblem && (
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-amber-600" />
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Muammo</p>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">
            {record.problemDescription || record.problem}
          </p>
        </div>
      )}
    </div>
  )
}

export default CadastreDetail
