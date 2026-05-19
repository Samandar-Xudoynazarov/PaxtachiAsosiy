import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { ExternalLink } from 'lucide-react'
import {
  cadastreApi, greenhouseApi, representativesApi, agroTechnicsApi,
} from '../../services/api'
import type {
  Farmer, CadastreRecord, GreenhouseRecord, FarmRepresentative, AgroTechnic,
} from '../../types'
import { formatNumber, formatDate } from '../../utils/helpers'

// ── Types ─────────────────────────────────────────────────────────────
type Tab = 'info' | 'cadastre' | 'greenhouse' | 'representative' | 'agro'

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'info',           label: 'Umumiy'     },
  { key: 'cadastre',       label: 'Kadastr'    },
  { key: 'greenhouse',     label: 'Issiqxona'  },
  { key: 'representative', label: 'Vakil'      },
  { key: 'agro',           label: 'Agrotexnika'},
]

const AREA_FIELDS: Array<{ key: keyof Farmer; label: string; color: string }> = [
  { key: 'totalArea',       label: 'Umumiy maydon',  color: '#6366f1' },
  { key: 'irrigatedArea',   label: "Sug'oriladigan", color: '#10b981' },
  { key: 'cottonArea',      label: "G'o'za",         color: '#f59e0b' },
  { key: 'wheatArea',       label: "Bug'doy",        color: '#eab308' },
  { key: 'greenhouseArea',  label: 'Issiqxona',      color: '#22c55e' },
  { key: 'lalmiArea',       label: 'Lalmi',          color: '#f97316' },
  { key: 'orchardArea',     label: "Bog'",           color: '#ec4899' },
  { key: 'grapeArea',       label: 'Uzum',           color: '#a855f7' },
  { key: 'poplarArea',      label: 'Terak',          color: '#14b8a6' },
  { key: 'otherTreeArea',   label: 'Boshqa daraxt',  color: '#84cc16' },
  { key: 'pastureArea',     label: 'Yaylov',         color: '#15803d' },
  { key: 'hayfieldArea',    label: 'Xashakzor',      color: '#ca8a04' },
  { key: 'meliorationArea', label: 'Meliorasiya',    color: '#06b6d4' },
  { key: 'pondArea',        label: 'Hovuz',          color: '#3b82f6' },
  { key: 'reservoirArea',   label: 'Suv ombori',     color: '#0284c7' },
  { key: 'canalArea',       label: 'Kanal',          color: '#1d4ed8' },
  { key: 'houseArea',       label: 'Uy',             color: '#f87171' },
  { key: 'yardArea',        label: 'Hovli',          color: '#fb923c' },
  { key: 'buildingArea',    label: 'Bino',           color: '#64748b' },
  { key: 'otherArea',       label: 'Boshqa',         color: '#94a3b8' },
]

// ── Small helpers ──────────────────────────────────────────────────────
const InfoRow: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
    <span className="text-sm font-semibold text-slate-700">{value != null && value !== '' ? value : '—'}</span>
  </div>
)

const LinkedInfoRow: React.FC<{ label: string; value?: string | null; to: string }> = ({ label, value, to }) => {
  const navigate = useNavigate()
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
      {value ? (
        <button
          onClick={() => navigate(to)}
          className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
        >
          {value}
          <ExternalLink size={11} />
        </button>
      ) : (
        <span className="text-sm font-semibold text-slate-300">—</span>
      )}
    </div>
  )
}

const Skeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div className="space-y-2 mt-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton h-8 w-full rounded-xl" />
    ))}
  </div>
)

const EmptyTab: React.FC<{ label: string }> = ({ label }) => (
  <div className="text-center py-12 text-slate-400">
    <p className="text-sm">{label} bo'yicha ma'lumot topilmadi</p>
  </div>
)

