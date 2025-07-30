#!/bin/bash
# backup_docker_automatic.sh - Backup automatico Docker su NAS
# Versione: 1.0
# Integrazione con sistema backup esistente

SRC="/home/mauri/gestionale-fullstack/"
DEST="/mnt/backup_gestionale/"
LOG="/home/mauri/gestionale-fullstack/docs/server/backup_docker.log"
MOUNTPOINT="/mnt/backup_gestionale"
NAS_SHARE="//10.10.10.21/backup_gestionale"
CREDENTIALS="/root/.nas_gestionale_creds"
MAILTO="ferraripietrosnc.mauri@outlook.it"
MAILCC="mauriferrari@hotmail.com"

# Funzioni di utilità
log_info() {
    echo "[$(date)] ℹ️  $1" | tee -a "$LOG"
}

log_success() {
    echo "[$(date)] ✅ $1" | tee -a "$LOG"
}

log_warning() {
    echo "[$(date)] ⚠️  $1" | tee -a "$LOG"
}

log_error() {
    echo "[$(date)] ❌ $1" | tee -a "$LOG"
}

# Verifica prerequisiti
check_prerequisites() {
    log_info "Verifica prerequisiti..."
    
    if [ ! -f "docker-compose.yml" ]; then
        log_error "docker-compose.yml non trovato"
        mail -s "[ERRORE] Backup Docker: docker-compose.yml non trovato" "$MAILTO" < "$LOG"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker non installato"
        mail -s "[ERRORE] Backup Docker: Docker non installato" "$MAILTO" < "$LOG"
        exit 1
    fi
    
    log_success "Prerequisiti verificati"
}

# Monta NAS
mount_nas() {
    log_info "Montaggio NAS..."
    
    if ! mountpoint -q "$MOUNTPOINT"; then
        sudo mount -t cifs "$NAS_SHARE" "$MOUNTPOINT" -o credentials="$CREDENTIALS",iocharset=utf8,vers=2.0
        
        if [ $? -ne 0 ]; then
            log_error "Mount NAS fallito!"
            mail -s "[ERRORE] Backup Docker: Mount NAS fallito" "$MAILTO" < "$LOG"
            exit 1
        fi
    fi
    
    log_success "NAS montato correttamente"
}

# Backup segreti Docker
backup_secrets() {
    log_info "Backup segreti Docker..."
    
    if [ -d "secrets" ]; then
        cd /home/mauri/gestionale-fullstack
        ./scripts/backup_secrets.sh
        
        if [ $? -eq 0 ]; then
            # Copia backup segreti su NAS
            cp secrets_backup_*.tar.gz.gpg "$DEST"/
            log_success "Segreti Docker salvati su NAS"
        else
            log_error "Backup segreti Docker fallito"
            mail -s "[ERRORE] Backup Docker: Backup segreti fallito" "$MAILTO" < "$LOG"
        fi
    else
        log_warning "Cartella secrets non trovata"
    fi
}

# Backup database PostgreSQL
backup_database() {
    log_info "Backup database PostgreSQL..."
    
    if docker-compose ps postgres | grep -q "Up"; then
        BACKUP_FILE="database_docker_backup_$(date +%F_%H%M%S).sql"
        docker-compose exec -T postgres pg_dump -U gestionale_user gestionale > "$BACKUP_FILE"
        
        if [ $? -eq 0 ]; then
            # Comprimi e cifra il backup
            gzip "$BACKUP_FILE"
            gpg --encrypt --recipient admin@carpenteriaferrari.com "$BACKUP_FILE.gz"
            
            # Copia su NAS
            cp "$BACKUP_FILE.gz.gpg" "$DEST"/
            rm "$BACKUP_FILE.gz.gpg"
            
            log_success "Database Docker salvato su NAS: $BACKUP_FILE.gz.gpg"
        else
            log_error "Backup database Docker fallito"
            mail -s "[ERRORE] Backup Docker: Backup database fallito" "$MAILTO" < "$LOG"
        fi
    else
        log_warning "Container PostgreSQL non attivo"
    fi
}

