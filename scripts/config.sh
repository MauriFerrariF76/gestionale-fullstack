#!/bin/bash
# ========================================
# CONFIGURAZIONE CENTRALIZZATA GESTIONALE
# ========================================
# Best practices per gestione credenziali sicura
# 
# USO:
# - Sviluppo: Variabili d'ambiente o valori di default
# - Produzione: Docker secrets o variabili d'ambiente
# - Sicurezza: Nessuna password hardcoded nel codice

# ========================================
# CONFIGURAZIONE DATABASE
# ========================================

# Database Sviluppo (UNICO su questo PC)
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_NAME=${DB_NAME:-"gestionale_dev"}
DB_USER=${DB_USER:-"gestionale_dev_user"}
DB_PASSWORD=${DB_PASSWORD:-""}  # DEVE essere definita

# Database Produzione (solo per riferimento, non su questo PC)
DB_PROD_HOST=${DB_PROD_HOST:-"10.10.10.16"}
DB_PROD_PORT=${DB_PROD_PORT:-"5433"}
DB_PROD_NAME=${DB_PROD_NAME:-"gestionale"}
DB_PROD_USER=${DB_PROD_USER:-"gestionale_user"}
DB_PROD_PASSWORD=${DB_PROD_PASSWORD:-""}  # Solo per deploy

# ========================================
# CONFIGURAZIONE JWT
# ========================================

JWT_SECRET=${JWT_SECRET:-""}  # DEVE essere definita

# ========================================
# CONFIGURAZIONE AMBIENTE
# ========================================

NODE_ENV=${NODE_ENV:-"development"}
PORT=${PORT:-"3001"}
FRONTEND_PORT=${FRONTEND_PORT:-"3000"}

# ========================================
# VALIDAZIONE CONFIGURAZIONE
# ========================================

validate_config() {
    local errors=0
    
    # Verifica password database sviluppo (UNICO su questo PC)
    if [ -z "$DB_PASSWORD" ]; then
        echo "❌ ERRORE: DB_PASSWORD non definita"
        echo "💡 Definisci DB_PASSWORD nel file .env o come variabile d'ambiente"
        errors=$((errors + 1))
    fi
    
    # Verifica JWT secret
    if [ -z "$JWT_SECRET" ]; then
        echo "❌ ERRORE: JWT_SECRET non definita"
        echo "💡 Definisci JWT_SECRET nel file .env o come variabile d'ambiente"
        errors=$((errors + 1))
    fi
    
    if [ $errors -gt 0 ]; then
        echo ""
        echo "🔧 COME RISOLVERE:"
        echo "1. Crea un file .env con le credenziali"
        echo "2. Oppure definisci le variabili d'ambiente"
        echo "3. Per sviluppo, puoi usare i valori di default"
        echo ""
        echo "📝 ESEMPIO .env:"
        echo "DB_PASSWORD=your_database_password"
        echo "JWT_SECRET=your_jwt_secret"
        echo ""
        return 1
    fi
    
    return 0
}

# ========================================
# FUNZIONI UTILITY
# ========================================

# Test connessione database sviluppo (UNICO su questo PC)
test_database() {
    echo "🔍 Test connessione database sviluppo..."
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ Database sviluppo: CONNESSO"
        return 0
    else
        echo "❌ Database sviluppo: ERRORE CONNESSIONE"
        return 1
    fi
}

# Mostra configurazione (senza password)
show_config() {
    echo "📋 CONFIGURAZIONE SVILUPPO:"
    echo "   Ambiente: $NODE_ENV"
    echo "   Database Host: $DB_HOST:$DB_PORT"
    echo "   Database Name: $DB_NAME"
    echo "   Database User: $DB_USER"
    echo "   Database Password: [DEFINITA]"
    echo "   JWT Secret: [DEFINITA]"
    echo "   Port Backend: $PORT"
    echo "   Port Frontend: $FRONTEND_PORT"
    echo ""
    echo "📋 CONFIGURAZIONE PRODUZIONE (riferimento):"
    echo "   Server: $DB_PROD_HOST:$DB_PROD_PORT"
    echo "   Database: $DB_PROD_NAME"
    echo "   User: $DB_PROD_USER"
}

# ========================================
# INIZIALIZZAZIONE
# ========================================

# Carica configurazione da .env se presente
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [ -f "$PROJECT_ROOT/.env" ]; then
    echo "📁 Caricamento configurazione da .env..."
    export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

# Valida configurazione
if ! validate_config; then
    echo "❌ Configurazione non valida. Script terminato."
    exit 1
fi

echo "✅ Configurazione caricata correttamente"
