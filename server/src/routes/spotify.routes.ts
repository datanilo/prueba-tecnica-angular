import { Router } from 'express';
import * as spotifyController from '../controllers/spotify.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Rutas públicas (no requieren autenticación)
router.get('/search/:artist', spotifyController.searchArtists);
router.get('/artist/:id', spotifyController.getArtistById);
router.get('/artist/:id/albums', spotifyController.getArtistAlbums);
router.get('/album/:id', spotifyController.getAlbumById);
router.get('/album/:id/tracks', spotifyController.getAlbumTracks);

// Rutas protegidas (requieren autenticación)
router.get('/me', authMiddleware, spotifyController.getCurrentUser);
router.get('/me/playlists', authMiddleware, spotifyController.getUserPlaylists);
router.get('/playlists/:id', authMiddleware, spotifyController.getPlaylistDetails);
router.get('/playlists/:id/tracks', authMiddleware, spotifyController.getPlaylistTracks);
router.put('/playlists/:id/follow', authMiddleware, spotifyController.followPlaylist);
router.delete('/playlists/:id/follow', authMiddleware, spotifyController.unfollowPlaylist);
router.get('/playlists/:id/followers/contains', authMiddleware, spotifyController.checkUserFollowsPlaylist);

// Para la redirección a la autenticación
router.get('/auth/login', (req, res) => {
  res.redirect('/api/auth/login');
});

export default router; 