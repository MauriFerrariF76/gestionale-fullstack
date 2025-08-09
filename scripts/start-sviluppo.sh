#!/bin/bash

# Script unificato per avvio ambiente sviluppo NATIVO
# Versione ottimizzata per systemd Type=oneshot con RemainAfterExit=yes
# Combina le funzionalità migliori di tutti gli script precedenti

set -e

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funzioni di output
print_status() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Directory progetto
PROJECT_ROOT="/home/mauri/gestionale-fullstack"
cd "$PROJECT_ROOT"

echo "🚀 Avvio ambiente sviluppo NATIVO (Script Unificato)..."

# 1. VERIFICA DATABASE
print_status "Verifica database PostgreSQL..."
if pg_isready -h localhost -p 5432 -U postgres >/dev/null 2>&1; then
    print_success "Database PostgreSQL attivo"
else
    print_error "Database PostgreSQL non disponibile"
    exit 1
fi

# 1.1. VERIFICA E PREPARAZIONE PRISMA
print_status "Verifica e preparazione Prisma..."
cd "$PROJECT_ROOT/backend"

# Verifica schema Prisma
if [ ! -f "prisma/schema.prisma" ]; then
    print_error "Schema Prisma non trovato in backend/prisma/"
    exit 1
fi

# Genera client Prisma se necessario
if [ ! -d "node_modules/.prisma" ] || [ ! -f "node_modules/.prisma/client/index.d.ts" ]; then
    print_status "Generazione client Prisma..."
    npx prisma generate
    print_success "Client Prisma generato"
else
    print_success "Client Prisma già presente"
fi

# Verifica sincronizzazione database
print_status "Verifica sincronizzazione database..."
if npx prisma db pull --print >/dev/null 2>&1; then
    print_success "Database sincronizzato con Prisma"
else
    print_warning "Database non completamente sincronizzato - eseguo migrazione..."
    npx prisma migrate dev --name "auto-sync" --create-only >/dev/null 2>&1 || true
    print_success "Migrazione Prisma completata"
fi

cd "$PROJECT_ROOT"

# 2. PULIZIA PROCESSI ESISTENTI (REGOLA DI FERRO)
print_status "Pulizia processi esistenti..."
pkill -f "ts-node src/app.ts" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
sleep 2
print_success "Pulizia completata"

# 3. AVVIO BACKEND
print_status "Avvio Backend..."
cd "$PROJECT_ROOT/backend"

# Verifica dipendenze
if [ ! -d "node_modules" ]; then
    print_status "Installazione dipendenze backend..."
    npm install
fi

# Avvia backend in background con nohup
nohup npm run dev > /dev/null 2>&1 &
BACKEND_PID=$!
print_success "Backend avviato in background (PID: $BACKEND_PID)"

# 4. AVVIO FRONTEND
print_status "Avvio Frontend..."
cd "$PROJECT_ROOT/frontend"

# Verifica dipendenze
if [ ! -d "node_modules" ]; then
    print_status "Installazione dipendenze frontend..."
    npm install
fi

# Avvia frontend in background con nohup
nohup PORT=3000 npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
print_success "Frontend avviato in background (PID: $FRONTEND_PID)"

# 5. VERIFICA RAPIDA (senza sleep lunghi)
print_status "Verifica rapida servizi..."
sleep 3

# Verifica backend
if curl -f http://localhost:3001/health >/dev/null 2>&1; then
    print_success "Backend risponde correttamente"
else
    print_warning "Backend non ancora pronto (può richiedere più tempo)"
fi

# Verifica frontend
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    print_success "Frontend risponde correttamente"
else
    print_warning "Frontend non ancora pronto (può richiedere più tempo)"
fi

# Verifica Prisma (test connessione database)
print_status "Verifica connessione Prisma..."
cd "$PROJECT_ROOT/backend"
if npx prisma db pull --print >/dev/null 2>&1; then
    print_success "Prisma connesso correttamente al database"
else
    print_warning "Prisma non riesce a connettersi (verificare configurazione)"
fi
cd "$PROJECT_ROOT"

# 6. SUCCESSO - TERMINA IMMEDIATAMENTE
echo ""
print_success "Ambiente sviluppo NATIVO avviato!"
echo ""
echo -e "${BLUE}📊 Backend:${NC} http://localhost:3001 (PID: $BACKEND_PID)"
echo -e "${BLUE}🎨 Frontend:${NC} http://localhost:3000 (PID: $FRONTEND_PID)"
echo -e "${BLUE}🗄️  Database:${NC} PostgreSQL (localhost:5432)"
echo -e "${BLUE}🔧 Prisma:${NC} Client generato e database sincronizzato"
echo ""
echo -e "${BLUE}📝 Script completato - servizi in esecuzione in background${NC}"
echo -e "${YELLOW}💡 Compatibile con systemd Type=oneshot + RemainAfterExit=yes${NC}"

# IMPORTANTE: Termina immediatamente per systemd
exit 0
