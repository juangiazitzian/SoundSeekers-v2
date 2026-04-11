import { create } from 'zustand'
import * as api from '../api'

export const useStore = create((set, get) => ({

  events: [],
  currentUser: null,
  eventsLoaded: false,

  loadEvents: async () => {
    if (get().eventsLoaded) return
    const events = await api.getEvents({ sortBy: 'date' })
    set({ events, eventsLoaded: true })
  },

  login: async (email, password) => {
    const result = await api.login(email, password)
    if (result.ok) set({ currentUser: result.user })
    return result
  },

  register: async (data) => {
    const result = await api.register(data)
    if (result.ok) set({ currentUser: result.user })
    return result
  },

  logout: () => set({ currentUser: null }),

  updateProfile: async (updates) => {
    const { currentUser } = get()
    if (!currentUser) return
    const result = await api.updateUser(currentUser.id, updates)
    if (result.ok) {
      set({ currentUser: result.user })
    }
  },

  addEvent: async (eventData) => {
    const { currentUser } = get()
    if (!currentUser) return null
    const newEvent = await api.createEvent({
      ...eventData,
      organizerId: currentUser.id,
      organizerName: currentUser.username,
    })
    set(s => ({ events: [newEvent, ...s.events] }))
    return newEvent
  },

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

    if (sortBy === 'date')        results.sort((a, b) => new Date(a.date) - new Date(b.date))
    else if (sortBy === 'price_asc')  results.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price_desc') results.sort((a, b) => b.price - a.price)
    else if (sortBy === 'popular')    results.sort((a, b) => (b.attending || 0) - (a.attending || 0))

    return results
  },

  getFeaturedEvents: () => get().events.filter(e => e.featured),

  getEventsByOrganizer: (organizerId) =>
    get().events.filter(e => e.organizerId === organizerId),
}))
