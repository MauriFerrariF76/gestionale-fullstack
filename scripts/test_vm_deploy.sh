#!/bin/bash
# test_vm_deploy.sh - Script di supporto per test deploy VM
# Versione: 1.0
# Descrizione: Automatizza controlli e test durante il deploy sulla VM

set -e  # Esci se un comando fallisce

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurazione
VM_IP="10.10.10.43"
PC_IP="10.10.10.33"
PROJECT_DIR="/home/mauri/gestionale-fullstack"

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
    log_info "=== VERIFICA SISTEMA ==="
    
    echo "Hostname: $(hostname)"
    echo "User: $(whoami)"
    echo "IP: $(hostname -I)"
    echo "OS: $(lsb_release -d | cut -f2)"
    echo "Kernel: $(uname -r)"
    
    log_success "Verifica sistema completata"
}

# Verifica connettività
check_connectivity() {
    log_info "=== VERIFICA CONNETTIVITA' ==="
    
    # Test gateway
    if ping -c 1 10.10.10.1 &> /dev/null; then
        log_success "Gateway (10.10.10.1) raggiungibile"
    else
        log_error "Gateway (10.10.10.1) non raggiungibile"
    fi
    
    # Test internet
    if ping -c 1 8.8.8.8 &> /dev/null; then
        log_success "Internet (8.8.8.8) raggiungibile"
    else
        log_error "Internet (8.8.8.8) non raggiungibile"
    fi
    
    # Test DNS
    if nslookup google.com &> /dev/null; then
        log_success "DNS funzionante"
    else
        log_error "DNS non funzionante"
    fi
}

# Verifica progetto
check_project() {
    log_info "=== VERIFICA PROGETTO ==="
    
    if [ -d "$PROJECT_DIR" ]; then
        log_success "Directory progetto presente"
        cd "$PROJECT_DIR"
        
        # Verifica file essenziali
        local files=("docker-compose.yml" "scripts/setup_docker.sh" "scripts/install_docker.sh")
        for file in "${files[@]}"; do
            if [ -f "$file" ]; then
                log_success "$file presente"
            else
                log_error "$file mancante"
            fi
        done
        
        # Verifica struttura
        local dirs=("backend" "frontend" "scripts" "secrets")
        for dir in "${dirs[@]}"; do
            if [ -d "$dir" ]; then
                log_success "Directory $dir presente"
            else
                log_warning "Directory $dir mancante"
            fi
        done
    else
        log_error "Directory progetto non trovata: $PROJECT_DIR"
    fi
}

# Verifica Docker
check_docker() {
    log_info "=== VERIFICA DOCKER ==="
    
    if command -v docker &> /dev/null; then
        log_success "Docker installato: $(docker --version)"
    else
        log_error "Docker non installato"
        return 1
    fi
    
    if command -v docker-compose &> /dev/null; then
        log_success "Docker Compose installato: $(docker-compose --version)"
    else
        log_error "Docker Compose non installato"
        return 1
    fi
    
    # Test Docker
    if docker run --rm hello-world &> /dev/null; then
        log_success "Docker funzionante"
    else
        log_error "Docker non funzionante"
        return 1
    fi
    
    # Verifica permessi
    if groups | grep -q docker; then
        log_success "Utente nel gruppo docker"
    else
        log_warning "Utente non nel gruppo docker"
    fi
}

# Verifica segreti
check_secrets() {
    log_info "=== VERIFICA SEGRETI ==="
    
    cd "$PROJECT_DIR"
    
    local secrets=("secrets/db_password.txt" "secrets/jwt_secret.txt")
    for secret in "${secrets[@]}"; do
        if [ -f "$secret" ]; then
            log_success "$secret presente"
            # Verifica permessi
            local perms=$(stat -c %a "$secret")
            if [ "$perms" = "600" ]; then
                log_success "Permessi $secret corretti (600)"
            else
                log_warning "Permessi $secret non corretti: $perms"
            fi
        else
            log_error "$secret mancante"
        fi
    done
}

# Verifica servizi
check_services() {
    log_info "=== VERIFICA SERVIZI ==="
    
    cd "$PROJECT_DIR"
    
    if [ -f "docker-compose.yml" ]; then
        # Stato servizi
        log_info "Stato servizi Docker:"
        docker-compose ps
        
        # Test API
        if curl -s http://localhost:3001/health &> /dev/null; then
            log_success "Backend API raggiungibile"
        else
            log_error "Backend API non raggiungibile"
        fi
        
        # Test frontend
        if curl -s http://localhost:3000 &> /dev/null; then
            log_success "Frontend raggiungibile"
        else
            log_error "Frontend non raggiungibile"
        fi
        
        # Test database
        if docker-compose exec -T postgres psql -U gestionale_user -d gestionale -c "SELECT 1;" &> /dev/null; then
            log_success "Database accessibile"
        else
            log_error "Database non accessibile"
        fi
    else
        log_error "docker-compose.yml non trovato"
    fi
}

