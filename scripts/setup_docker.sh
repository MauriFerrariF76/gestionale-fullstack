#!/bin/bash
# setup_docker.sh - Setup automatico Docker per Gestionale
# Versione: 1.0
# Descrizione: Script completo per configurare Docker e avviare l'applicazione

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
    
    # Verifica Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker non installato!"
        echo "   Installa Docker con: ./scripts/install_docker.sh"
        exit 1
    fi
    
    # Verifica Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose non installato!"
        echo "   Installa Docker Compose con: ./scripts/install_docker.sh"
        exit 1
    fi
    
    # Verifica file necessari
    if [ ! -f "docker-compose.yml" ]; then
        log_error "File docker-compose.yml non trovato!"
        exit 1
    fi
    
    if [ ! -f "backend/Dockerfile" ]; then
        log_error "Dockerfile backend non trovato!"
        exit 1
    fi
    
    if [ ! -f "frontend/Dockerfile" ]; then
        log_error "Dockerfile frontend non trovato!"
        exit 1
    fi
    
    log_success "Prerequisiti verificati"
}

# Setup segreti Docker
setup_secrets() {
    log_info "Setup segreti Docker..."
    
    # Carica variabili d'ambiente se disponibili
    if [ -f ".env" ]; then
        export $(grep -v '^#' .env | xargs)
    fi
    
    # Crea cartella secrets se non esiste
    mkdir -p secrets
    
    # Usa variabili d'ambiente o valori di default
    DB_PASSWORD=${DB_PASSWORD:-"gestionale2025"}
    JWT_SECRET=${JWT_SECRET:-"GestionaleFerrari2025JWT_UltraSecure_v1!"}
    
    # Crea segreti se non esistono
    if [ ! -f "secrets/db_password.txt" ]; then
        echo "$DB_PASSWORD" > secrets/db_password.txt
        log_success "Creato segreto db_password"
    fi
    
    if [ ! -f "secrets/jwt_secret.txt" ]; then
        echo "$JWT_SECRET" > secrets/jwt_secret.txt
        log_success "Creato segreto jwt_secret"
    fi
    
    # Imposta permessi sicuri
    chmod 600 secrets/*.txt
    
    log_success "Segreti Docker configurati"
}

# Crea cartelle necessarie
create_directories() {
    log_info "Creazione cartelle necessarie..."
    
    mkdir -p nginx/ssl
    mkdir -p postgres/init
    
    log_success "Cartelle create"
}

# Build e avvio servizi
start_services() {
    log_info "Avvio servizi Docker..."
    
    # Ferma servizi esistenti
    docker-compose down 2>/dev/null || true
    
    # Build delle immagini
    log_info "Build immagini Docker..."
    docker-compose build --no-cache
    
    # Avvia servizi
    log_info "Avvio servizi..."
    docker-compose up -d
    
    log_success "Servizi avviati"
}

# Verifica stato servizi
check_services() {
    log_info "Verifica stato servizi..."
    
    # Aspetta che i servizi siano pronti
    sleep 10
    
    # Verifica container attivi
    if docker-compose ps | grep -q "Up"; then
        log_success "Tutti i servizi sono attivi"
    else
        log_error "Alcuni servizi non sono attivi"
        docker-compose ps
        exit 1
    fi
    
    # Verifica health checks
    log_info "Verifica health checks..."
    sleep 30
    
    if docker-compose exec -T postgres pg_isready -U gestionale_user -d gestionale &>/dev/null; then
        log_success "Database PostgreSQL OK"
    else
        log_warning "Database PostgreSQL non pronto"
    fi
    
    if curl -f http://localhost/health &>/dev/null; then
        log_success "Backend API OK"
    else
        log_warning "Backend API non pronto"
    fi
    
    if curl -f http://localhost &>/dev/null; then
        log_success "Frontend OK"
    else
        log_warning "Frontend non pronto"
    fi
}

# Mostra informazioni utili
show_info() {
    echo ""
    echo "🎉 Setup Docker completato!"
    echo ""
    echo "📋 Informazioni utili:"
    echo "   🌐 Frontend: http://localhost"
    echo "   🔧 Backend API: http://localhost/api"
    echo "   💚 Health Check: http://localhost/health"
    echo ""
    echo "🔧 Comandi utili:"
    echo "   Visualizza log: docker-compose logs -f"
    echo "   Ferma servizi: docker-compose down"
    echo "   Riavvia servizi: docker-compose restart"
    echo "   Ricostruisci: docker-compose up -d --build"
    echo ""
    echo "📊 Monitoraggio:"
    echo "   Stato servizi: docker-compose ps"
    echo "   Log specifico: docker-compose logs -f backend"
    echo "   Log database: docker-compose logs -f postgres"
    echo ""
    echo "🔐 Segreti Docker:"
    echo "   Backup: ./scripts/backup_secrets.sh"
    echo "   Ripristino: ./scripts/restore_secrets.sh backup_file.tar.gz.gpg"
    echo ""
    echo "⚠️  IMPORTANTE:"
    echo "   - I dati del database sono salvati nel volume 'postgres_data'"
    echo "   - I segreti sono in ./secrets/ (permessi 600)"
    echo "   - Per backup completo: ./scripts/backup_secrets.sh"
}

# Funzione principale
main() {
    echo "🐳 Setup Docker Gestionale"
    echo "========================"
    echo ""
    
    # Verifica prerequisiti
    check_prerequisites
    
    # Setup segreti
    setup_secrets
    
    # Crea cartelle
    create_directories
    
    # Avvia servizi
    start_services
    
    # Verifica stato
    check_services
    
    # Mostra informazioni
    show_info
}

# Esegui funzione principale
main "$@" 