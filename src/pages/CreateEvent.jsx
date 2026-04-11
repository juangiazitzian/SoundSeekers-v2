import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Music, DollarSign, Users, FileText, Tag, Check, Eye } from 'lucide-react'
import { useStore } from '../store'
import { GENRES, CITIES, getGenreConfig } from '../data/seedData'

const EMPTY_FORM = {
  title: '', artist: '', genre: '', city: '', venue: '', address: '',
  date: '', time: '', price: '', capacity: '', description: '', tags: ''
}

export default function CreateEvent() {
  const { addEvent, currentUser } = useStore()
  const navigate = useNavigate()
  const [form, setForm]   = useState({ ...EMPTY_FORM, artist: currentUser?.username || '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title = 'El título es obligatorio.'
    if (!form.artist.trim())      e.artist = 'El artista es obligatorio.'
    if (!form.genre)              e.genre = 'Elegí un género.'
    if (!form.city)               e.city = 'Elegí una ciudad.'
    if (!form.venue.trim())       e.venue = 'El lugar es obligatorio.'
    if (!form.date)               e.date = 'La fecha es obligatoria.'
    if (!form.time)               e.time = 'La hora es obligatoria.'
    if (form.price !== '' && isNaN(Number(form.price))) e.price = 'Precio inválido.'
    if (form.capacity !== '' && isNaN(Number(form.capacity))) e.capacity = 'Capacidad inválida.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    const tags = form.tags
      ? form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      : []

    const newEvent = await addEvent({
      title: form.title.trim(),
      artist: form.artist.trim(),
      genre: form.genre,
      city: form.city,
      venue: form.venue.trim(),
      address: form.address.trim(),
      date: form.date,
      time: form.time,
      price: form.price === '' ? 0 : Number(form.price),
      capacity: form.capacity === '' ? null : Number(form.capacity),
      description: form.description.trim(),
      tags,
    })

    setLoading(false)
    navigate(`/evento/${newEvent.id}`)
  }

  const cfg = form.genre ? getGenreConfig(form.genre) : null

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 rounded-lg glass glass-hover transition-all">
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Publicar evento</h1>
            <p className="text-sm text-white/40">Completá los datos para publicar tu evento en SoundSeekers</p>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setPreview(v => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                preview ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30' : 'glass glass-hover text-white/50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Vista previa
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">

            <FormSection title="Identidad del evento" icon={Music}>
              <FormField label="Título del evento" required error={errors.title}>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Ej: Noche de Jazz en el Centro"
                  className="input-dark"
                  maxLength={100}
                />
              </FormField>

              <FormField label="Artista / Banda" required error={errors.artist}>
                <input
                  type="text"
                  value={form.artist}
                  onChange={e => set('artist', e.target.value)}
                  placeholder="Nombre del artista o banda"
                  className="input-dark"
                  maxLength={80}
                />
              </FormField>

              <FormField label="Género musical" required error={errors.genre}>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(g => {
                    const c = getGenreConfig(g)
                    const active = form.genre === g
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => set('genre', active ? '' : g)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 flex items-center gap-1"
                        style={active
                          ? { background: `${c.accent}22`, color: c.accent, border: `1px solid ${c.accent}55` }
                          : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }
                        }
                      >
                        {active && <Check className="w-3 h-3" />}
                        {c.emoji} {g}
                      </button>
                    )
                  })}
                </div>
              </FormField>
            </FormSection>

            <FormSection title="Lugar y fecha" icon={MapPin}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Ciudad" required error={errors.city}>
                  <select value={form.city} onChange={e => set('city', e.target.value)} className="input-dark cursor-pointer">
                    <option value="">Seleccionar ciudad</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Nombre del lugar" required error={errors.venue}>
                  <input
                    type="text"
                    value={form.venue}
                    onChange={e => set('venue', e.target.value)}
                    placeholder="Ej: Club Niceto"
                    className="input-dark"
                  />
                </FormField>
              </div>
              <FormField label="Dirección" error={errors.address}>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  placeholder="Ej: Niceto Vega 5510, Palermo"
                  className="input-dark"
                />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Fecha" required error={errors.date}>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => set('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-dark"
                  />
                </FormField>
                <FormField label="Hora de inicio" required error={errors.time}>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => set('time', e.target.value)}
                    className="input-dark"
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Precio y capacidad" icon={DollarSign}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Precio de entrada (ARS)" error={errors.price}>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => set('price', e.target.value)}
                    placeholder="0 = Gratis"
                    className="input-dark"
                    min={0}
                    step={100}
                  />
                </FormField>
                <FormField label="Capacidad máxima" error={errors.capacity}>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={e => set('capacity', e.target.value)}
                    placeholder="Dejar vacío si no aplica"
                    className="input-dark"
                    min={1}
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Descripción y etiquetas" icon={FileText}>
              <FormField label="Descripción del evento" error={errors.description}>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Contá de qué se trata el evento, qué van a tocar, qué esperar..."
                  rows={4}
                  maxLength={600}
                  className="input-dark resize-none"
                />
                <p className="text-[11px] text-white/25 mt-1 text-right">{form.description.length}/600</p>
              </FormField>
              <FormField label="Etiquetas" error={errors.tags}>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input
                    type="text"
                    value={form.tags}
                    onChange={e => set('tags', e.target.value)}
                    placeholder="indie, emergente, buenos aires (separadas por coma)"
                    className="input-dark pl-10"
                  />
                </div>
              </FormField>
            </FormSection>

            <div className="flex gap-3 pt-2">
              <Link to="/" className="btn-secondary flex-1 text-center text-sm py-3">
                Cancelar
              </Link>
              <button type="submit" disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-3 disabled:opacity-60">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publicando...
                  </>
                ) : '✓ Publicar evento'}
              </button>
            </div>
          </form>

          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider">Vista previa</h3>
              {form.title || form.genre ? (
                <div className="rounded-2xl overflow-hidden border border-white/10">

                  <div className="h-32 relative"
                       style={{ background: cfg ? cfg.bg : 'linear-gradient(135deg, #1e1b4b, #4c1d95)' }}>
                    <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20 select-none">
                      {cfg?.emoji || '🎵'}
                    </div>
                    <div className="absolute top-2.5 left-2.5">
                      {form.genre && (
                        <span className="badge text-[10px]"
                              style={{ background: `${cfg?.accent}22`, color: cfg?.accent, border: `1px solid ${cfg?.accent}44` }}>
                          {cfg?.emoji} {form.genre}
                        </span>
                      )}
                    </div>
                    {form.price !== '' && (
                      <div className="absolute bottom-2 right-2">
                        <span className="text-xs font-bold px-2 py-1 rounded-lg"
                              style={{ background: 'rgba(0,0,0,0.5)', color: '#f1f0ff' }}>
                          {form.price === '' || form.price === '0' ? 'Gratis' : `$${Number(form.price).toLocaleString('es-AR')}`}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3" style={{ background: 'rgba(13,13,28,0.9)' }}>
                    <h4 className="font-bold text-sm text-white truncate">{form.title || 'Título del evento'}</h4>
                    <p className="text-xs mt-0.5 truncate" style={{ color: cfg?.accent || '#f07a3a' }}>
                      {form.artist || 'Artista'}
                    </p>
                    <div className="mt-2 space-y-1 text-xs text-white/40">
                      {form.date && <p>📅 {form.date}</p>}
                      {(form.city || form.venue) && <p>📍 {[form.venue, form.city].filter(Boolean).join(', ')}</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                  <div className="text-3xl mb-2 opacity-40">🎵</div>
                  <p className="text-xs text-white/25">La vista previa aparecerá aquí</p>
                </div>
              )}
              <p className="text-[11px] text-white/20 text-center">
                El evento se publicará inmediatamente en la plataforma
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormSection({ title, icon: Icon, children }) {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <h3 className="text-sm font-bold text-white/60 flex items-center gap-2">
        <Icon className="w-4 h-4 text-brand-400" />
        {title}
      </h3>
      {children}
    </div>
  )
}

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-red-400 mt-1">{error}</p>
      )}
    </div>
  )
}
