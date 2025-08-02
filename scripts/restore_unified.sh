#!/bin/bash
# restore_unified.sh - Script unificato di ripristino Gestionale
# Versione: 2.0
# Descrizione: Ripristino unificato per Docker e sistema tradizionale

set -e

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzioni di logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
show_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    RIPRISTINO UNIFICATO                      ║"
    echo "║                     GESTIONALE FULLSTACK                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Mostra help
show_help() {
    echo "Uso: $0 [OPZIONI]"
    echo ""
    echo "OPZIONI:"
    echo "  --docker          Ripristino completo Docker"
    echo "  --traditional     Ripristino sistema tradizionale"
    echo "  --secrets-only    Ripristino solo segreti"
    echo "  --database-only   Ripristino solo database"
    echo "  --config-only     Ripristino solo configurazioni"
    echo "  --emergency       Modalità emergenza (interattiva)"
    echo "  --test            Test ripristino senza applicare"
    echo "  --help            Mostra questo help"
    echo ""
    echo "ESEMPI:"
    echo "  $0 --docker                    # Ripristino completo Docker"
    echo "  $0 --traditional               # Ripristino sistema tradizionale"
    echo "  $0 --emergency                 # Modalità emergenza"
    echo "  $0 --secrets-only              # Solo segreti"
    echo ""
}

# Verifica prerequisiti
check_prerequisites() {
    log_info "Verifica prerequisiti..."
    
    # Verifica Docker
    if command -v docker &> /dev/null; then
        log_success "Docker installato"
        DOCKER_AVAILABLE=true
    else
        log_warning "Docker non installato"
        DOCKER_AVAILABLE=false
    fi
    
    # Verifica PostgreSQL
    if command -v psql &> /dev/null; then
        log_success "PostgreSQL client installato"
        PSQL_AVAILABLE=true
    else
        log_warning "PostgreSQL client non installato"
        PSQL_AVAILABLE=false
    fi
    
    # Verifica GPG
    if command -v gpg &> /dev/null; then
        log_success "GPG installato"
        GPG_AVAILABLE=true
    else
        log_warning "GPG non installato"
        GPG_AVAILABLE=false
    fi
    
    # Verifica curl
    if command -v curl &> /dev/null; then
        log_success "curl installato"
    else
        log_error "curl non installato"
        exit 1
    fi
}

