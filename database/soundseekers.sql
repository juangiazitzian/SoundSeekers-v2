PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  username    TEXT UNIQUE  NOT NULL,
  email       TEXT UNIQUE  NOT NULL,
  password    TEXT         NOT NULL,
  role        TEXT         NOT NULL DEFAULT 'fan',
  initials    TEXT         NOT NULL,
  bio         TEXT                  DEFAULT '',
  location    TEXT                  DEFAULT '',
  following   TEXT                  DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS events (
  id             TEXT PRIMARY KEY,
  title          TEXT    NOT NULL,
  artist         TEXT    NOT NULL,
  genre          TEXT    NOT NULL,
  city           TEXT    NOT NULL,
  venue          TEXT    NOT NULL,
  address        TEXT             DEFAULT '',
  date           TEXT    NOT NULL,
  time           TEXT    NOT NULL,
  price          REAL             DEFAULT 0,
  capacity       INTEGER,
  description    TEXT             DEFAULT '',
  tags           TEXT             DEFAULT '[]',
  organizer_id   TEXT,
  organizer_name TEXT,
  attending      INTEGER          DEFAULT 0,
  featured       INTEGER          DEFAULT 0,
  created_at     TEXT    NOT NULL,
  FOREIGN KEY (organizer_id) REFERENCES users(id)
);

INSERT OR IGNORE INTO users (id, username, email, password, role, initials, bio, location, following) VALUES
  ('u1', 'juliana_m',    'fan@demo.com',         'demo123', 'fan',       'JM', 'Amante del indie y la música emergente. Siempre en el próximo show.',             'Buenos Aires', '["u2","u3","u4"]'),
  ('u2', 'los_duendes',  'artista@demo.com',      'demo123', 'artist',    'LD', 'Banda de indie-rock porteña. Desde 2019 creando paisajes sonoros únicos.',        'Buenos Aires', '[]'),
  ('u3', 'lucia_prod',   'organizador@demo.com',  'demo123', 'organizer', 'LP', 'Productora de eventos musicales independientes. 8 años en la escena.',            'Buenos Aires', '["u2"]'),
  ('u4', 'neonfantasma', 'neon@demo.com',         'demo123', 'artist',    'NF', 'Productor de electrónica y synthwave. Creando sonidos del futuro desde Córdoba.', 'Córdoba',      '[]'),
  ('u5', 'mariano_fan',  'mariano@demo.com',      'demo123', 'fan',       'MF', 'Melómano empedernido. Rock, jazz, no importa — si es bueno, ahí estoy.',          'Rosario',      '["u2","u4"]');

INSERT OR IGNORE INTO events
  (id, title, artist, genre, city, venue, address, date, time, price, capacity, attending, featured, description, tags, organizer_id, organizer_name, created_at)
