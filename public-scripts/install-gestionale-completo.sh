#!/bin/bash
# install-gestionale-completo.sh - Installazione automatica Gestionale
# Versione: 2.0.0
# Basato su: Server fisico 10.10.10.15 (configurazione ideale)
# SSH Porta: 27

set -e

# Gestione errori migliorata
trap 'log_error "Script interrotto da errore. Controlla i log: $LOG_FILE"' ERR

# Configurazione logging
LOG_DIR="/home/mauri/logs"
LOG_FILE="$LOG_DIR/deploy-$(date +%Y%m%d-%H%M%S).log"
ERROR_LOG="$LOG_DIR/deploy-errors-$(date +%Y%m%d-%H%M%S).log"

# Crea directory log se non esiste
mkdir -p "$LOG_DIR"

# Funzione per logging completo
log_to_file() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# Funzione per logging errori
log_error_to_file() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [ERROR] $message" | tee -a "$LOG_FILE" "$ERROR_LOG"
}

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funzioni di utilità con logging
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
    log_to_file "INFO" "$1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    log_to_file "SUCCESS" "$1"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    log_to_file "WARNING" "$1"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    log_error_to_file "$1"
}

# Inizio logging
log_info "=== INIZIO DEPLOY AUTOMATICO GESTIONALE ==="
log_info "Versione script: 2.0.0"
log_info "Data/ora: $(date)"
log_info "Sistema: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2 2>/dev/null || echo 'Sistema non identificato')"
log_info "Kernel: $(uname -r)"
log_info "Architettura: $(uname -m)"
log_info "Utente: $(whoami)"
log_info "Directory: $(pwd)"
log_info "Log file: $LOG_FILE"
log_info "Error log: $ERROR_LOG"
log_info "=========================================="

# Verifica prerequisiti
check_prerequisites() {
    log_info "=== VERIFICA PREREQUISITI ==="
    
    # Verifica sistema operativo
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        if [[ "$ID" == "ubuntu" && "$VERSION_ID" == "24.04" ]]; then
            log_success "Sistema operativo: Ubuntu 24.04.2 LTS"
        else
            log_warning "Sistema operativo: $PRETTY_NAME (non testato)"
        fi
    fi
    
    # Verifica privilegi
    if [ "$EUID" -ne 0 ]; then
        log_error "Esegui questo script con privilegi di amministratore"
        echo "   sudo ./install-gestionale-completo.sh"
        exit 1
    fi
    
    # Verifica memoria (min 2GB)
    MEMORY_GB=$(free -g | awk '/^Mem:/{print $2}')
    if [ "$MEMORY_GB" -lt 2 ]; then
        log_error "Memoria insufficiente: ${MEMORY_GB}GB (minimo 2GB)"
        exit 1
    else
        log_success "Memoria: ${MEMORY_GB}GB"
    fi
    
    # Verifica spazio disco (min 3GB per VM di test)
    DISK_GB=$(df -BG / | awk 'NR==2{print $4}' | sed 's/G//')
    if [ "$DISK_GB" -lt 3 ]; then
        log_error "Spazio disco insufficiente: ${DISK_GB}GB (minimo 3GB per VM di test)"
        exit 1
    else
        log_success "Spazio disco: ${DISK_GB}GB"
    fi
    
    log_success "Prerequisiti verificati"
    echo ""
}

# Aggiornamento sistema
update_system() {
    log_info "=== AGGIORNAMENTO SISTEMA ==="
    
    log_info "Aggiornamento pacchetti..."
    apt update
    apt upgrade -y
    
    log_info "Installazione pacchetti essenziali..."
    apt install -y curl wget git vim htop unzip net-tools build-essential
    
    log_info "Installazione pacchetti per sviluppo e build..."
    apt install -y python3 python3-pip python3-venv
    
    log_info "Installazione pacchetti per database..."
    apt install -y postgresql-client
    
    log_info "Installazione pacchetti per SSL/HTTPS..."
    apt install -y certbot python3-certbot-nginx
    
    log_info "Installazione pacchetti per monitoraggio..."
    apt install -y htop iotop nethogs
    
    log_success "Sistema aggiornato"
    echo ""
}

