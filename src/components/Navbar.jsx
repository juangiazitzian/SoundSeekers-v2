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

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const navLinks = [{ to: '/', label: 'Descubrir' }]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b'
          : 'bg-transparent border-b border-transparent'
      }`}
      style={scrolled ? { background: 'rgba(17,17,16,0.96)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,240,220,0.08)' } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #f07a3a 0%, #e8621e 100%)' }}>
                <Music2 className="w-4 h-4 text-white" />
              </div>
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300"
                   style={{ background: '#e8621e', filter: 'blur(10px)', zIndex: -1 }} />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="gradient-text-brand">Sound</span>
              <span style={{ color: 'rgba(240,237,232,0.88)' }}>Seekers</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-brand-400 bg-brand-500/10'
                    : 'text-white/55 hover:text-white/85 hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <Link to="/crear-evento" className="hidden sm:flex items-center gap-1.5 btn-primary text-xs">
                  <Plus className="w-3.5 h-3.5" />
                  Publicar evento
                </Link>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg glass glass-hover transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                         style={{ background: 'linear-gradient(135deg, #f07a3a, #e8621e)' }}>
                      {currentUser.initials}
                    </div>
                    <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate" style={{ color: 'rgba(240,237,232,0.8)' }}>
                      {currentUser.username}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-2xl animate-slide-down overflow-hidden"
                         style={{ background: '#1c1b19', border: '1px solid rgba(255,240,220,0.1)' }}>
                      <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,240,220,0.07)' }}>
                        <p className="text-sm font-semibold text-white">{currentUser.username}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(240,237,232,0.4)' }}>{currentUser.email}</p>
                        <span className="mt-1.5 badge text-[10px]"
                              style={{ background: 'rgba(232,98,30,0.12)', color: '#f07a3a', border: '1px solid rgba(232,98,30,0.25)' }}>
                          {currentUser.role === 'artist' ? '🎵 Artista' : currentUser.role === 'organizer' ? '🎪 Organizador' : '🎧 Fan'}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link to="/perfil" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: 'rgba(240,237,232,0.65)' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#f0ede8'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,237,232,0.65)'}
                        >
                          <User className="w-4 h-4" />
                          Mi perfil
                        </Link>
                        <Link to="/crear-evento" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: 'rgba(240,237,232,0.65)' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#f0ede8'}
                          onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,237,232,0.65)'}
                        >
                          <Plus className="w-4 h-4" />
                          Publicar evento
                        </Link>
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 transition-colors"
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
                <Link to="/login" className="btn-secondary text-xs hidden sm:block">Iniciar sesión</Link>
                <Link to="/registro" className="btn-primary text-xs">Registrarse</Link>
              </div>
            )}

            <button
              className="md:hidden p-2 rounded-lg glass glass-hover"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menú"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-3 animate-slide-down" style={{ borderTop: '1px solid rgba(255,240,220,0.07)' }}>
            <nav className="flex flex-col gap-1 mb-3">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: 'rgba(240,237,232,0.65)' }}>
                  {link.label}
                </Link>
              ))}
              {currentUser && (
                <Link to="/crear-evento"
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-brand-400 flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Publicar evento
                </Link>
              )}
            </nav>
            {!currentUser && (
              <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,240,220,0.07)' }}>
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
