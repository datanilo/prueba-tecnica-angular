import { Request, Response } from 'express';
import { createSpotifyApi, getClientToken } from '../utils/spotify.utils';

/**
 * Busca artistas en Spotify
 */
export const searchArtists = async (req: Request, res: Response) => {
  const { artist } = req.params;

  if (!artist) {
    return res.status(400).json({
      error: 'Parámetro requerido',
      message: 'Se requiere el nombre del artista'
    });
  }

  try {
    // Usar token de usuario si está disponible, o token de cliente si no
    let accessToken = req.user?.spotifyToken;
    
    if (!accessToken) {
      // Obtener token de cliente para operaciones públicas
      accessToken = await getClientToken();
    }
    
    const spotifyApi = createSpotifyApi(accessToken);
    
    const data = await spotifyApi.searchArtists(artist);
    res.json(data.body);
  } catch (error) {
    console.error('Error al buscar artistas:', error);
    res.status(500).json({
      error: 'Error en la búsqueda',
      message: 'Ocurrió un error al buscar artistas'
    });
  }
};

/**
 * Obtiene los álbumes de un artista
 */
export const getArtistAlbums = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'Parámetro requerido',
      message: 'Se requiere el ID del artista'
    });
  }

  try {
    // Usar token de usuario si está disponible, o token de cliente si no
    let accessToken = req.user?.spotifyToken;
    
    if (!accessToken) {
      // Obtener token de cliente para operaciones públicas
      accessToken = await getClientToken();
    }
    
    const spotifyApi = createSpotifyApi(accessToken);
    
    const data = await spotifyApi.getArtistAlbums(id, { limit: 50 });
    res.json(data.body);
  } catch (error) {
    console.error('Error al obtener álbumes:', error);
    res.status(500).json({
      error: 'Error en la consulta',
      message: 'Ocurrió un error al obtener los álbumes del artista'
    });
  }
};

/**
 * Obtiene las canciones de un álbum
 */
export const getAlbumTracks = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'Parámetro requerido',
      message: 'Se requiere el ID del álbum'
    });
  }

  try {
    // Usar token de usuario si está disponible, o token de cliente si no
    let accessToken = req.user?.spotifyToken;
    
    if (!accessToken) {
      // Obtener token de cliente para operaciones públicas
      accessToken = await getClientToken();
    }
    
    const spotifyApi = createSpotifyApi(accessToken);
    
    const data = await spotifyApi.getAlbumTracks(id, { limit: 50 });
    res.json(data.body);
  } catch (error) {
    console.error('Error al obtener canciones:', error);
    res.status(500).json({
      error: 'Error en la consulta',
      message: 'Ocurrió un error al obtener las canciones del álbum'
    });
  }
};

/**
 * Obtiene la información del usuario actual
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const spotifyApi = createSpotifyApi(req.user?.spotifyToken);
    
    const data = await spotifyApi.getMe();
    res.json(data.body);
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    res.status(500).json({
      error: 'Error en la consulta',
      message: 'Ocurrió un error al obtener la información del usuario'
    });
  }
};

/**
 * Obtiene las playlists del usuario
 */
export const getUserPlaylists = async (req: Request, res: Response) => {
  try {
    const spotifyApi = createSpotifyApi(req.user?.spotifyToken);
    
    const data = await spotifyApi.getUserPlaylists();
    res.json(data.body);
  } catch (error) {
    console.error('Error al obtener playlists:', error);
    res.status(500).json({
      error: 'Error en la consulta',
      message: 'Ocurrió un error al obtener las playlists del usuario'
    });
  }
};

/**
 * Obtiene los detalles de una playlist
 */
export const getPlaylistDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'Parámetro requerido',
      message: 'Se requiere el ID de la playlist'
    });
  }

  try {
    const spotifyApi = createSpotifyApi(req.user?.spotifyToken);
    
    const data = await spotifyApi.getPlaylist(id);
    res.json(data.body);
  } catch (error) {
    console.error('Error al obtener detalles de la playlist:', error);
    res.status(500).json({
      error: 'Error en la consulta',
      message: 'Ocurrió un error al obtener los detalles de la playlist'
    });
  }
};

