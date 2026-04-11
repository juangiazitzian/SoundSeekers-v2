import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, TrendingUp, MapPin, Music, ArrowRight, Zap } from 'lucide-react'
import { useStore } from '../store'
import EventCard from '../components/EventCard'
import EventFilters from '../components/EventFilters'

const STATS = [
  { icon: Music,      label: 'Eventos activos',     value: '20+' },
  { icon: Sparkles,   label: 'Artistas emergentes', value: '80+' },
  { icon: MapPin,     label: 'Ciudades',             value: '15+' },
  { icon: TrendingUp, label: 'Fans conectados',      value: '4.200+' },
]

export default function Home() {
  const { getFilteredEvents, getFeaturedEvents, currentUser, events } = useStore()
  const [filters, setFilters] = useState({ search: '', genre: '', city: '', sortBy: 'date' })

  const allEvents      = useMemo(() => getFilteredEvents(filters), [filters, events])
  const featuredEvents = useMemo(() => getFeaturedEvents(), [events])
  const hasFilters     = filters.search || filters.genre || filters.city

  return (
    <div className="min-h-screen">

      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute top-0 left-0 w-[500px] h-[280px] rounded-full opacity-15 blur-[90px] pointer-events-none"
             style={{ background: 'radial-gradient(ellipse, #e8621e 0%, #c04e18 100%)' }} />
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 animate-fade-in"
               style={{ background: 'rgba(232,98,30,0.12)', color: '#f07a3a', border: '1px solid rgba(232,98,30,0.25)' }}>
            <Zap className="w-3 h-3" />
            La plataforma de artistas emergentes
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-6 animate-slide-up"
              style={{ letterSpacing: '-0.03em' }}>
            Descubrí el sonido<br />
            <span className="gradient-text">que te mueve</span>
          </h1>

          <p className="text-base sm:text-lg max-w-xl mx-auto mb-10 animate-slide-up"
             style={{ color: 'rgba(240,237,232,0.48)', animationDelay: '80ms' }}>
            Eventos musicales, artistas emergentes y toda la escena independiente de Argentina
            en un solo lugar. Sin algoritmos, sin ruido.
          </p>

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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 animate-slide-up" style={{ animationDelay: '220ms' }}>
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl px-4 py-4 text-center"
                   style={{ background: '#1a1917', border: '1px solid rgba(255,240,220,0.08)' }}>
                <div className="text-2xl font-extrabold gradient-text-brand">{value}</div>
                <div className="text-xs mt-1 flex items-center gap-1 justify-center" style={{ color: 'rgba(240,237,232,0.38)' }}>
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!hasFilters && featuredEvents.length > 0 && (
        <section className="px-4 sm:px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <span style={{ color: '#e8621e' }}>★</span> Destacados
                </h2>
                <div className="orange-bar" />
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

      <section id="eventos" className="px-4 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">
                {hasFilters ? 'Resultados' : 'Todos los eventos'}
              </h2>
              <div className="orange-bar" />
              <p className="text-sm mt-3" style={{ color: 'rgba(240,237,232,0.38)' }}>
                {allEvents.length} {allEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <EventFilters filters={filters} onChange={setFilters} />
          </div>

          {allEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {allEvents.map(event => (
                <EventCard key={event.id} event={event} variant="featured" />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgba(240,237,232,0.55)' }}>Sin resultados</h3>
              <p className="text-sm mb-6" style={{ color: 'rgba(240,237,232,0.3)' }}>
                No encontramos eventos que coincidan con tu búsqueda.
              </p>
              <button onClick={() => setFilters({ search: '', genre: '', city: '', sortBy: 'date' })}
                className="btn-secondary text-sm">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {!currentUser && (
        <section className="px-4 sm:px-6 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center"
                 style={{ background: '#1a1917', border: '1px solid rgba(232,98,30,0.2)', borderLeft: '4px solid #e8621e' }}>
              <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
              <div className="relative">
                <div className="text-4xl mb-4">🎵</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
                  ¿Sos artista o hacés eventos?
                </h2>
                <p className="mb-8 max-w-md mx-auto text-sm sm:text-base" style={{ color: 'rgba(240,237,232,0.48)' }}>
                  Publicá tus eventos gratis y llegá a miles de fans que buscan exactamente lo que vos hacés.
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
                <p className="text-xs mt-4" style={{ color: 'rgba(240,237,232,0.22)' }}>Sin tarjeta de crédito. Sin comisiones.</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
