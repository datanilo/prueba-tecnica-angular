# Solución Prueba Técnica

Este proyecto es una aplicación de búsqueda de música desarrollada con Angular 19 que permite buscar artistas, navegar por sus álbumes y canciones, y gestionar playlists personalizadas.

## 🚀 Funcionalidades

- **Búsqueda de Artistas** - Encuentra tus artistas favoritos a través de la API de Spotify
- **Exploración de Álbumes** - Visualiza todos los álbumes de un artista específico
- **Listado de Canciones** - Accede a las canciones de cada álbum con detalles como duración y enlaces directos
- **Gestión de Playlists** - Crea, modifica y sigue playlists personalizadas
- **Autenticación Integrada** - Inicia sesión con tu cuenta de Spotify

## 🛠️ Tecnologías

- **Frontend:** Angular 19, TailwindCSS
- **Backend:** Node.js, Express, TypeScript
- **API:** Spotify Web API
- **Autenticación:** OAuth 2.0 con JWT
- **Despliegue:** Docker, Docker Compose

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Cuenta de desarrollador en Spotify
- Docker y Docker Compose (opcional, para ejecución en contenedores)

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/datanilo/prueba-tecnica-angular.git
cd prueba-tecnica-angular
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Instalar dependencias del backend

```bash
cd server
npm install
cd ..
```

### 4. Configurar credenciales de Spotify

1. Ve a [Spotify for Developers](https://developer.spotify.com/dashboard/)
2. Inicia sesión y crea una nueva aplicación
3. Configura la URL de redirección: `http://localhost:4200/auth/callback`
4. Copia el Client ID y Client Secret

### 5. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `server` con el siguiente contenido:

```
# Puerto del servidor
PORT=4000

# Credenciales de Spotify
SPOTIFY_CLIENT_ID=tu_client_id_de_spotify
SPOTIFY_CLIENT_SECRET=tu_client_secret_de_spotify
SPOTIFY_REDIRECT_URI=http://localhost:4200/auth/callback

# Secreto JWT
JWT_SECRET=tu_clave_secreta_para_los_tokens
JWT_EXPIRES_IN=7d
```

## 🚀 Ejecución

### A. Modo Local

#### Modo desarrollo completo (frontend + backend)

```bash
npm run dev
```

#### Ejecutar solo el frontend

```bash
npm start
```

#### Ejecutar solo el backend

```bash
npm run server
```

El frontend estará disponible en `http://localhost:4200` y el backend en `http://localhost:4000`.

### B. Modo Docker

El proyecto incluye configuración para Docker, permitiendo ejecutar la aplicación en contenedores:

#### 1. Construir y ejecutar con Docker Compose

```bash
docker-compose up
```

Para ejecutar en segundo plano:

```bash
docker-compose up -d
```

#### 2. Detener los contenedores

```bash
docker-compose down
```

Al usar Docker, la aplicación estará disponible en:
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
/
├── src/                # Código fuente del frontend (Angular)
│   ├── app/            # Componentes, servicios y módulos
│   ├── assets/         # Imágenes, fuentes y recursos estáticos
│   └── environments/   # Configuraciones por entorno
│
├── server/             # Código fuente del backend (Node.js/Express)
│   ├── src/
│   │   ├── controllers/  # Controladores de la API
│   │   ├── routes/       # Definición de rutas
│   │   ├── middleware/   # Middlewares (autenticación, etc.)
│   │   └── utils/        # Utilidades y helpers
│   └── .env             # Variables de entorno (crear manualmente)
│
├── Dockerfile          # Configuración para construcción de imagen Docker
├── docker-compose.yml  # Configuración para orquestación de contenedores
└── docker-entrypoint.sh # Script de inicio para el contenedor
```

## 📚 API Endpoints

### Spotify API

- `GET /api/spotify/search/{artist}` - Buscar artistas
- `GET /api/spotify/artist/{id}/albums` - Obtener álbumes de un artista
- `GET /api/spotify/album/{id}/tracks` - Obtener canciones de un álbum

### Autenticación

- `GET /api/auth/login` - Redirige a la autenticación de Spotify
- `GET /api/auth/callback` - Callback de la autenticación
- `GET /api/auth/refresh` - Refrescar token de acceso

### Playlists

- `GET /api/playlists` - Obtener playlists del usuario
- `POST /api/playlists` - Crear una playlist
- `PUT /api/playlists/{id}` - Actualizar una playlist
- `DELETE /api/playlists/{id}` - Eliminar una playlist

## 📝 Notas de Diseño

Para el desarrollo de esta aplicación se utilizó la aplicación web de Spotify como base para el diseño y la interfaz de usuario. Se tomó esta decisión debido a que no se encontró un UI Kit de Figma en la comunidad que cumpliera con las necesidades específicas de esta prueba técnica.

El diseño se implementó utilizando TailwindCSS, recreando los elementos visuales y la experiencia de usuario de Spotify, pero adaptándolos a los requerimientos específicos de esta prueba técnica.

---

