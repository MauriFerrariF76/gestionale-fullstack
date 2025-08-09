#!/bin/bash

# Script di monitoraggio stabilità sistema Gestionale
# Rileva reboot continui, crash frequenti e instabilità
# Best practice per ambiente enterprise-grade

set -e

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funzioni di output
print_status() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Directory progetto
PROJECT_ROOT="/home/mauri/gestionale-fullstack"
cd "$PROJECT_ROOT"

# File di stato e configurazione
STATUS_FILE="$PROJECT_ROOT/logs/stabilita-status.log"
ALERT_FILE="$PROJECT_ROOT/logs/stabilita-alerts.log"
CONFIG_FILE="$PROJECT_ROOT/scripts/stabilita-config.conf"

# Creazione file se non esistono
mkdir -p "$PROJECT_ROOT/logs"
touch "$STATUS_FILE"
touch "$ALERT_FILE"

# Configurazione default
MAX_REBOOTS_PER_HOUR=3
MAX_CRASHES_PER_HOUR=5
CHECK_INTERVAL=300  # 5 minuti

# Funzione per log timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$STATUS_FILE"
}

# Funzione per alert
log_alert() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - 🚨 ALERT: $1" >> "$ALERT_FILE"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - 🚨 ALERT: $1" >> "$STATUS_FILE"
}

# Funzione per controllare uptime del sistema
check_system_uptime() {
    local uptime_seconds=$(cat /proc/uptime | awk '{print $1}' | cut -d. -f1)
    local uptime_hours=$((uptime_seconds / 3600))
    local uptime_minutes=$(( (uptime_seconds % 3600) / 60 ))
    
    echo "Uptime: ${uptime_hours}h ${uptime_minutes}m"
    
    # Se uptime < 1 ora, potrebbe essere un reboot recente
    if [ $uptime_hours -lt 1 ]; then
        print_warning "Sistema riavviato nelle ultime ore"
        log_alert "Sistema riavviato - Uptime: ${uptime_hours}h ${uptime_minutes}m"
    fi
    
    return $uptime_hours
}

# Funzione per controllare servizi systemd
check_systemd_services() {
    print_status "Controllo servizi systemd..."
    
    # Controlla servizio gestionale
    if systemctl is-active --quiet gestionale-dev; then
        print_success "Servizio gestionale-dev attivo"
    else
        print_error "Servizio gestionale-dev non attivo!"
        log_alert "Servizio gestionale-dev non attivo"
        return 1
    fi
    
    # Controlla servizi critici
    local critical_services=("postgresql" "nginx")
    for service in "${critical_services[@]}"; do
        if systemctl is-active --quiet "$service"; then
            print_success "Servizio $service attivo"
        else
            print_warning "Servizio $service non attivo"
            log_alert "Servizio critico $service non attivo"
        fi
    done
}

# Funzione per controllare processi del gestionale
check_gestionale_processes() {
    print_status "Controllo processi gestionale..."
    
    # Controlla backend
    local backend_pid=$(ps aux | grep "ts-node src/app.ts" | grep -v grep | awk '{print $2}' | head -1)
    if [ -n "$backend_pid" ]; then
        print_success "Backend attivo (PID: $backend_pid)"
    else
        print_error "Backend non attivo!"
        log_alert "Backend non attivo"
        return 1
    fi
    
    # Controlla frontend
    local frontend_pid=$(ps aux | grep "next-server" | grep -v grep | awk '{print $2}' | head -1)
    if [ -n "$frontend_pid" ]; then
        print_success "Frontend attivo (PID: $frontend_pid)"
    else
        print_error "Frontend non attivo!"
        log_alert "Frontend non attivo"
        return 1
    fi
}

# Funzione per controllare porte
check_ports() {
    print_status "Controllo porte servizi..."
    
    # Controlla porta backend
    if ss -tlnp | grep -q ":3001"; then
        print_success "Porta 3001 (backend) in ascolto"
    else
        print_error "Porta 3001 (backend) non in ascolto!"
        log_alert "Porta backend 3001 non in ascolto"
        return 1
    fi
    
    # Controlla porta frontend
    if ss -tlnp | grep -q ":3000"; then
        print_success "Porta 3000 (frontend) in ascolto"
    else
        print_error "Porta 3000 (frontend) non in ascolto!"
        log_alert "Porta frontend 3000 non in ascolto"
        return 1
    fi
}

# Funzione per controllare log di errore
check_error_logs() {
    print_status "Controllo log errori..."
    
    # Controlla log systemd per errori recenti
    local recent_errors=$(sudo journalctl -u gestionale-dev --since "1 hour ago" --no-pager | grep -i "error\|fail\|crash" | wc -l)
    
    if [ $recent_errors -gt 0 ]; then
        print_warning "Trovati $recent_errors errori nelle ultime ore"
        log_alert "Trovati $recent_errors errori nelle ultime ore"
        
        # Log degli errori specifici
        sudo journalctl -u gestionale-dev --since "1 hour ago" --no-pager | grep -i "error\|fail\|crash" >> "$ALERT_FILE"
    else
        print_success "Nessun errore rilevato nelle ultime ore"
    fi
}

