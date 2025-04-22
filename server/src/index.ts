import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Importar rutas
import spotifyRoutes from './routes/spotify.routes';
import authRoutes from './routes/auth.routes';

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación de Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/spotify', spotifyRoutes);
app.use('/api/auth', authRoutes);

// Ruta para verificar que el servidor está funcionando
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'El servidor está funcionando correctamente' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
}); 