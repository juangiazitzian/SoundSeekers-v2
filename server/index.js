import express from 'express'
import cors from 'cors'
import db, { rowToUser, rowToEvent } from './db.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ ok: false, error: 'Faltan campos.' })

  const row = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email)
  if (!row || row.password !== password) {
    return res.json({ ok: false, error: 'Email o contraseña incorrectos.' })
  }
  res.json({ ok: true, user: rowToUser(row) })
})

app.post('/api/auth/register', (req, res) => {
  const { username, email, password, role = 'fan', bio = '', location = '' } = req.body
  if (!username || !email || !password) return res.status(400).json({ ok: false, error: 'Faltan campos.' })

  const emailExists = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(email)
  if (emailExists) return res.json({ ok: false, error: 'Ese email ya está registrado.' })

  const usernameExists = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(username.trim())
  if (usernameExists) return res.json({ ok: false, error: 'Ese nombre de usuario ya está en uso.' })

  const id = `u${Date.now()}`
  const initials = username.trim().slice(0, 2).toUpperCase()
  db.prepare(`
    INSERT INTO users (id, username, email, password, role, initials, bio, location, following)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, '[]')
  `).run(id, username.trim(), email.trim().toLowerCase(), password, role, initials, bio, location)

  const user = rowToUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id))
  res.json({ ok: true, user })
})

app.patch('/api/users/:id', (req, res) => {
  const { id } = req.params
  const { bio, location, username } = req.body

  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  if (!existing) return res.status(404).json({ ok: false, error: 'Usuario no encontrado.' })

  const newBio      = bio      !== undefined ? bio      : existing.bio
  const newLocation = location !== undefined ? location : existing.location
  const newUsername = username !== undefined ? username.trim() : existing.username
  const newInitials = newUsername.slice(0, 2).toUpperCase()

  db.prepare(`
    UPDATE users SET bio = ?, location = ?, username = ?, initials = ? WHERE id = ?
  `).run(newBio, newLocation, newUsername, newInitials, id)

  const user = rowToUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id))
  res.json({ ok: true, user })
})

app.get('/api/events', (req, res) => {
  const { genre, city, search, sortBy } = req.query

  let sql = 'SELECT * FROM events WHERE 1=1'
  const params = []

  if (genre) { sql += ' AND genre = ?'; params.push(genre) }
  if (city)  { sql += ' AND city = ?';  params.push(city)  }

  if (search && search.trim()) {
    const q = `%${search.trim().toLowerCase()}%`
    sql += ` AND (
      LOWER(title)  LIKE ? OR LOWER(artist) LIKE ? OR LOWER(genre) LIKE ?
      OR LOWER(city) LIKE ? OR LOWER(venue)  LIKE ? OR LOWER(tags)  LIKE ?
    )`
    params.push(q, q, q, q, q, q)
  }

  if (sortBy === 'date')       sql += ' ORDER BY date ASC'
  else if (sortBy === 'price_asc')  sql += ' ORDER BY price ASC'
  else if (sortBy === 'price_desc') sql += ' ORDER BY price DESC'
  else if (sortBy === 'popular')    sql += ' ORDER BY attending DESC'
  else                              sql += ' ORDER BY date ASC'

  const rows = db.prepare(sql).all(...params)
  res.json(rows.map(rowToEvent))
})

app.get('/api/events/featured', (req, res) => {
  const rows = db.prepare('SELECT * FROM events WHERE featured = 1 ORDER BY date ASC').all()
  res.json(rows.map(rowToEvent))
})

app.get('/api/events/organizer/:organizerId', (req, res) => {
  const rows = db.prepare('SELECT * FROM events WHERE organizer_id = ? ORDER BY date ASC').all(req.params.organizerId)
  res.json(rows.map(rowToEvent))
})

app.get('/api/events/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ ok: false, error: 'Evento no encontrado.' })
  res.json(rowToEvent(row))
})

app.post('/api/events', (req, res) => {
  const { organizerId, organizerName, title, artist, genre, city, venue, address,
          date, time, price, capacity, description, tags } = req.body

  if (!organizerId) return res.status(401).json({ ok: false, error: 'No autenticado.' })
  if (!title || !artist || !genre || !city || !venue || !date || !time) {
    return res.status(400).json({ ok: false, error: 'Faltan campos obligatorios.' })
  }

  const id = `e${Date.now()}`
  const createdAt = new Date().toISOString()

  db.prepare(`
    INSERT INTO events
      (id, title, artist, genre, city, venue, address, date, time, price, capacity,
       description, tags, organizer_id, organizer_name, attending, featured, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)
  `).run(
    id, title, artist, genre, city, venue, address ?? '',
    date, time, price ?? 0, capacity ?? null,
    description ?? '', JSON.stringify(tags ?? []),
    organizerId, organizerName ?? '', createdAt
  )

  const event = rowToEvent(db.prepare('SELECT * FROM events WHERE id = ?').get(id))
  res.status(201).json(event)
})

app.listen(PORT, () => {
  console.log(`SoundSeekers API → http://localhost:${PORT}`)
})
