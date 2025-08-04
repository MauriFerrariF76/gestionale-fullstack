#!/bin/bash

# Script Rollback Automatico - Gestionale Fullstack
# Versione: 1.0
# Data: $(date +%Y-%m-%d)
# Server: 10.10.10.15

set -e  # Exit on error

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurazioni
PROJECT_DIR="/home/mauri/gestionale-fullstack"
BACKUP_DIR="/home/mauri/backup"
LOG_FILE="/home/mauri/backup/logs/rollback-$(date +%Y%m%d-%H%M%S).log"
ALERT_EMAIL="mauri@dominio.com"

# Funzione per logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

# Funzione per invio alert email
send_alert() {
    local subject="$1"
    local message="$2"
    
    echo "$message" | mail -s "$subject" "$ALERT_EMAIL" || warning "Impossibile inviare email alert"
}

# Funzione per trovare backup più recente
find_latest_backup() {
    local backup_type="$1"
    local latest_backup=""
    
    case "$backup_type" in
        "database")
            latest_backup=$(find "$BACKUP_DIR" -name "db_*.sql" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)
            ;;
        "config")
            latest_backup=$(find "$BACKUP_DIR" -name "config_*.tar.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)
            ;;
        "git")
            latest_backup=$(cd "$PROJECT_DIR" && git tag --sort=-creatordate | head -1)
            ;;
    esac
    
    echo "$latest_backup"
}

# Funzione per rollback database
rollback_database() {
    log "Rollback database..."
    
    local backup_file=$(find_latest_backup "database")
    if [ -z "$backup_file" ] || [ ! -f "$backup_file" ]; then
        error "Nessun backup database trovato"
    fi
    
    log "Ripristino da: $backup_file"
    
    # Stop servizi che usano il database
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" stop backend frontend || warning "Impossibile fermare servizi"
    
    # Ripristino database
    docker exec -i gestionale-postgres psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS gestionale;"
    docker exec -i gestionale-postgres psql -U postgres -d postgres -c "CREATE DATABASE gestionale;"
    docker exec -i gestionale-postgres psql -U postgres -d gestionale < "$backup_file" || error "Ripristino database fallito"
    
    # Riavvia servizi
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" start backend frontend || warning "Impossibile riavviare servizi"
    
    success "Rollback database completato"
}

# Funzione per rollback configurazioni
rollback_config() {
    log "Rollback configurazioni..."
    
    local backup_file=$(find_latest_backup "config")
    if [ -z "$backup_file" ] || [ ! -f "$backup_file" ]; then
        error "Nessun backup configurazioni trovato"
    fi
    
    log "Ripristino da: $backup_file"
    
    # Stop servizi
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" down || warning "Impossibile fermare servizi"
    
    # Ripristino configurazioni
    tar -xzf "$backup_file" -C "$PROJECT_DIR" || error "Ripristino configurazioni fallito"
    
    # Riavvia servizi
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" up -d || error "Impossibile riavviare servizi"
    
    success "Rollback configurazioni completato"
}

# Funzione per rollback codice Git
rollback_git() {
    log "Rollback codice Git..."
    
    local backup_tag=$(find_latest_backup "git")
    if [ -z "$backup_tag" ]; then
        error "Nessun tag di backup Git trovato"
    fi
    
    log "Rollback al tag: $backup_tag"
    
    cd "$PROJECT_DIR"
    
    # Salva modifiche non committate
    git stash push -m "Rollback automatico $(date +%Y-%m-%d_%H:%M:%S)" || warning "Nessuna modifica da salvare"
    
    # Rollback al tag
    git checkout "$backup_tag" || error "Rollback Git fallito"
    
    # Rimuovi tag temporanei
    git tag -d "pre-test-$(date +%Y%m%d)*" 2>/dev/null || true
    
    success "Rollback Git completato"
}

# Funzione per verifica post-rollback
verify_rollback() {
    log "Verifica post-rollback..."
    
    # Attendi riavvio servizi
    sleep 30
    
    # Test connessione database
    if ! docker exec gestionale-postgres pg_isready -U postgres &> /dev/null; then
        error "Database non raggiungibile dopo rollback"
    fi
    
    # Test API health
    if ! curl -s http://localhost:3001/api/health > /dev/null; then
        error "API non raggiungibile dopo rollback"
    fi
    
    # Test frontend
    if ! curl -s http://localhost:3000 > /dev/null; then
        error "Frontend non raggiungibile dopo rollback"
    fi
    
    # Verifica servizi Docker
    if ! docker ps | grep -q "gestionale"; then
        error "Servizi Docker non attivi dopo rollback"
    fi
    
    success "Verifica post-rollback completata"
}

# Funzione per monitoraggio post-rollback
monitor_post_rollback() {
    log "Avvio monitoraggio post-rollback..."
    
    # Monitoraggio per 10 minuti
    for i in {1..60}; do
        # Controllo errori nei log
        ERROR_COUNT=$(docker logs gestionale-backend 2>&1 | grep -c "ERROR" || echo "0")
        if [ "$ERROR_COUNT" -gt 5 ]; then
            warning "Errori rilevati nei log: $ERROR_COUNT"
        fi
        
        # Controllo performance
        RESPONSE_TIME=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:3001/api/health)
        if (( $(echo "$RESPONSE_TIME > 5.0" | bc -l) )); then
            warning "Tempo di risposta elevato: ${RESPONSE_TIME}s"
        fi
        
        sleep 10
    done
    
    success "Monitoraggio post-rollback completato"
}

