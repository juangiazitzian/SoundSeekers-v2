# SoundSeekers

Aplicación web desarrollada en el marco del Seminario de Gestión de Tecnología 2024 de UADE. El proyecto propone una plataforma centralizada para el descubrimiento y la promoción de eventos musicales, especialmente de artistas emergentes, permitiendo a los usuarios explorar, filtrar y acceder a experiencias de música en vivo.

## Contexto

La dispersión de información sobre eventos musicales en redes sociales y plataformas diversas dificulta tanto el descubrimiento para los fans como la visibilidad para los artistas independientes. SoundSeekers centraliza esa información en un solo lugar, con foco en la escena emergente argentina.

## Funcionalidades

- Listado y exploración de eventos musicales con diseño en cards
- Filtros por género musical, ciudad y búsqueda libre
- Detalle completo de cada evento: artista, lugar, fecha, precio y disponibilidad
- Registro e inicio de sesión con tres roles: Fan, Artista y Organizador
- Publicación de nuevos eventos (usuarios autenticados)
- Perfil de usuario con historial de eventos publicados
- 60 eventos demo precargados con datos realistas

## Requisitos

- Node.js 18 o superior

## Instalación y ejecución

```bash
npm install
npm run dev
```

La aplicación se abre automáticamente en `http://localhost:5173`

## Cuentas demo

| Rol         | Email                 | Contraseña |
|-------------|-----------------------|------------|
| Fan         | fan@demo.com          | demo123    |
| Artista     | artista@demo.com      | demo123    |
| Organizador | organizador@demo.com  | demo123    |

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| React 18 + Vite 5 | Framework frontend y bundler |
| Zustand 5 | Estado global con persistencia en localStorage |
| React Router 6 | Navegación entre vistas |
| Tailwind CSS 3 | Estilos y diseño responsivo |
| date-fns 4 | Formateo de fechas en español |
| Lucide React | Iconografía |

## Arquitectura

La aplicación es una SPA (Single Page Application) completamente del lado del cliente. No requiere backend ni base de datos externa. Los datos se persisten en el `localStorage` del navegador mediante Zustand, lo que permite mantener sesión y conservar eventos creados entre sesiones en la misma máquina.

Los datos demo (eventos y usuarios) se cargan desde `src/data/seedData.js` al iniciar por primera vez.

## Estructura del proyecto

```
src/
├── data/
│   └── seedData.js        # Datos demo: 60 eventos, 5 usuarios, configuración de géneros
├── store/
│   └── index.js           # Store Zustand: autenticación, eventos, filtros
├── components/
│   ├── Navbar.jsx
│   ├── EventCard.jsx
│   ├── EventFilters.jsx
│   └── Footer.jsx
└── pages/
    ├── Home.jsx            # Página principal con hero, filtros y grilla de eventos
    ├── EventDetail.jsx     # Vista de detalle de evento
    ├── Login.jsx
    ├── Register.jsx
    ├── CreateEvent.jsx     # Formulario de publicación con vista previa
    └── Profile.jsx
```

## Notas

- Para restablecer los datos al estado inicial: abrir DevTools del navegador, ir a Application > Local Storage y eliminar la clave `soundseekers-v1`.
- La aplicación no realiza cobros ni envía datos a ningún servidor externo.
- Los eventos demo cubren las ciudades de Buenos Aires, Córdoba, Rosario, Mendoza, La Plata y Mar del Plata, con géneros que incluyen rock, indie, techno, electronic, trap, hip-hop, jazz, blues, folklore, metal, pop y reggaeton.
