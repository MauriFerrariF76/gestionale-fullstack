#!/bin/bash

# Script per configurazione database PostgreSQL SVILUPPO
# Configurazione separata per ambiente sviluppo

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

# Carica configurazione centralizzata
# Carica configurazione centralizzata
if [ -f "scripts/config.sh" ]; then
    source "scripts/config.sh"
elif [ -f "../scripts/config.sh" ]; then
    source "../scripts/config.sh"
else
    echo "❌ Errore: File config.sh non trovato"
    exit 1
fi

print_status "Configurazione database PostgreSQL SVILUPPO..."

# Verifica se PostgreSQL è installato
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL non è installato. Installa PostgreSQL prima di continuare."
    exit 1
fi

# Verifica se PostgreSQL è in esecuzione
if ! sudo systemctl is-active --quiet postgresql; then
    print_status "Avvio PostgreSQL..."
    if sudo systemctl start postgresql; then
        print_success "PostgreSQL avviato"
    else
        print_error "Errore nell'avvio di PostgreSQL"
        exit 1
    fi
else
    print_success "PostgreSQL già in esecuzione"
fi

# Crea utente sviluppo se non esiste
print_status "Creazione utente database sviluppo..."
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
    print_success "Utente $DB_USER già esistente"
else
    if sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"; then
        print_success "Utente $DB_USER creato"
    else
        print_error "Errore nella creazione dell'utente"
        exit 1
    fi
fi

# Crea database sviluppo se non esiste
print_status "Creazione database sviluppo..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    print_success "Database $DB_NAME già esistente"
else
    if sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"; then
        print_success "Database $DB_NAME creato"
    else
        print_error "Errore nella creazione del database"
        exit 1
    fi
fi

# Assegna permessi
print_status "Configurazione permessi..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;" 2>/dev/null || true

print_success "Permessi configurati"

# Test connessione
print_status "Test connessione database sviluppo..."
if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" > /dev/null 2>&1; then
    print_success "Connessione database sviluppo riuscita"
else
    print_error "Errore nella connessione al database sviluppo"
    print_warning "Verifica le credenziali e la configurazione"
    exit 1
fi

echo ""
print_success "Database SVILUPPO configurato con successo!"
echo ""
print_status "Credenziali SVILUPPO:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo ""
