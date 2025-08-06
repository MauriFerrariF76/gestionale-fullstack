#!/bin/bash

# Script per fermare ambiente sviluppo NATIVO
# Ferma backend, frontend e opzionalmente PostgreSQL

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "Fermando ambiente sviluppo..."

# Funzione per fermare processi per nome
stop_process_by_name() {
    local process_name=$1
    local pids=$(pgrep -f "$process_name" 2>/dev/null)
    
    if [ ! -z "$pids" ]; then
        print_status "Fermando $process_name..."
        echo "$pids" | xargs kill -TERM 2>/dev/null || true
        sleep 2
        # Se ancora attivo, forza la chiusura
        pids=$(pgrep -f "$process_name" 2>/dev/null)
        if [ ! -z "$pids" ]; then
            echo "$pids" | xargs kill -KILL 2>/dev/null || true
        fi
        print_success "$process_name fermato"
    else
        print_warning "$process_name non trovato in esecuzione"
    fi
}

# Ferma backend (ts-node o node)
stop_process_by_name "ts-node.*src/app.ts"
stop_process_by_name "node.*dist/app.js"

# Ferma frontend (next dev)
stop_process_by_name "next dev"
stop_process_by_name "npm run dev"

# Ferma processi Node.js generici se rimangono
pids=$(pgrep -f "node.*backend" 2>/dev/null)
if [ ! -z "$pids" ]; then
    print_status "Fermando processi Node.js backend..."
    echo "$pids" | xargs kill -TERM 2>/dev/null || true
fi

pids=$(pgrep -f "node.*frontend" 2>/dev/null)
if [ ! -z "$pids" ]; then
    print_status "Fermando processi Node.js frontend..."
    echo "$pids" | xargs kill -TERM 2>/dev/null || true
fi

# Chiedi se fermare anche PostgreSQL
echo ""
read -p "Vuoi fermare anche PostgreSQL? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Fermando PostgreSQL..."
    if sudo systemctl stop postgresql; then
        print_success "PostgreSQL fermato"
    else
        print_error "Errore nel fermare PostgreSQL"
    fi
else
    print_status "PostgreSQL rimane attivo"
fi

echo ""
print_success "Ambiente sviluppo fermato con successo!"
echo ""
print_warning "Se hai ancora problemi, prova a riavviare il terminale"
echo ""
