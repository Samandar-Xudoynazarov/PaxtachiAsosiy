import React, { useState } from 'react'
import { useAuth } from '../../utils/AuthContext'
import { Eye, EyeOff, Leaf, Lock, User } from 'lucide-react'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
    } catch {
      setError("Login yoki parol noto'g'ri. Qayta urinib ko'ring.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-16 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-700">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute bottom-[-60px] left-[-60px] w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-[-40px] w-40 h-40 bg-white/10 rounded-full" />

        <div className="relative z-10 text-center text-white max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-2xl">
              <Leaf className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold mb-3 tracking-tight">Paxtachi</h1>
          <p className="text-xl font-medium text-white/80 mb-8">
            Qishloq xo'jaligi boshqaruv paneli
          </p>
          <div className="space-y-4 text-left">
            {[
              { icon: '🌾', label: 'Fermerlar va yer maydonlarini boshqarish' },
              { icon: '📊', label: "Agro texnikalar va statistika ko'rsatkichlari" },
              { icon: '💧', label: "Nasos stansiyalari va sug'orish nazorati" },
              { icon: '🏡', label: 'Issiqxona va kadastr yozuvlari' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-white/90 font-medium text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="bg-gradient-primary rounded-xl p-2.5">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-slate-800">Paxtachi</span>
          </div>

          <div className="card shadow-xl border-0 ring-1 ring-slate-100">
            <h2 className="font-display text-2xl font-bold text-slate-800 mb-1">Xush kelibsiz!</h2>
            <p className="text-slate-500 text-sm mb-8">Tizimga kirish uchun ma'lumotlaringizni kiriting</p>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Foydalanuvchi nomi
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="username"
                    className="input-field pl-10"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Parol</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-12"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Kirish…
                  </>
                ) : (
                  'Tizimga kirish'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">
            © 2024 Paxtachi — Qishloq xo'jaligi boshqaruv tizimi
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
