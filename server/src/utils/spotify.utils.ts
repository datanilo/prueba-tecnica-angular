import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';

dotenv.config();

// Credenciales de Spotify
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:4200/api/auth/callback';

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error('Error: Faltan las credenciales de Spotify en el archivo .env');
  process.exit(1);
}

// Almacenamiento temporal para el token del cliente
let clientToken = {
  token: '',
  expiresAt: 0
};

/**
 * Crea una instancia de la API de Spotify
 */
export const createSpotifyApi = (accessToken?: string): SpotifyWebApi => {
  const spotifyApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URI
  });

  // Si se proporciona un token de acceso, configurarlo
  if (accessToken) {
    spotifyApi.setAccessToken(accessToken);
  }

  return spotifyApi;
};

/**
 * Obtiene un token de acceso de cliente para operaciones públicas
 */
export const getClientToken = async (): Promise<string> => {
  const now = Date.now();
  
  // Si el token es válido, retornarlo
  if (clientToken.token && clientToken.expiresAt > now) {
    return clientToken.token;
  }
  
  try {
    const spotifyApi = createSpotifyApi();
    const data = await spotifyApi.clientCredentialsGrant();
    
    // Almacenar el token y su tiempo de expiración
    clientToken = {
      token: data.body.access_token,
      expiresAt: now + data.body.expires_in * 1000
    };
    
    return clientToken.token;
  } catch (error) {
    console.error('Error al obtener token de cliente:', error);
    throw error;
  }
};

/**
 * Genera la URL de autorización de Spotify
 */
export const getAuthorizationUrl = (): string => {
  const spotifyApi = createSpotifyApi();
  
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-read',
    'user-library-modify'
  ];
  
  return spotifyApi.createAuthorizeURL(scopes, 'spotify-auth-state');
};

/**
 * Formatea la duración en milisegundos a formato MM:SS
 */
export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
}; 