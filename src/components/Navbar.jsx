import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Music2, Plus, User, LogOut, ChevronDown, Menu, X } from 'lucide-react'
import { useStore } from '../store'

export default function Navbar() {
  const { currentUser, logout } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Descubrir' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-900/95 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}>
                <Music2 className="w-4 h-4 text-white" />
              </div>
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #f472b6 100%)', filter: 'blur(8px)', zIndex: -1 }} />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="gradient-text-brand">Sound</span>
              <span className="text-white/90">Seekers</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-brand-400 bg-brand-600/10'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                {/* Create event button */}
                <Link to="/crear-evento" className="hidden sm:flex items-center gap-1.5 btn-primary text-xs">
                  <Plus className="w-3.5 h-3.5" />
                  Publicar evento
                </Link>

                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg glass glass-hover transition-all"
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                         style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                      {currentUser.initials}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-white/80 max-w-[100px] truncate">
                      {currentUser.username}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 shadow-2xl animate-slide-down overflow-hidden"
                         style={{ background: '#111128' }}>
                      <div className="px-4 py-3 border-b border-white/[0.06]">
                        <p className="text-sm font-semibold text-white">{currentUser.username}</p>
                        <p className="text-xs text-white/40 mt-0.5">{currentUser.email}</p>
                        <span className="mt-1.5 badge text-[10px]"
                              style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>
                          {currentUser.role === 'artist' ? '🎵 Artista' : currentUser.role === 'organizer' ? '🎪 Organizador' : '🎧 Fan'}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/perfil"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Mi perfil
                        </Link>
                        <Link
                          to="/crear-evento"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Publicar evento
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/[0.05] transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-xs hidden sm:block">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="btn-primary text-xs">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg glass glass-hover"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menú"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-white/[0.06] animate-slide-down">
            <nav className="flex flex-col gap-1 mb-3">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors">
                  {link.label}
                </Link>
              ))}
              {currentUser && (
                <Link to="/crear-evento"
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-brand-400 hover:bg-brand-600/10 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Publicar evento
                </Link>
              )}
            </nav>
            {!currentUser && (
              <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
                <Link to="/login"    className="flex-1 btn-secondary text-center text-xs py-2">Iniciar sesión</Link>
                <Link to="/registro" className="flex-1 btn-primary  text-center text-xs py-2">Registrarse</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
