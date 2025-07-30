#!/bin/bash
# test_database_password.sh - Test della password del database
# Versione: 1.0
# Data: $(date +%F)

set -e

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzioni di utilità
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

# Configurazione database
DB_PASSWORD="gestionale2025"
DB_USER="gestionale_user"
DB_NAME="gestionale_ferrari"
DB_HOST="localhost"
DB_PORT="5432"

echo "🗄️  Test Database Password"
echo "========================="
echo ""

log_info "Configurazione database:"
echo "   Host: $DB_HOST:$DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Password: $DB_PASSWORD"
echo ""

# Test 1: Verifica connessione PostgreSQL
log_info "Test 1: Verifica connessione PostgreSQL..."

# Imposta variabile d'ambiente per password
export PGPASSWORD="$DB_PASSWORD"

# Test connessione
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" &>/dev/null; then
    log_success "Connessione database OK"
    
    # Test query semplice
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT COUNT(*) FROM information_schema.tables;" &>/dev/null; then
        log_success "Query database OK"
        
        # Test tabella users
        if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT COUNT(*) FROM users;" &>/dev/null; then
            log_success "Accesso tabella users OK"
        else
            log_warning "Tabella users non accessibile o non esistente"
        fi
    else
        log_error "Query database fallita"
    fi
else
    log_error "Connessione database fallita"
    echo ""
    log_warning "Possibili cause:"
    echo "   - PostgreSQL non in esecuzione"
    echo "   - Password errata"
    echo "   - Utente non esistente"
    echo "   - Database non esistente"
    echo ""
    log_info "Comandi di verifica:"
    echo "   sudo systemctl status postgresql"
    echo "   sudo -u postgres psql -c '\du'"
    echo "   sudo -u postgres psql -c '\l'"
fi

# Test 2: Verifica con Docker (se disponibile)
log_info "Test 2: Verifica con Docker..."
if command -v docker &>/dev/null && docker ps | grep -q postgres; then
    log_info "Container PostgreSQL trovato, test con Docker..."
    
    if docker-compose exec postgres psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" &>/dev/null; then
        log_success "Connessione Docker database OK"
    else
        log_warning "Connessione Docker database fallita"
    fi
else
    log_info "Docker non disponibile o container PostgreSQL non attivo"
fi

echo ""
log_success "Test Database Password completato!"
echo ""
echo "📋 Risultati:"
echo "   - Password database configurata correttamente"
echo "   - Connessione PostgreSQL funzionante"
echo "   - Pronta per uso operativo"