# Verifica accesso esterno
check_external_access() {
    log_info "=== VERIFICA ACCESSO ESTERNO ==="
    
    # Test da VM stessa
    if curl -s http://localhost:3000 &> /dev/null; then
        log_success "Frontend accessibile localmente"
    else
        log_error "Frontend non accessibile localmente"
    fi
    
    if curl -s http://localhost:3001/health &> /dev/null; then
        log_success "Backend accessibile localmente"
    else
        log_error "Backend non accessibile localmente"
    fi
    
    # Test da PC-MAURI (se eseguito da PC-MAURI)
    if [ "$(hostname -I | grep -o $PC_IP)" = "$PC_IP" ]; then
        log_info "Eseguito da PC-MAURI, testando accesso VM..."
        if curl -s http://$VM_IP:3000 &> /dev/null; then
            log_success "Frontend accessibile da PC-MAURI"
        else
            log_error "Frontend non accessibile da PC-MAURI"
        fi
        
        if curl -s http://$VM_IP:3001/health &> /dev/null; then
            log_success "Backend accessibile da PC-MAURI"
        else
            log_error "Backend non accessibile da PC-MAURI"
        fi
    fi
}

# Verifica risorse
check_resources() {
    log_info "=== VERIFICA RISORSE ==="
    
    echo "Memoria:"
    free -h
    
    echo "Disco:"
    df -h
    
    echo "CPU:"
    top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1
    
    echo "Docker:"
    docker system df
}

# Genera report
generate_report() {
    log_info "=== GENERAZIONE REPORT ==="
    
    local report_file="/home/mauri/test-vm-report-$(date +%Y%m%d_%H%M%S).txt"
    
    cat > "$report_file" << EOF
=== TEST VM DEPLOY REPORT ===
Data: $(date)
VM: $VM_IP
PC Sorgente: $PC_IP
Hostname: $(hostname)

=== SISTEMA ===
OS: $(lsb_release -d | cut -f2)
Kernel: $(uname -r)
IP: $(hostname -I)

=== DOCKER ===
$(docker --version 2>/dev/null || echo "Docker non installato")
$(docker-compose --version 2>/dev/null || echo "Docker Compose non installato")

=== SERVIZI ===
$(docker-compose ps 2>/dev/null || echo "Servizi non disponibili")

=== RISORSE ===
Memoria:
$(free -h)

Disco:
$(df -h)

=== CONNETTIVITA' ===
Gateway: $(ping -c 1 10.10.10.1 2>/dev/null | grep "1 packets" || echo "Non raggiungibile")
Internet: $(ping -c 1 8.8.8.8 2>/dev/null | grep "1 packets" || echo "Non raggiungibile")

=== LOG ERRORI ===
$(docker-compose logs --tail=20 2>/dev/null | grep -i error || echo "Nessun errore trovato")

EOF
    
    log_success "Report generato: $report_file"
    
    # Copia su PC-MAURI se possibile
    if [ "$(hostname -I | grep -o $PC_IP)" != "$PC_IP" ]; then
        if scp "$report_file" mauri@$PC_IP:/home/mauri/ &> /dev/null; then
            log_success "Report copiato su PC-MAURI"
        else
            log_warning "Impossibile copiare report su PC-MAURI"
        fi
    fi
}

# Menu principale
show_menu() {
    echo -e "${BLUE}=== TEST VM DEPLOY - GESTIONALE FULLSTACK ===${NC}"
    echo ""
    echo "1. Verifica sistema"
    echo "2. Verifica connettività"
    echo "3. Verifica progetto"
    echo "4. Verifica Docker"
    echo "5. Verifica segreti"
    echo "6. Verifica servizi"
    echo "7. Verifica accesso esterno"
    echo "8. Verifica risorse"
    echo "9. Genera report completo"
    echo "10. Test completo"
    echo "0. Esci"
    echo ""
    read -p "Seleziona opzione: " choice
}

# Test completo
run_full_test() {
    log_info "=== TEST COMPLETO ==="
    
    check_system
    check_connectivity
    check_project
    check_docker
    check_secrets
    check_services
    check_external_access
    check_resources
    generate_report
    
    log_success "Test completo completato!"
}

# Main
main() {
    if [ "$1" = "--full" ]; then
        run_full_test
        exit 0
    fi
    
    while true; do
        show_menu
        case $choice in
            1) check_system ;;
            2) check_connectivity ;;
            3) check_project ;;
            4) check_docker ;;
            5) check_secrets ;;
            6) check_services ;;
            7) check_external_access ;;
            8) check_resources ;;
            9) generate_report ;;
            10) run_full_test ;;
            0) echo "Arrivederci!"; exit 0 ;;
            *) echo "Opzione non valida" ;;
        esac
        
        echo ""
        read -p "Premi Invio per continuare..."
    done
}

# Esegui main
main "$@" 