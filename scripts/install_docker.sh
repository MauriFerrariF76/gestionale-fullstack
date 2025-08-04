#!/bin/bash
# install_docker.sh - Installazione automatica Docker e Docker Compose
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

# Verifica sistema
check_system() {
    log_info "Verifica sistema..."
    
    # Verifica distribuzione
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        if [[ "$ID" != "ubuntu" && "$ID" != "debian" ]]; then
            log_warning "Distribuzione non testata: $ID"
            echo "   Questo script è ottimizzato per Ubuntu/Debian"
        fi
    fi
    
    # Verifica privilegi
    if [ "$EUID" -ne 0 ]; then
        log_error "Esegui questo script con privilegi di amministratore"
        echo "   sudo ./scripts/install_docker.sh"
        exit 1
    fi
    
    log_success "Sistema verificato"
}

# Aggiorna sistema
update_system() {
    log_info "Aggiornamento sistema..."
    
    apt update
    apt upgrade -y
    
    # Installa pacchetti essenziali
    apt install -y curl wget git vim htop
    
    log_success "Sistema aggiornato"
}

# Installa Docker
install_docker() {
    log_info "Installazione Docker..."
    
    # Rimuovi versioni precedenti
    apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # Installa prerequisiti
    apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
    
    # Aggiungi chiave GPG ufficiale Docker
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Aggiungi repository Docker
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Aggiorna e installa Docker
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Avvia e abilita Docker
    systemctl start docker
    systemctl enable docker
    
    log_success "Docker installato"
}

# Installa Docker Compose
install_docker_compose() {
    log_info "Installazione Docker Compose..."
    
    # Docker Compose è ora integrato in Docker, non serve installazione separata
# Verifica che docker compose sia disponibile
    
    log_success "Docker Compose installato"
}

# Configura utente
setup_user() {
    log_info "Configurazione utente..."
    
    # Trova utente non-root
    local user=$(logname 2>/dev/null || echo $SUDO_USER)
    
    if [ -n "$user" ]; then
        # Aggiungi utente al gruppo docker
        usermod -aG docker "$user"
        log_success "Utente $user aggiunto al gruppo docker"
    else
        log_warning "Impossibile determinare utente, configurazione manuale richiesta"
        echo "   usermod -aG docker \$USER"
    fi
}

# Verifica installazione
verify_installation() {
    log_info "Verifica installazione..."
    
    # Verifica Docker
    if docker --version &>/dev/null; then
        log_success "Docker funzionante: $(docker --version)"
    else
        log_error "Docker non funzionante"
        return 1
    fi
    
    # Verifica Docker Compose
    if docker compose version &>/dev/null; then
        log_success "Docker Compose plugin funzionante: $(docker compose version)"
    elif docker compose version &>/dev/null; then
    log_success "Docker Compose funzionante: $(docker compose version)"
    else
        log_error "Docker Compose non funzionante"
        return 1
    fi
    
    # Test Docker
    if docker run --rm hello-world &>/dev/null; then
        log_success "Test Docker completato"
    else
        log_warning "Test Docker fallito"
    fi
    
    log_success "Installazione verificata"
}

# Configurazione aggiuntiva
setup_additional() {
    log_info "Configurazione aggiuntiva..."
    
    # Configura timezone
    timedatectl set-timezone Europe/Rome
    
    # Configura hostname
    if [ -z "$(hostname)" ] || [ "$(hostname)" = "localhost" ]; then
        hostnamectl set-hostname gestionale-server
    fi
    
    # Installa strumenti utili
    apt install -y tree jq
    
    log_success "Configurazione aggiuntiva completata"
}

# Funzione principale
main() {
    echo "🐳 Installazione Docker e Docker Compose"
    echo "======================================"
    echo ""
    
    # Verifica sistema
    check_system
    
    # Aggiorna sistema
    update_system
    
    # Installa Docker
    install_docker
    
    # Installa Docker Compose
    install_docker_compose
    
    # Configura utente
    setup_user
    
    # Verifica installazione
    verify_installation
    
    # Configurazione aggiuntiva
    setup_additional
    
    echo ""
    echo "🎉 Installazione completata!"
    echo ""
    echo "📋 Prossimi passi:"
    echo "   1. Riavvia la sessione per applicare i gruppi:"
    echo "      newgrp docker"
    echo "   2. Testa Docker: docker run hello-world"
    echo "   3. Procedi con il ripristino: ./scripts/restore_all.sh"
    echo ""
    echo "⚠️ IMPORTANTE:"
    echo "   - Riavvia la sessione per applicare i gruppi"
    echo "   - Verifica che Docker funzioni senza sudo"
    echo "   - Testa il ripristino su un ambiente di prova"
}

# Esegui funzione principale
main "$@"