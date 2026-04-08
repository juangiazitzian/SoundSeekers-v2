import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, MapPin, Music, Edit2, Check, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useStore } from '../store'
import { getGenreConfig } from '../data/seedData'

function formatDate(dateStr) {
  try { return format(parseISO(dateStr), "d MMM yyyy", { locale: es }) } catch { return dateStr }
}

export default function Profile() {
  const { currentUser, getEventsByOrganizer, updateProfile } = useStore()
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(currentUser?.bio || '')

  if (!currentUser) return null

  const myEvents = getEventsByOrganizer(currentUser.id)
  const roleLabel = currentUser.role === 'artist' ? 'Artista' : currentUser.role === 'organizer' ? 'Organizador' : 'Fan'
  const roleEmoji = currentUser.role === 'artist' ? '🎵' : currentUser.role === 'organizer' ? '🎪' : '🎧'

  const saveBio = () => {
    updateProfile({ bio })
    setEditing(false)
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 animate-fade-in">
      <div className="max-w-4xl mx-auto">

        {/* Profile card */}
        <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)', color: 'white' }}>
              {currentUser.initials}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-white">@{currentUser.username}</h1>
                <span className="badge text-xs"
                      style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>
                  {roleEmoji} {roleLabel}
                </span>
              </div>
              <p className="text-sm text-white/40 mt-0.5">{currentUser.email}</p>
              {currentUser.location && (
                <p className="text-xs text-white/30 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {currentUser.location}
                </p>
              )}

              {/* Bio */}
              <div className="mt-3">
                {editing ? (
                  <div className="flex gap-2 items-start">
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      rows={2}
                      maxLength={200}
                      className="input-dark resize-none text-sm flex-1"
                      autoFocus
                    />
                    <div className="flex flex-col gap-1">
                      <button onClick={saveBio}
                        className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setBio(currentUser.bio || ''); setEditing(false) }}
                        className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 group">
                    <p className="text-sm text-white/55 leading-relaxed">
                      {currentUser.bio || <span className="text-white/25 italic">Sin bio todavía</span>}
                    </p>
                    <button onClick={() => setEditing(true)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg glass text-white/40 hover:text-white/70 transition-all flex-shrink-0 mt-0.5">
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 flex-shrink-0">
              <div className="text-center sm:text-right">
                <div className="text-xl font-extrabold gradient-text-brand">{myEvents.length}</div>
                <div className="text-xs text-white/35">eventos</div>
              </div>
              <Link to="/crear-evento" className="btn-primary flex items-center gap-1.5 text-xs whitespace-nowrap">
                <Plus className="w-3.5 h-3.5" />
                Nuevo evento
              </Link>
            </div>
          </div>
        </div>

        {/* My events */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title text-xl">
              {myEvents.length > 0 ? 'Mis eventos' : 'Aún no publicaste eventos'}
            </h2>
            {myEvents.length > 0 && (
              <Link to="/crear-evento" className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Publicar
              </Link>
            )}
          </div>

          {myEvents.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">🎵</div>
              <h3 className="font-bold text-white/60 mb-2">Tu primera publicación te espera</h3>
              <p className="text-sm text-white/30 mb-6 max-w-sm mx-auto">
                Publicá tu primer evento y llegá a miles de fans que buscan exactamente lo que hacés.
              </p>
              <Link to="/crear-evento" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Publicar evento
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myEvents.map(event => {
                const cfg = getGenreConfig(event.genre)
                return (
                  <Link key={event.id} to={`/evento/${event.id}`}
                    className="glass glass-hover rounded-xl p-4 flex items-center gap-4 group transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                         style={{ background: cfg.bg }}>
                      {cfg.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-white truncate group-hover:text-brand-300 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-white/40 mt-0.5">
                        {event.artist} · {event.venue}, {event.city}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs font-semibold" style={{ color: cfg.accent }}>{event.genre}</div>
                      <div className="text-xs text-white/35 mt-0.5 flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {formatDate(event.date)}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
