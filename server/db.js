import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, 'soundseekers.db'))

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    username    TEXT UNIQUE NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'fan',
    initials    TEXT NOT NULL,
    bio         TEXT DEFAULT '',
    location    TEXT DEFAULT '',
    following   TEXT DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS events (
    id             TEXT PRIMARY KEY,
    title          TEXT NOT NULL,
    artist         TEXT NOT NULL,
    genre          TEXT NOT NULL,
    city           TEXT NOT NULL,
    venue          TEXT NOT NULL,
    address        TEXT DEFAULT '',
    date           TEXT NOT NULL,
    time           TEXT NOT NULL,
    price          REAL DEFAULT 0,
    capacity       INTEGER,
    description    TEXT DEFAULT '',
    tags           TEXT DEFAULT '[]',
    organizer_id   TEXT,
    organizer_name TEXT,
    attending      INTEGER DEFAULT 0,
    featured       INTEGER DEFAULT 0,
    created_at     TEXT NOT NULL,
    FOREIGN KEY (organizer_id) REFERENCES users(id)
  );
`)

export function rowToUser(row) {
  if (!row) return null
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    role: row.role,
    initials: row.initials,
    bio: row.bio || '',
    location: row.location || '',
    following: JSON.parse(row.following || '[]'),
  }
}

export function rowToEvent(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    genre: row.genre,
    city: row.city,
    venue: row.venue,
    address: row.address || '',
    date: row.date,
    time: row.time,
    price: row.price ?? 0,
    capacity: row.capacity ?? null,
    description: row.description || '',
    tags: JSON.parse(row.tags || '[]'),
    organizerId: row.organizer_id,
    organizerName: row.organizer_name,
    attending: row.attending ?? 0,
    featured: row.featured === 1,
    createdAt: row.created_at,
  }
}

const seedUsers = [
  { id: 'u1', username: 'juliana_m',   email: 'fan@demo.com',          password: 'demo123', role: 'fan',       initials: 'JM', bio: 'Amante del indie y la música emergente. Siempre en el próximo show.',            location: 'Buenos Aires', following: ['u2','u3','u4'] },
  { id: 'u2', username: 'los_duendes', email: 'artista@demo.com',      password: 'demo123', role: 'artist',    initials: 'LD', bio: 'Banda de indie-rock porteña. Desde 2019 creando paisajes sonoros únicos.',       location: 'Buenos Aires', following: [] },
  { id: 'u3', username: 'lucia_prod',  email: 'organizador@demo.com',  password: 'demo123', role: 'organizer', initials: 'LP', bio: 'Productora de eventos musicales independientes. 8 años en la escena.',           location: 'Buenos Aires', following: ['u2'] },
  { id: 'u4', username: 'neonfantasma',email: 'neon@demo.com',         password: 'demo123', role: 'artist',    initials: 'NF', bio: 'Productor de electrónica y synthwave. Creando sonidos del futuro desde Córdoba.', location: 'Córdoba',      following: [] },
  { id: 'u5', username: 'mariano_fan', email: 'mariano@demo.com',      password: 'demo123', role: 'fan',       initials: 'MF', bio: 'Melómano empedernido. Rock, jazz, no importa — si es bueno, ahí estoy.',          location: 'Rosario',      following: ['u2','u4'] },
]

const NOW = new Date().toISOString()
const seedEvents = [
  { id:'e1',  title:'Noche de Shoegaze',         artist:'Los Cometas Grises',        genre:'Indie',      city:'Buenos Aires', venue:'Club Niceto',                   address:'Niceto Vega 5510, Palermo',               date:'2026-04-18', time:'21:30', price:4000, capacity:350,  attending:210,  featured:1, description:'Los Cometas Grises regresan a Niceto con su propuesta de shoegaze y dream pop más intensa hasta la fecha. Una noche de pedales, capas sonoras y letras que calan hondo. Show previo a su gira por Latinoamérica.', tags:['shoegaze','dream pop','emergente','palermo'],                     organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e2',  title:'Techno Oscuro Vol.3',        artist:'CERO/CERO + Guests',         genre:'Techno',     city:'Córdoba',      venue:'La Fábrica Club',               address:'Bv. San Juan 801, Nueva Córdoba',          date:'2026-04-22', time:'23:00', price:5500, capacity:600,  attending:480,  featured:1, description:'La tercera edición de la noche más oscura de Córdoba. CERO/CERO invita a dos DJs internacionales para una jornada de techno industrial y noise que se extiende hasta el amanecer. Capacidad limitada.', tags:['techno industrial','noise','underground','nueva córdoba'],        organizer_id:'u4', organizer_name:'neonfantasma' },
  { id:'e3',  title:'Trap en Las Márgenes',       artist:'Sombra Urbana & Guests',     genre:'Trap',       city:'Buenos Aires', venue:'El Bajo Fondo',                 address:'Av. Corrientes 2200, Centro',              date:'2026-04-25', time:'22:00', price:3500, capacity:250,  attending:178,  featured:0, description:'Sombra Urbana presenta su nuevo EP "Cemento" en vivo, con invitados sorpresa de la escena del trap porteño. Un espacio íntimo para los que siguen la escena desde el principio.', tags:['trap','freestyle','emergente','corrientes'],                      organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e4',  title:'Jazz Standards & Más',       artist:'Quinteto Río Plata',         genre:'Jazz',       city:'Rosario',      venue:'Teatro El Círculo',             address:'Laprida 1235, Centro',                    date:'2026-04-20', time:'20:00', price:6500, capacity:400,  attending:290,  featured:0, description:'El Quinteto Río Plata interpreta clásicos del jazz junto a composiciones propias que exploran la fusión con el folklore del litoral. Una velada elegante en el teatro más emblemático de Rosario.', tags:['jazz','fusión','estándar','teatro'],                              organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e5',  title:'Rock Emergente Fest',        artist:'La Grieta + El Molino + TBA',genre:'Rock',       city:'Mendoza',      venue:'Estadio Aconcagua',             address:'Av. San Martín 650, Ciudad',              date:'2026-05-03', time:'18:00', price:7000, capacity:1200, attending:860,  featured:1, description:'El festival de rock emergente más grande del cuyo reúne a tres de las bandas con más proyección del interior argentino. La Grieta con su rock poderoso, El Molino con post-rock instrumental, y una tercera banda por confirmar. Fecha histórica.', tags:['rock','festival','emergente','cuyo','mendoza'],                   organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e6',  title:'Synthwave Nocturno',         artist:'Neón Fantasma',              genre:'Electronic', city:'Buenos Aires', venue:'Club Roxy',                     address:'Av. Figueroa Alcorta 6000, Palermo',      date:'2026-04-30', time:'22:30', price:4500, capacity:300,  attending:215,  featured:1, description:'Neón Fantasma lleva su set de synthwave y retrowave a Buenos Aires por primera vez. Visuales generados en tiempo real, sintetizadores analógicos y una atmósfera que transporta a los 80 desde el futuro.', tags:['synthwave','retrowave','electrónica','visuales'],                 organizer_id:'u4', organizer_name:'neonfantasma' },
  { id:'e7',  title:'Folklore Raíz',              artist:'Agustina Medina',            genre:'Folklore',   city:'Córdoba',      venue:'Casa de la Cultura',            address:'27 de Abril 179, Centro',                 date:'2026-05-08', time:'20:30', price:2500, capacity:200,  attending:140,  featured:0, description:'Agustina Medina presenta "Raíz", su primer disco solista que fusiona el folklore serrano con elementos de jazz y música contemporánea. Una propuesta fresca que reinterpreta la tradición sin perder su esencia.', tags:['folklore','fusión','solista','córdoba'],                          organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e8',  title:'Indie Porteño: Vol. 7',      artist:'Los Duendes Eléctricos',     genre:'Indie',      city:'Buenos Aires', venue:'Matienzo Club',                 address:'Matienzo 2424, Coghlan',                  date:'2026-05-01', time:'21:00', price:3500, capacity:280,  attending:230,  featured:0, description:'La séptima edición de la serie "Indie Porteño" vuelve a Matienzo con Los Duendes Eléctricos encabezando una noche de cuatro bandas emergentes de la ciudad. El mejor indie-rock argentino en un espacio íntimo y único.', tags:['indie rock','indie pop','emergente','porteño'],                   organizer_id:'u2', organizer_name:'los_duendes' },
  { id:'e9',  title:'Sesiones de Trap: Rosario',  artist:'Flow Clandestino Crew',      genre:'Trap',       city:'Rosario',      venue:'El Galpón Cultural',            address:'Güemes 2540, Pichincha',                  date:'2026-05-06', time:'22:00', price:2800, capacity:180,  attending:120,  featured:0, description:'Flow Clandestino Crew lleva las "Sesiones de Trap" a Rosario por segunda vez. Una noche de freestyle, beats en vivo y colaboraciones espontáneas. La escena del trap en el litoral tiene su espacio.', tags:['trap','freestyle','sesiones','litoral'],                          organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e10', title:'Blues del Atlántico',        artist:'The Southern Cats',          genre:'Blues',      city:'Mar del Plata',venue:'Teatro Auditorium',             address:'Bv. Marítimo P. Peralta Ramos 8116',      date:'2026-05-10', time:'21:00', price:4200, capacity:500,  attending:310,  featured:0, description:'The Southern Cats celebran 10 años de carrera con un show especial frente al mar. Blues, rock sureño y soul en uno de los teatros más icónicos de la costa atlántica argentina. Noche de gala para la escena.', tags:['blues','rock sureño','soul','aniversario'],                       organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e11', title:'Metal sin Filtros',          artist:'Tormenta de Acero',          genre:'Metal',      city:'Buenos Aires', venue:'Vorterix Teatro',               address:'Federico Lacroze 3455, Chacarita',        date:'2026-05-15', time:'20:30', price:9000, capacity:800,  attending:650,  featured:0, description:'Tormenta de Acero presenta "Punto de Quiebre", su disco más ambicioso. El show incluye efectos pirotécnicos, pantallas LED de 12 metros y el set más largo de su carrera. Metal argentino en estado puro, sin concesiones.', tags:['metal','heavy metal','thrash','chacarita'],                       organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e12', title:'Pop Emergente: Luna Silvestre',artist:'Luna Silvestre',           genre:'Pop',        city:'La Plata',     venue:'Ciudad Cultural Universitaria', address:'Calle 7 y 50, La Plata',                  date:'2026-04-28', time:'20:00', price:3000, capacity:350,  attending:280,  featured:1, description:'Luna Silvestre lleva su pop íntimo y honesto a La Plata. Con letras sobre identidad, memoria y amor contemporáneo, este show presenta las canciones de "Marea Alta", su disco debut. Abrirá Valeria Voss, artista revelación del año.', tags:['pop','indie pop','debut','femenino'],                             organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e13', title:'Rock de las Pampas',         artist:'Rancho del Este',            genre:'Rock',       city:'Buenos Aires', venue:'La Trastienda Club',            address:'Balcarce 460, San Telmo',                 date:'2026-04-17', time:'21:30', price:5500, capacity:450,  attending:310,  featured:0, description:'Rancho del Este llega a La Trastienda con su rock poderoso y letras criollas. Tres guitarras, una sección rítmica sin freno y canciones que hablan de tierra, identidad y resistencia. Una de las bandas más sólidas de la escena emergente bonaerense.', tags:['rock','rock nacional','san telmo','emergente'],                   organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e14', title:'Guitarras al Límite',        artist:'Cuadro de Mando',            genre:'Rock',       city:'Rosario',      venue:'El Riff Bar',                   address:'Mitre 869, Centro',                       date:'2026-04-24', time:'22:00', price:3200, capacity:200,  attending:155,  featured:0, description:'Cuadro de Mando regresa al Riff con el set más largo de su carrera. Nuevo material mezclado con los temas que los catapultaron en la escena rosarina. Dos horas de rock sin concesiones en el bar de referencia del under santafesino.', tags:['rock','under','rosario','guitarras'],                             organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e15', title:'Rock en el Anfiteatro',      artist:'Fractura Expuesta',          genre:'Rock',       city:'Mendoza',      venue:'Anfiteatro Frank Romero Day',   address:'Parque General San Martín',               date:'2026-05-17', time:'19:00', price:4500, capacity:2000, attending:1340, featured:1, description:'El anfiteatro más icónico de Mendoza recibe a Fractura Expuesta en lo que promete ser el show del año en el cuyo. Producción a la altura, sonido impecable y una banda en su mejor momento. Rock argentino con los Andes de fondo.', tags:['rock','anfiteatro','mendoza','aire libre'],                       organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e16', title:'Rock Urbano: Vol. 3',        artist:'Los Sin Nombre',             genre:'Rock',       city:'Buenos Aires', venue:'Uniclub',                       address:'Guardia Vieja 3360, Almagro',             date:'2026-05-21', time:'22:00', price:3000, capacity:250,  attending:188,  featured:0, description:'Los Sin Nombre llevan su rock urbano sucio y urgente al Uniclub. Tres años de shows en el under porteño los convirtieron en referentes de una escena que no pide permiso. Este show cierra una trilogía de fechas en vivo.', tags:['rock','under','almagro','urgente'],                               organizer_id:'u2', organizer_name:'los_duendes' },
  { id:'e17', title:'Power Trio Fest',            artist:'Tres al Hilo + Doble Fuerza',genre:'Rock',       city:'La Plata',     venue:'La Grieta',                     address:'Calle 8 Nro. 1248, La Plata',            date:'2026-05-29', time:'21:00', price:2800, capacity:180,  attending:130,  featured:0, description:'Una noche dedicada al power trio: guitarra, bajo, batería y nada más. Dos bandas que demuestran que sobra con eso para llenar cualquier sala. Tres al Hilo y Doble Fuerza en La Grieta, el espacio cultural más vital de La Plata.', tags:['rock','power trio','la plata','instrumental'],                   organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e18', title:'Rock de Madrugada',          artist:'El Ciclo',                   genre:'Rock',       city:'Buenos Aires', venue:'CAFF',                          address:'San Ignacio 62, San Telmo',               date:'2026-06-05', time:'00:30', price:2500, capacity:150,  attending:120,  featured:0, description:'El Ciclo hace lo que mejor sabe: tocar cuando el resto duerme. Su show de madrugada en el CAFF es ya una tradición del under porteño. Oscuro, intenso, sin filtros. Para los que saben que la noche empieza cuando termina la noche.', tags:['rock','madrugada','under','san telmo'],                           organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e19', title:'Córdoba Rock Abierto',       artist:'Maldito Frío + La Caída + TBA',genre:'Rock',     city:'Córdoba',      venue:'Rancho Aparte',                 address:'Ricardo Rojas 67, Nueva Córdoba',         date:'2026-06-12', time:'20:00', price:4000, capacity:300,  attending:210,  featured:0, description:'La sala más querida del rock cordobés recibe tres bandas emergentes en una noche de puertas abiertas. Maldito Frío, La Caída y una banda por confirmar que promete sorprender. Rock del interior que no necesita de la capital para existir.', tags:['rock','córdoba','emergente','multi-banda'],                       organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e20', title:'Volumen Once',               artist:'Ruta 7',                     genre:'Rock',       city:'Buenos Aires', venue:'Teatro ND Ateneo',              address:'Paraguay 918, Centro',                    date:'2026-07-03', time:'21:00', price:7500, capacity:500,  attending:430,  featured:1, description:'Ruta 7 celebra once años de carrera con un show en el Teatro ND Ateneo. Set acústico en la primera mitad, eléctrico puro en la segunda. Repaso por once años de canciones que definieron una generación de rockeros argentinos.', tags:['rock','aniversario','teatro','acústico'],                         organizer_id:'u3', organizer_name:'lucia_prod' },
  { id:'e21', title:'Dream Pop Night',            artist:'Cielo de Papel',             genre:'Indie',      city:'Buenos Aires', venue:'Palermo Club',                  address:'Humboldt 1752, Palermo',                  date:'2026-04-19', time:'21:00', price:3800, capacity:220,  attending:180,  featured:0, description:'Cielo de Papel presenta su propuesta de dream pop con capas de sintetizadores, guitarras reverberadas y letras oníricas. Una noche para perderse en el sonido.', tags:['dream pop','indie','sintetizadores','palermo'],                   organizer_id:'u3', organizer_name:'lucia_prod' },
]

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, username, email, password, role, initials, bio, location, following)
  VALUES (@id, @username, @email, @password, @role, @initials, @bio, @location, @following)
`)

const insertEvent = db.prepare(`
  INSERT OR IGNORE INTO events
    (id, title, artist, genre, city, venue, address, date, time, price, capacity,
     description, tags, organizer_id, organizer_name, attending, featured, created_at)
  VALUES
    (@id, @title, @artist, @genre, @city, @venue, @address, @date, @time, @price, @capacity,
     @description, @tags, @organizer_id, @organizer_name, @attending, @featured, @created_at)
`)

const seedAll = db.transaction(() => {
  for (const u of seedUsers) {
    insertUser.run({ ...u, following: JSON.stringify(u.following) })
  }
  for (const e of seedEvents) {
    insertEvent.run({ ...e, tags: JSON.stringify(e.tags), created_at: NOW })
  }
})

seedAll()

export default db
