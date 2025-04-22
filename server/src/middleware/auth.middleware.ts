import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken } from '../utils/auth.utils';

// Extendemos la interfaz Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        spotifyToken: string;
        refreshToken?: string;
        userId?: string;
      };
    }
  }
}

/**
 * Middleware para proteger rutas que requieren autenticación
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener el token del header de autorización
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Autenticación requerida',
        message: 'No se proporcionó un token de acceso' 
      });
    }
    
    // Verificar el token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'El token proporcionado no es válido o ha expirado' 
      });
    }
    
    // Añadir el usuario al objeto request para uso posterior
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Error en el middleware de autenticación:', error);
    res.status(500).json({ 
      error: 'Error de autenticación',
      message: 'Ocurrió un error al procesar la autenticación' 
    });
  }
}; 