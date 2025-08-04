#!/bin/bash

# Script Monitoraggio Aggiornamento Node.js
# Versione: 2.0
# Data: 2025-08-04
# Descrizione: Monitoraggio completo pre/post aggiornamento

set -euo pipefail

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurazione
LOG_FILE="/home/mauri/backup/logs/monitor-aggiornamento-$(date +%Y%m%d_%H%M%S).log"
BASELINE_FILE="/tmp/baseline_metrics.txt"

# Funzioni di utilità
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}ℹ️ $1${NC}" | tee -a "$LOG_FILE"
}

# Funzione per test health check API
test_health_check() {
    local START_TIME=$(date +%s.%N)
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        local END_TIME=$(date +%s.%N)
        echo "$END_TIME - $START_TIME" | bc 2>/dev/null || echo "0"
    else
        echo "999"
    fi
}

# Funzione per test frontend
test_frontend() {
    curl -s http://localhost:3000 > /dev/null 2>&1
    return $?
}

# Funzione per test database
test_database() {
    docker exec gestionale-postgres pg_isready -U postgres > /dev/null 2>&1
    return $?
}

# Funzione per ottenere metriche Docker
get_docker_metrics() {
    local container="$1"
    local metric="$2"
    
    case "$metric" in
        "cpu")
            docker stats --no-stream --format "{{.CPUPerc}}" "$container" 2>/dev/null | sed 's/%//' || echo "0"
            ;;
        "memory")
            docker stats --no-stream --format "{{.MemPerc}}" "$container" 2>/dev/null | sed 's/%//' || echo "0"
            ;;
        *)
            echo "0"
            ;;
    esac
}

# Funzione per controllare spazio disco
check_disk_space() {
    df / | tail -1 | awk '{print $5}' | sed 's/%//'
}

# Funzione per inviare alert
send_alert() {
    local title="$1"
    local message="$2"
    local level="${3:-info}"
    
    log "ALERT [$level]: $title - $message"
    
    # Qui si può aggiungere l'invio di notifiche (email, Slack, etc.)
    case "$level" in
        "critical")
            echo -e "${RED}🚨 CRITICAL: $title${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️ WARNING: $title${NC}"
            ;;
        *)
            echo -e "${BLUE}ℹ️ INFO: $title${NC}"
            ;;
    esac
}

# Funzione per monitoraggio pre-aggiornamento
pre_update_monitoring() {
    log "=== MONITORAGGIO PRE-AGGIORNAMENTO ==="
    
    # Salva baseline
    local baseline_response_time=$(test_health_check)
    local baseline_cpu=$(get_docker_metrics "gestionale-backend" "cpu")
    local baseline_memory=$(get_docker_metrics "gestionale-backend" "memory")
    
    # Salva baseline
    cat > "$BASELINE_FILE" << 'EOF'
BASELINE_RESPONSE_TIME=$baseline_response_time
BASELINE_CPU_USAGE=$baseline_cpu
BASELINE_MEMORY_USAGE=$baseline_memory
BASELINE_TIMESTAMP=$(date +%s)
EOF
    
    success "Baseline salvata: response_time=${baseline_response_time}s, cpu=${baseline_cpu}%, memory=${baseline_memory}%"
    
    # Test servizi
    if test_health_check > /dev/null; then
        success "API Health OK"
    else
        error "API Health FAIL"
    fi
    
    if test_frontend; then
        success "Frontend OK"
    else
        error "Frontend FAIL"
    fi
    
    if test_database; then
        success "Database OK"
    else
        error "Database FAIL"
    fi
    
    info "Monitoraggio pre-aggiornamento completato"
}

