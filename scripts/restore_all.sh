#!/bin/bash
# restore_all.sh - Ripristino automatico completo gestionale
# Versione: 1.0
# Data: $(date +%F)

set -e  # Esci se un comando fallisce

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
    
    # Verifica che siamo nella directory corretta
    if [ ! -f "docker-compose.yml" ]; then
        log_error "Esegui questo script dalla directory root del progetto"
        echo "   cd gestionale-fullstack"
        echo "   ./scripts/restore_all.sh"
        exit 1
    fi
    
    # Verifica Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker non installato. Esegui prima: ./scripts/install_docker.sh"
        exit 1
    fi
    
    # Verifica Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose non installato. Esegui prima: ./scripts/install_docker.sh"
        exit 1
    fi
    
    log_success "Prerequisiti verificati"
}

# Trova backup segreti
find_backup_secrets() {
    local locations=(
        "./secrets_backup_*.tar.gz.gpg"
        "/mnt/backup_gestionale/secrets_backup_*.tar.gz.gpg"
        "./backup/secrets_backup_*.tar.gz.gpg"
    )
    
    for pattern in "${locations[@]}"; do
        local files=($pattern 2>/dev/null)
        if [ ${#files[@]} -gt 0 ]; then
            echo "${files[0]}"
            return 0
        fi
    done
    
    return 1
}

# Trova backup database
find_backup_database() {
    local locations=(
        "./gestionale_db_*.backup"
        "/mnt/backup_gestionale/gestionale_db_*.backup"
        "./backup/gestionale_db_*.backup"
    )
    
    for pattern in "${locations[@]}"; do
        local files=($pattern 2>/dev/null)
        if [ ${#files[@]} -gt 0 ]; then
            echo "${files[0]}"
            return 0
        fi
    done
    
    return 1
}

# Trova configurazione
find_config() {
    local locations=(
        "./config/restore_config.conf.gpg"
        "/mnt/backup_gestionale/restore_config.conf.gpg"
        "./restore_config.conf.gpg"
    )
    
    for pattern in "${locations[@]}"; do
        if [ -f "$pattern" ]; then
            echo "$pattern"
            return 0
        fi
    done
    
    return 1
}

# Monta NAS se necessario
mount_nas() {
    log_info "Verifica montaggio NAS..."
    
    # Configurazione NAS esistente
    local NAS_SHARE="//10.10.10.21/backup_gestionale"
    local MOUNTPOINT="/mnt/backup_gestionale"
    local CREDENTIALS="/root/.nas_gestionale_creds"
    
    if ! mountpoint -q "$MOUNTPOINT"; then
        log_warning "NAS non montato, tentativo di montaggio..."
        
        # Verifica se le credenziali esistono
        if [ -f "$CREDENTIALS" ]; then
            sudo mount -t cifs "$NAS_SHARE" "$MOUNTPOINT" -o credentials="$CREDENTIALS",iocharset=utf8,vers=2.0
            if [ $? -eq 0 ]; then
                log_success "NAS montato automaticamente"
            else
                log_warning "Errore nel montaggio automatico NAS"
                echo "   Verifica credenziali: $CREDENTIALS"
                echo "   Monta manualmente: sudo mount -t cifs $NAS_SHARE $MOUNTPOINT -o credentials=$CREDENTIALS,iocharset=utf8,vers=2.0"
                return 1
            fi
        else
            log_warning "Credenziali NAS non trovate: $CREDENTIALS"
            echo "   Crea file credenziali: sudo nano $CREDENTIALS"
            echo "   Formato: username=user\npassword=pass"
            echo "   Monta manualmente: sudo mount -t cifs $NAS_SHARE $MOUNTPOINT -o credentials=$CREDENTIALS,iocharset=utf8,vers=2.0"
            return 1
        fi
    else
        log_success "NAS già montato"
    fi
}

# Copia file dal NAS
copy_from_nas() {
    log_info "Copia file dal NAS..."
    
    if [ -d "/mnt/backup_gestionale" ]; then
        # Crea directory se non esistono
        mkdir -p config backup logs
        
        # Copia script se non presente
        if [ ! -f "restore_all.sh" ] && [ -f "/mnt/backup_gestionale/restore_all.sh" ]; then
            cp "/mnt/backup_gestionale/restore_all.sh" ./
            log_success "Script copiato dal NAS"
        fi
        
        # Copia configurazione se non presente
        if [ ! -f "config/restore_config.conf.gpg" ] && [ -f "/mnt/backup_gestionale/restore_config.conf.gpg" ]; then
            cp "/mnt/backup_gestionale/restore_config.conf.gpg" config/
            log_success "Configurazione copiata dal NAS"
        fi
        
        # Copia backup segreti se non presenti
        if [ ! -f "./secrets_backup_*.tar.gz.gpg" ] && [ -f "/mnt/backup_gestionale/secrets_backup_*.tar.gz.gpg" ]; then
            cp "/mnt/backup_gestionale/secrets_backup_*.tar.gz.gpg" ./
            log_success "Backup segreti copiato dal NAS"
        fi
        
        # Copia backup database se non presenti
        if [ ! -f "./gestionale_db_*.backup" ] && [ -f "/mnt/backup_gestionale/gestionale_db_*.backup" ]; then
            cp "/mnt/backup_gestionale/gestionale_db_*.backup" ./
            log_success "Backup database copiato dal NAS"
        fi
    fi
}

# Ripristina segreti
restore_secrets() {
    log_info "Ripristino segreti..."
    
    # Metodo 1: Backup cifrato
    local secrets_backup=$(find_backup_secrets)
    if [ -n "$secrets_backup" ]; then
        log_info "Trovato backup segreti: $secrets_backup"
        
        # Chiedi Master Password
        echo -n "Inserisci Master Password per decifrare backup: "
        read -s MASTER_PASSWORD
        echo
        
        # Prova ripristino
        if ./scripts/restore_secrets.sh "$secrets_backup"; then
            log_success "Segreti ripristinati da backup"
            return 0
        else
            log_warning "Errore nel ripristino backup, tentativo metodo alternativo"
        fi
    fi
    
    # Metodo 2: Configurazione cifrata
    local config_file=$(find_config)
    if [ -n "$config_file" ]; then
        log_info "Trovata configurazione cifrata: $config_file"
        
        # Chiedi Master Password
        echo -n "Inserisci Master Password per decifrare configurazione: "
        read -s MASTER_PASSWORD
        echo
        
        # Decifra configurazione
        if gpg --decrypt "$config_file" > restore_config.conf; then
            source restore_config.conf
            if ./scripts/setup_secrets.sh --config; then
                log_success "Segreti creati da configurazione"
                return 0
            fi
        fi
    fi
    
    # Metodo 3: Inserimento manuale
    log_warning "Inserimento manuale credenziali"
    echo -n "Inserisci password database: "
    read -s DB_PASSWORD
    echo
    
    echo -n "Inserisci JWT secret: "
    read -s JWT_SECRET
    echo
    
    # Crea segreti manualmente
    mkdir -p secrets
    echo "$DB_PASSWORD" > secrets/db_password.txt
    echo "$JWT_SECRET" > secrets/jwt_secret.txt
    chmod 600 secrets/*.txt
    
    log_success "Segreti creati manualmente"
    return 0
}

# Ripristina database
restore_database() {
    log_info "Ripristino database..."
    
    local db_backup=$(find_backup_database)
    if [ -n "$db_backup" ]; then
        log_info "Trovato backup database: $db_backup"
        
        # Avvia PostgreSQL
        docker-compose up -d postgres
        
        # Attendi che PostgreSQL sia pronto
        log_info "Attendo che PostgreSQL sia pronto..."
        sleep 30
        
        # Ripristina database
        if docker-compose exec -T postgres pg_restore -U gestionale_user -d gestionale -v "/backup/$(basename "$db_backup")"; then
            log_success "Database ripristinato"
            return 0
        else
            log_warning "Errore nel ripristino database"
        fi
    else
        log_warning "Backup database non trovato, database vuoto"
    fi
    
    return 0
}

# Avvia servizi
start_services() {
    log_info "Avvio servizi Docker..."
    
    if docker-compose up -d; then
        log_success "Servizi avviati"
        
        # Attendi che i servizi siano pronti
        log_info "Attendo che i servizi siano pronti..."
        sleep 30
        
        # Verifica servizi
        if docker-compose ps | grep -q "Up"; then
            log_success "Tutti i servizi sono attivi"
        else
            log_warning "Alcuni servizi potrebbero non essere attivi"
            docker-compose ps
        fi
    else
        log_error "Errore nell'avvio servizi"
        return 1
    fi
}

# Configura Nginx
setup_nginx() {
    log_info "Configurazione Nginx..."
    
    # Verifica se Nginx è installato
    if ! command -v nginx &> /dev/null; then
        log_info "Installazione Nginx..."
        sudo apt update
        sudo apt install -y nginx
    fi
    
    # Copia configurazione se presente
    if [ -f "docs/server/nginx_gestionale.conf" ]; then
        sudo cp docs/server/nginx_gestionale.conf /etc/nginx/sites-available/gestionale
        sudo ln -sf /etc/nginx/sites-available/gestionale /etc/nginx/sites-enabled/
        sudo rm -f /etc/nginx/sites-enabled/default
        
        # Testa configurazione
        if sudo nginx -t; then
            sudo systemctl restart nginx
            log_success "Nginx configurato"
        else
            log_warning "Errore nella configurazione Nginx"
        fi
    else
        log_warning "File configurazione Nginx non trovato"
    fi
}

# Configura SSL
setup_ssl() {
    log_info "Configurazione SSL..."
    
    # Verifica se Certbot è installato
    if ! command -v certbot &> /dev/null; then
        log_info "Installazione Certbot..."
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Ottieni certificato SSL
    if [ -n "$DOMAIN" ]; then
        log_info "Ottengo certificato SSL per $DOMAIN..."
        if sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$SSL_EMAIL"; then
            log_success "SSL configurato"
        else
            log_warning "Errore nella configurazione SSL"
        fi
    else
        log_warning "Dominio non configurato, SSL saltato"
    fi
}

# Configura firewall
setup_firewall() {
    log_info "Configurazione firewall..."
    
    # Verifica se UFW è installato
    if ! command -v ufw &> /dev/null; then
        log_info "Installazione UFW..."
        sudo apt install -y ufw
    fi
    
    # Configura regole base
    sudo ufw allow ssh
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    
    # Abilita firewall
    if sudo ufw --force enable; then
        log_success "Firewall configurato"
    else
        log_warning "Errore nella configurazione firewall"
    fi
}

# Verifica finale
verify_restore() {
    log_info "Verifica finale..."
    
    # Verifica container
    if docker-compose ps | grep -q "Up"; then
        log_success "✅ Container attivi"
    else
        log_error "❌ Container non attivi"
        return 1
    fi
    
    # Verifica database
    if docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT COUNT(*) FROM information_schema.tables;" &>/dev/null; then
        log_success "✅ Database accessibile"
    else
        log_warning "⚠️ Database non accessibile"
    fi
    
    # Verifica backend
    if curl -s http://localhost:3001/api/health &>/dev/null; then
        log_success "✅ Backend risponde"
    else
        log_warning "⚠️ Backend non risponde"
    fi
    
    # Verifica frontend
    if curl -s http://localhost:3000 &>/dev/null; then
        log_success "✅ Frontend accessibile"
    else
        log_warning "⚠️ Frontend non accessibile"
    fi
    
    # Verifica Nginx
    if curl -s http://localhost &>/dev/null; then
        log_success "✅ Nginx funziona"
    else
        log_warning "⚠️ Nginx non funziona"
    fi
}

# Funzione principale
main() {
    echo "🚀 Ripristino Automatico Gestionale"
    echo "==================================="
    echo ""
    
    # Verifica prerequisiti
    check_prerequisites
    
    # Monta NAS
    mount_nas
    
    # Copia file dal NAS
    copy_from_nas
    
    # Ripristina segreti
    restore_secrets
    
    # Ripristina database
    restore_database
    
    # Avvia servizi
    start_services
    
    # Configura Nginx
    setup_nginx
    
    # Configura SSL (se richiesto)
    if [ "$AUTO_SSL" = "true" ]; then
        setup_ssl
    fi
    
    # Configura firewall (se richiesto)
    if [ "$AUTO_FIREWALL" = "true" ]; then
        setup_firewall
    fi
    
    # Verifica finale
    verify_restore
    
    echo ""
    echo "🎉 Ripristino completato!"
    echo ""
    echo "📋 Prossimi passi:"
    echo "   1. Verifica accesso web: http://localhost"
    echo "   2. Testa login admin"
    echo "   3. Controlla log: docker-compose logs -f"
    echo "   4. Configura backup automatici"
    echo ""
    echo "⚠️ IMPORTANTE:"
    echo "   - Aggiorna EMERGENZA_PASSWORDS.md con nuove credenziali"
    echo "   - Testa backup regolarmente"
    echo "   - Monitora log per problemi"
}

# Esegui funzione principale
main "$@"