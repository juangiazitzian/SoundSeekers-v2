import { Link } from 'react-router-dom'
import { Music2, Github, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.05]" style={{ background: '#080812' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}>
                <Music2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm">
                <span className="gradient-text-brand">Sound</span>
                <span className="text-white/80">Seekers</span>
              </span>
            </Link>
            <p className="text-xs text-white/30 text-center md:text-left max-w-xs">
              La plataforma de artistas emergentes y eventos musicales en Argentina.
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-5">
            <Link to="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Descubrir
            </Link>
            <Link to="/crear-evento" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Publicar evento
            </Link>
            <Link to="/registro" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Registrarse
            </Link>
          </nav>

          {/* Credits */}
          <p className="text-xs text-white/20 flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-red-400/60" /> para artistas emergentes
          </p>
        </div>

        {/* Bottom line */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
          <p className="text-[11px] text-white/20">
            SoundSeekers — Seminario de Gestión de Tecnología · 2024
          </p>
        </div>
      </div>
    </footer>
  )
}
