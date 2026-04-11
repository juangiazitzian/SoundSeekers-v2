import { Link } from 'react-router-dom'
import { Music2, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ background: '#0e0d0c', borderTop: '1px solid rgba(255,240,220,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #f07a3a 0%, #e8621e 100%)' }}>
                <Music2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm">
                <span className="gradient-text-brand">Sound</span>
                <span style={{ color: 'rgba(240,237,232,0.75)' }}>Seekers</span>
              </span>
            </Link>
            <p className="text-xs text-center md:text-left max-w-xs" style={{ color: 'rgba(240,237,232,0.28)' }}>
              La plataforma de artistas emergentes y eventos musicales en Argentina.
            </p>
          </div>

          <nav className="flex items-center gap-5">
            {[['/', 'Descubrir'], ['/crear-evento', 'Publicar evento'], ['/registro', 'Registrarse']].map(([to, label]) => (
              <Link key={to} to={to} className="text-xs transition-colors"
                style={{ color: 'rgba(240,237,232,0.35)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(240,237,232,0.65)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,237,232,0.35)'}>
                {label}
              </Link>
            ))}
          </nav>

          <p className="text-xs flex items-center gap-1" style={{ color: 'rgba(240,237,232,0.2)' }}>
            Hecho con <Heart className="w-3 h-3" style={{ color: '#e8621e' }} /> para artistas emergentes
          </p>
        </div>

        <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,240,220,0.05)' }}>
          <p className="text-[11px]" style={{ color: 'rgba(240,237,232,0.18)' }}>
            SoundSeekers — Seminario de Gestión de Tecnología · 2024
          </p>
        </div>
      </div>

      <div style={{ height: '3px', background: 'linear-gradient(90deg, #e8621e 0%, #f07a3a 40%, transparent 100%)' }} />
    </footer>
  )
}
