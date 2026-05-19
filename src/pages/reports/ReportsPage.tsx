import React, { useState } from 'react'
import { FileText, FileSpreadsheet, Download, Eye, Clock, CheckCircle, Edit3, Plus, Search } from 'lucide-react'
import { PageHeader } from '../../components/ui'

interface Report {
  id: number
  title: string
  date: string
  author: string
  type: 'Excel' | 'PDF'
  status: 'ready' | 'pending'
  size: string
}

interface Order {
  id: number
  number: string
  title: string
  date: string
  signedBy: string
  status: 'active' | 'draft'
  pages: number
}

const MOCK_REPORTS: Report[] = [
  { id: 1, title: "2024-yil 1-chorak fermer xo'jaliklari hisoboti", date: '01.04.2024', author: 'Toshmatov A.B.', type: 'Excel', status: 'ready', size: '1.2 MB' },
  { id: 2, title: "Ixtisosliklar bo'yicha yillik hisobot — 2023", date: '15.01.2024', author: 'Rahimov B.S.', type: 'PDF', status: 'ready', size: '840 KB' },
  { id: 3, title: "Yer maydonlari bo'yicha 2024-yil hisoboti", date: '20.03.2024', author: 'Karimov S.T.', type: 'Excel', status: 'pending', size: '—' },
  { id: 4, title: 'Nasos stansiyalari ishlash ko\'rsatkichlari', date: '10.02.2024', author: 'Yusupov M.O.', type: 'PDF', status: 'ready', size: '560 KB' },
  { id: 5, title: "Issiqxona fermerchilik hisoboti — 2024", date: '05.05.2024', author: 'Nazarov J.R.', type: 'Excel', status: 'pending', size: '—' },
]

const MOCK_ORDERS: Order[] = [
  { id: 1, number: '01-2024', title: "Fermer xo'jaliklarini ro'yxatga olish tartibini takomillashtirish to'g'risida", date: '10.01.2024', signedBy: 'Tuman hokimi', status: 'active', pages: 4 },
  { id: 2, number: '05-2024', title: "Agrotexnik ishlar tartibini belgilash va nazorat qilish to'g'risida buyruq", date: '15.02.2024', signedBy: "Qishloq xo'jaligi boshqarmasi", status: 'active', pages: 6 },
  { id: 3, number: '12-2024', title: "Sug'orish me'yorlari va nasos stansiyalari foydalanish tartibini tasdiqlash", date: '01.03.2024', signedBy: 'Tuman hokimi', status: 'active', pages: 3 },
  { id: 4, number: '18-2024', title: "Issiqxona fermerchiligini rivojlantirish dasturini tasdiqlash to'g'risida", date: '05.04.2024', signedBy: 'Viloyat hokimi', status: 'draft', pages: 8 },
  { id: 5, number: '22-2024', title: "Yer uchastkalarini kadastr ro'yxatidan o'tkazish muddatlarini uzaytirish", date: '20.04.2024', signedBy: 'Tuman hokimi', status: 'draft', pages: 2 },
]

const ReportsPage: React.FC = () => {
  const [tab, setTab] = useState<'reports' | 'orders'>('reports')
  const [search, setSearch] = useState('')

  const filteredReports = MOCK_REPORTS.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.author.toLowerCase().includes(search.toLowerCase())
  )
  const filteredOrders = MOCK_ORDERS.filter(o =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.number.toLowerCase().includes(search.toLowerCase()) ||
    o.signedBy.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Hisobotlar va Buyruqlar"
        subtitle="Rasmiy hujjatlar va hisobotlar ro'yxati"
        actions={
          <button className="btn-primary text-sm">
            <Plus size={16} /> Yangi hujjat
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Jami hisobotlar", value: MOCK_REPORTS.length, sub: `${MOCK_REPORTS.filter(r => r.status === 'ready').length} ta tayyor`, color: 'bg-blue-50 text-blue-600' },
          { label: "Tayyor hisobotlar", value: MOCK_REPORTS.filter(r => r.status === 'ready').length, sub: "yuklab olish mumkin", color: 'bg-green-50 text-green-600' },
          { label: "Jami buyruqlar", value: MOCK_ORDERS.length, sub: `${MOCK_ORDERS.filter(o => o.status === 'active').length} ta faol`, color: 'bg-purple-50 text-purple-600' },
          { label: "Loyiha buyruqlar", value: MOCK_ORDERS.filter(o => o.status === 'draft').length, sub: "imzolash kutilmoqda", color: 'bg-amber-50 text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="card">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${stat.color}`}>
              <FileText size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-sm font-medium text-slate-600 mt-0.5">{stat.label}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-slate-100">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTab('reports')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'reports' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Hisobotlar ({MOCK_REPORTS.length})
            </button>
            <button
              onClick={() => setTab('orders')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'orders' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Buyruqlar ({MOCK_ORDERS.length})
            </button>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input-field pl-9 py-2 text-sm w-64"
              placeholder="Qidirish…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {tab === 'reports' ? (
          <div className="divide-y divide-slate-100">
            {filteredReports.length === 0 ? (
              <p className="text-center text-slate-400 py-12 text-sm">Hisobot topilmadi</p>
            ) : filteredReports.map(report => (
              <div key={report.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${report.type === 'Excel' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {report.type === 'Excel' ? <FileSpreadsheet size={20} /> : <FileText size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{report.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">{report.date}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{report.author}</span>
                    {report.size !== '—' && (
                      <>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-400">{report.size}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {report.status === 'ready' ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      <CheckCircle size={12} /> Tayyor
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                      <Clock size={12} /> Tayyorlanmoqda
                    </span>
                  )}
                  {report.status === 'ready' && (
                    <>
                      <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Ko'rish">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Yuklab olish">
                        <Download size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-slate-400 py-12 text-sm">Buyruq topilmadi</p>
            ) : filteredOrders.map(order => (
              <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Edit3 size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">#{order.number}</span>
                    <span className="text-xs text-slate-400">{order.pages} bet</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 truncate">{order.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">{order.date}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{order.signedBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {order.status === 'active' ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      <CheckCircle size={12} /> Faol
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      <Clock size={12} /> Loyiha
                    </span>
                  )}
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Ko'rish">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Yuklab olish">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportsPage
