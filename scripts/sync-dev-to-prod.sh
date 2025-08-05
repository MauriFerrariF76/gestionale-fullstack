#!/bin/bash

# Script Sincronizzazione Dev → Prod - Gestionale Fullstack
# Versione: 1.0
# Descrizione: Sincronizza ambiente sviluppo NATIVO con produzione CONTAINERIZZATA
# Target: pc-mauri-vaio → gestionale-server

set -e  # Exit on error

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurazioni
PROD_SERVER="10.10.10.16"
PROD_USER="mauri"
PROD_PATH="/home/mauri/gestionale-fullstack"
BACKUP_DIR="backup/sync"
DATE=$(date +%Y%m%d_%H%M%S)

# Funzioni di utilità
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

# Verifica prerequisiti
check_prerequisites() {
    log_info "Verifica prerequisiti..."
    
    # Verifica connessione al server produzione
    if ! ping -c 1 "$PROD_SERVER" &> /dev/null; then
        log_error "Server produzione $PROD_SERVER non raggiungibile"
        exit 1
    fi
    
    # Verifica SSH access
    if ! ssh -o ConnectTimeout=5 "$PROD_USER@$PROD_SERVER" "echo 'SSH OK'" &> /dev/null; then
        log_error "Impossibile connettersi via SSH al server produzione"
        exit 1
    fi
    
    # Verifica ambiente sviluppo
    if [[ ! -d "backend" ]] || [[ ! -d "frontend" ]]; then
        log_error "Directory backend o frontend non trovate"
        exit 1
    fi
    
    # Verifica git
    if ! command -v git &> /dev/null; then
        log_error "Git non installato"
        exit 1
    fi
    
    log_success "Prerequisiti verificati"
}

# Backup produzione
backup_production() {
    log_info "Backup produzione..."
    
    # Crea directory backup
    mkdir -p "$BACKUP_DIR"
    
    # Backup database produzione
    log_info "Backup database produzione..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && ./scripts/backup-automatico.sh"
    
    # Backup configurazioni produzione
    log_info "Backup configurazioni produzione..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && tar -czf /tmp/config_prod_$DATE.tar.gz \
        docker-compose.yml \
        nginx/ \
        postgres/ \
        secrets/ 2>/dev/null || true"
    
    # Scarica backup configurazioni
    scp "$PROD_USER@$PROD_SERVER:/tmp/config_prod_$DATE.tar.gz" "$BACKUP_DIR/"
    
    log_success "Backup produzione completato"
}

# Sincronizza codice
sync_code() {
    log_info "Sincronizzazione codice..."
    
    # Verifica stato git
    if [[ -n $(git status --porcelain) ]]; then
        log_warning "Modifiche non committate rilevate"
        read -p "Commettare modifiche? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "Sync dev to prod - $(date)"
        else
            log_error "Sincronizzazione annullata"
            exit 1
        fi
    fi
    
    # Push al repository
    log_info "Push al repository..."
    if git push origin main; then
        log_success "Codice sincronizzato"
    else
        log_error "Errore nel push del codice"
        exit 1
    fi
}

# Sincronizza database schema
sync_database_schema() {
    log_info "Sincronizzazione schema database..."
    
    # Esporta schema da sviluppo
    log_info "Esportazione schema sviluppo..."
    pg_dump -h localhost -U gestionale_user -d gestionale --schema-only > "$BACKUP_DIR/schema_dev_$DATE.sql"
    
    # Esporta schema da produzione
    log_info "Esportazione schema produzione..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && docker compose exec -T postgres pg_dump -U gestionale_user -d gestionale --schema-only" > "$BACKUP_DIR/schema_prod_$DATE.sql"
    
    # Confronta schemi
    if diff "$BACKUP_DIR/schema_dev_$DATE.sql" "$BACKUP_DIR/schema_prod_$DATE.sql" > /dev/null; then
        log_success "Schemi database identici"
    else
        log_warning "Differenze negli schemi database rilevate"
        read -p "Applicare schema sviluppo a produzione? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Applica schema sviluppo a produzione
            log_info "Applicazione schema sviluppo a produzione..."
            ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && \
                docker compose exec -T postgres psql -U gestionale_user -d gestionale -f -" < "$BACKUP_DIR/schema_dev_$DATE.sql"
            log_success "Schema applicato a produzione"
        fi
    fi
}