VALUES
  ('e1',  'Noche de Shoegaze',
          'Los Cometas Grises', 'Indie', 'Buenos Aires', 'Club Niceto', 'Niceto Vega 5510, Palermo',
          '2026-04-18', '21:30', 4000, 350, 210, 1,
          'Los Cometas Grises regresan a Niceto con su propuesta de shoegaze y dream pop más intensa hasta la fecha. Una noche de pedales, capas sonoras y letras que calan hondo. Show previo a su gira por Latinoamérica.',
          '["shoegaze","dream pop","emergente","palermo"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e2',  'Techno Oscuro Vol.3',
          'CERO/CERO + Guests', 'Techno', 'Córdoba', 'La Fábrica Club', 'Bv. San Juan 801, Nueva Córdoba',
          '2026-04-22', '23:00', 5500, 600, 480, 1,
          'La tercera edición de la noche más oscura de Córdoba. CERO/CERO invita a dos DJs internacionales para una jornada de techno industrial y noise que se extiende hasta el amanecer. Capacidad limitada.',
          '["techno industrial","noise","underground","nueva córdoba"]', 'u4', 'neonfantasma', '2026-01-10T00:00:00.000Z'),

  ('e3',  'Trap en Las Márgenes',
          'Sombra Urbana & Guests', 'Trap', 'Buenos Aires', 'El Bajo Fondo', 'Av. Corrientes 2200, Centro',
          '2026-04-25', '22:00', 3500, 250, 178, 0,
          'Sombra Urbana presenta su nuevo EP "Cemento" en vivo, con invitados sorpresa de la escena del trap porteño. Un espacio íntimo para los que siguen la escena desde el principio.',
          '["trap","freestyle","emergente","corrientes"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e4',  'Jazz Standards & Más',
          'Quinteto Río Plata', 'Jazz', 'Rosario', 'Teatro El Círculo', 'Laprida 1235, Centro',
          '2026-04-20', '20:00', 6500, 400, 290, 0,
          'El Quinteto Río Plata interpreta clásicos del jazz junto a composiciones propias que exploran la fusión con el folklore del litoral. Una velada elegante en el teatro más emblemático de Rosario.',
          '["jazz","fusión","estándar","teatro"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e5',  'Rock Emergente Fest',
          'La Grieta + El Molino + TBA', 'Rock', 'Mendoza', 'Estadio Aconcagua', 'Av. San Martín 650, Ciudad',
          '2026-05-03', '18:00', 7000, 1200, 860, 1,
          'El festival de rock emergente más grande del cuyo reúne a tres de las bandas con más proyección del interior argentino. La Grieta con su rock poderoso, El Molino con post-rock instrumental, y una tercera banda por confirmar. Fecha histórica.',
          '["rock","festival","emergente","cuyo","mendoza"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e6',  'Synthwave Nocturno',
          'Neón Fantasma', 'Electronic', 'Buenos Aires', 'Club Roxy', 'Av. Figueroa Alcorta 6000, Palermo',
          '2026-04-30', '22:30', 4500, 300, 215, 1,
          'Neón Fantasma lleva su set de synthwave y retrowave a Buenos Aires por primera vez. Visuales generados en tiempo real, sintetizadores analógicos y una atmósfera que transporta a los 80 desde el futuro.',
          '["synthwave","retrowave","electrónica","visuales"]', 'u4', 'neonfantasma', '2026-01-10T00:00:00.000Z'),

  ('e7',  'Folklore Raíz',
          'Agustina Medina', 'Folklore', 'Córdoba', 'Casa de la Cultura', '27 de Abril 179, Centro',
          '2026-05-08', '20:30', 2500, 200, 140, 0,
          'Agustina Medina presenta "Raíz", su primer disco solista que fusiona el folklore serrano con elementos de jazz y música contemporánea. Una propuesta fresca que reinterpreta la tradición sin perder su esencia.',
          '["folklore","fusión","solista","córdoba"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e8',  'Indie Porteño: Vol. 7',
          'Los Duendes Eléctricos', 'Indie', 'Buenos Aires', 'Matienzo Club', 'Matienzo 2424, Coghlan',
          '2026-05-01', '21:00', 3500, 280, 230, 0,
          'La séptima edición de la serie "Indie Porteño" vuelve a Matienzo con Los Duendes Eléctricos encabezando una noche de cuatro bandas emergentes de la ciudad. El mejor indie-rock argentino en un espacio íntimo y único.',
          '["indie rock","indie pop","emergente","porteño"]', 'u2', 'los_duendes', '2026-01-10T00:00:00.000Z'),

  ('e9',  'Sesiones de Trap: Rosario',
          'Flow Clandestino Crew', 'Trap', 'Rosario', 'El Galpón Cultural', 'Güemes 2540, Pichincha',
          '2026-05-06', '22:00', 2800, 180, 120, 0,
          'Flow Clandestino Crew lleva las "Sesiones de Trap" a Rosario por segunda vez. Una noche de freestyle, beats en vivo y colaboraciones espontáneas. La escena del trap en el litoral tiene su espacio.',
          '["trap","freestyle","sesiones","litoral"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e10', 'Blues del Atlántico',
          'The Southern Cats', 'Blues', 'Mar del Plata', 'Teatro Auditorium', 'Bv. Marítimo P. Peralta Ramos 8116',
          '2026-05-10', '21:00', 4200, 500, 310, 0,
          'The Southern Cats celebran 10 años de carrera con un show especial frente al mar. Blues, rock sureño y soul en uno de los teatros más icónicos de la costa atlántica argentina. Noche de gala para la escena.',
          '["blues","rock sureño","soul","aniversario"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e11', 'Metal sin Filtros',
          'Tormenta de Acero', 'Metal', 'Buenos Aires', 'Vorterix Teatro', 'Federico Lacroze 3455, Chacarita',
          '2026-05-15', '20:30', 9000, 800, 650, 0,
          'Tormenta de Acero presenta "Punto de Quiebre", su disco más ambicioso. El show incluye efectos pirotécnicos, pantallas LED de 12 metros y el set más largo de su carrera. Metal argentino en estado puro, sin concesiones.',
          '["metal","heavy metal","thrash","chacarita"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e12', 'Pop Emergente: Luna Silvestre',
          'Luna Silvestre', 'Pop', 'La Plata', 'Ciudad Cultural Universitaria', 'Calle 7 y 50, La Plata',
          '2026-04-28', '20:00', 3000, 350, 280, 1,
          'Luna Silvestre lleva su pop íntimo y honesto a La Plata. Con letras sobre identidad, memoria y amor contemporáneo, este show presenta las canciones de "Marea Alta", su disco debut. Abrirá Valeria Voss, artista revelación del año.',
          '["pop","indie pop","debut","femenino"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e13', 'Rock de las Pampas',
          'Rancho del Este', 'Rock', 'Buenos Aires', 'La Trastienda Club', 'Balcarce 460, San Telmo',
          '2026-04-17', '21:30', 5500, 450, 310, 0,
          'Rancho del Este llega a La Trastienda con su rock poderoso y letras criollas. Tres guitarras, una sección rítmica sin freno y canciones que hablan de tierra, identidad y resistencia. Una de las bandas más sólidas de la escena emergente bonaerense.',
          '["rock","rock nacional","san telmo","emergente"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e14', 'Guitarras al Límite',
          'Cuadro de Mando', 'Rock', 'Rosario', 'El Riff Bar', 'Mitre 869, Centro',
          '2026-04-24', '22:00', 3200, 200, 155, 0,
          'Cuadro de Mando regresa al Riff con el set más largo de su carrera. Nuevo material mezclado con los temas que los catapultaron en la escena rosarina. Dos horas de rock sin concesiones en el bar de referencia del under santafesino.',
          '["rock","under","rosario","guitarras"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e15', 'Rock en el Anfiteatro',
          'Fractura Expuesta', 'Rock', 'Mendoza', 'Anfiteatro Frank Romero Day', 'Parque General San Martín',
          '2026-05-17', '19:00', 4500, 2000, 1340, 1,
          'El anfiteatro más icónico de Mendoza recibe a Fractura Expuesta en lo que promete ser el show del año en el cuyo. Producción a la altura, sonido impecable y una banda en su mejor momento. Rock argentino con los Andes de fondo.',
          '["rock","anfiteatro","mendoza","aire libre"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e16', 'Rock Urbano: Vol. 3',
          'Los Sin Nombre', 'Rock', 'Buenos Aires', 'Uniclub', 'Guardia Vieja 3360, Almagro',
          '2026-05-21', '22:00', 3000, 250, 188, 0,
          'Los Sin Nombre llevan su rock urbano sucio y urgente al Uniclub. Tres años de shows en el under porteño los convirtieron en referentes de una escena que no pide permiso. Este show cierra una trilogía de fechas en vivo.',
          '["rock","under","almagro","urgente"]', 'u2', 'los_duendes', '2026-01-10T00:00:00.000Z'),

  ('e17', 'Power Trio Fest',
          'Tres al Hilo + Doble Fuerza', 'Rock', 'La Plata', 'La Grieta', 'Calle 8 Nro. 1248, La Plata',
          '2026-05-29', '21:00', 2800, 180, 130, 0,
          'Una noche dedicada al power trio: guitarra, bajo, batería y nada más. Dos bandas que demuestran que sobra con eso para llenar cualquier sala. Tres al Hilo y Doble Fuerza en La Grieta, el espacio cultural más vital de La Plata.',
          '["rock","power trio","la plata","instrumental"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e18', 'Rock de Madrugada',
          'El Ciclo', 'Rock', 'Buenos Aires', 'CAFF', 'San Ignacio 62, San Telmo',
          '2026-06-05', '00:30', 2500, 150, 120, 0,
          'El Ciclo hace lo que mejor sabe: tocar cuando el resto duerme. Su show de madrugada en el CAFF es ya una tradición del under porteño. Oscuro, intenso, sin filtros. Para los que saben que la noche empieza cuando termina la noche.',
          '["rock","madrugada","under","san telmo"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e19', 'Córdoba Rock Abierto',
          'Maldito Frío + La Caída + TBA', 'Rock', 'Córdoba', 'Rancho Aparte', 'Ricardo Rojas 67, Nueva Córdoba',
          '2026-06-12', '20:00', 4000, 300, 210, 0,
          'La sala más querida del rock cordobés recibe tres bandas emergentes en una noche de puertas abiertas. Maldito Frío, La Caída y una banda por confirmar que promete sorprender. Rock del interior que no necesita de la capital para existir.',
          '["rock","córdoba","emergente","multi-banda"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e20', 'Volumen Once',
          'Ruta 7', 'Rock', 'Buenos Aires', 'Teatro ND Ateneo', 'Paraguay 918, Centro',
          '2026-07-03', '21:00', 7500, 500, 430, 1,
          'Ruta 7 celebra once años de carrera con un show en el Teatro ND Ateneo. Set acústico en la primera mitad, eléctrico puro en la segunda. Repaso por once años de canciones que definieron una generación de rockeros argentinos.',
          '["rock","aniversario","teatro","acústico"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z'),

  ('e21', 'Dream Pop Night',
          'Cielo de Papel', 'Indie', 'Buenos Aires', 'Palermo Club', 'Humboldt 1752, Palermo',
          '2026-04-19', '21:00', 3800, 220, 180, 0,
          'Cielo de Papel presenta su propuesta de dream pop con capas de sintetizadores, guitarras reverberadas y letras oníricas. Una noche para perderse en el sonido.',
          '["dream pop","indie","sintetizadores","palermo"]', 'u3', 'lucia_prod', '2026-01-10T00:00:00.000Z');
