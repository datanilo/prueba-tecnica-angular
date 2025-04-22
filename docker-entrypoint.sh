#!/bin/sh
set -e

# Iniciar el servidor Node.js en segundo plano
cd /app/server
node dist/index.js &
SERVER_PID=$!

# Servir la aplicación Angular usando un servidor estático simple
cd /app
npx serve -s dist/prueba-tecnica -l 4200 &
ANGULAR_PID=$!

# Mantener el contenedor en ejecución
wait $SERVER_PID $ANGULAR_PID 