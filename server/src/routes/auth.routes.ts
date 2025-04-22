import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Iniciar el proceso de autorización
router.get('/login', authController.login);

// Manejar el callback de Spotify
router.get('/callback', authController.callback);

// Actualizar el token de acceso
router.post('/refresh-token', authController.refreshToken);

export default router; 