# Ripristino segreti
restore_secrets() {
    log_info "Ripristino segreti..."
    
    # Cerca backup segreti
    local secrets_backup=$(find /mnt/backup_gestionale/ -name "secrets_backup_*.tar.gz.gpg" | head -1)
    
    if [ -n "$secrets_backup" ]; then
        log_info "Trovato backup segreti: $secrets_backup"
        
        # Chiedi Master Password
        echo -n "Inserisci Master Password per decifrare backup: "
        read -s MASTER_PASSWORD
        echo
        
        # Ripristina segreti
        if ./scripts/restore_secrets.sh "$secrets_backup"; then
            log_success "Segreti ripristinati da backup"
            return 0
        else
            log_warning "Errore nel ripristino backup segreti"
        fi
    fi
    
    # Fallback: creazione manuale
    log_warning "Creazione manuale segreti..."
    mkdir -p secrets
    
    echo -n "Inserisci password database: "
    read -s DB_PASSWORD
    echo
    
    echo -n "Inserisci JWT secret: "
    read -s JWT_SECRET
    echo
    
    echo "$DB_PASSWORD" > secrets/db_password.txt
    echo "$JWT_SECRET" > secrets/jwt_secret.txt
    chmod 600 secrets/*.txt
    
    log_success "Segreti creati manualmente"
}

# Ripristino database
restore_database() {
    log_info "Ripristino database..."
    
    if [ "$DOCKER_AVAILABLE" = true ]; then
        # Ripristino Docker
        local db_backup=$(find /mnt/backup_gestionale/ -name "database_docker_backup_*.sql" | head -1)
        
        if [ -n "$db_backup" ]; then
            log_info "Trovato backup database Docker: $db_backup"
            
            # Avvia PostgreSQL container
            docker compose up -d postgres
            
            # Attendi che PostgreSQL sia pronto
            log_info "Attendo che PostgreSQL sia pronto..."
            sleep 30
            
            # Ripristina database
            if docker compose exec -T postgres psql -U gestionale_user -d gestionale < "$db_backup"; then
                log_success "Database Docker ripristinato"
                return 0
            else
                log_warning "Errore nel ripristino database Docker"
            fi
        fi
    fi
    
    if [ "$PSQL_AVAILABLE" = true ]; then
        # Ripristino tradizionale
        local db_backup=$(find /mnt/backup_gestionale/ -name "gestionale_db_*.backup" | head -1)
        
        if [ -n "$db_backup" ]; then
            log_info "Trovato backup database tradizionale: $db_backup"
            
            if pg_restore -U gestionale -h localhost -d gestionale_db -v "$db_backup"; then
                log_success "Database tradizionale ripristinato"
                return 0
            else
                log_warning "Errore nel ripristino database tradizionale"
            fi
        fi
    fi
    
    log_warning "Nessun backup database trovato o ripristino fallito"
}

# Ripristino configurazioni
restore_configurations() {
    log_info "Ripristino configurazioni..."
    
    # Cerca backup configurazioni
    local config_backup=$(find /mnt/backup_gestionale/ -name "docker_config_backup_*.tar.gz" | head -1)
    
    if [ -n "$config_backup" ]; then
        log_info "Trovato backup configurazioni: $config_backup"
        
        if tar xzf "$config_backup"; then
            log_success "Configurazioni ripristinate"
            return 0
        else
            log_warning "Errore nel ripristino configurazioni"
        fi
    fi
    
    log_warning "Nessun backup configurazioni trovato"
}

# Avvio servizi
start_services() {
    log_info "Avvio servizi..."
    
    if [ "$DOCKER_AVAILABLE" = true ]; then
        # Avvia Docker Compose
        if docker compose up -d; then
            log_success "Servizi Docker avviati"
            
            # Attendi che i servizi siano pronti
            log_info "Attendo che i servizi siano pronti..."
            sleep 30
            
            # Verifica health check
            if curl -f http://localhost/health &>/dev/null; then
                log_success "Health check OK"
                return 0
            else
                log_warning "Health check fallito, controlla i log"
                docker compose logs
            fi
        else
            log_error "Errore nell'avvio servizi Docker"
            return 1
        fi
    else
        log_warning "Docker non disponibile, avvio manuale richiesto"
        echo "Avvia manualmente i servizi:"
        echo "  - Backend: cd backend && npm start"
        echo "  - Frontend: cd frontend && npm start"
        echo "  - Nginx: sudo systemctl start nginx"
    fi
}

# Verifica finale
verify_restore() {
    log_info "Verifica ripristino..."
    
    # Test health check
    if curl -f http://localhost/health &>/dev/null; then
        log_success "✅ Health check OK"
    else
        log_warning "❌ Health check fallito"
    fi
    
    # Test frontend
    if curl -f http://localhost &>/dev/null; then
        log_success "✅ Frontend accessibile"
    else
        log_warning "❌ Frontend non accessibile"
    fi
    
    # Test API
    if curl -f http://localhost/api &>/dev/null; then
        log_success "✅ API accessibile"
    else
        log_warning "❌ API non accessibile"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 RIPRISTINO COMPLETATO!${NC}"
    echo ""
    echo "URLs:"
    echo "  - Frontend: http://localhost"
    echo "  - API: http://localhost/api"
    echo "  - Health: http://localhost/health"
    echo ""
    echo "Comandi utili:"
    echo "  - Logs: docker-compose logs -f"
    echo "  - Status: docker-compose ps"
    echo "  - Stop: docker-compose down"
    echo ""
}

# Modalità emergenza
emergency_mode() {
    log_warning "MODO EMERGENZA - Ripristino interattivo"
    echo ""
    echo "Scegli il tipo di ripristino:"
    echo "1) Ripristino completo Docker"
    echo "2) Ripristino completo tradizionale"
    echo "3) Solo segreti"
    echo "4) Solo database"
    echo "5) Solo configurazioni"
    echo "6) Test senza applicare"
    echo "0) Esci"
    echo ""
    read -p "Scelta: " choice
    
    case $choice in
        1) restore_docker_complete ;;
        2) restore_traditional_complete ;;
        3) restore_secrets ;;
        4) restore_database ;;
        5) restore_configurations ;;
        6) test_restore ;;
        0) exit 0 ;;
        *) log_error "Scelta non valida"; exit 1 ;;
    esac
}

# Ripristino completo Docker
restore_docker_complete() {
    log_info "Ripristino completo Docker..."
    restore_secrets
    restore_database
    restore_configurations
    start_services
    verify_restore
}

# Ripristino completo tradizionale
restore_traditional_complete() {
    log_info "Ripristino completo tradizionale..."
    restore_secrets
    restore_database
    log_warning "Avvio manuale servizi richiesto"
    verify_restore
}

# Test ripristino
test_restore() {
    log_info "Test ripristino (senza applicare)..."
    
    # Verifica backup disponibili
    echo "Backup disponibili:"
    find /mnt/backup_gestionale/ -name "*backup*" -type f | head -10
    
    echo ""
    echo "Configurazione attuale:"
    echo "  - Docker: $DOCKER_AVAILABLE"
    echo "  - PostgreSQL: $PSQL_AVAILABLE"
    echo "  - GPG: $GPG_AVAILABLE"
    
    log_success "Test completato"
}

# Main
main() {
    show_banner
    
    # Verifica argomenti
    if [ $# -eq 0 ]; then
        show_help
        exit 1
    fi
    
    # Verifica prerequisiti
    check_prerequisites
    
    # Gestione argomenti
    case "$1" in
        --docker)
            restore_docker_complete
            ;;
        --traditional)
            restore_traditional_complete
            ;;
        --secrets-only)
            restore_secrets
            ;;
        --database-only)
            restore_database
            ;;
        --config-only)
            restore_configurations
            ;;
        --emergency)
            emergency_mode
            ;;
        --test)
            test_restore
            ;;
        --help)
            show_help
            ;;
        *)
            log_error "Opzione non valida: $1"
            show_help
            exit 1
            ;;
    esac
}

# Esegui main
main "$@" 