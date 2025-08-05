#!/bin/bash

# Script per avviare ambiente sviluppo NATIVO
echo "🚀 Avvio ambiente sviluppo NATIVO..."

# Avvia PostgreSQL
echo "📊 Avvio PostgreSQL..."
sudo systemctl start postgresql

# Avvia Backend (in background)
echo "🔧 Avvio Backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Attendi avvio backend
sleep 3

# Avvia Frontend (in background)
echo "🎨 Avvio Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Ambiente sviluppo NATIVO avviato"
echo "📊 Backend: http://localhost:3001"
echo "🎨 Frontend: http://localhost:3000"
echo "📝 Premi Ctrl+C per fermare tutto"

# Funzione cleanup
cleanup() {
    echo "🛑 Fermando servizi..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT

# Mantieni script attivo
wait