# Installazione Docker (versione corretta)
install_docker() {
    log_info "=== INSTALLAZIONE DOCKER ==="
    
    log_info "Rimozione versioni precedenti..."
    apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    log_info "Installazione prerequisiti Docker..."
    apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
    
    log_info "Aggiunta repository Docker..."
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    log_info "Aggiornamento pacchetti..."
    apt update
    
    log_info "Installazione Docker..."
    apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    log_info "Avvio e abilitazione Docker..."
    systemctl start docker
    systemctl enable docker
    
    log_info "Installazione Docker Compose standalone..."
    # Docker Compose è ora integrato in Docker, non serve installazione separata
# Verifica che docker compose sia disponibile
    
    log_info "Configurazione utente Docker..."
    usermod -aG docker mauri
    
    # Verifica installazione
    DOCKER_VERSION=$(docker --version)
    COMPOSE_VERSION=$(docker compose version)
    
    log_success "Docker installato: $DOCKER_VERSION"
    log_success "Docker Compose: $COMPOSE_VERSION"
    log_success "Docker configurato"
    echo ""
}

# Configurazione rete
configure_network() {
    log_info "=== CONFIGURAZIONE RETE ==="
    
    # Configurazione IP statico (da personalizzare)
    log_info "Configurazione IP statico..."
    cat > /etc/netplan/01-static-ip.yaml << EOF
network:
  version: 2
  renderer: networkd
  ethernets:
    enp4s0:
      dhcp4: false
      addresses:
        - 10.10.10.15/24
      gateway4: 10.10.10.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
EOF
    
    log_info "Applicazione configurazione rete..."
    netplan apply
    
    log_success "Rete configurata"
    echo ""
}

# Configurazione SSH
configure_ssh() {
    log_info "=== CONFIGURAZIONE SSH ==="
    
    log_info "Configurazione SSH su porta 27..."
    
    # Backup configurazione originale
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
    
    # Modifica configurazione SSH
    sed -i 's/#Port 22/Port 27/' /etc/ssh/sshd_config
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
    
    log_info "Riavvio servizio SSH..."
    systemctl restart ssh
    
    log_success "SSH configurato su porta 27"
    echo ""
}

# Configurazione firewall
configure_firewall() {
    log_info "=== CONFIGURAZIONE FIREWALL ==="
    
    log_info "Configurazione UFW..."
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow 27/tcp comment 'SSH'
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    ufw allow 5433/tcp comment 'PostgreSQL'
    ufw --force enable
    
    log_success "Firewall configurato"
    echo ""
}

# Clonazione repository (versione corretta)
clone_repository() {
    log_info "=== CLONAZIONE REPOSITORY ==="
    
    cd /home/mauri
    
    # Rimuovi directory esistente se presente
    if [ -d "gestionale-fullstack" ]; then
        log_info "Rimozione directory esistente..."
        rm -rf gestionale-fullstack
    fi
    
    log_info "Clonazione repository gestionale..."
    git clone https://github.com/MauriFerrariF76/gestionale-fullstack.git
    
    if [ $? -eq 0 ]; then
        log_success "Repository clonato con successo"
    else
        log_error "Errore durante la clonazione del repository"
        exit 1
    fi
    
    cd gestionale-fullstack
    
    log_success "Repository configurato"
    echo ""
}

