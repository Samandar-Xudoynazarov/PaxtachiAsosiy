import React, { useState } from 'react'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react'
import { farmersApi, agroTechnicsApi, pumpApi } from '../../services/api'
import { PageHeader } from '../../components/ui'

interface ImportOption {
  key: string
  label: string
  description: string
  color: string
  fn: (file: File) => Promise<unknown>
}

const options: ImportOption[] = [
  { key: 'farmers', label: 'Fermerlar', description: "Fermerlar ro'yxatini Excel orqali yuklash", color: 'from-primary-500 to-primary-700', fn: farmersApi.upload },
  { key: 'agro', label: 'Agro texnikalar', description: 'Texnika parkini Excel orqali yuklash', color: 'from-accent-500 to-accent-700', fn: agroTechnicsApi.importExcel },
  { key: 'pump', label: 'Nasos stansiyalari', description: "Nasos ma'lumotlarini Excel orqali yuklash", color: 'from-cyan-500 to-cyan-700', fn: pumpApi.importExcel },
]

const ExcelImportPage: React.FC = () => {
  const [statuses, setStatuses] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({})

  const handleFile = async (opt: ImportOption, file: File) => {
    setStatuses(p => ({ ...p, [opt.key]: 'loading' }))
    try {
      await opt.fn(file)
      setStatuses(p => ({ ...p, [opt.key]: 'success' }))
      setTimeout(() => setStatuses(p => ({ ...p, [opt.key]: 'idle' })), 3000)
    } catch {
      setStatuses(p => ({ ...p, [opt.key]: 'error' }))
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Excel import" subtitle="Ma'lumotlarni Excel fayl orqali yuklash" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {options.map((opt) => {
          const status = statuses[opt.key] || 'idle'
          return (
            <label
              key={opt.key}
              className={`card cursor-pointer group transition-all duration-200 hover:shadow-card-hover border-2 ${
                status === 'success' ? 'border-green-300 bg-green-50' :
                status === 'error' ? 'border-red-300 bg-red-50' :
                'border-transparent hover:border-slate-200'
              }`}
            >
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                disabled={status === 'loading'}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(opt, f); e.target.value = '' }}
              />
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${opt.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform`}>
                {status === 'loading' ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : status === 'success' ? (
                  <CheckCircle className="w-7 h-7 text-white" />
                ) : status === 'error' ? (
                  <AlertCircle className="w-7 h-7 text-white" />
                ) : (
                  <FileSpreadsheet className="w-7 h-7 text-white" />
                )}
              </div>
              <h3 className="font-display font-bold text-slate-800 mb-1">{opt.label}</h3>
              <p className="text-sm text-slate-500 mb-4">{opt.description}</p>
              {status === 'success' && <p className="text-sm text-green-600 font-medium">✓ Muvaffaqiyatli yuklandi!</p>}
              {status === 'error' && <p className="text-sm text-red-600 font-medium">✗ Yuklashda xatolik yuz berdi</p>}
              {status === 'idle' && (
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 group-hover:text-primary-600 transition-colors">
                  <Upload size={15} />
                  Excel faylni tanlang
                </div>
              )}
            </label>
          )
        })}
      </div>

      <div className="card mt-6 bg-amber-50 border border-amber-200">
        <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
          <AlertCircle size={16} /> Muhim eslatma
        </h4>
        <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
          <li>Faqat .xlsx, .xls va .csv formatidagi fayllar qabul qilinadi</li>
          <li>Fayl hajmi 10 MB dan oshmasligi kerak</li>
          <li>Ustun nomlari to'g'ri tartibda bo'lishi shart</li>
          <li>Yuklashdan oldin namuna shablonni yuklab oling</li>
        </ul>
      </div>
    </div>
  )
}

export default ExcelImportPage
