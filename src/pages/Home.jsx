import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, TrendingUp, MapPin, Music, ArrowRight, Zap } from 'lucide-react'
import { useStore } from '../store'
import EventCard from '../components/EventCard'
import EventFilters from '../components/EventFilters'

const STATS = [
  { icon: Music,    label: 'Eventos activos', value: '120+' },
  { icon: Sparkles, label: 'Artistas emergentes', value: '80+' },
  { icon: MapPin,   label: 'Ciudades', value: '15+' },
  { icon: TrendingUp, label: 'Fans conectados', value: '4.200+' },
]

export default function Home() {
  const { getFilteredEvents, getFeaturedEvents, currentUser } = useStore()
  const [filters, setFilters] = useState({ search: '', genre: '', city: '', sortBy: 'date' })

  const allEvents = useMemo(() => getFilteredEvents(filters), [filters])
  const featuredEvents = useMemo(() => getFeaturedEvents(), [])
  const hasFilters = filters.search || filters.genre || filters.city

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6">
        {/* Background glow */}
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 blur-[80px] pointer-events-none"
             style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, #ec4899 100%)' }} />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 animate-fade-in"
               style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }}>
            <Zap className="w-3 h-3" />
            La plataforma de artistas emergentes
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-slide-up">
            Descubrí el sonido<br />
            <span className="gradient-text">que te mueve</span>
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '80ms' }}>
            Eventos musicales, artistas emergentes y toda la escena independiente de Argentina
            en un solo lugar. Sin algoritmos, sin ruido.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up" style={{ animationDelay: '140ms' }}>
            <a href="#eventos" className="btn-primary flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4" />
              Explorar eventos
            </a>
            {!currentUser && (
              <Link to="/registro" className="btn-secondary flex items-center gap-2 justify-center">
                Soy artista o organizador
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {currentUser && (
              <Link to="/crear-evento" className="btn-secondary flex items-center gap-2 justify-center">
                Publicar mi evento
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 animate-slide-up" style={{ animationDelay: '220ms' }}>
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass rounded-xl px-4 py-4 text-center">
                <div className="text-2xl font-extrabold gradient-text-brand">{value}</div>
                <div className="text-xs text-white/40 mt-1 flex items-center gap-1 justify-center">
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Events ───────────────────────────────────────────────── */}
      {!hasFilters && featuredEvents.length > 0 && (
        <section className="px-4 sm:px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <span className="text-yellow-400">★</span> Destacados
                </h2>
                <p className="text-sm text-white/40 mt-1">Los eventos que no te podés perder</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {featuredEvents.slice(0, 3).map(event => (
                <EventCard key={event.id} event={event} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── All Events ────────────────────────────────────────────────────── */}
      <section id="eventos" className="px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">
                {hasFilters ? 'Resultados' : 'Todos los eventos'}
              </h2>
              <p className="text-sm text-white/40 mt-1">
                {allEvents.length} {allEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <EventFilters filters={filters} onChange={setFilters} />
          </div>

          {/* Results */}
          {allEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {allEvents.map(event => (
                <EventCard key={event.id} event={event} variant="featured" />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-white/60 mb-2">Sin resultados</h3>
              <p className="text-sm text-white/30 mb-6">
                No encontramos eventos que coincidan con tu búsqueda.
              </p>
              <button
                onClick={() => setFilters({ search: '', genre: '', city: '', sortBy: 'date' })}
                className="btn-secondary text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA para artistas ─────────────────────────────────────────────── */}
      {!currentUser && (
        <section className="px-4 sm:px-6 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center"
                 style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(236,72,153,0.1) 100%)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
              <div className="relative">
                <div className="text-4xl mb-4">🎵</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  ¿Sos artista o hacés eventos?
                </h2>
                <p className="text-white/50 mb-8 max-w-md mx-auto text-sm sm:text-base">
                  Publicá tus eventos gratis y llegá a miles de fans que buscan exactamente lo que vos hacés.
                  SoundSeekers es el lugar donde la escena emergente toma visibilidad.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/registro" className="btn-primary flex items-center gap-2 justify-center">
                    <Sparkles className="w-4 h-4" />
                    Crear cuenta gratis
                  </Link>
                  <Link to="/login" className="btn-secondary flex items-center gap-2 justify-center">
                    Ya tengo cuenta
                  </Link>
                </div>
                <p className="text-xs text-white/25 mt-4">Sin tarjeta de crédito. Sin comisiones. Sin vueltas.</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
