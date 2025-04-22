import { Request, Response } from 'express';
import { createSpotifyApi, getAuthorizationUrl } from '../utils/spotify.utils';
import { generateToken } from '../utils/auth.utils';

/**
 * Inicia el proceso de autorización redirigiendo a la página de autorización de Spotify
 */
export const login = (req: Request, res: Response) => {
  try {
    const authorizationUrl = getAuthorizationUrl();
    res.redirect(authorizationUrl);
  } catch (error) {
    console.error('Error al generar la URL de autorización:', error);
    res.status(500).json({ 
      error: 'Error de autenticación',
      message: 'No se pudo generar la URL de autorización' 
    });
  }
};

/**
 * Maneja la respuesta de Spotify después de la autorización
 */
export const callback = async (req: Request, res: Response) => {
  const { code, error } = req.query;

  if (error) {
    console.error('Error en la autenticación de Spotify:', error);
    return res.redirect(`http://127.0.0.1:4200/auth-error?error=${error}`);
  }

  if (!code) {
    console.error('No se recibió el código de autorización');
    return res.redirect('http://127.0.0.1:4200/auth-error?error=no_code');
  }

  try {
    const spotifyApi = createSpotifyApi();
    
    // Intercambiar el código por un token de acceso
    const data = await spotifyApi.authorizationCodeGrant(code as string);
    
    const accessToken = data.body.access_token;
    const refreshToken = data.body.refresh_token;
    
    // Obtener información del usuario
    spotifyApi.setAccessToken(accessToken);
    const me = await spotifyApi.getMe();
    const userId = me.body.id;
    
    // Generar nuestro propio token JWT para el frontend
    const token = generateToken({
      spotifyToken: accessToken,
      refreshToken,
      userId
    });
    
    // Redirección al cliente con el token (URL completa)
    res.redirect(`http://127.0.0.1:4200/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Error al procesar el callback de Spotify:', error);
    res.redirect('http://127.0.0.1:4200/auth-error?error=token_exchange_failed');
  }
};

/**
 * Actualiza un token de acceso expirado usando el refresh token
 */
export const refreshToken = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  
  if (!refresh_token) {
    return res.status(400).json({ 
      error: 'Parámetro requerido',
      message: 'Se requiere un refresh_token' 
    });
  }
  
  try {
    const spotifyApi = createSpotifyApi();
    spotifyApi.setRefreshToken(refresh_token);
    
    const data = await spotifyApi.refreshAccessToken();
    const accessToken = data.body.access_token;
    
    // Generar un nuevo token JWT
    const token = generateToken({
      spotifyToken: accessToken,
      refreshToken: refresh_token
    });
    
    res.json({
      token,
      expires_in: data.body.expires_in
    });
  } catch (error) {
    console.error('Error al actualizar el token:', error);
    res.status(500).json({ 
      error: 'Error de autenticación',
      message: 'No se pudo actualizar el token de acceso' 
    });
  }
}; 