# Funzione per monitoraggio post-aggiornamento
post_update_monitoring() {
    log "=== MONITORAGGIO POST-AGGIORNAMENTO ==="
    
    # Carica baseline
    if [ -f "$BASELINE_FILE" ]; then
        source "$BASELINE_FILE"
    else
        warning "Baseline non trovata, usando valori di default"
        BASELINE_RESPONSE_TIME="0.1"
        BASELINE_CPU_USAGE="5"
        BASELINE_MEMORY_USAGE="10"
    fi
    
    # Test attuali
    local current_response_time=$(test_health_check)
    local current_cpu=$(get_docker_metrics "gestionale-backend" "cpu")
    local current_memory=$(get_docker_metrics "gestionale-backend" "memory")
    
    # Confronto performance
    local performance_degraded=false
    
    if (( $(echo "$current_response_time > $BASELINE_RESPONSE_TIME * 1.5" | bc -l) )); then
        warning "Tempo risposta degradato: ${current_response_time}s vs ${BASELINE_RESPONSE_TIME}s"
        performance_degraded=true
    fi
    
    if (( $(echo "$current_cpu > $BASELINE_CPU_USAGE * 1.3" | bc -l) )); then
        warning "CPU usage aumentato: ${current_cpu}% vs ${BASELINE_CPU_USAGE}%"
        performance_degraded=true
    fi
    
    if (( $(echo "$current_memory > $BASELINE_MEMORY_USAGE * 1.3" | bc -l) )); then
        warning "Memory usage aumentato: ${current_memory}% vs ${BASELINE_MEMORY_USAGE}%"
        performance_degraded=true
    fi
    
    # Test servizi
    if test_health_check > /dev/null; then
        success "API Health OK"
    else
        error "API Health FAIL"
        performance_degraded=true
    fi
    
    if test_frontend; then
        success "Frontend OK"
    else
        error "Frontend FAIL"
        performance_degraded=true
    fi
    
    if test_database; then
        success "Database OK"
    else
        error "Database FAIL"
        performance_degraded=true
    fi
    
    if [ "$performance_degraded" = true ]; then
        send_alert "PERFORMANCE DEGRADATA" "Monitoraggio post-aggiornamento ha rilevato degradazione performance.\nServer: 10.10.10.15\nConsiderare ottimizzazioni." "warning"
    else
        success "Performance post-aggiornamento OK"
    fi
}

# Funzione per monitoraggio continuo
continuous_monitoring() {
    local duration="$1"
    local interval="$2"
    local iterations=$((duration * 60 / interval))
    
    log "=== MONITORAGGIO CONTINUO ==="
    log "Durata: ${duration} minuti"
    log "Intervallo: ${interval} secondi"
    log "Iterazioni: ${iterations}"
    
    for ((i=1; i<=iterations; i++)); do
        log "Iterazione $i/$iterations"
        
        # Test servizi
        local api_ok=false
        local frontend_ok=false
        local db_ok=false
        
        if test_health_check > /dev/null; then
            api_ok=true
        fi
        
        if test_frontend; then
            frontend_ok=true
        fi
        
        if test_database; then
            db_ok=true
        fi
        
        # Log stato
        if [ "$api_ok" = true ] && [ "$frontend_ok" = true ] && [ "$db_ok" = true ]; then
            success "Tutti i servizi OK"
        else
            error "Problemi rilevati: API=$api_ok, Frontend=$frontend_ok, DB=$db_ok"
        fi
        
        # Metriche
        local cpu=$(get_docker_metrics "gestionale-backend" "cpu")
        local memory=$(get_docker_metrics "gestionale-backend" "memory")
        local disk=$(check_disk_space)
        
        log "Metriche: CPU=${cpu}%, Memory=${memory}%, Disk=${disk}%"
        
        # Alert se necessario
        if [ "$cpu" -gt 80 ]; then
            send_alert "CPU ALTA" "CPU usage: ${cpu}%" "warning"
        fi
        
        if [ "$memory" -gt 80 ]; then
            send_alert "MEMORY ALTA" "Memory usage: ${memory}%" "warning"
        fi
        
        if [ "$disk" -gt 90 ]; then
            send_alert "DISK PIENO" "Disk usage: ${disk}%" "critical"
        fi
        
        sleep "$interval"
    done
}