# Backup volumi Docker
backup_volumes() {
    log_info "Backup volumi Docker..."
    
    if docker volume ls | grep -q "gestionale_postgres_data"; then
        VOLUME_BACKUP="postgres_volume_docker_$(date +%F_%H%M%S).tar.gz"
        docker run --rm -v gestionale_postgres_data:/data -v $(pwd):/backup alpine tar czf "/backup/$VOLUME_BACKUP" -C /data .
        
        if [ $? -eq 0 ]; then
            # Cifra il backup
            gpg --encrypt --recipient admin@carpenteriaferrari.com "$VOLUME_BACKUP"
            
            # Copia su NAS
            cp "$VOLUME_BACKUP.gpg" "$DEST"/
            rm "$VOLUME_BACKUP.gpg"
            
            log_success "Volume Docker salvato su NAS: $VOLUME_BACKUP.gpg"
        else
            log_error "Backup volume Docker fallito"
            mail -s "[ERRORE] Backup Docker: Backup volume fallito" "$MAILTO" < "$LOG"
        fi
    else
        log_warning "Volume PostgreSQL non trovato"
    fi
}

# Backup configurazioni Docker
backup_configurations() {
    log_info "Backup configurazioni Docker..."
    
    CONFIG_BACKUP="docker_config_backup_$(date +%F_%H%M%S).tar.gz"
    tar czf "$CONFIG_BACKUP" docker-compose.yml nginx/ postgres/ backend/Dockerfile frontend/Dockerfile .dockerignore
    
    if [ $? -eq 0 ]; then
        # Cifra il backup
        gpg --encrypt --recipient admin@carpenteriaferrari.com "$CONFIG_BACKUP"
        
        # Copia su NAS
        cp "$CONFIG_BACKUP.gpg" "$DEST"/
        rm "$CONFIG_BACKUP.gpg"
        
        log_success "Configurazioni Docker salvate su NAS: $CONFIG_BACKUP.gpg"
    else
        log_error "Backup configurazioni Docker fallito"
        mail -s "[ERRORE] Backup Docker: Backup configurazioni fallito" "$MAILTO" < "$LOG"
    fi
}

# Backup script di ripristino
backup_scripts() {
    log_info "Backup script di ripristino..."
    
    SCRIPTS_BACKUP="docker_scripts_backup_$(date +%F_%H%M%S).tar.gz"
    tar czf "$SCRIPTS_BACKUP" scripts/restore_secrets.sh scripts/backup_secrets.sh scripts/setup_docker.sh scripts/ripristino_docker_emergenza.sh scripts/backup_completo_docker.sh
    
    if [ $? -eq 0 ]; then
        # Cifra il backup
        gpg --encrypt --recipient admin@carpenteriaferrari.com "$SCRIPTS_BACKUP"
        
        # Copia su NAS
        cp "$SCRIPTS_BACKUP.gpg" "$DEST"/
        rm "$SCRIPTS_BACKUP.gpg"
        
        log_success "Script Docker salvati su NAS: $SCRIPTS_BACKUP.gpg"
    else
        log_error "Backup script Docker fallito"
        mail -s "[ERRORE] Backup Docker: Backup script fallito" "$MAILTO" < "$LOG"
    fi
}

# Crea report backup
create_backup_report() {
    log_info "Creazione report backup..."
    
    REPORT_FILE="docker_backup_report_$(date +%F_%H%M%S).txt"
    cat > "$REPORT_FILE" << EOF
BACKUP DOCKER AUTOMATICO - GESTIONALE
=====================================

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
4. Ripristina database: docker-compose exec -T postgres psql -U gestionale_user -d gestionale < database_backup_*.sql
5. Avvia servizi: docker-compose up -d

VERIFICA POST-RIPRISTINO:
- curl http://localhost/health
- docker-compose ps
- docker-compose logs

CONTATTI EMERGENZA:
- Amministratore: [NOME] - [TELEFONO]
- Backup Admin: [NOME] - [TELEFONO]

LOG BACKUP:
$(tail -20 "$LOG")
EOF

    # Copia report su NAS
    cp "$REPORT_FILE" "$DEST"/
    rm "$REPORT_FILE"
    
    log_success "Report backup creato su NAS"
}

# Funzione principale
main() {
    echo "🐳 Backup Automatico Docker Gestionale" | tee -a "$LOG"
    echo "=====================================" | tee -a "$LOG"
    echo "" | tee -a "$LOG"
    
    # Verifica prerequisiti
    check_prerequisites
    
    # Monta NAS
    mount_nas
    
    # Esegui backup
    backup_secrets
    backup_database
    backup_volumes
    backup_configurations
    backup_scripts
    
    # Crea report
    create_backup_report
    
    log_success "Backup Docker completato con successo"
    
    # Invia notifica successo
    echo "Backup Docker completato con successo il $(date)" | mail -s "[SUCCESSO] Backup Docker Gestionale" "$MAILTO"
}

# Esegui funzione principale
main "$@" 