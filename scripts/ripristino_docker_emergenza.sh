#!/bin/bash
# ripristino_docker_emergenza.sh - Ripristino di emergenza Docker
# Versione: 1.0
# Descrizione: Script di emergenza per ripristino rapido con Docker

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

# Funzione principale di ripristino
ripristino_emergenza() {
    echo "🚨 RIPRISTINO DI EMERGENZA DOCKER"
    echo "================================"
    echo ""
    
    # Passo 1: Verifica ambiente
    log_info "Passo 1: Verifica ambiente..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker non installato!"
        echo "   Installazione automatica Docker..."
        sudo ./scripts/install_docker.sh
    fi
    
    if ! docker compose version &> /dev/null; then
        if ! command -v docker > /dev/null || ! docker compose version > /dev/null 2>&1; then
            log_error "Docker Compose non installato!"
            echo "   Installazione automatica Docker Compose..."
            sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
        fi
    fi
    
    log_success "Docker e Docker Compose verificati"
    
    # Passo 2: Setup segreti
    log_info "Passo 2: Setup segreti Docker..."
    
    mkdir -p secrets
    
    # Cerca backup segreti
    if [ -f "secrets_backup_*.tar.gz.gpg" ]; then
        log_info "Trovato backup segreti, ripristino..."
        ./scripts/restore_secrets.sh secrets_backup_*.tar.gz.gpg
    else
        log_warning "Nessun backup segreti trovato, creazione manuale..."
        # Carica variabili d'ambiente se disponibili
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

DB_PASSWORD=${DB_PASSWORD:-"gestionale2025"}
JWT_SECRET=${JWT_SECRET:-"GestionaleFerrari2025JWT_UltraSecure_v1!"}

echo "$DB_PASSWORD" > secrets/db_password.txt
echo "$JWT_SECRET" > secrets/jwt_secret.txt
        chmod 600 secrets/*.txt
    fi
    
    log_success "Segreti configurati"
    
    # Passo 3: Ferma servizi esistenti
    log_info "Passo 3: Pulizia servizi esistenti..."
    
    docker compose down 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
    
    log_success "Servizi esistenti fermati"
    
    # Passo 4: Crea cartelle necessarie
    log_info "Passo 4: Creazione cartelle..."
    
    mkdir -p nginx/ssl postgres/init
    
    log_success "Cartelle create"
    
    # Passo 5: Build e avvio servizi
    log_info "Passo 5: Build e avvio servizi..."
    
    docker compose build --no-cache
    docker compose up -d
    
    log_success "Servizi avviati"
    
    # Passo 6: Verifica funzionamento
    log_info "Passo 6: Verifica funzionamento..."
    
    echo "   Aspetta 30 secondi per l'avvio completo..."
    sleep 30
    
    # Verifica container
    if docker compose ps | grep -q "Up"; then
        log_success "Container attivi"
    else
        log_error "Alcuni container non sono attivi"
        docker compose ps
        exit 1
    fi
    
    # Verifica health checks
    if curl -f http://localhost/health &>/dev/null; then
        log_success "Health check OK"
    else
        log_warning "Health check non risponde, controlla log..."
        docker compose logs --tail=20
    fi
    
    # Verifica frontend
    if curl -f http://localhost &>/dev/null; then
        log_success "Frontend accessibile"
    else
        log_warning "Frontend non accessibile, controlla log..."
        docker compose logs frontend --tail=10
    fi
    
    # Verifica database
    if docker compose exec -T postgres pg_isready -U gestionale_user -d gestionale &>/dev/null; then
        log_success "Database connesso"
    else
        log_warning "Database non connesso, controlla log..."
        docker compose logs postgres --tail=10
    fi
}

# Funzione di backup rapido
backup_rapido() {
    log_info "Backup rapido prima del ripristino..."
    
    # Backup segreti
    if [ -d "secrets" ]; then
        ./scripts/backup_secrets.sh
    fi
    
    # Backup database se attivo
    if docker compose ps postgres | grep -q "Up"; then
    docker compose exec -T postgres pg_dump -U gestionale_user gestionale > backup_emergenza_$(date +%F_%H%M).sql
        log_success "Backup database creato"
    fi
    
    # Backup configurazioni
    tar czf config_emergenza_$(date +%F_%H%M).tar.gz docker-compose.yml nginx/ postgres/ 2>/dev/null || true
    log_success "Backup configurazioni creato"
}

# Funzione di ripristino da backup
ripristino_da_backup() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        log_error "Specifica il file di backup: ./ripristino_docker_emergenza.sh --restore backup_file.tar.gz.gpg"
        exit 1
    fi
    
    log_info "Ripristino da backup: $backup_file"
    
    # Ripristina segreti
    ./scripts/restore_secrets.sh "$backup_file"
    
    # Ripristina database se presente
    if [ -f "backup_emergenza_*.sql" ]; then
        docker compose exec -T postgres psql -U gestionale_user -d gestionale < backup_emergenza_*.sql
        log_success "Database ripristinato"
    fi
    
    # Riavvia servizi
    docker compose up -d
    
    log_success "Ripristino completato"
}

# Funzione di reset completo
reset_completo() {
    log_warning "ATTENZIONE: Reset completo - tutti i dati verranno persi!"
    read -p "Sei sicuro? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Reset completo in corso..."
        
        # Ferma e rimuovi tutto
        docker compose down -v 2>/dev/null || true
        docker rmi $(docker images -q gestionale-fullstack_*) 2>/dev/null || true
        docker volume prune -f 2>/dev/null || true
        
        # Rimuovi segreti
        rm -rf secrets/
        
        # Setup da zero
        ./scripts/setup_docker.sh
        
        log_success "Reset completo completato"
    else
        log_info "Reset annullato"
    fi
}

# Funzione di diagnostica
diagnostica() {
    log_info "Diagnostica sistema..."
    
    echo ""
    echo "📊 STATO SISTEMA:"
    echo "=================="
    
    # Verifica Docker
    echo "🐳 Docker:"
    docker --version 2>/dev/null || echo "   ❌ Non installato"
    docker compose version 2>/dev/null || echo "   ❌ Non installato"
    
    # Verifica servizi
    echo ""
    echo "🔧 Servizi:"
    if [ -f "docker-compose.yml" ]; then
    docker compose ps 2>/dev/null || echo "   ❌ Errore docker compose"
else
    echo "   ❌ docker-compose.yml non trovato"
fi
    
    # Verifica segreti
    echo ""
    echo "🔐 Segreti:"
    if [ -d "secrets" ]; then
        ls -la secrets/ 2>/dev/null || echo "   ❌ Errore accesso secrets"
    else
        echo "   ❌ Cartella secrets non trovata"
    fi
    
    # Verifica connessioni
    echo ""
    echo "🌐 Connessioni:"
    curl -f http://localhost/health &>/dev/null && echo "   ✅ Health check OK" || echo "   ❌ Health check fallito"
    curl -f http://localhost &>/dev/null && echo "   ✅ Frontend OK" || echo "   ❌ Frontend non accessibile"
    
    # Verifica database
    echo ""
    echo "🗄️ Database:"
    if docker compose exec -T postgres pg_isready -U gestionale_user -d gestionale &>/dev/null; then
        echo "   ✅ Database connesso"
    else
        echo "   ❌ Database non connesso"
    fi
    
    # Verifica risorse
    echo ""
    echo "💾 Risorse:"
    df -h . | tail -1
    docker system df 2>/dev/null || echo "   ❌ Errore Docker system"
}

# Funzione di aiuto
mostra_aiuto() {
    echo "🚨 Script Ripristino Emergenza Docker"
    echo "===================================="
    echo ""
    echo "Uso:"
    echo "  $0                    # Ripristino automatico"
    echo "  $0 --backup          # Backup rapido"
    echo "  $0 --restore FILE    # Ripristino da backup"
    echo "  $0 --reset           # Reset completo"
    echo "  $0 --diagnostica     # Diagnostica sistema"
    echo "  $0 --help            # Questo aiuto"
    echo ""
    echo "Esempi:"
    echo "  $0"
    echo "  $0 --backup"
    echo "  $0 --restore secrets_backup_2025-01-15.tar.gz.gpg"
    echo "  $0 --reset"
    echo "  $0 --diagnostica"
}

# Gestione parametri
case "${1:-}" in
    --backup)
        backup_rapido
        ;;
    --restore)
        ripristino_da_backup "$2"
        ;;
    --reset)
        reset_completo
        ;;
    --diagnostica)
        diagnostica
        ;;
    --help|-h)
        mostra_aiuto
        ;;
    "")
        ripristino_emergenza
        ;;
    *)
        log_error "Parametro sconosciuto: $1"
        mostra_aiuto
        exit 1
        ;;
esac 