import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { GENRES, CITIES, getGenreConfig } from '../data/seedData'

const SORT_OPTIONS = [
  { value: 'date',       label: 'Más próximos' },
  { value: 'popular',    label: 'Más populares' },
  { value: 'price_asc',  label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
]

export default function EventFilters({ filters, onChange }) {
  const [showExtra, setShowExtra] = useState(false)
  const { search, genre, city, sortBy } = filters

  const set = (key, value) => onChange({ ...filters, [key]: value })

  const hasActiveFilters = genre || city || (search && search.trim())

  const clearAll = () => onChange({ search: '', genre: '', city: '', sortBy: 'date' })

  return (
    <div className="space-y-4">
      {/* Search + toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar eventos, artistas, géneros..."
            value={search}
            onChange={e => set('search', e.target.value)}
            className="input-dark pl-10 pr-10"
          />
          {search && (
            <button onClick={() => set('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowExtra(v => !v)}
          className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
            showExtra || (city || sortBy !== 'date')
              ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
              : 'glass glass-hover text-white/60 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filtros</span>
          {(city || (sortBy && sortBy !== 'date')) && (
            <span className="w-2 h-2 rounded-full bg-brand-400" />
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="px-3 py-3 rounded-lg text-sm text-white/40 hover:text-white/70 glass glass-hover transition-all"
            title="Limpiar filtros"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Genre pills */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => set('genre', '')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            !genre
              ? 'text-white border border-white/20 bg-white/10'
              : 'text-white/40 border border-white/[0.06] hover:border-white/20 hover:text-white/60'
          }`}
        >
          Todos
        </button>
        {GENRES.map(g => {
          const cfg = getGenreConfig(g)
          const active = genre === g
          return (
            <button
              key={g}
              onClick={() => set('genre', active ? '' : g)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              style={active
                ? { background: `${cfg.accent}22`, color: cfg.accent, border: `1px solid ${cfg.accent}55` }
                : { background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.06)' }
              }
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = cfg.accent; e.currentTarget.style.borderColor = `${cfg.accent}33` } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' } }}
            >
              {cfg.emoji} {g}
            </button>
          )
        })}
      </div>

      {/* Extra filters (city + sort) */}
      {showExtra && (
        <div className="flex gap-3 flex-wrap animate-slide-down">
          {/* City */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs text-white/40 mb-1.5 font-medium">Ciudad</label>
            <select
              value={city}
              onChange={e => set('city', e.target.value)}
              className="input-dark cursor-pointer"
            >
              <option value="">Todas las ciudades</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {/* Sort */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs text-white/40 mb-1.5 font-medium">Ordenar por</label>
            <select
              value={sortBy || 'date'}
              onChange={e => set('sortBy', e.target.value)}
              className="input-dark cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active filter summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>Filtros activos:</span>
          {genre && (
            <button onClick={() => set('genre', '')}
              className="flex items-center gap-1 px-2 py-1 rounded-full hover:bg-white/5 transition-colors"
              style={{ color: getGenreConfig(genre).accent }}>
              {genre} <X className="w-3 h-3" />
            </button>
          )}
          {city && (
            <button onClick={() => set('city', '')}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-brand-400 hover:bg-brand-600/10 transition-colors">
              📍 {city} <X className="w-3 h-3" />
            </button>
          )}
          {search && search.trim() && (
            <button onClick={() => set('search', '')}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-white/50 hover:bg-white/5 transition-colors">
              "{search}" <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
