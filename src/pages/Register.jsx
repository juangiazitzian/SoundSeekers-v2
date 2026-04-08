import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Music2, Mail, Lock, User, Eye, EyeOff, AlertCircle, Check } from 'lucide-react'
import { useStore } from '../store'

const ROLES = [
  {
    value: 'fan',
    icon: '🎧',
    label: 'Fan',
    desc: 'Descubrí eventos y artistas que te gustan'
  },
  {
    value: 'artist',
    icon: '🎵',
    label: 'Artista',
    desc: 'Publicá tus shows y conectá con tu audiencia'
  },
  {
    value: 'organizer',
    icon: '🎪',
    label: 'Organizador',
    desc: 'Gestioná y publicá eventos musicales'
  },
]

export default function Register() {
  const { register, currentUser } = useStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '', role: 'fan', bio: ''
  })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: role, 2: data

  if (currentUser) { navigate('/'); return null }

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.email || !form.password) {
      setError('Completá todos los campos obligatorios.')
      return
    }
    if (form.username.trim().length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const result = register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      bio: form.bio,
    })
    setLoading(false)
    if (result.ok) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
               style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}>
            <Music2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Crear cuenta</h1>
          <p className="text-sm text-white/40 mt-1">Unite a la comunidad de SoundSeekers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Step 1: Role */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white/70 mb-4">¿Cómo querés usar SoundSeekers?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => set('role', r.value)}
                  className="relative p-4 rounded-xl text-left transition-all duration-200"
                  style={form.role === r.value
                    ? { background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)' }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
                  }
                >
                  {form.role === r.value && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
                         style={{ background: '#7c3aed' }}>
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <div className="text-2xl mb-2">{r.icon}</div>
                  <div className="font-semibold text-sm text-white mb-0.5">{r.label}</div>
                  <div className="text-[11px] text-white/40 leading-tight">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Data */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white/70">Tus datos</h2>

            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">
                Nombre de usuario <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => set('username', e.target.value)}
                  placeholder="tucuenta"
                  className="input-dark pl-10"
                  autoComplete="username"
                  maxLength={30}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
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
              <label className="block text-xs font-medium text-white/50 mb-1.5">
                Contraseña <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="input-dark pl-10 pr-10"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">
                Confirmar contraseña <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)}
                  placeholder="Repetí la contraseña"
                  className="input-dark pl-10"
                  autoComplete="new-password"
                />
                {form.confirmPassword && (
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center ${
                    form.password === form.confirmPassword ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      form.password === form.confirmPassword ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                  </div>
                )}
              </div>
            </div>

            {/* Bio (optional) */}
            {(form.role === 'artist' || form.role === 'organizer') && (
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">
                  Bio <span className="text-white/25">(opcional)</span>
                </label>
                <textarea
                  value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                  placeholder={form.role === 'artist' ? 'Contá quién sos como artista...' : 'Contá qué tipo de eventos organizás...'}
                  rows={2}
                  maxLength={200}
                  className="input-dark resize-none"
                />
              </div>
            )}
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
            className="btn-primary w-full justify-center flex items-center gap-2 py-3 text-sm disabled:opacity-60">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando cuenta...
              </span>
            ) : (
              `Crear cuenta como ${ROLES.find(r => r.value === form.role)?.label}`
            )}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-5">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
