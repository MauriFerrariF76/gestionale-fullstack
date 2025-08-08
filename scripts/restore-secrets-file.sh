#!/bin/bash

# Script per ripristino del file sec.md dal backup cifrato sul NAS
# Ripristino sicuro del file con credenziali sensibili

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

# Configurazioni
SECRETS_FILE="docs/SVILUPPO/sec.md"
BACKUP_DIR="/mnt/backup_gestionale/secrets"
GPG_KEY="E83504F1D08BE266E44AE4F028BB7FB520B83BA4"

print_status "Ripristino file credenziali sensibili dal backup..."

# Verifica che il NAS sia montato
if [ ! -d "/mnt/backup_gestionale" ]; then
    print_error "NAS non montato. Monta prima il NAS"
    exit 1
fi

# Verifica che la directory backup esista
if [ ! -d "$BACKUP_DIR" ]; then
    print_error "Directory backup $BACKUP_DIR non trovata"
    exit 1
fi

# Trova l'ultimo backup disponibile
LATEST_BACKUP=$(find "$BACKUP_DIR" -name "secrets_backup_*.md.gpg" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)

if [ -z "$LATEST_BACKUP" ]; then
    print_error "Nessun backup trovato in $BACKUP_DIR"
    print_status "Backup disponibili:"
    ls -la "$BACKUP_DIR"/*.gpg 2>/dev/null || echo "Nessun file .gpg trovato"
    exit 1
fi

print_status "Backup trovato: $LATEST_BACKUP"

# Verifica integrità del backup
print_status "Verifica integrità backup..."
if ! gpg --decrypt "$LATEST_BACKUP" >/dev/null 2>&1; then
    print_error "Backup corrotto o chiave GPG non valida"
    exit 1
fi

print_success "Integrità backup verificata"

# Crea backup del file corrente se esiste
if [ -f "$SECRETS_FILE" ]; then
    BACKUP_CURRENT="$SECRETS_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    print_status "Backup file corrente: $BACKUP_CURRENT"
    cp "$SECRETS_FILE" "$BACKUP_CURRENT"
fi

# Ripristina il file
print_status "Ripristino file credenziali..."
if gpg --decrypt "$LATEST_BACKUP" > "$SECRETS_FILE"; then
    print_success "File ripristinato: $SECRETS_FILE"
else
    print_error "Errore nel ripristino del file"
    exit 1
fi

# Imposta permessi corretti
chmod 600 "$SECRETS_FILE"
print_success "Permessi impostati: 600"

# Informazioni finali
echo ""
print_success "Ripristino file credenziali completato!"
echo ""
print_status "Informazioni ripristino:"
echo "  File ripristinato: $SECRETS_FILE"
echo "  Backup utilizzato: $LATEST_BACKUP"
echo "  Data ripristino: $(date)"
echo "  Permessi: 600 (solo proprietario)"
echo ""
print_warning "Verifica che il file contenga le informazioni corrette!"
echo ""