# Funzione per controllare utilizzo risorse
check_resource_usage() {
    print_status "Controllo utilizzo risorse..."
    
    # Controlla memoria
    local mem_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    local mem_usage_int=$(echo $mem_usage | cut -d. -f1)
    
    if [ $mem_usage_int -gt 80 ]; then
        print_warning "Utilizzo memoria alto: ${mem_usage}%"
        log_alert "Utilizzo memoria alto: ${mem_usage}%"
    else
        print_success "Utilizzo memoria normale: ${mem_usage}%"
    fi
    
    # Controlla CPU
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    local cpu_usage_int=$(echo $cpu_usage | cut -d. -f1)
    
    if [ $cpu_usage_int -gt 80 ]; then
        print_warning "Utilizzo CPU alto: ${cpu_usage}%"
        log_alert "Utilizzo CPU alto: ${cpu_usage}%"
    else
        print_success "Utilizzo CPU normale: ${cpu_usage}%"
    fi
    
    # Controlla spazio disco
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | cut -d'%' -f1)
    
    if [ $disk_usage -gt 80 ]; then
        print_warning "Spazio disco basso: ${disk_usage}%"
        log_alert "Spazio disco basso: ${disk_usage}%"
    else
        print_success "Spazio disco OK: ${disk_usage}%"
    fi
}

# Funzione per controllare frequenza reboot
check_reboot_frequency() {
    print_status "Controllo frequenza reboot..."
    
    # Conta reboot nelle ultime 24 ore
    local reboot_count=$(last reboot | head -10 | grep "$(date '+%a %b %d')" | wc -l)
    
    if [ $reboot_count -gt $MAX_REBOOTS_PER_HOUR ]; then
        print_error "Troppi reboot oggi: $reboot_count"
        log_alert "Troppi reboot rilevati: $reboot_count nelle ultime 24 ore"
    else
        print_success "Frequenza reboot normale: $reboot_count oggi"
    fi
}

# Funzione per controllare salute servizi
check_service_health() {
    print_status "Controllo salute servizi..."
    
    # Test endpoint backend
    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        print_success "Backend risponde correttamente"
    else
        print_error "Backend non risponde!"
        log_alert "Backend non risponde all'health check"
        return 1
    fi
    
    # Test endpoint frontend
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        print_success "Frontend risponde correttamente"
    else
        print_error "Frontend non risponde!"
        log_alert "Frontend non risponde"
        return 1
    fi
}

# Funzione principale di monitoraggio
main_monitoring() {
    echo "🔍 MONITORAGGIO STABILITÀ SISTEMA - $(date)"
    echo "=================================================="
    
    log_message "Avvio monitoraggio stabilità"
    
    # Controlli principali
    local uptime_hours=$(check_system_uptime)
    check_systemd_services
    check_gestionale_processes
    check_ports
    check_error_logs
    check_resource_usage
    check_reboot_frequency
    check_service_health
    
    echo ""
    echo "📊 RIEPILOGO MONITORAGGIO"
    echo "=========================="
    
    # Conta alert nelle ultime ore
    local recent_alerts=$(grep "$(date '+%Y-%m-%d')" "$ALERT_FILE" | wc -l)
    
    if [ $recent_alerts -eq 0 ]; then
        print_success "Sistema stabile - Nessun alert rilevato"
        log_message "Monitoraggio completato - Sistema stabile"
    else
        print_warning "Sistema con problemi - $recent_alerts alert rilevati"
        log_message "Monitoraggio completato - $recent_alerts alert rilevati"
    fi
    
    echo ""
    echo "📁 File di log:"
    echo "   Status: $STATUS_FILE"
    echo "   Alert: $ALERT_FILE"
    echo ""
    echo "⏰ Prossimo controllo: $(date -d "+$CHECK_INTERVAL seconds" '+%H:%M:%S')"
}

# Funzione per avvio monitoraggio continuo
start_continuous_monitoring() {
    echo "🚀 Avvio monitoraggio continuo (intervallo: $CHECK_INTERVAL secondi)"
    echo "Premi Ctrl+C per fermare"
    
    while true; do
        main_monitoring
        sleep $CHECK_INTERVAL
        echo ""
        echo "🔄 Riavvio monitoraggio..."
        echo ""
    done
}

# Gestione parametri
case "${1:-}" in
    "once")
        main_monitoring
        ;;
    "continuous"|"cont")
        start_continuous_monitoring
        ;;
    "status")
        echo "📊 STATO MONITORAGGIO"
        echo "====================="
        echo "Ultimo controllo: $(tail -1 "$STATUS_FILE" 2>/dev/null || echo "Mai eseguito")"
        echo "Alert recenti: $(grep "$(date '+%Y-%m-%d')" "$ALERT_FILE" 2>/dev/null | wc -l || echo "0")"
        echo "File log: $STATUS_FILE"
        echo "File alert: $ALERT_FILE"
        ;;
    "alerts")
        echo "🚨 ULTIMI ALERT"
        echo "==============="
        tail -20 "$ALERT_FILE" 2>/dev/null || echo "Nessun alert registrato"
        ;;
    *)
        echo "🔍 MONITORAGGIO STABILITÀ SISTEMA GESTIONALE"
        echo "============================================="
        echo ""
        echo "Uso: $0 [COMANDO]"
        echo ""
        echo "Comandi disponibili:"
        echo "  once        - Esegue un controllo singolo"
        echo "  continuous  - Avvia monitoraggio continuo"
        echo "  status      - Mostra stato monitoraggio"
        echo "  alerts      - Mostra ultimi alert"
        echo ""
        echo "Esempi:"
        echo "  $0 once           # Controllo singolo"
        echo "  $0 continuous     # Monitoraggio continuo"
        echo "  $0 status         # Stato attuale"
        echo "  $0 alerts         # Alert recenti"
        echo ""
        echo "📁 File di log:"
        echo "   Status: $STATUS_FILE"
        echo "   Alert: $ALERT_FILE"
        ;;
esac
