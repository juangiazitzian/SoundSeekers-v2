import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Music2, Mail, Lock, Eye, EyeOff, AlertCircle, ChevronRight } from 'lucide-react'
import { useStore } from '../store'

const DEMO_ACCOUNTS = [
  { label: 'Fan',          email: 'fan@demo.com',         role: '🎧' },
  { label: 'Artista',      email: 'artista@demo.com',     role: '🎵' },
  { label: 'Organizador',  email: 'organizador@demo.com', role: '🎪' },
]

export default function Login() {
  const { login, currentUser } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  if (currentUser) {
    navigate(from, { replace: true })
    return null
  }

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Completá todos los campos.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400)) // simulate async
    const result = login(form.email, form.password)
    setLoading(false)
    if (result.ok) {
      navigate(from, { replace: true })
    } else {
      setError(result.error)
    }
  }

  const loginDemo = (email) => {
    setForm({ email, password: 'demo123' })
    setError('')
    setTimeout(() => {
      const result = login(email, 'demo123')
      if (result.ok) navigate(from, { replace: true })
    }, 100)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
               style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}>
            <Music2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Bienvenido de vuelta</h1>
          <p className="text-sm text-white/40 mt-1">Ingresá a tu cuenta de SoundSeekers</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 space-y-5">

          {/* Demo accounts */}
          <div className="rounded-xl p-4 space-y-2"
               style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <p className="text-xs font-semibold text-brand-400 mb-3">Cuentas demo (clic para ingresar)</p>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => loginDemo(acc.email)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                <span className="flex items-center gap-2 text-white/70">
                  <span>{acc.role}</span>
                  <span className="font-medium">{acc.label}</span>
                  <span className="text-white/30 text-xs">{acc.email}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
              </button>
            ))}
            <p className="text-[11px] text-white/25 mt-1">Contraseña: <code className="text-brand-400">demo123</code></p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-white/25">o ingresá con tu cuenta</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="tu@email.com"
                  className="input-dark pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="••••••••"
                  className="input-dark pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm animate-slide-down"
                   style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center flex items-center gap-2 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-white/40 mt-5">
          ¿No tenés cuenta?{' '}
          <Link to="/registro" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Registrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