# Funzione per test singolo sistema
run_system_test() {
    log "=== TEST SISTEMA SINGOLO ==="
    
    # Test servizi
    log "Test API..."
    if test_health_check > /dev/null; then
        success "API OK"
    else
        error "API FAIL"
    fi
    
    log "Test Frontend..."
    if test_frontend; then
        success "Frontend OK"
    else
        error "Frontend FAIL"
    fi
    
    log "Test Database..."
    if test_database; then
        success "Database OK"
    else
        error "Database FAIL"
    fi
    
    # Metriche
    local cpu=$(get_docker_metrics "gestionale-backend" "cpu")
    local memory=$(get_docker_metrics "gestionale-backend" "memory")
    local disk=$(check_disk_space)
    
    log "Metriche sistema:"
    log "  CPU: ${cpu}%"
    log "  Memory: ${memory}%"
    log "  Disk: ${disk}%"
    
    success "Test sistema completato"
}

# Funzione per report monitoraggio
generate_monitoring_report() {
    log "Generazione report monitoraggio..."
    
    REPORT_FILE="/home/mauri/backup/reports/monitoring-report-$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$REPORT_FILE" << 'EOF'
# Report Monitoraggio Aggiornamento - $(date +%Y-%m-%d %H:%M:%S)

## Riepilogo
- **Durata monitoraggio**: $MONITORING_DURATION minuti
- **Intervallo test**: $MONITORING_INTERVAL secondi
- **Test eseguiti**: $MONITORING_ITERATIONS
- **Problemi rilevati**: $(grep -c "⚠️\|❌" "$LOG_FILE" || echo "0")

## Metriche Performance
- **Tempo risposta API**: $(test_health_check)s
- **CPU Backend**: $(get_docker_metrics "gestionale-backend" "cpu")%
- **Memoria Backend**: $(get_docker_metrics "gestionale-backend" "memory")%
- **Spazio disco**: $(check_disk_space | cut -d'|' -f1)%

## Stato Servizi
- **API Health**: $(if test_health_check > /dev/null; then echo "✅ OK"; else echo "❌ FAIL"; fi)
- **Frontend**: $(if test_frontend; then echo "✅ OK"; else echo "❌ FAIL"; fi)
- **Database**: $(if test_database; then echo "✅ OK"; else echo "❌ FAIL"; fi)
- **Docker Services**: $(docker ps | grep -c "gestionale")/3

## Log Completo
\`\`\`
$(cat "$LOG_FILE")
\`\`\`
EOF
    
    success "Report monitoraggio generato: $REPORT_FILE"
}

# Main execution
main() {
    local mode="${1:-continuous}"
    local duration="${2:-60}"
    local interval="${3:-30}"
    
    MONITORING_DURATION=$duration
    MONITORING_INTERVAL=$interval
    MONITORING_ITERATIONS=$((duration * 60 / interval))
    
    log "=== INIZIO MONITORAGGIO AGGIORNAMENTO ==="
    log "Modalità: $mode"
    log "Durata: ${duration} minuti"
    log "Intervallo: ${interval} secondi"
    log "Log file: $LOG_FILE"
    
    case "$mode" in
        "pre")
            pre_update_monitoring
            ;;
        "post")
            post_update_monitoring
            ;;
        "continuous")
            continuous_monitoring "$duration" "$interval"
            ;;
        "test")
            run_system_test
            ;;
        *)
            echo "Uso: $0 [pre|post|continuous|test] [duration_minutes] [interval_seconds]"
            echo "  pre: Monitoraggio pre-aggiornamento"
            echo "  post: Monitoraggio post-aggiornamento"
            echo "  continuous: Monitoraggio continuo (default)"
            echo "  test: Test singolo sistema"
            exit 1
            ;;
    esac
    
    generate_monitoring_report
    
    log "=== FINE MONITORAGGIO AGGIORNAMENTO ==="
    success "Monitoraggio completato! ✅"
    
    echo -e "${GREEN}"
    echo "📊 MONITORAGGIO COMPLETATO!"
    echo "📋 Log completo: $LOG_FILE"
    echo "📄 Report disponibile: $REPORT_FILE"
    echo -e "${NC}"
}

# Gestione errori
trap 'error "Script interrotto da errore"' ERR
trap 'log "Script interrotto dall'\''utente"; exit 1' INT TERM

# Esecuzione
main "$@" 