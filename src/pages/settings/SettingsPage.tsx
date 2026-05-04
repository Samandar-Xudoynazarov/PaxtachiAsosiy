import React, { useState } from 'react'
import { Save, User, Lock, Bell, Globe } from 'lucide-react'
import { PageHeader } from '../../components/ui'
import { useAuth } from '../../utils/AuthContext'

const SettingsPage: React.FC = () => {
  const { user } = useAuth()
  const [tab, setTab] = useState('profile')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { key: 'profile', label: 'Profil', icon: <User size={16} /> },
    { key: 'security', label: 'Xavfsizlik', icon: <Lock size={16} /> },
    { key: 'notifications', label: 'Bildirishnomalar', icon: <Bell size={16} /> },
    { key: 'system', label: 'Tizim', icon: <Globe size={16} /> },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Sozlamalar" subtitle="Tizim va foydalanuvchi sozlamalari" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-56 shrink-0">
          <div className="card p-2 space-y-0.5">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === t.key ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 card">
          {tab === 'profile' && (
            <div>
              <h3 className="font-display font-bold text-slate-800 mb-6">Profil ma'lumotlari</h3>
              <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-xl">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{user?.username}</p>
                  <p className="text-sm text-slate-500">{user?.direction || 'Administrator'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Foydalanuvchi nomi</label>
                  <input className="input-field" defaultValue={user?.username} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bo'lim / Yo'nalish</label>
                  <input className="input-field" defaultValue={user?.direction} />
                </div>
              </div>
            </div>
          )}
          {tab === 'security' && (
            <div>
              <h3 className="font-display font-bold text-slate-800 mb-6">Xavfsizlik sozlamalari</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Joriy parol</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Yangi parol</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Yangi parolni tasdiqlang</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
              </div>
            </div>
          )}
          {tab === 'notifications' && (
            <div>
              <h3 className="font-display font-bold text-slate-800 mb-6">Bildirishnoma sozlamalari</h3>
              <div className="space-y-4">
                {["Yangi fermer qo'shilganda", "Texnika ta'mirga ketganda", "Excel import tugaganda", "Tizim xatoliklari"].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:bg-primary-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'system' && (
            <div>
              <h3 className="font-display font-bold text-slate-800 mb-6">Tizim sozlamalari</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Til</label>
                  <select className="input-field">
                    <option value="uz">O'zbek tili</option>
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vaqt mintaqasi</label>
                  <select className="input-field">
                    <option>Asia/Tashkent (UTC+5)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sahifadagi yozuvlar soni</label>
                  <select className="input-field">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">
            <button onClick={handleSave} className="btn-primary">
              <Save size={16} />
              {saved ? 'Saqlandi!' : 'Saqlash'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
