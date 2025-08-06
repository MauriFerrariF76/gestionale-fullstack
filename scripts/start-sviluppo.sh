#!/bin/bash

# Script per avviare ambiente sviluppo NATIVO
# Versione migliorata con gestione errori e autenticazione PostgreSQL

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzione per stampare messaggi colorati
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Funzione cleanup migliorata
cleanup() {
    print_status "Fermando servizi..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_success "Backend fermato"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_success "Frontend fermato"
    fi
    
    exit 0
}

# Trap per gestire Ctrl+C
trap cleanup SIGINT SIGTERM

# Ottieni il percorso assoluto dello script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

print_status "Avvio ambiente sviluppo NATIVO..."
print_status "Directory progetto: $PROJECT_ROOT"

# Verifica che siamo nella directory corretta
if [ ! -d "$PROJECT_ROOT/backend" ] || [ ! -d "$PROJECT_ROOT/frontend" ]; then
    print_error "Directory backend o frontend non trovate. Assicurati di essere nella root del progetto."
    exit 1
fi

# 1. AVVIO POSTGRESQL
print_status "Avvio PostgreSQL..."

# Verifica se PostgreSQL è installato
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL non è installato. Installa PostgreSQL prima di continuare."
    exit 1
fi

# Avvia PostgreSQL
if sudo systemctl start postgresql; then
    print_success "PostgreSQL avviato"
else
    print_error "Errore nell'avvio di PostgreSQL"
    exit 1
fi

# 2. CONFIGURAZIONE DATABASE
print_status "Configurazione database..."

# Crea utente e database se non esistono
sudo -u postgres psql -c "CREATE USER gestionale_user WITH PASSWORD 'gestionale2025';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE gestionale OWNER gestionale_user;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE gestionale TO gestionale_user;" 2>/dev/null || true

print_success "Database configurato"

# 3. AVVIO BACKEND
print_status "Avvio Backend..."

cd "$PROJECT_ROOT/backend"

# Verifica che package.json esista
if [ ! -f "package.json" ]; then
    print_error "package.json non trovato nella directory backend"
    exit 1
fi

# Installa dipendenze se necessario
if [ ! -d "node_modules" ]; then
    print_status "Installazione dipendenze backend..."
    npm install
fi

# Avvia backend in background
npm run dev &
BACKEND_PID=$!

# Verifica che il backend sia partito
sleep 5
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    print_error "Errore nell'avvio del backend"
    exit 1
fi

print_success "Backend avviato (PID: $BACKEND_PID)"

# 4. AVVIO FRONTEND
print_status "Avvio Frontend..."

cd "$PROJECT_ROOT/frontend"

# Verifica che package.json esista
if [ ! -f "package.json" ]; then
    print_error "package.json non trovato nella directory frontend"
    cleanup
    exit 1
fi

# Installa dipendenze se necessario
if [ ! -d "node_modules" ]; then
    print_status "Installazione dipendenze frontend..."
    npm install
fi

# Avvia frontend in background
npm run dev &
FRONTEND_PID=$!

# Verifica che il frontend sia partito
sleep 5
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    print_error "Errore nell'avvio del frontend"
    cleanup
    exit 1
fi

print_success "Frontend avviato (PID: $FRONTEND_PID)"

# 5. INFORMAZIONI FINALI
echo ""
print_success "Ambiente sviluppo NATIVO avviato con successo!"
echo ""
echo -e "${BLUE}📊 Backend:${NC} http://localhost:3001"
echo -e "${BLUE}🎨 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}🗄️  Database:${NC} PostgreSQL (localhost:5432)"
echo ""
echo -e "${YELLOW}📝 Premi Ctrl+C per fermare tutti i servizi${NC}"
echo ""

# Mantieni script attivo e monitora i processi
while true; do
    # Verifica che i processi siano ancora attivi
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend si è fermato inaspettatamente"
        cleanup
        exit 1
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend si è fermato inaspettatamente"
        cleanup
        exit 1
    fi
    
    sleep 10
done
