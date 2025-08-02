#!/bin/bash
# ottimizza-disco-vm.sh - Ottimizzazione spazio disco VM
# Versione: 1.0.0
# Descrizione: Script per ridurre lo spazio utilizzato su VM di test

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

# Verifica spazio iniziale
check_space_before() {
    log_info "=== VERIFICA SPAZIO INIZIALE ==="
    
    echo "Spazio disco utilizzato:"
    df -h /
    
    echo ""
    echo "Directory più grandi:"
    sudo du -h --max-depth=1 / 2>/dev/null | sort -hr | head -10
    
    echo ""
    echo "Spazio Docker:"
    docker system df 2>/dev/null || echo "Docker non installato"
}

# Pulizia cache apt
clean_apt_cache() {
    log_info "=== PULIZIA CACHE APT ==="
    
    sudo apt clean
    sudo apt autoremove -y
    sudo apt autoclean
    
    log_success "Cache apt pulita"
}

# Pulizia log di sistema
clean_system_logs() {
    log_info "=== PULIZIA LOG DI SISTEMA ==="
    
    # Pulisci log vecchi
    sudo journalctl --vacuum-time=7d
    
    # Pulisci log specifici
    sudo find /var/log -name "*.log" -exec truncate -s 0 {} \;
    sudo find /var/log -name "*.gz" -delete
    
    log_success "Log di sistema puliti"
}

# Pulizia cache utente
clean_user_cache() {
    log_info "=== PULIZIA CACHE UTENTE ==="
    
    # Cache npm
    npm cache clean --force 2>/dev/null || true
    
    # Cache Docker
    docker system prune -f 2>/dev/null || true
    
    # Cache browser (se installato)
    rm -rf ~/.cache/* 2>/dev/null || true
    
    log_success "Cache utente pulita"
}

# Ottimizzazione Docker
optimize_docker() {
    log_info "=== OTTIMIZZAZIONE DOCKER ==="
    
    # Rimuovi immagini non utilizzate
    docker image prune -f 2>/dev/null || true
    
    # Rimuovi container fermati
    docker container prune -f 2>/dev/null || true
    
    # Rimuovi volumi non utilizzati
    docker volume prune -f 2>/dev/null || true
    
    # Rimuovi reti non utilizzate
    docker network prune -f 2>/dev/null || true
    
    log_success "Docker ottimizzato"
}

# Pulizia file temporanei
clean_temp_files() {
    log_info "=== PULIZIA FILE TEMPORANEI ==="
    
    # File temporanei di sistema
    sudo rm -rf /tmp/*
    sudo rm -rf /var/tmp/*
    
    # File temporanei utente
    rm -rf ~/.local/share/Trash/* 2>/dev/null || true
    
    log_success "File temporanei puliti"
}

# Compressione file di sistema
compress_system_files() {
    log_info "=== COMPRESSIONE FILE DI SISTEMA ==="
    
    # Comprimi file di log grandi
    sudo find /var/log -name "*.log" -size +1M -exec gzip {} \;
    
    log_success "File di sistema compressi"
}

# Verifica spazio finale
check_space_after() {
    log_info "=== VERIFICA SPAZIO FINALE ==="
    
    echo "Spazio disco dopo ottimizzazione:"
    df -h /
    
    echo ""
    echo "Risparmio spazio:"
    # Calcola differenza (semplificato)
    echo "Ottimizzazione completata"
}

# Funzione principale
main() {
    echo "=========================================="
    echo "OTTIMIZZAZIONE SPAZIO DISCO VM"
    echo "Data: $(date)"
    echo "=========================================="
    echo ""
    
    check_space_before
    echo ""
    
    clean_apt_cache
    clean_system_logs
    clean_user_cache
    optimize_docker
    clean_temp_files
    compress_system_files
    
    echo ""
    check_space_after
    
    echo ""
    echo "=========================================="
    echo "OTTIMIZZAZIONE COMPLETATA!"
    echo "=========================================="
    echo ""
    echo "💡 Suggerimenti per mantenere lo spazio libero:"
    echo "1. Esegui questo script periodicamente"
    echo "2. Usa 'docker system prune' regolarmente"
    echo "3. Monitora con 'df -h' e 'du -sh /*'"
    echo "4. Considera l'uso di dischi dinamici in VirtualBox"
}

# Esecuzione script
main "$@" 