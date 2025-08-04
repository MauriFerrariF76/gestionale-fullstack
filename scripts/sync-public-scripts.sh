#!/bin/bash
# sync-public-scripts.sh - Sincronizza script pubblici con repository pubblico
# Versione: 1.0.0
# Autore: Mauri Ferrari

set -e

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Configurazione
PRIVATE_REPO="/home/mauri/gestionale-fullstack"
PUBLIC_REPO="/home/mauri/gestionale-scripts-public"
PUBLIC_SCRIPTS_DIR="$PRIVATE_REPO/public-scripts"

log_info "=== SINCRONIZZAZIONE SCRIPT PUBBLICI ==="

# Verifica che la cartella public-scripts esista
if [ ! -d "$PUBLIC_SCRIPTS_DIR" ]; then
    log_error "Cartella public-scripts non trovata in $PRIVATE_REPO"
    exit 1
fi

# Crea repository pubblico se non esiste
if [ ! -d "$PUBLIC_REPO" ]; then
    log_info "Creazione repository pubblico..."
    mkdir -p "$PUBLIC_REPO"
    cd "$PUBLIC_REPO"
    git init
    git branch -m main
    git remote add origin https://github.com/MauriFerrariF76/gestionale-scripts-public.git
    log_success "Repository pubblico creato"
else
    cd "$PUBLIC_REPO"
    log_info "Aggiornamento repository pubblico..."
    git pull origin main 2>/dev/null || log_warning "Branch main non trovato, continuo..."
fi

# Pulisci repository pubblico
log_info "Pulizia repository pubblico..."
rm -rf * 2>/dev/null || true

# Copia file dalla cartella public-scripts
log_info "Copia file da public-scripts..."
cp -r "$PUBLIC_SCRIPTS_DIR"/* .

# Commit e push
log_info "Commit e push al repository pubblico..."
git add .
git commit -m "Aggiornamento script di automazione $(date +%Y-%m-%d_%H:%M:%S)"
git push origin main

log_success "Sincronizzazione completata!"
echo ""
log_info "📁 Script disponibili su:"
log_info "   https://github.com/MauriFerrariF76/gestionale-scripts-public"
echo ""
log_info "🚀 Download diretto sulla VM:"
log_info "   wget https://raw.githubusercontent.com/MauriFerrariF76/gestionale-scripts-public/main/install-gestionale-completo.sh"
log_info "   wget https://raw.githubusercontent.com/MauriFerrariF76/gestionale-scripts-public/main/deploy-vm-automatico.sh"
echo ""
log_info "📋 Per aggiornare gli script:"
log_info "   1. Modifica i file in public-scripts/"
log_info "   2. Esegui: ./scripts/sync-public-scripts.sh" 