// ── Main component ─────────────────────────────────────────────────────
const FarmerDetail: React.FC<{ farmer: Farmer }> = ({ farmer }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('info')

  // Lazy-loaded related data: null = not fetched, [] = fetched (empty)
  const [cadastre, setCadastre]       = useState<CadastreRecord[] | null>(null)
  const [cadastreLoading, setCadastreLoading] = useState(false)
  const [greenhouse, setGreenhouse]   = useState<GreenhouseRecord[] | null>(null)
  const [ghLoading, setGhLoading]     = useState(false)
  const [reprs, setReprs]             = useState<FarmRepresentative[] | null>(null)
  const [reprsLoading, setReprsLoading] = useState(false)
  const [agro, setAgro]               = useState<AgroTechnic[] | null>(null)
  const [agroLoading, setAgroLoading] = useState(false)

  const farmerNameLower = farmer.name?.toLowerCase() || ''
  const farmerStir = farmer.stir || ''

  const handleTab = useCallback((tab: Tab) => {
    setActiveTab(tab)

    if (tab === 'cadastre' && cadastre === null && !cadastreLoading) {
      setCadastreLoading(true)
      cadastreApi.getAll({ size: 10000 }).then(res => {
        const all: CadastreRecord[] = Array.isArray(res.data) ? res.data : res.data?.content ?? []
        // cadastreNumber (6-part) and farmer.cadastralNumber (3-part) use different formats
        // No reliable match possible — backend needs stir field in cadastre entity
        setCadastre(all.filter(() => false))
      }).catch(() => setCadastre([])).finally(() => setCadastreLoading(false))
    }

    if (tab === 'greenhouse' && greenhouse === null && !ghLoading) {
      setGhLoading(true)
      greenhouseApi.getAll({ size: 10000 }).then(res => {
        const all: GreenhouseRecord[] = Array.isArray(res.data) ? res.data : res.data?.content ?? []
        // Greenhouse uses jshshir (14-digit personal ID), farmer uses stir (9-digit legal ID)
        // No direct link possible — show empty
        setGreenhouse(all.filter(() => false))
      }).catch(() => setGreenhouse([])).finally(() => setGhLoading(false))
    }

    if (tab === 'representative' && reprs === null && !reprsLoading) {
      setReprsLoading(true)
      representativesApi.getAll({ size: 10000 }).then(res => {
        const all: FarmRepresentative[] = Array.isArray(res.data) ? res.data : res.data?.content ?? []
        // Link: representative.inn === farmer.stir
        const stirStr = farmerStir.trim()
        setReprs(
          stirStr
            ? all.filter(r => String(r.inn ?? '').trim() === stirStr)
            : []
        )
      }).catch(() => setReprs([])).finally(() => setReprsLoading(false))
    }

    if (tab === 'agro' && agro === null && !agroLoading) {
      setAgroLoading(true)
      agroTechnicsApi.getAll({ size: 10000 }).then(res => {
        const all: AgroTechnic[] = Array.isArray(res.data) ? res.data : res.data?.content ?? []
        // Link: agro.inn === farmer.stir
        const stirStr = farmerStir.trim()
        setAgro(
          stirStr
            ? all.filter(r => String(r.inn ?? '').trim() === stirStr)
            : []
        )
      }).catch(() => setAgro([])).finally(() => setAgroLoading(false))
    }
  }, [farmer, cadastre, greenhouse, reprs, agro, cadastreLoading, ghLoading, reprsLoading, agroLoading, farmerStir])

  // ── Info tab helpers ─────────────────────────────────────────────
  const get = (key: keyof Farmer) => (farmer[key] as number | null) ?? 0
  const indivMax = Math.max(...AREA_FIELDS.filter(f => f.key !== 'totalArea').map(f => get(f.key)), 1)

  const irrigated = get('irrigatedArea')
  const nonIrrig  = Math.max(0, get('totalArea') - irrigated)
  const pieData = [
    { name: "Sug'oriladigan",   value: irrigated, color: '#10b981' },
    { name: "Sug'orilmaydigan", value: nonIrrig,  color: '#6366f1' },
  ].filter(d => d.value > 0)

  const barData = AREA_FIELDS
    .filter(f => f.key !== 'totalArea')
    .map(f => ({ name: f.label, value: get(f.key), color: f.color }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value)

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="space-y-4 pb-4">

      {/* Header */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md">
          {farmer.name?.[0]?.toUpperCase() || 'F'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-slate-800 text-base leading-tight">{farmer.name}</p>
          <button
            onClick={() => navigate(`/farmers?q=${farmer.stir}`)}
            className="text-xs text-primary-500 hover:underline mt-0.5 inline-flex items-center gap-1"
          >
            STIR: {farmer.stir || '—'} <ExternalLink size={10} />
          </button>
        </div>
        <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
          farmer.deleted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
        }`}>
          {farmer.deleted ? 'Nofaol' : 'Faol'}
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => handleTab(t.key)}
            className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === t.key
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: UMUMIY ────────────────────────────────────────── */}
      {activeTab === 'info' && (
        <div className="space-y-5">
          {/* Asosiy ma'lumotlar */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Asosiy ma'lumotlar</p>
            <div className="rounded-xl border border-slate-100 px-3 py-1">
              <InfoRow label="Ferma turi"     value={farmer.farmType} />
              <InfoRow label="Ixtisoslik"     value={farmer.specialization} />
              <InfoRow label="Haq turi"       value={farmer.rightType} />
              <LinkedInfoRow
                label="Kadastr raqami"
                value={farmer.cadastralNumber || null}
                to={`/cadastre?q=${farmer.cadastralNumber}`}
              />
              <InfoRow label="Mavsum"         value={farmer.season} />
              <InfoRow label="Ro'yxat sanasi" value={formatDate(farmer.createdAt || '')} />
              <InfoRow label="Yangilangan"    value={farmer.updatedAt ? formatDate(farmer.updatedAt) : null} />
            </div>
          </div>

          {/* Balans kartalar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-indigo-50 p-4 text-center">
              <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide mb-1">Umumiy maydon</p>
              <p className="font-display font-bold text-2xl text-indigo-700">{formatNumber(get('totalArea'))}</p>
              <p className="text-xs text-indigo-400 mt-0.5">ga</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wide mb-1">Umumiy balans</p>
              <p className="font-display font-bold text-2xl text-emerald-700">{formatNumber(get('totalBalance'))}</p>
              <p className="text-xs text-emerald-400 mt-0.5">ga</p>
            </div>
          </div>

          {/* Donut */}
          {pieData.length >= 2 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sug'orish taqsimoti</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} dataKey="value" paddingAngle={3}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: unknown) => [`${formatNumber(v as number)} ga`, '']} />
                  <Legend formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Progress bars */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Yer maydonlari (ga)</p>
            <div className="space-y-1.5">
              {AREA_FIELDS.map(({ key, label, color }) => {
                const val = get(key)
                const pct = key === 'totalArea' ? 100 : indivMax > 0 ? (val / indivMax) * 100 : 0
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 w-36 shrink-0">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-xs text-slate-500 truncate">{label}</span>
                    </div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(pct, val > 0 ? 2 : 0)}%`, backgroundColor: color }} />
                    </div>
                    <span className="text-xs font-bold tabular-nums w-14 text-right" style={{ color: val > 0 ? '#1e293b' : '#cbd5e1' }}>
                      {formatNumber(val)}
                    </span>
                  </div>
                )
              })}
              <div className="flex items-center gap-2 pt-2 mt-1 border-t-2 border-slate-200">
                <div className="flex items-center gap-1.5 w-36 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Umumiy balans</span>
                </div>
                <div className="flex-1" />
                <span className="text-xs font-bold tabular-nums w-14 text-right text-slate-800">
                  {formatNumber(get('totalBalance'))}
                </span>
              </div>
            </div>
          </div>

          {/* Bar chart */}
          {barData.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Eng ko'p maydonlar</p>
              <ResponsiveContainer width="100%" height={Math.max(100, barData.length * 28)}>
                <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 36, left: 84, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={82} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(v: unknown) => [`${formatNumber(v as number)} ga`, '']} />
                  <Bar dataKey="value" radius={[0, 5, 5, 0]} barSize={14}>
                    {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: KADASTR ───────────────────────────────────────── */}
      {activeTab === 'cadastre' && (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Bog'liq kadastr yozuvlari
          </p>
          {!cadastreLoading && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 mb-3">
              <p className="text-xs text-amber-700 font-medium">
                Fermer kadastr raqami (<span className="font-mono">{farmer.cadastralNumber || '—'}</span>) va kadastr bazasi formati mos kelmaydi — backend kadastr yozuviga STIR field qo'shilsa bog'lash mumkin bo'ladi.
              </p>
            </div>
          )}
          {cadastreLoading && <Skeleton />}
          {!cadastreLoading && cadastre !== null && cadastre.length === 0 && (
            <EmptyTab label="Kadastr" />
          )}
          {!cadastreLoading && cadastre && cadastre.length > 0 && (
            <div className="space-y-2">
              {cadastre.map(r => (
                <div key={r.id} className="rounded-xl border border-slate-100 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 truncate">{r.farmName || '—'}</span>
                    <span className="text-xs text-slate-400">{r.landType || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/cadastre?q=${r.cadastreNumber}`)}
                      className="text-xs font-mono text-primary-600 hover:underline flex items-center gap-0.5"
                    >
                      {r.cadastreNumber || '—'} <ExternalLink size={10} />
                    </button>
                    <span className="text-xs font-semibold text-slate-700">{formatNumber(r.area ?? 0)} ga</span>
                  </div>
                  {r.contourNumber && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">Kontur:</span>
                      <button
                        onClick={() => navigate(`/land-contours?q=${r.contourNumber}`)}
                        className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-0.5"
                      >
                        {r.contourNumber} <ExternalLink size={10} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {cadastre === null && !cadastreLoading && (
            <EmptyTab label="Kadastr" />
          )}
        </div>
      )}

      {/* ── TAB: ISSIQXONA ─────────────────────────────────────── */}
      {activeTab === 'greenhouse' && (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Bog'liq issiqxona yozuvlari
          </p>
          {!ghLoading && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 mb-3">
              <p className="text-xs text-amber-700 font-medium">
                Issiqxona yozuvlari shaxsiy ID (JShShIR) bilan bog'langan — fermer STIR bilan to'g'ridan bog'lash mumkin emas.
              </p>
            </div>
          )}
          {ghLoading && <Skeleton />}
          {!ghLoading && greenhouse !== null && greenhouse.length === 0 && (
            <EmptyTab label="Issiqxona" />
          )}
          {!ghLoading && greenhouse && greenhouse.length > 0 && (
            <div className="space-y-2">
              {greenhouse.map(r => (
                <div key={r.id} className="rounded-xl border border-slate-100 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 truncate">{r.ownerName || '—'}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{r.cropName || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Issiqxona: <strong className="text-slate-700">{formatNumber(r.greenhouseArea ?? 0)} ga</strong></span>
                    <span>Umumiy: <strong className="text-slate-700">{formatNumber(r.totalArea ?? 0)} ga</strong></span>
                  </div>
                  {r.contourNumber && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">Kontur:</span>
                      <button
                        onClick={() => navigate(`/land-contours?q=${r.contourNumber}`)}
                        className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-0.5"
                      >
                        {r.contourNumber} <ExternalLink size={10} />
                      </button>
                    </div>
                  )}
                  {r.phoneNumber && (
                    <p className="text-xs text-slate-400">Tel: {r.phoneNumber}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: VAKIL ─────────────────────────────────────────── */}
      {activeTab === 'representative' && (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Bog'liq vakillar
          </p>
          {reprsLoading && <Skeleton />}
          {!reprsLoading && reprs !== null && reprs.length === 0 && (
            <EmptyTab label="Vakil" />
          )}
          {!reprsLoading && reprs && reprs.length > 0 && (
            <div className="space-y-2">
              {reprs.map(r => (
                <div key={r.id} className="rounded-xl border border-slate-100 px-3 py-1">
                  <InfoRow label="Ferma nomi"         value={r.farmName} />
                  <InfoRow label="Fermer F.I.O"       value={r.farmerFullName} />
                  <InfoRow label="Fermer tel"          value={r.farmerPhone} />
                  <InfoRow label="Yer boshqaruvchi"   value={r.landManagerFullName} />
                  <InfoRow label="Boshqaruvchi tel"   value={r.landManagerPhone} />
                  <InfoRow label="Faoliyat turi"      value={r.activityType} />
                  <InfoRow label="Chorva soni"        value={r.livestockCount} />
                  <LinkedInfoRow
                    label="INN"
                    value={r.inn || null}
                    to={`/farmers?q=${r.inn}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: AGROTEXNIKA ───────────────────────────────────── */}
      {activeTab === 'agro' && (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Bog'liq agrotexnikalar
          </p>
          {agroLoading && <Skeleton />}
          {!agroLoading && agro !== null && agro.length === 0 && (
            <EmptyTab label="Agrotexnika" />
          )}
          {!agroLoading && agro && agro.length > 0 && (
            <div className="space-y-2">
              {agro.map(r => (
                <div key={r.id} className="rounded-xl border border-slate-100 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 truncate">{r.ownerName || '—'}</span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{r.productionYear || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{r.technicType || '—'}</span>
                    <span className="font-semibold text-slate-700">{r.model || '—'}</span>
                  </div>
                  {r.inn != null && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">INN:</span>
                      <button
                        onClick={() => navigate(`/farmers?q=${String(r.inn).trim()}`)}
                        className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-0.5"
                      >
                        {String(r.inn)} <ExternalLink size={10} />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2 text-xs text-slate-400">
                    {r.engineNumber && <span>Dvigatel: {r.engineNumber}</span>}
                    {r.chassisNumber && <span>Shassi: {r.chassisNumber}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FarmerDetail