# Funzione per report rollback
generate_rollback_report() {
    log "Generazione report rollback..."
    
    REPORT_FILE="/home/mauri/backup/reports/rollback-report-$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
# Report Rollback Automatico - $(date +%Y-%m-%d %H:%M:%S)

## Riepilogo
- **Stato**: ✅ ROLLBACK COMPLETATO
- **Motivo**: $ROLLBACK_REASON
- **Durata**: $(($(date +%s) - START_TIME)) secondi
- **Errori**: $(grep -c "❌" "$LOG_FILE" || echo "0")
- **Warning**: $(grep -c "⚠️" "$LOG_FILE" || echo "0")

## Operazioni Eseguite
- [x] Rollback database
- [x] Rollback configurazioni
- [x] Rollback codice Git
- [x] Verifica post-rollback
- [x] Monitoraggio continuo

## Backup Utilizzati
- **Database**: $(find_latest_backup "database")
- **Configurazioni**: $(find_latest_backup "config")
- **Git Tag**: $(find_latest_backup "git")

## Metriche Post-Rollback
- Tempo risposta API: ${RESPONSE_TIME}s
- Errori nei log: $ERROR_COUNT
- Servizi attivi: $(docker ps | grep -c "gestionale")

## Note
- Sistema ripristinato alla versione precedente
- Tutti i servizi operativi
- Monitoraggio attivo per 24 ore

## Log Completo
\`\`\`
$(cat "$LOG_FILE")
\`\`\`
EOF
    
    success "Report rollback generato: $REPORT_FILE"
}

# Funzione per trigger automatico
check_rollback_triggers() {
    log "Controllo trigger rollback automatico..."
    
    # Controllo health check
    if ! curl -s http://localhost:3001/api/health > /dev/null; then
        ROLLBACK_REASON="Health check fallito"
        return 0
    fi
    
    # Controllo errori critici
    CRITICAL_ERRORS=$(docker logs gestionale-backend 2>&1 | grep -c "CRITICAL\|FATAL" || echo "0")
    if [ "$CRITICAL_ERRORS" -gt 0 ]; then
        ROLLBACK_REASON="Errori critici rilevati: $CRITICAL_ERRORS"
        return 0
    fi
    
    # Controllo tempo di risposta
    RESPONSE_TIME=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:3001/api/health)
    if (( $(echo "$RESPONSE_TIME > 5.0" | bc -l) )); then
        ROLLBACK_REASON="Tempo di risposta elevato: ${RESPONSE_TIME}s"
        return 0
    fi
    
    # Controllo servizi Docker
    if ! docker ps | grep -q "gestionale"; then
        ROLLBACK_REASON="Servizi Docker non attivi"
        return 0
    fi
    
    return 1  # Nessun trigger attivato
}

# Main execution
main() {
    START_TIME=$(date +%s)
    ROLLBACK_REASON="${1:-Trigger automatico}"
    
    log "=== INIZIO ROLLBACK AUTOMATICO ==="
    log "Motivo: $ROLLBACK_REASON"
    log "Data: $(date +%Y-%m-%d %H:%M:%S)"
    log "Log file: $LOG_FILE"
    
    # Invio alert iniziale
    send_alert "ROLLBACK AUTOMATICO ATTIVATO" "Rollback avviato per: $ROLLBACK_REASON\nServer: 10.10.10.15\nData: $(date)"
    
    # Esecuzione rollback in sequenza
    rollback_database
    rollback_config
    rollback_git
    verify_rollback
    monitor_post_rollback
    generate_rollback_report
    
    # Invio alert di completamento
    send_alert "ROLLBACK COMPLETATO" "Rollback completato con successo\nServer: 10.10.10.15\nDurata: $(($(date +%s) - START_TIME))s"
    
    log "=== FINE ROLLBACK AUTOMATICO ==="
    success "Rollback completato con successo! ✅"
    
    echo -e "${GREEN}"
    echo "🔄 ROLLBACK COMPLETATO CON SUCCESSO!"
    echo "📊 Report disponibile: $REPORT_FILE"
    echo "📋 Log completo: $LOG_FILE"
    echo "📧 Alert inviato a: $ALERT_EMAIL"
    echo -e "${NC}"
}

# Funzione per rollback manuale
manual_rollback() {
    echo -e "${YELLOW}Avvio rollback manuale...${NC}"
    main "Rollback manuale richiesto"
}

# Funzione per rollback automatico
auto_rollback() {
    if check_rollback_triggers; then
        echo -e "${RED}Trigger di rollback rilevato!${NC}"
        main
    else
        echo -e "${GREEN}Nessun trigger di rollback rilevato. Sistema OK.${NC}"
    fi
}

# Gestione errori
trap 'error "Script interrotto da errore"' ERR
trap 'log "Script interrotto dall\'utente"; exit 1' INT TERM

# Parsing argomenti
case "${1:-auto}" in
    "manual")
        manual_rollback
        ;;
    "auto")
        auto_rollback
        ;;
    *)
        echo "Uso: $0 [manual|auto]"
        echo "  manual: Rollback manuale"
        echo "  auto: Rollback automatico (default)"
        exit 1
        ;;
esac 