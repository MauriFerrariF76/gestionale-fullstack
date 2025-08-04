#!/bin/bash
# backup_docker_automatic.sh - Backup automatico Docker su NAS
# Versione: 1.0
# Integrazione con sistema backup esistente

SRC="/home/mauri/gestionale-fullstack/"
DEST="/mnt/backup_gestionale/"
BACKUP_DIR="/home/mauri/gestionale-fullstack/backup/docker/"
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
            # Il backup è già stato spostato nella cartella dedicata dallo script backup_secrets.sh
            # Copia backup segreti su NAS
            cp "$BACKUP_DIR"/secrets_backup_*.tar.gz.gpg "$DEST"/
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
    
    if docker compose ps postgres | grep -q "Up"; then
    BACKUP_FILE="database_docker_backup_$(date +%F_%H%M%S).sql"
    docker compose exec -T postgres pg_dump -U gestionale_user gestionale > "$BACKUP_FILE"
        
        if [ $? -eq 0 ]; then
            # Comprimi e cifra il backup
            gzip "$BACKUP_FILE"
            # Usa --batch per evitare interazioni e esegui come utente mauri
            sudo -u mauri gpg --batch --yes --encrypt --recipient admin@carpenteriaferrari.com "$BACKUP_FILE.gz" 2>/dev/null || {
                log_warning "Cifratura fallita, backup mantenuto non cifrato"
                mv "$BACKUP_FILE.gz" "$BACKUP_FILE.gz.backup"
            }
            
            # Sposta backup database nella cartella dedicata
            mkdir -p "$BACKUP_DIR"
            if [ -f "$BACKUP_FILE.gz.gpg" ]; then
                mv "$BACKUP_FILE.gz.gpg" "$BACKUP_DIR"/
                # Copia su NAS
                cp "$BACKUP_DIR"/"$BACKUP_FILE.gz.gpg" "$DEST"/
                log_success "Database Docker salvato su NAS: $BACKUP_FILE.gz.gpg"
            else
                # Se cifratura fallita, sposta il file non cifrato
                mv "$BACKUP_FILE.gz.backup" "$BACKUP_DIR"/
                cp "$BACKUP_DIR"/"$BACKUP_FILE.gz.backup" "$DEST"/
                log_success "Database Docker salvato su NAS (non cifrato): $BACKUP_FILE.gz.backup"
            fi
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
    
    if docker volume ls | grep -q "gestionale-fullstack_postgres_data"; then
        VOLUME_BACKUP="postgres_volume_docker_$(date +%F_%H%M%S).tar.gz"
        docker run --rm -v gestionale-fullstack_postgres_data:/data -v $(pwd):/backup alpine tar czf "/backup/$VOLUME_BACKUP" -C /data .
        
        if [ $? -eq 0 ]; then
            # Cifra il backup
            sudo -u mauri gpg --batch --yes --encrypt --recipient admin@carpenteriaferrari.com "$VOLUME_BACKUP" 2>/dev/null || {
                log_warning "Cifratura volume fallita, backup mantenuto non cifrato"
                mv "$VOLUME_BACKUP" "$VOLUME_BACKUP.backup"
            }
            
            # Sposta backup volume nella cartella dedicata
            mkdir -p "$BACKUP_DIR"
            if [ -f "$VOLUME_BACKUP.gpg" ]; then
                mv "$VOLUME_BACKUP.gpg" "$BACKUP_DIR"/
                # Copia su NAS
                cp "$BACKUP_DIR"/"$VOLUME_BACKUP.gpg" "$DEST"/
                log_success "Volume Docker salvato su NAS: $VOLUME_BACKUP.gpg"
            else
                # Se cifratura fallita, sposta il file non cifrato
                mv "$VOLUME_BACKUP.backup" "$BACKUP_DIR"/
                cp "$BACKUP_DIR"/"$VOLUME_BACKUP.backup" "$DEST"/
                log_success "Volume Docker salvato su NAS (non cifrato): $VOLUME_BACKUP.backup"
            fi
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
        sudo -u mauri gpg --batch --yes --encrypt --recipient admin@carpenteriaferrari.com "$CONFIG_BACKUP" 2>/dev/null || {
            log_warning "Cifratura configurazioni fallita, backup mantenuto non cifrato"
            mv "$CONFIG_BACKUP" "$CONFIG_BACKUP.backup"
        }
        
        # Sposta backup configurazioni nella cartella dedicata
        mkdir -p "$BACKUP_DIR"
        if [ -f "$CONFIG_BACKUP.gpg" ]; then
            mv "$CONFIG_BACKUP.gpg" "$BACKUP_DIR"/
            # Copia su NAS
            cp "$BACKUP_DIR"/"$CONFIG_BACKUP.gpg" "$DEST"/
            log_success "Configurazioni Docker salvate su NAS: $CONFIG_BACKUP.gpg"
        else
            # Se cifratura fallita, sposta il file non cifrato
            mv "$CONFIG_BACKUP.backup" "$BACKUP_DIR"/
            cp "$BACKUP_DIR"/"$CONFIG_BACKUP.backup" "$DEST"/
            log_success "Configurazioni Docker salvate su NAS (non cifrato): $CONFIG_BACKUP.backup"
        fi
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
        sudo -u mauri gpg --batch --yes --encrypt --recipient admin@carpenteriaferrari.com "$SCRIPTS_BACKUP" 2>/dev/null || {
            log_warning "Cifratura script fallita, backup mantenuto non cifrato"
            mv "$SCRIPTS_BACKUP" "$SCRIPTS_BACKUP.backup"
        }
        
        # Sposta backup script nella cartella dedicata
        mkdir -p "$BACKUP_DIR"
        if [ -f "$SCRIPTS_BACKUP.gpg" ]; then
            mv "$SCRIPTS_BACKUP.gpg" "$BACKUP_DIR"/
            # Copia su NAS
            cp "$BACKUP_DIR"/"$SCRIPTS_BACKUP.gpg" "$DEST"/
            log_success "Script Docker salvati su NAS: $SCRIPTS_BACKUP.gpg"
        else
            # Se cifratura fallita, sposta il file non cifrato
            mv "$SCRIPTS_BACKUP.backup" "$BACKUP_DIR"/
            cp "$BACKUP_DIR"/"$SCRIPTS_BACKUP.backup" "$DEST"/
            log_success "Script Docker salvati su NAS (non cifrato): $SCRIPTS_BACKUP.backup"
        fi
    else
        log_error "Backup script Docker fallito"
        mail -s "[ERRORE] Backup Docker: Backup script fallito" "$MAILTO" < "$LOG"
    fi
}

