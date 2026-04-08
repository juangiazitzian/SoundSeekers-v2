import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedEvents, seedUsers } from '../data/seedData'

const STORE_VERSION = 2

export const useStore = create(
  persist(
    (set, get) => ({
      // ─── State ───────────────────────────────────────────────────────────────
      events: seedEvents,
      users: seedUsers,
      currentUser: null,
      _version: STORE_VERSION,

      // ─── Auth ─────────────────────────────────────────────────────────────────
      login: (email, password) => {
        const user = get().users.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        )
        if (!user) return { ok: false, error: 'Email o contraseña incorrectos.' }
        set({ currentUser: user })
        return { ok: true, user }
      },

      register: ({ username, email, password, role = 'fan', bio = '', location = '' }) => {
        const { users } = get()
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          return { ok: false, error: 'Ese email ya está registrado.' }
        }
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
          return { ok: false, error: 'Ese nombre de usuario ya está en uso.' }
        }
        const newUser = {
          id: `u${Date.now()}`,
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
          initials: username.slice(0, 2).toUpperCase(),
          bio,
          location,
          following: [],
        }
        set(s => ({ users: [...s.users, newUser], currentUser: newUser }))
        return { ok: true, user: newUser }
      },

      logout: () => set({ currentUser: null }),

      updateProfile: (updates) => {
        const { currentUser, users } = get()
        if (!currentUser) return
        const updated = { ...currentUser, ...updates }
        set({
          currentUser: updated,
          users: users.map(u => u.id === currentUser.id ? updated : u),
        })
      },

      // ─── Events ───────────────────────────────────────────────────────────────
      addEvent: (eventData) => {
        const { currentUser } = get()
        if (!currentUser) return null
        const newEvent = {
          id: `e${Date.now()}`,
          ...eventData,
          organizerId: currentUser.id,
          organizerName: currentUser.username,
          attending: 0,
          featured: false,
          createdAt: new Date().toISOString(),
        }
        set(s => ({ events: [newEvent, ...s.events] }))
        return newEvent
      },

      // ─── Selectors ────────────────────────────────────────────────────────────
      getEventById: (id) => get().events.find(e => e.id === id),

      getFilteredEvents: ({ genre, city, search, sortBy } = {}) => {
        let results = [...get().events]

        if (genre) results = results.filter(e => e.genre === genre)
        if (city)  results = results.filter(e => e.city === city)

        if (search && search.trim()) {
          const q = search.toLowerCase().trim()
          results = results.filter(e =>
            e.title.toLowerCase().includes(q) ||
            e.artist.toLowerCase().includes(q) ||
            e.genre.toLowerCase().includes(q) ||
            e.city.toLowerCase().includes(q) ||
            e.venue.toLowerCase().includes(q) ||
            (e.tags || []).some(t => t.toLowerCase().includes(q))
          )
        }

        if (sortBy === 'date') {
          results.sort((a, b) => new Date(a.date) - new Date(b.date))
        } else if (sortBy === 'price_asc') {
          results.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'price_desc') {
          results.sort((a, b) => b.price - a.price)
        } else if (sortBy === 'popular') {
          results.sort((a, b) => (b.attending || 0) - (a.attending || 0))
        }

        return results
      },

      getFeaturedEvents: () => get().events.filter(e => e.featured),

      getEventsByOrganizer: (organizerId) =>
        get().events.filter(e => e.organizerId === organizerId),
    }),
    {
      name: 'soundseekers-v1',
      version: STORE_VERSION,
      migrate: (persistedState, version) => {
        // If version mismatch, reset to fresh seed data
        if (version !== STORE_VERSION) {
          return {
            events: seedEvents,
            users: seedUsers,
            currentUser: null,
            _version: STORE_VERSION,
          }
        }
        return persistedState
      },
    }
  )
)
