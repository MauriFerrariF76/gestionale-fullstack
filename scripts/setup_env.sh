#!/bin/bash
# setup_env.sh - Configurazione sicura variabili d'ambiente
# Versione: 1.0
# Scopo: Gestire variabili d'ambiente senza esporre password

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

# Verifica prerequisiti
check_prerequisites() {
    log_info "Verifica prerequisiti..."
    
    if [ ! -f "config/env.example" ]; then
        log_error "File config/env.example non trovato!"
        exit 1
    fi
    
    log_success "Prerequisiti verificati"
}

# Crea file .env se non esiste
create_env_file() {
    log_info "Creazione file .env..."
    
    if [ -f ".env" ]; then
        log_warning "File .env già esistente"
        read -p "Vuoi sovrascrivere? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Operazione annullata"
            return
        fi
    fi
    
    # Copia template
    cp config/env.example .env
    
    if [ $? -eq 0 ]; then
        log_success "File .env creato da template"
        log_warning "RICORDA: Completa le variabili sensibili nel file .env"
    else
        log_error "Errore nella creazione del file .env"
        exit 1
    fi
}

# Configura variabili sensibili
configure_sensitive_vars() {
    log_info "Configurazione variabili sensibili..."
    
    if [ ! -f ".env" ]; then
        log_error "File .env non trovato! Esegui prima: ./scripts/setup_env.sh"
        exit 1
    fi
    
    # Database password
    if grep -q "DB_PASSWORD=INSERISCI_PASSWORD_DATABASE" .env; then
        log_warning "Configura DB_PASSWORD nel file .env"
        echo "   Esempio: DB_PASSWORD=gestionale2025"
    fi
    
    # JWT secret
    if grep -q "JWT_SECRET=INSERISCI_CHIAVE_JWT_SECURA" .env; then
        log_warning "Configura JWT_SECRET nel file .env"
        echo "   Esempio: JWT_SECRET=GestionaleFerrari2025JWT_UltraSecure_v1!"
    fi
    
    # Master password
    if grep -q "MASTER_PASSWORD=INSERISCI_MASTER_PASSWORD" .env; then
        log_warning "Configura MASTER_PASSWORD nel file .env"
        echo "   Esempio: MASTER_PASSWORD=\"La Ferrari Pietro Snc è stata fondata nel 1963...\""
    fi
    
    # Email configuration
    if grep -q "EMAIL_PRIMARY=INSERISCI_EMAIL_PRINCIPALE" .env; then
        log_warning "Configura EMAIL_PRIMARY nel file .env"
        echo "   Esempio: EMAIL_PRIMARY=ferraripietrosnc.mauri@outlook.it"
    fi
    
    if grep -q "EMAIL_ADMIN=INSERISCI_EMAIL_ADMIN" .env; then
        log_warning "Configura EMAIL_ADMIN nel file .env"
        echo "   Esempio: EMAIL_ADMIN=admin@carpenteriaferrari.com"
    fi
    
    # NAS configuration
    if grep -q "NAS_IP=INSERISCI_IP_NAS" .env; then
        log_warning "Configura NAS_IP nel file .env"
        echo "   Esempio: NAS_IP=10.10.10.21"
    fi
    
    log_info "Controlla e completa tutte le variabili nel file .env"
}

# Verifica configurazione
verify_configuration() {
    log_info "Verifica configurazione..."
    
    if [ ! -f ".env" ]; then
        log_error "File .env non trovato!"
        return 1
    fi
    
    # Conta variabili non configurate
    UNCONFIGURED=$(grep -c "INSERISCI_" .env)
    
    if [ $UNCONFIGURED -gt 0 ]; then
        log_warning "Trovate $UNCONFIGURED variabili non configurate"
        echo "   Variabili da completare:"
        grep "INSERISCI_" .env | sed 's/^/   - /'
    else
        log_success "Tutte le variabili sono configurate"
    fi
    
    # Verifica permessi
    PERMISSIONS=$(stat -c "%a" .env)
    if [ "$PERMISSIONS" != "600" ]; then
        log_warning "Permessi file .env non sicuri ($PERMISSIONS)"
        log_info "Impostazione permessi sicuri..."
        chmod 600 .env
        log_success "Permessi impostati a 600"
    else
        log_success "Permessi file .env corretti (600)"
    fi
}

# Crea cartella secrets se non esiste
create_secrets_dir() {
    log_info "Creazione cartella secrets..."
    
    if [ ! -d "secrets" ]; then
        mkdir -p secrets
        chmod 700 secrets
        log_success "Cartella secrets creata con permessi 700"
    else
        log_info "Cartella secrets già esistente"
    fi
    
    # Verifica permessi
    PERMISSIONS=$(stat -c "%a" secrets)
    if [ "$PERMISSIONS" != "700" ]; then
        log_warning "Permessi cartella secrets non sicuri ($PERMISSIONS)"
        chmod 700 secrets
        log_success "Permessi impostati a 700"
    else
        log_success "Permessi cartella secrets corretti (700)"
    fi
}

# Mostra istruzioni
show_instructions() {
    echo ""
    echo "========================================"
    echo "🔐 CONFIGURAZIONE SICURA COMPLETATA"
    echo "========================================"
    echo ""
    echo "📋 PROSSIMI PASSI:"
    echo "1. Completa le variabili nel file .env"
    echo "2. Verifica che i permessi siano corretti"
    echo "3. Testa la configurazione"
    echo ""
    echo "⚠️  IMPORTANTE:"
    echo "- NON committare mai il file .env"
    echo "- Usa sempre variabili d'ambiente per password"
    echo "- Verifica i permessi dei file sensibili"
    echo ""
    echo "🧪 TEST CONFIGURAZIONE:"
    echo "./scripts/test_env_config.sh"
    echo ""
}

# Funzione principale
main() {
    echo "🔐 Setup Variabili d'Ambiente Sicure"
    echo "===================================="
    echo ""
    
    # Verifica prerequisiti
    check_prerequisites
    
    # Crea file .env
    create_env_file
    
    # Crea cartella secrets
    create_secrets_dir
    
    # Configura variabili sensibili
    configure_sensitive_vars
    
    # Verifica configurazione
    verify_configuration
    
    # Mostra istruzioni
    show_instructions
}

# Esegui funzione principale
main "$@" 