# Backup file di emergenza protetto
backup_emergency_passwords() {
    log_info "Backup file di emergenza protetto..."
    
    if sudo test -f "/root/emergenza-passwords.md"; then
        EMERGENCY_BACKUP="emergency_passwords_backup_$(date +%F_%H%M%S).md"
        
        # Copia file protetto (solo root può leggere)
        sudo cp /root/emergenza-passwords.md "$EMERGENCY_BACKUP"
        
        if [ $? -eq 0 ]; then
            # Cifra il backup
            sudo -u mauri gpg --batch --yes --encrypt --recipient admin@carpenteriaferrari.com "$EMERGENCY_BACKUP" 2>/dev/null || {
                log_warning "Cifratura emergenza fallita, backup mantenuto non cifrato"
                mv "$EMERGENCY_BACKUP" "$EMERGENCY_BACKUP.backup"
            }
            
            # Sposta backup emergenza nella cartella dedicata
            mkdir -p "$BACKUP_DIR"
            if [ -f "$EMERGENCY_BACKUP.gpg" ]; then
                mv "$EMERGENCY_BACKUP.gpg" "$BACKUP_DIR"/
                # Cambia proprietario per permettere copia su NAS
                sudo chown mauri:mauri "$BACKUP_DIR"/"$EMERGENCY_BACKUP.gpg"
                # Copia su NAS
                cp "$BACKUP_DIR"/"$EMERGENCY_BACKUP.gpg" "$DEST"/
                log_success "File emergenza salvato su NAS: $EMERGENCY_BACKUP.gpg"
            else
                # Se cifratura fallita, sposta il file non cifrato
                mv "$EMERGENCY_BACKUP.backup" "$BACKUP_DIR"/
                # Cambia proprietario per permettere copia su NAS
                sudo chown mauri:mauri "$BACKUP_DIR"/"$EMERGENCY_BACKUP.backup"
                # Copia su NAS
                cp "$BACKUP_DIR"/"$EMERGENCY_BACKUP.backup" "$DEST"/
                log_success "File emergenza salvato su NAS (non cifrato): $EMERGENCY_BACKUP.backup"
            fi
            
            # Rimuovi copia temporanea
            rm -f "$EMERGENCY_BACKUP"
        else
            log_error "Backup file emergenza fallito"
            mail -s "[ERRORE] Backup Docker: Backup emergenza fallito" "$MAILTO" < "$LOG"
        fi
    else
        log_warning "File emergenza /root/emergenza-passwords.md non trovato"
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
- File di emergenza protetto (/root/emergenza-passwords.md)

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

LOG BACKUP:
$(tail -20 "$LOG")
EOF

    # Copia report su NAS
    cp "$REPORT_FILE" "$DEST"/
    rm "$REPORT_FILE"
    
    log_success "Report backup creato su NAS"
}

# Pulizia file temporanei
cleanup_temp_files() {
    log_info "Pulizia file temporanei..."
    
    # Rimuovi file temporanei dalla root del progetto
    find . -maxdepth 1 -name "*.gz" -type f -delete 2>/dev/null || true
    find . -maxdepth 1 -name "*.gpg" -type f -delete 2>/dev/null || true
    find . -maxdepth 1 -name "*.backup" -type f -delete 2>/dev/null || true
    find . -maxdepth 1 -name "*.sql" -type f -delete 2>/dev/null || true
    
    log_success "Pulizia file temporanei completata"
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
    backup_emergency_passwords
    
    # Crea report
    create_backup_report
    
    # Pulizia file temporanei
    cleanup_temp_files
    
    log_success "Backup Docker completato con successo"
    
    # Invia notifica successo
    echo "Backup Docker completato con successo il $(date)" | mail -s "[SUCCESSO] Backup Docker Gestionale" "$MAILTO"
}

# Esegui funzione principale
main "$@" 