# Deploy produzione
deploy_production() {
    log_info "Deploy produzione..."
    
    # Pull codice aggiornato
    log_info "Pull codice aggiornato..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && git pull origin main"
    
    # Ferma servizi produzione
    log_info "Fermata servizi produzione..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && docker compose down"
    
    # Build e avvia servizi
    log_info "Build e avvio servizi produzione..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && docker compose up -d --build"
    
    # Attendi avvio servizi
    log_info "Attesa avvio servizi..."
    sleep 30
    
    log_success "Deploy produzione completato"
}

# Test deploy
test_deploy() {
    log_info "Test deploy..."
    
    # Test connessione backend
    if ssh "$PROD_USER@$PROD_SERVER" "curl -f http://localhost:3001/health" &> /dev/null; then
        log_success "Backend produzione funzionante"
    else
        log_error "Backend produzione non risponde"
        return 1
    fi
    
    # Test connessione frontend
    if ssh "$PROD_USER@$PROD_SERVER" "curl -f http://localhost:3000" &> /dev/null; then
        log_success "Frontend produzione funzionante"
    else
        log_error "Frontend produzione non risponde"
        return 1
    fi
    
    # Test database
    if ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && docker compose exec -T postgres pg_isready -U gestionale_user -d gestionale" &> /dev/null; then
        log_success "Database produzione funzionante"
    else
        log_error "Database produzione non risponde"
        return 1
    fi
    
    log_success "Tutti i test superati"
}

# Rollback automatico
rollback_deploy() {
    log_error "Errore nel deploy. Avvio rollback..."
    
    # Ripristina backup configurazioni
    log_info "Ripristino configurazioni..."
    scp "$BACKUP_DIR/config_prod_$DATE.tar.gz" "$PROD_USER@$PROD_SERVER:/tmp/"
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && tar -xzf /tmp/config_prod_$DATE.tar.gz"
    
    # Riavvia servizi
    log_info "Riavvio servizi..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && docker compose down && docker compose up -d"
    
    log_success "Rollback completato"
}

# Cleanup
cleanup() {
    log_info "Cleanup..."
    
    # Rimuovi file temporanei
    rm -f "$BACKUP_DIR/schema_dev_$DATE.sql"
    rm -f "$BACKUP_DIR/schema_prod_$DATE.sql"
    
    # Rimuovi backup configurazioni dal server
    ssh "$PROD_USER@$PROD_SERVER" "rm -f /tmp/config_prod_$DATE.tar.gz"
    
    log_success "Cleanup completato"
}

# Funzione principale
main() {
    echo "🔄 Sincronizzazione Dev → Prod - Gestionale Fullstack"
    echo "=================================================="
    echo ""
    
    # Verifica prerequisiti
    check_prerequisites
    
    # Backup produzione
    backup_production
    
    # Sincronizza codice
    sync_code
    
    # Sincronizza database schema
    sync_database_schema
    
    # Deploy produzione
    if deploy_production; then
        # Test deploy
        if test_deploy; then
            log_success "Sincronizzazione completata con successo"
        else
            log_error "Test deploy falliti"
            rollback_deploy
            exit 1
        fi
    else
        log_error "Deploy fallito"
        rollback_deploy
        exit 1
    fi
    
    # Cleanup
    cleanup
    
    echo ""
    echo "🎉 Sincronizzazione completata!"
    echo ""
    echo "📊 Produzione: http://$PROD_SERVER"
    echo "📝 Log: $BACKUP_DIR/"
    echo ""
}

# Gestione errori
trap 'log_error "Errore durante l'esecuzione. Rollback automatico..."; rollback_deploy; exit 1' ERR

# Esegui script
main "$@"
