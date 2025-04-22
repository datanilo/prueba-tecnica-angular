FROM node:20-alpine as build

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY angular.json tsconfig*.json .postcssrc.json ./
COPY proxy.conf.json ./

# Instalar dependencias del frontend
RUN npm ci

# Copiar código fuente del frontend
COPY src/ ./src/
COPY public/ ./public/

# Configurar servidor
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci
WORKDIR /app
COPY server/ ./server/

# Compilar la aplicación Angular
RUN npm run build

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Copiar build de Angular
COPY --from=build /app/dist/prueba-tecnica /app/dist/prueba-tecnica

# Copiar archivos necesarios del servidor
COPY --from=build /app/server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/server/.env ./

# Configurar variables de entorno
ENV NODE_ENV=production

# Exponer puertos (ajustar según la configuración de tu aplicación)
EXPOSE 3000 4200

# Script de arranque
WORKDIR /app
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"] 