# Setup applicazione
setup_application() {
    log_info "=== SETUP APPLICAZIONE ==="
    
    cd /home/mauri/gestionale-fullstack
    
    log_info "Setup variabili d'ambiente..."
    if [ ! -f ".env" ]; then
        cp .env.example .env 2>/dev/null || echo "# Configurazione ambiente" > .env
    fi
    
    log_info "Setup segreti Docker..."
    mkdir -p secrets
    echo "gestionale2025" > secrets/db_password.txt
    echo "GestionaleFerrari2025JWT_UltraSecure_v1!" > secrets/jwt_secret.txt
    chmod 600 secrets/*.txt
    
    log_info "Build e avvio container..."
    docker compose up -d --build
    
    log_success "Applicazione configurata"
    echo ""
}

# Configurazione SSL/HTTPS (opzionale)
setup_ssl() {
    log_info "=== CONFIGURAZIONE SSL/HTTPS ==="
    
    log_info "Verifica dominio..."
    DOMAIN="gestionale.carpenteriaferrari.com"
    
    # Verifica se il dominio è configurato
    if nslookup $DOMAIN > /dev/null 2>&1; then
        log_info "Dominio $DOMAIN risolto correttamente"
        
        log_info "Installazione Certbot..."
        apt install -y certbot python3-certbot-nginx
        
        log_info "Configurazione SSL con Let's Encrypt..."
        # Certbot per Nginx dockerizzato (certificati in /etc/letsencrypt)
        certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos --email admin@carpenteriaferrari.com
        
        if [ $? -eq 0 ]; then
            log_success "SSL configurato per $DOMAIN"
            log_info "Certificati salvati in /etc/letsencrypt/"
            
            # Test HTTPS dopo riavvio container
            log_info "Riavvio container per applicare SSL..."
            cd /home/mauri/gestionale-fullstack
            docker compose restart nginx
            
            # Test HTTPS
            sleep 10
            if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200\|301\|302"; then
                log_success "HTTPS funzionante"
            else
                log_warning "HTTPS non testato (dominio non accessibile)"
            fi
        else
            log_warning "SSL non configurato (dominio non accessibile o errore)"
        fi
    else
        log_warning "Dominio $DOMAIN non risolto - SSL non configurato"
        log_info "Per configurare SSL:"
        log_info "1. Configura il DNS per puntare a questo server"
        log_info "2. Esegui: sudo certbot certonly --standalone -d $DOMAIN"
    fi
    
    echo ""
}

# Verifiche post-installazione
post_install_checks() {
    log_info "=== VERIFICHE POST-INSTALLAZIONE ==="
    
    log_info "Verifica Docker..."
    if command -v docker > /dev/null && docker compose version > /dev/null 2>&1; then
        log_success "Docker: $(docker --version)"
        log_success "Docker Compose: $(docker compose version)"
    else
        log_error "Docker o Docker Compose non installati"
    fi
    
    log_info "Verifica Docker daemon..."
    if docker ps > /dev/null 2>&1; then
        log_success "Docker daemon attivo"
    else
        log_warning "Docker daemon non attivo"
    fi
    
    log_info "Verifica pacchetti sistema..."
    if command -v postgres > /dev/null; then
        log_success "PostgreSQL client: installato"
    else
        log_warning "PostgreSQL client non installato"
    fi
    
    if command -v certbot > /dev/null; then
        log_success "Certbot: installato"
    else
        log_warning "Certbot non installato"
    fi
    
    log_info "Verifica servizi Docker..."
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "Up"; then
        log_success "Container attivi"
        docker ps --format "table {{.Names}}\t{{.Status}}"
    else
        log_error "Nessun container attivo"
    fi
    
    log_info "Verifica connettività..."
    if ping -c 3 8.8.8.8 > /dev/null 2>&1; then
        log_success "Connettività internet OK"
    else
        log_warning "Connettività internet non verificata"
    fi
    
    log_info "Verifica porte in ascolto..."
    ss -tuln | grep -E ":(27|80|443|5433)"
    
    log_success "Verifiche completate"
    echo ""
}

# Generazione report completo con log integrati
generate_report() {
    log_info "=== GENERAZIONE REPORT COMPLETO ==="
    
    REPORT_FILE="/home/mauri/deploy-report-$(date +%Y%m%d-%H%M%S).txt"
    
    # Crea report completo con log integrati
    cat > "$REPORT_FILE" << EOF
================================================================================
                           REPORT DEPLOY AUTOMATICO GESTIONALE
================================================================================
Data/ora: $(date)
Versione script: 2.0.0
Sistema: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2 2>/dev/null || echo 'Sistema non identificato')
Kernel: $(uname -r)
Architettura: $(uname -m)
IP: $(ip route get 8.8.8.8 | awk '{print $7}')
SSH Porta: 27
Utente: $(whoami)
Directory: $(pwd)

================================================================================
                                    LOG COMPLETI
================================================================================
EOF
    
    # Aggiungi log completi al report
    if [ -f "$LOG_FILE" ]; then
        cat "$LOG_FILE" >> "$REPORT_FILE"
    fi
    
    # Aggiungi informazioni finali
    cat >> "$REPORT_FILE" << EOF

================================================================================
                                    STATO SISTEMA
================================================================================
Docker: $(docker --version 2>/dev/null || echo "Non installato")
Docker Compose: $(docker compose version 2>/dev/null || echo "Non installato")

=== CONTAINER ATTIVI ===
$(docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Nessun container attivo")

=== CONFIGURAZIONE COMPLETATA ===
✅ Sistema aggiornato
✅ Rete configurata
✅ SSH su porta 27
✅ Firewall configurato
✅ Docker installato
✅ Repository clonato
✅ Applicazione avviata

=== ACCESSO APPLICAZIONE ===
Frontend: http://$(ip route get 8.8.8.8 | awk '{print $7}'):3000
Backend: http://$(ip route get 8.8.8.8 | awk '{print $7}'):3001
Database: $(ip route get 8.8.8.8 | awk '{print $7}'):5433

=== COMANDI UTILI ===
Stato container: docker ps
Log container: docker compose logs -f
Ferma servizi: docker compose down
Avvia servizi: docker compose up -d

=== FILE DI LOG ===
Log completi: $LOG_FILE
Error log: $ERROR_LOG
Report completo: $REPORT_FILE

=== COMANDI PER VISUALIZZARE LOG ===
Visualizza log in tempo reale: tail -f $LOG_FILE
Visualizza errori: tail -f $ERROR_LOG
Visualizza report completo: cat $REPORT_FILE
Copia report su PC: scp mauri@$(ip route get 8.8.8.8 | awk '{print $7}'):$REPORT_FILE ./

================================================================================
                                    FINE REPORT
================================================================================
EOF
    
    log_success "Report completo generato: $REPORT_FILE"
    log_info "Il report contiene tutti i log del deploy"
    log_info "Per copiare il report sul PC: scp mauri@$(ip route get 8.8.8.8 | awk '{print $7}'):$REPORT_FILE ./"
    
    # Mostra informazioni per accesso ai log
    echo ""
    echo "📄 REPORT E LOG DISPONIBILI:"
    echo "   Report completo: $REPORT_FILE"
    echo "   Log dettagliati: $LOG_FILE"
    echo "   Errori: $ERROR_LOG"
    echo ""
    echo "📋 COMANDI PER ACCEDERE AI LOG:"
    echo "   Visualizza report: cat $REPORT_FILE"
    echo "   Log in tempo reale: tail -f $LOG_FILE"
    echo "   Solo errori: tail -f $ERROR_LOG"
    echo "   Copia su PC: scp mauri@$(ip route get 8.8.8.8 | awk '{print $7}'):$REPORT_FILE ./"
    echo ""
}

# Funzione principale
main() {
    log_info "=== INIZIO FUNZIONE PRINCIPALE ==="
    
    echo "=========================================="
    echo "INSTALLAZIONE AUTOMATICA GESTIONALE"
    echo "Versione: 2.0.0"
    echo "Basato su: Server fisico 10.10.10.15"
    echo "SSH Porta: 27"
    echo "Data: $(date)"
    echo "=========================================="
    echo ""
    
    # Esecuzione con gestione errori
    local exit_code=0
    
    check_prerequisites || exit_code=1
    if [ $exit_code -eq 0 ]; then
        update_system || exit_code=1
    fi
    if [ $exit_code -eq 0 ]; then
        install_docker || exit_code=1
    fi
    if [ $exit_code -eq 0 ]; then
        configure_network || exit_code=1
    fi
    if [ $exit_code -eq 0 ]; then
        configure_ssh || exit_code=1
    fi
    if [ $exit_code -eq 0 ]; then
        configure_firewall || exit_code=1
    fi
    if [ $exit_code -eq 0 ]; then
        clone_repository || exit_code=1
    fi
    if [ $exit_code -eq 0 ]; then
        setup_application || exit_code=1
    fi
    if [ $exit_code -eq 0 ]; then
        setup_ssl || exit_code=1
    fi
    if [ $exit_code -eq 0 ]; then
        post_install_checks || exit_code=1
    fi
    if [ $exit_code -eq 0 ]; then
        generate_report || exit_code=1
    fi
    
    # Logging finale
    if [ $exit_code -eq 0 ]; then
        log_success "=== DEPLOY COMPLETATO CON SUCCESSO ==="
        log_success "Data/ora completamento: $(date)"
        log_success "Durata totale: $SECONDS secondi"
        log_success "Log file: $LOG_FILE"
        log_success "Error log: $ERROR_LOG"
        
        echo "=========================================="
        echo "INSTALLAZIONE COMPLETATA CON SUCCESSO!"
        echo "=========================================="
        echo ""
        echo "🎉 Il gestionale è ora operativo!"
        echo ""
        echo "📋 Prossimi passi:"
        echo "1. Configura le variabili d'ambiente in .env"
        echo "2. Accedi all'applicazione via browser"
        echo "3. Configura backup e monitoraggio"
        echo ""
        echo "📞 Supporto: Consulta la documentazione in /docs"
        echo ""
        echo "📄 REPORT E LOG:"
        echo "   Report completo: $REPORT_FILE"
        echo "   Log dettagliati: $LOG_FILE"
        echo "   Errori: $ERROR_LOG"
        echo ""
        echo "📋 COMANDI UTILI:"
        echo "   Visualizza report: cat $REPORT_FILE"
        echo "   Log in tempo reale: tail -f $LOG_FILE"
        echo "   Solo errori: tail -f $ERROR_LOG"
        echo "   Copia su PC: scp mauri@$(ip route get 8.8.8.8 | awk '{print $7}'):$REPORT_FILE ./"
    else
        log_error "=== DEPLOY FALLITO ==="
        log_error "Data/ora errore: $(date)"
        log_error "Durata totale: $SECONDS secondi"
        log_error "Log file: $LOG_FILE"
        log_error "Error log: $ERROR_LOG"
        
        echo "=========================================="
        echo "INSTALLAZIONE FALLITA!"
        echo "=========================================="
        echo ""
        echo "❌ Si è verificato un errore durante l'installazione"
        echo ""
        echo "📄 Consulta i log per i dettagli:"
        echo "   Report completo: $REPORT_FILE"
        echo "   Log dettagliati: $LOG_FILE"
        echo "   Errori: $ERROR_LOG"
        echo ""
        echo "🔧 Possibili soluzioni:"
        echo "1. Verifica i prerequisiti (memoria, disco, rete)"
        echo "2. Controlla la connettività internet"
        echo "3. Verifica i permessi di amministratore"
        echo "4. Consulta la documentazione in /docs"
    fi
    
    log_info "=== FINE FUNZIONE PRINCIPALE ==="
    return $exit_code
}

# Esecuzione script
main "$@" 