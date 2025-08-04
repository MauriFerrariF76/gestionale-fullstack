#!/bin/bash
# backup_completo_docker.sh - Backup completo sistema Docker
# Versione: 1.0
# Descrizione: Backup di segreti, database, configurazioni e volumi Docker

set -e

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
    
    if [ ! -f "docker-compose.yml" ]; then
        log_error "Esegui questo script dalla directory root del progetto"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker non installato!"
        exit 1
    fi
    
    log_success "Prerequisiti verificati"
}

# Backup segreti Docker
backup_secrets() {
    log_info "Backup segreti Docker..."
    
    if [ -d "secrets" ]; then
        ./scripts/backup_secrets.sh
        log_success "Segreti Docker salvati"
    else
        log_warning "Cartella secrets non trovata"
    fi
}

# Backup database PostgreSQL
backup_database() {
    log_info "Backup database PostgreSQL..."
    
    if docker compose ps postgres | grep -q "Up"; then
        BACKUP_FILE="database_backup_$(date +%F_%H%M%S).sql"
        docker compose exec -T postgres pg_dump -U gestionale_user gestionale > "$BACKUP_FILE"
        
        if [ $? -eq 0 ]; then
            log_success "Database salvato: $BACKUP_FILE"
        else
            log_error "Errore backup database"
            return 1
        fi
    else
        log_warning "Container PostgreSQL non attivo"
    fi
}

# Backup volumi Docker
backup_volumes() {
    log_info "Backup volumi Docker..."
    
    # Backup volume PostgreSQL
    if docker volume ls | grep -q "gestionale_postgres_data"; then
        VOLUME_BACKUP="postgres_volume_$(date +%F_%H%M%S).tar.gz"
        docker run --rm -v gestionale_postgres_data:/data -v $(pwd):/backup alpine tar czf "/backup/$VOLUME_BACKUP" -C /data .
        
        if [ $? -eq 0 ]; then
            log_success "Volume PostgreSQL salvato: $VOLUME_BACKUP"
        else
            log_error "Errore backup volume PostgreSQL"
        fi
    else
        log_warning "Volume PostgreSQL non trovato"
    fi
}

# Backup configurazioni
backup_configurations() {
    log_info "Backup configurazioni..."
    
    CONFIG_BACKUP="config_backup_$(date +%F_%H%M%S).tar.gz"
    tar czf "$CONFIG_BACKUP" docker-compose.yml nginx/ postgres/ backend/Dockerfile frontend/Dockerfile .dockerignore
    
    if [ $? -eq 0 ]; then
        log_success "Configurazioni salvate: $CONFIG_BACKUP"
    else
        log_error "Errore backup configurazioni"
    fi
}

# Backup script di ripristino
backup_scripts() {
    log_info "Backup script di ripristino..."
    
    SCRIPTS_BACKUP="scripts_backup_$(date +%F_%H%M%S).tar.gz"
    tar czf "$SCRIPTS_BACKUP" scripts/restore_secrets.sh scripts/backup_secrets.sh scripts/setup_docker.sh scripts/ripristino_docker_emergenza.sh
    
    if [ $? -eq 0 ]; then
        log_success "Script salvati: $SCRIPTS_BACKUP"
    else
        log_error "Errore backup script"
    fi
}

# Crea backup completo
create_complete_backup() {
    log_info "Creazione backup completo..."
    
    BACKUP_DIR="backup_completo_$(date +%F_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Sposta tutti i file di backup nella directory
    mv *.tar.gz* *.sql "$BACKUP_DIR" 2>/dev/null || true
    
    # Crea file di informazioni
    cat > "$BACKUP_DIR/INFO_BACKUP.txt" << EOF
BACKUP COMPLETO GESTIONALE DOCKER
=================================

Data: $(date)
Versione: 1.0

CONTENUTO BACKUP:
- Segreti Docker (password database, JWT)
- Database PostgreSQL (dati applicazione)
- Volumi Docker (dati persistenti)
- Configurazioni (docker-compose.yml, nginx, postgres)
- Script di ripristino

PASSWORD IMPORTANTI:
- Database: [CONFIGURATO DA VARIABILI D'AMBIENTE]
- JWT: [CONFIGURATO DA VARIABILI D'AMBIENTE]
- Master: [CONFIGURATO DA VARIABILI D'AMBIENTE]

PROCEDURA RIPRISTINO:
1. Clona repository: git clone [URL]
2. Copia backup in directory progetto
3. Ripristina segreti: ./scripts/restore_secrets.sh secrets_backup_*.tar.gz.gpg
4. Ripristina database: docker compose exec -T postgres psql -U gestionale_user -d gestionale < database_backup_*.sql
5. Avvia servizi: docker compose up -d

VERIFICA POST-RIPRISTINO:
- curl http://localhost/health
- docker compose ps
- docker compose logs

CONTATTI EMERGENZA:
- Amministratore: [NOME] - [TELEFONO]
- Backup Admin: [NOME] - [TELEFONO]
EOF

    log_success "Backup completo creato: $BACKUP_DIR"
}

# Funzione principale
main() {
    echo "💾 Backup Completo Sistema Docker"
    echo "================================"
    echo ""
    
    # Verifica prerequisiti
    check_prerequisites
    
    # Crea backup di tutto
    backup_secrets
    backup_database
    backup_volumes
    backup_configurations
    backup_scripts
    
    # Crea backup completo
    create_complete_backup
    
    echo ""
    echo "🎉 Backup completo terminato!"
    echo ""
    echo "📁 File di backup creati:"
    ls -la backup_completo_*/
    echo ""
    echo "🔑 Password importanti:"
    echo "   Database: gestionale2025"
    echo "   JWT: GestionaleFerrari2025JWT_UltraSecure_v1!"
    echo "   Master: 'La Ferrari Pietro Snc è stata fondata nel 1963...'"
    echo ""
    echo "💡 Suggerimenti:"
    echo "   - Conserva il backup in luogo sicuro"
    echo "   - Testa il ripristino su ambiente di prova"
    echo "   - Fai backup regolari (settimanali)"
    echo "   - Aggiorna i contatti di emergenza"
}

# Esegui funzione principale
main "$@" 