/**
 * Obtiene las canciones de una playlist
 */
export const getPlaylistTracks = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'Parámetro requerido',
      message: 'Se requiere el ID de la playlist'
    });
  }

  try {
    const spotifyApi = createSpotifyApi(req.user?.spotifyToken);
    
    const data = await spotifyApi.getPlaylistTracks(id);
    res.json(data.body);
  } catch (error) {
    console.error('Error al obtener canciones de la playlist:', error);
    res.status(500).json({
      error: 'Error en la consulta',
      message: 'Ocurrió un error al obtener las canciones de la playlist'
    });
  }
};

/**
 * Sigue una playlist
 */
export const followPlaylist = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'Parámetro requerido',
      message: 'Se requiere el ID de la playlist'
    });
  }

  try {
    const spotifyApi = createSpotifyApi(req.user?.spotifyToken);
    
    await spotifyApi.followPlaylist(id);
    res.status(200).json({ success: true, message: 'Playlist seguida correctamente' });
  } catch (error) {
    console.error('Error al seguir la playlist:', error);
    res.status(500).json({
      error: 'Error en la operación',
      message: 'Ocurrió un error al intentar seguir la playlist'
    });
  }
};

/**
 * Deja de seguir una playlist
 */
export const unfollowPlaylist = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'Parámetro requerido',
      message: 'Se requiere el ID de la playlist'
    });
  }

  try {
    const spotifyApi = createSpotifyApi(req.user?.spotifyToken);
    
    await spotifyApi.unfollowPlaylist(id);
    res.status(200).json({ success: true, message: 'Has dejado de seguir la playlist correctamente' });
  } catch (error) {
    console.error('Error al dejar de seguir la playlist:', error);
    res.status(500).json({
      error: 'Error en la operación',
      message: 'Ocurrió un error al intentar dejar de seguir la playlist'
    });
  }
};

/**
 * Verifica si el usuario sigue una playlist
 */
export const checkUserFollowsPlaylist = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'Parámetro requerido',
      message: 'Se requiere el ID de la playlist'
    });
  }

  try {
    const spotifyApi = createSpotifyApi(req.user?.spotifyToken);
    
    const userInfoResponse = await spotifyApi.getMe();
    const userId = userInfoResponse.body.id;
    

    const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/followers/contains?ids=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${req.user?.spotifyToken}`
      }
    });
    
    const data = await response.json();
    
    res.json({ following: data[0] });
  } catch (error) {
    console.error('Error al verificar si sigue la playlist:', error);
    res.status(500).json({
      error: 'Error en la consulta',
      message: 'Ocurrió un error al verificar si el usuario sigue la playlist'
    });
  }
};

/**
 * Obtiene la información detallada de un artista
 */
export const getArtistById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'Parámetro requerido',
      message: 'Se requiere el ID del artista'
    });
  }

  try {
    let accessToken = req.user?.spotifyToken;
    
    if (!accessToken) {
      accessToken = await getClientToken();
    }
    
    const spotifyApi = createSpotifyApi(accessToken);
    
    const data = await spotifyApi.getArtist(id);
    res.json(data.body);
  } catch (error) {
    console.error('Error al obtener artista:', error);
    res.status(500).json({
      error: 'Error en la consulta',
      message: 'Ocurrió un error al obtener la información del artista'
    });
  }
};

/**
 * Obtiene información detallada de un álbum
 */
export const getAlbumById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: 'Parámetro requerido',
      message: 'Se requiere el ID del álbum'
    });
  }

  try {
    // Usar token de usuario si está disponible, o token de cliente si no
    let accessToken = req.user?.spotifyToken;
    
    if (!accessToken) {
      // Obtener token de cliente para operaciones públicas
      accessToken = await getClientToken();
    }
    
    const spotifyApi = createSpotifyApi(accessToken);
    
    const data = await spotifyApi.getAlbum(id);
    res.json(data.body);
  } catch (error) {
    console.error('Error al obtener álbum:', error);
    res.status(500).json({
      error: 'Error en la consulta',
      message: 'Ocurrió un error al obtener la información del álbum'
    });
  }
}; 