#!/bin/bash

# Script per backup automatico del file sec.md sul NAS
# Backup cifrato del file con credenziali sensibili

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
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/secrets_backup_$DATE.md.gpg"

print_status "Backup automatico file credenziali sensibili..."

# Verifica che il file esista
if [ ! -f "$SECRETS_FILE" ]; then
    print_error "File $SECRETS_FILE non trovato"
    exit 1
fi

# Verifica che il NAS sia montato
if [ ! -d "/mnt/backup_gestionale" ]; then
    print_error "NAS non montato. Monta prima il NAS"
    exit 1
fi

# Crea directory backup se non esiste
mkdir -p "$BACKUP_DIR"

# Verifica chiave GPG
if ! gpg --list-keys "$GPG_KEY" >/dev/null 2>&1; then
    print_error "Chiave GPG $GPG_KEY non trovata"
    exit 1
fi

# Backup cifrato del file
print_status "Cifratura e backup del file credenziali..."
if gpg --encrypt --recipient "$GPG_KEY" --output "$BACKUP_FILE" "$SECRETS_FILE"; then
    print_success "Backup cifrato completato: $BACKUP_FILE"
else
    print_error "Errore nella cifratura del backup"
    exit 1
fi

# Verifica integrità del backup
print_status "Verifica integrità backup..."
if gpg --decrypt "$BACKUP_FILE" >/dev/null 2>&1; then
    print_success "Integrità backup verificata"
else
    print_error "Errore nella verifica integrità backup"
    exit 1
fi

# Pulizia backup vecchi (mantieni ultimi 10)
print_status "Pulizia backup vecchi..."
cd "$BACKUP_DIR"
ls -t secrets_backup_*.md.gpg | tail -n +11 | xargs -r rm -f
print_success "Backup vecchi rimossi (mantenuti ultimi 10)"

# Informazioni finali
echo ""
print_success "Backup file credenziali completato!"
echo ""
print_status "Informazioni backup:"
echo "  File originale: $SECRETS_FILE"
echo "  Backup cifrato: $BACKUP_FILE"
echo "  Chiave GPG: $GPG_KEY"
echo "  Data: $(date)"
echo ""
print_status "Per ripristinare il file:"
echo "  gpg --decrypt $BACKUP_FILE > $SECRETS_FILE"
echo ""
