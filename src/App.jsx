import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import EventDetail from './pages/EventDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateEvent from './pages/CreateEvent'
import Profile from './pages/Profile'

function ProtectedRoute({ children }) {
  const currentUser = useStore(s => s.currentUser)
  if (!currentUser) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const loadEvents = useStore(s => s.loadEvents)
  useEffect(() => { loadEvents() }, [loadEvents])

  return (
    <div className="noise-bg min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/evento/:id"    element={<EventDetail />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/registro"      element={<Register />} />
          <Route path="/perfil"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/crear-evento"  element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
