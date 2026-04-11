async function request(method, path, body) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok && res.status !== 400) throw new Error(`API error ${res.status}`)
  return res.json()
}

const get  = (path)         => request('GET',   path)
const post = (path, body)   => request('POST',  path, body)
const patch = (path, body)  => request('PATCH', path, body)

export const login    = (email, password)  => post('/api/auth/login',    { email, password })
export const register = (data)             => post('/api/auth/register', data)

export const updateUser = (id, updates)    => patch(`/api/users/${id}`,  updates)

export const getEvents = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString()
  return get(`/api/events${qs ? `?${qs}` : ''}`)
}

export const getFeaturedEvents      = ()         => get('/api/events/featured')
export const getEventById           = (id)       => get(`/api/events/${id}`)
export const getEventsByOrganizer   = (orgId)    => get(`/api/events/organizer/${orgId}`)
export const createEvent            = (data)     => post('/api/events', data)
