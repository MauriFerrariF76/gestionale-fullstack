#!/bin/bash
# sync-public-scripts.sh - Sincronizza script pubblici con repository pubblico
# Versione: 2.0.0
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

# Verifica che ci siano file da sincronizzare
if [ -z "$(ls -A "$PUBLIC_SCRIPTS_DIR" 2>/dev/null)" ]; then
    log_error "Cartella public-scripts vuota"
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
    
    # Verifica se il remote esiste
    if git remote get-url origin >/dev/null 2>&1; then
        git pull origin main 2>/dev/null || log_warning "Branch main non trovato, continuo..."
    else
        log_warning "Remote origin non configurato, configuro..."
        git remote add origin https://github.com/MauriFerrariF76/gestionale-scripts-public.git
    fi
fi

# Verifica se ci sono modifiche da sincronizzare
log_info "Verifica modifiche da sincronizzare..."

# Lista file da sincronizzare
FILES_TO_SYNC=()
for file in "$PUBLIC_SCRIPTS_DIR"/*; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        if [ ! -f "$PUBLIC_REPO/$filename" ] || ! cmp -s "$file" "$PUBLIC_REPO/$filename"; then
            FILES_TO_SYNC+=("$filename")
        fi
    fi
done

if [ ${#FILES_TO_SYNC[@]} -eq 0 ]; then
    log_success "Nessuna modifica da sincronizzare"
    exit 0
fi

log_info "File da sincronizzare: ${FILES_TO_SYNC[*]}"

# Pulisci repository pubblico (solo file, mantieni .git)
log_info "Pulizia repository pubblico..."
find "$PUBLIC_REPO" -type f -not -path "*/\.git/*" -delete 2>/dev/null || true

# Copia file dalla cartella public-scripts
log_info "Copia file da public-scripts..."
cp -r "$PUBLIC_SCRIPTS_DIR"/* "$PUBLIC_REPO/"

# Configura Git se necessario
cd "$PUBLIC_REPO"
if [ ! -f ".git/config" ]; then
    log_info "Configurazione Git..."
    git config user.name "Mauri Ferrari"
    git config user.email "mauri.ferrari@carpenteriaferrari.com"
fi

# Commit e push
log_info "Commit e push al repository pubblico..."
git add .

# Verifica se ci sono modifiche da committare
if git diff --cached --quiet; then
    log_warning "Nessuna modifica da committare"
else
    git commit -m "Aggiornamento script di automazione $(date +%Y-%m-%d_%H:%M:%S)"
    
    # Push con gestione errori
    if git push origin main; then
        log_success "Push completato con successo"
    else
        log_error "Errore durante il push"
        log_info "Verifica le credenziali Git e riprova"
        exit 1
    fi
fi

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