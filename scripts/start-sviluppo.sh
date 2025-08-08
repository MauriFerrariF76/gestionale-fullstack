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
# Carica configurazione centralizzata
source "$PROJECT_ROOT/scripts/config.sh"
sudo -u postgres psql -c "CREATE USER gestionale_dev_user WITH PASSWORD '$DB_DEV_PASSWORD';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE gestionale_dev OWNER gestionale_dev_user;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE gestionale_dev TO gestionale_dev_user;" 2>/dev/null || true

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

# Verifica che il backend sia partito - controlla se il server è in ascolto sulla porta
print_status "Verifica avvio backend..."
sleep 8  # Diamo più tempo per l'avvio

# Funzione per verificare se il server è in ascolto
check_server_running() {
    local port=$1
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if ss -tlnp | grep -q ":$port "; then
            return 0  # Server attivo
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    return 1  # Server non attivo
}

if check_server_running 3001; then
    print_success "Backend avviato e in ascolto sulla porta 3001"
else
    print_error "Errore nell'avvio del backend - server non in ascolto sulla porta 3001"
    exit 1
fi

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
PORT=3000 npm run dev &
FRONTEND_PID=$!

# Verifica che il frontend sia partito - controlla se il server è in ascolto sulla porta
print_status "Verifica avvio frontend..."
sleep 8  # Diamo più tempo per l'avvio

if check_server_running 3000; then
    print_success "Frontend avviato e in ascolto sulla porta 3000"
else
    print_error "Errore nell'avvio del frontend - server non in ascolto sulla porta 3000"
    cleanup
    exit 1
fi

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
    # Verifica che i server siano ancora attivi
    if ! check_server_running 3001; then
        print_error "Backend si è fermato inaspettatamente"
        cleanup
        exit 1
    fi
    
    if ! check_server_running 3000; then
        print_error "Frontend si è fermato inaspettatamente"
        cleanup
        exit 1
    fi
    
    sleep 10
done
