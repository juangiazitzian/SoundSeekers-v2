import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Clock, Users, Ticket, ExternalLink, Share2, Heart } from 'lucide-react'
import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useStore } from '../store'
import { getGenreConfig } from '../data/seedData'
import EventCard from '../components/EventCard'

function formatDate(dateStr) {
  try {
    return format(parseISO(dateStr), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
  } catch { return dateStr }
}

function formatDateShort(dateStr) {
  try { return format(parseISO(dateStr), "d MMM", { locale: es }) } catch { return dateStr }
}

function formatPrice(price) {
  if (!price || price === 0) return 'Gratis'
  return `$${price.toLocaleString('es-AR')}`
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEventById, getFilteredEvents, currentUser } = useStore()
  const [liked, setLiked] = useState(false)
  const [ticketModalOpen, setTicketModalOpen] = useState(false)

  const event = getEventById(id)

  if (!event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-5xl">🎵</div>
        <h2 className="text-xl font-bold text-white/70">Evento no encontrado</h2>
        <p className="text-sm text-white/40">El evento que buscás no existe o fue eliminado.</p>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    )
  }

  const cfg = getGenreConfig(event.genre)
  const related = getFilteredEvents({ genre: event.genre }).filter(e => e.id !== id).slice(0, 3)
  const pctAttending = event.capacity ? Math.min(100, Math.round((event.attending / event.capacity) * 100)) : 0
  const spotsLeft = event.capacity ? event.capacity - (event.attending || 0) : null

  return (
    <div className="min-h-screen animate-fade-in">
      {/* ── Hero Banner ────────────────────────────────────────────────── */}
      <div className="relative h-72 sm:h-96 overflow-hidden" style={{ background: cfg.bg }}>
        {/* Pattern */}
        <div className="absolute inset-0 opacity-[0.08]"
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        {/* Big emoji */}
        <div className="absolute inset-0 flex items-center justify-center text-[140px] opacity-10 select-none">
          {cfg.emoji}
        </div>
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32"
             style={{ background: 'linear-gradient(to top, #080812, transparent)' }} />
        {/* Top actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.8)' }}
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setLiked(v => !v)}
              className="p-2.5 rounded-lg transition-all"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
            >
              <Heart className={`w-4 h-4 ${liked ? 'text-red-400 fill-red-400' : 'text-white/60'}`} />
            </button>
            <button
              onClick={() => { navigator.clipboard?.writeText(window.location.href).catch(()=>{}); alert('Link copiado al portapapeles') }}
              className="p-2.5 rounded-lg transition-all"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.6)' }}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Genre badge */}
        <div className="absolute bottom-6 left-6">
          <span className="badge text-xs font-bold"
                style={{ background: `${cfg.accent}22`, color: cfg.accent, border: `1px solid ${cfg.accent}44` }}>
            {cfg.emoji} {event.genre}
          </span>
          {event.featured && (
            <span className="badge text-xs font-bold ml-2"
                  style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
              ★ Destacado
            </span>
          )}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-2 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title + artist */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {event.title}
              </h1>
              <p className="text-lg font-semibold mt-2" style={{ color: cfg.accent }}>
                {event.artist}
              </p>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: Calendar, label: 'Fecha', value: formatDate(event.date) },
                { icon: Clock,    label: 'Hora',  value: event.time || 'A confirmar' },
                { icon: MapPin,   label: 'Lugar',  value: event.venue },
                { icon: MapPin,   label: 'Ciudad', value: event.city },
                event.address && { icon: MapPin, label: 'Dirección', value: event.address },
                event.capacity && { icon: Users, label: 'Capacidad', value: `${event.capacity} personas` },
              ].filter(Boolean).map(({ icon: Icon, label, value }) => (
                <div key={label} className="glass rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1">
                    <Icon className="w-3 h-3" />
                    <span>{label}</span>
                  </div>
                  <p className="text-sm font-semibold text-white/90 leading-tight">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base font-bold text-white/80 mb-3">Sobre el evento</h3>
              <p className="text-sm text-white/55 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-white/80 mb-3">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-full text-xs text-white/50"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer */}
            <div>
              <h3 className="text-base font-bold text-white/80 mb-3">Organizado por</h3>
              <div className="flex items-center gap-3 glass rounded-xl p-3 w-fit">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                     style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                  {event.organizerName?.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-white/70">@{event.organizerName}</span>
              </div>
            </div>
          </div>

          {/* Sidebar: Ticket */}
          <div className="space-y-4">
            <div className="sticky top-24 space-y-4">
              {/* Price card */}
              <div className="glass rounded-2xl p-6 space-y-5">
                <div>
                  <p className="text-xs text-white/40 mb-1">Precio de entrada</p>
                  <p className="text-3xl font-extrabold text-white">{formatPrice(event.price)}</p>
                </div>

                {/* Availability bar */}
                {event.capacity && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white/40">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Disponibilidad</span>
                      <span>{pctAttending}% ocupado</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-1.5 rounded-full transition-all"
                           style={{ width: `${pctAttending}%`, background: pctAttending > 80 ? '#ef4444' : pctAttending > 50 ? '#f59e0b' : cfg.accent }} />
                    </div>
                    {spotsLeft !== null && (
                      <p className="text-xs" style={{ color: pctAttending > 80 ? '#ef4444' : 'rgba(255,255,255,0.35)' }}>
                        {spotsLeft > 0 ? `${spotsLeft} lugares disponibles` : '¡Agotado!'}
                      </p>
                    )}
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => setTicketModalOpen(true)}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${cfg.accent}dd, ${cfg.accent}aa)`, color: '#fff',
                           boxShadow: `0 8px 24px ${cfg.accent}33` }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <Ticket className="w-4 h-4" />
                  {event.price === 0 ? 'Registrarme gratis' : 'Conseguir entrada'}
                </button>

                <p className="text-[11px] text-white/25 text-center">
                  Demo — no se realizan cobros reales
                </p>
              </div>

              {/* Date reminder */}
              <div className="glass rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex flex-col items-center justify-center text-center flex-shrink-0"
                     style={{ background: `${cfg.accent}22`, border: `1px solid ${cfg.accent}33` }}>
                  <span className="text-[9px] text-white/40 uppercase tracking-wide leading-none">
                    {event.date ? format(parseISO(event.date), 'MMM', { locale: es }) : ''}
                  </span>
                  <span className="text-lg font-extrabold leading-none" style={{ color: cfg.accent }}>
                    {event.date ? format(parseISO(event.date), 'd') : ''}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">{formatDate(event.date)}</p>
                  <p className="text-xs text-white/40">{event.time} — {event.venue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related events ──────────────────────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title text-xl">Más de {event.genre}</h2>
              <Link to="/" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                Ver todos <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {related.map(e => <EventCard key={e.id} event={e} variant="featured" />)}
            </div>
          </div>
        )}
      </div>

      {/* ── Ticket modal (simulated) ──────────────────────────────────────── */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
             onClick={() => setTicketModalOpen(false)}>
          <div className="relative max-w-sm w-full rounded-2xl p-8 text-center animate-slide-up"
               style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.1)' }}
               onClick={e => e.stopPropagation()}>
            <div className="text-5xl mb-4">{cfg.emoji}</div>
            <h3 className="text-xl font-bold text-white mb-2">¡Entrada reservada!</h3>
            <p className="text-sm text-white/50 mb-1">{event.title}</p>
            <p className="text-xs text-white/35 mb-6">{event.venue} · {formatDateShort(event.date)}</p>
            {/* Fake QR */}
            <div className="w-32 h-32 mx-auto rounded-xl mb-6 flex items-center justify-center"
                 style={{ background: 'white' }}>
              <svg viewBox="0 0 110 110" className="w-24 h-24" fill="#0d0d1c">
                {/* Top-left finder */}
                <rect x="5" y="5" width="30" height="30" rx="2"/>
                <rect x="10" y="10" width="20" height="20" rx="1" fill="white"/>
                <rect x="15" y="15" width="10" height="10" rx="1"/>
                {/* Top-right finder */}
                <rect x="75" y="5" width="30" height="30" rx="2"/>
                <rect x="80" y="10" width="20" height="20" rx="1" fill="white"/>
                <rect x="85" y="15" width="10" height="10" rx="1"/>
                {/* Bottom-left finder */}
                <rect x="5" y="75" width="30" height="30" rx="2"/>
                <rect x="10" y="80" width="20" height="20" rx="1" fill="white"/>
                <rect x="15" y="85" width="10" height="10" rx="1"/>
                {/* Data modules */}
                {[[42,5],[52,5],[62,5],[42,15],[52,25],[42,35],[52,35],[62,15],[62,35],
                  [5,42],[15,42],[25,42],[35,42],[5,52],[25,52],[35,52],[5,62],[15,62],[35,62],
                  [42,42],[62,42],[52,52],[42,62],[62,62],[72,72],[82,52],[92,62],[72,82],[92,82],
                  [52,72],[72,52],[82,72],[92,42]].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="8" height="8" rx="1"/>
                ))}
              </svg>
            </div>
            <p className="text-xs text-white/30 mb-6">
              Este es un demo. En producción, el código QR sería enviado a tu email.
            </p>
            <button onClick={() => setTicketModalOpen(false)} className="btn-primary w-full">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
