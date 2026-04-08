import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { getGenreConfig } from '../data/seedData'

function formatDate(dateStr) {
  try {
    return format(parseISO(dateStr), "d 'de' MMMM", { locale: es })
  } catch {
    return dateStr
  }
}

function formatPrice(price) {
  if (price === 0) return 'Gratis'
  return `$${price.toLocaleString('es-AR')}`
}

function AttendingBar({ attending = 0, capacity = 100 }) {
  const pct = Math.min(100, Math.round((attending / capacity) * 100))
  const color = pct > 80 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#22c55e'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-white/10">
        <div className="h-1 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] text-white/40 tabular-nums whitespace-nowrap">{pct}%</span>
    </div>
  )
}

export default function EventCard({ event, variant = 'default' }) {
  const { id, title, artist, genre, city, venue, date, time, price, capacity, attending, featured, tags } = event
  const cfg = getGenreConfig(genre)

  if (variant === 'featured') {
    return (
      <Link to={`/evento/${id}`} className="card-event group relative block animate-slide-up">
        {/* Header gradient */}
        <div className="relative h-52 overflow-hidden" style={{ background: cfg.bg }}>
          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-10"
               style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          {/* Genre emoji */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20 select-none">
            {cfg.emoji}
          </div>
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="badge text-[11px] font-bold"
                  style={{ background: `${cfg.accent}22`, color: cfg.accent, border: `1px solid ${cfg.accent}44` }}>
              {cfg.emoji} {genre}
            </span>
            {featured && (
              <span className="badge text-[11px] font-bold"
                    style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                ★ Destacado
              </span>
            )}
          </div>
          {/* Price */}
          <div className="absolute bottom-3 right-3">
            <span className="text-sm font-bold px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', color: '#f1f0ff' }}>
              {formatPrice(price)}
            </span>
          </div>
          {/* Gradient fade to card */}
          <div className="absolute bottom-0 left-0 right-0 h-12"
               style={{ background: 'linear-gradient(to bottom, transparent, rgba(13,13,28,0.8))' }} />
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-bold text-base text-white leading-tight mb-1 group-hover:text-brand-300 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-sm font-medium mb-3" style={{ color: cfg.accent }}>
            {artist}
          </p>
          <div className="space-y-1.5 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{formatDate(date)}{time && ` · ${time}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{venue}, {city}</span>
            </div>
            {capacity && (
              <div className="flex items-center gap-2 pt-1">
                <Users className="w-3.5 h-3.5 flex-shrink-0" />
                <AttendingBar attending={attending} capacity={capacity} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {(tags || []).slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                #{tag}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Ver más <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    )
  }

  // Default compact card
  return (
    <Link to={`/evento/${id}`} className="card-event group flex overflow-hidden animate-slide-up">
      {/* Color bar */}
      <div className="w-2 flex-shrink-0" style={{ background: cfg.accent }} />

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{cfg.emoji}</span>
              <span className="text-[11px] font-semibold" style={{ color: cfg.accent }}>{genre}</span>
              {featured && <span className="text-[10px] text-yellow-400/70">★</span>}
            </div>
            <h3 className="font-bold text-sm text-white leading-tight group-hover:text-brand-300 transition-colors truncate">
              {title}
            </h3>
            <p className="text-xs mt-0.5 truncate" style={{ color: cfg.accent }}>
              {artist}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-bold text-white">{formatPrice(price)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2.5 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(date)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {city}
          </span>
          {time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {time}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
