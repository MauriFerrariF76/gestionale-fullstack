#!/bin/bash

# Script Monitoraggio Aggiornamento - Gestionale Fullstack
# Versione: 1.0
# Data: $(date +%Y-%m-%d)
# Server: 10.10.10.15

set -e  # Exit on error

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurazioni
PROJECT_DIR="/home/mauri/gestionale-fullstack"
BACKUP_DIR="/home/mauri/backup"
LOG_FILE="/home/mauri/backup/logs/monitor-aggiornamento-$(date +%Y%m%d-%H%M%S).log"
ALERT_EMAIL="mauri@dominio.com"
ROLLBACK_SCRIPT="/home/mauri/gestionale-fullstack/scripts/rollback-automatico.sh"

# Metriche baseline
BASELINE_RESPONSE_TIME=2.0
BASELINE_CPU_USAGE=80
BASELINE_MEMORY_USAGE=80
MAX_ERROR_COUNT=10
MAX_RESPONSE_TIME=5.0

# Funzione per logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

# Funzione per invio alert email
send_alert() {
    local subject="$1"
    local message="$2"
    local priority="$3"
    
    if [ "$priority" = "critical" ]; then
        subject="🚨 CRITICO: $subject"
    elif [ "$priority" = "warning" ]; then
        subject="⚠️  WARNING: $subject"
    fi
    
    echo "$message" | mail -s "$subject" "$ALERT_EMAIL" || warning "Impossibile inviare email alert"
}

# Funzione per test health check
test_health_check() {
    local response=$(curl -s -w "%{http_code}|%{time_total}" -o /dev/null http://localhost:3001/api/health 2>/dev/null || echo "000|0.0")
    local http_code=$(echo "$response" | cut -d'|' -f1)
    local response_time=$(echo "$response" | cut -d'|' -f2)
    
    if [ "$http_code" = "200" ]; then
        echo "$response_time"
        return 0
    else
        echo "0"
        return 1
    fi
}

# Funzione per test frontend
test_frontend() {
    local response=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:3000 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ]; then
        return 0
    else
        return 1
    fi
}

# Funzione per test database
test_database() {
    if docker exec gestionale-postgres pg_isready -U postgres &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Funzione per raccolta metriche Docker
get_docker_metrics() {
    local container_name="$1"
    local metric_type="$2"
    
    case "$metric_type" in
        "cpu")
            docker stats --no-stream --format "table {{.CPUPerc}}" "$container_name" | tail -n 1 | sed 's/%//'
            ;;
        "memory")
            docker stats --no-stream --format "table {{.MemPerc}}" "$container_name" | tail -n 1 | sed 's/%//'
            ;;
        "status")
            docker ps --format "table {{.Status}}" | grep "$container_name" | head -1
            ;;
    esac
}

# Funzione per conteggio errori nei log
count_errors() {
    local container_name="$1"
    local error_type="$2"
    
    case "$error_type" in
        "critical")
            docker logs "$container_name" 2>&1 | grep -c "CRITICAL\|FATAL\|ERROR" || echo "0"
            ;;
        "warning")
            docker logs "$container_name" 2>&1 | grep -c "WARN\|WARNING" || echo "0"
            ;;
        "all")
            docker logs "$container_name" 2>&1 | grep -c "ERROR\|WARN\|CRITICAL\|FATAL" || echo "0"
            ;;
    esac
}

# Funzione per verifica spazio disco
check_disk_space() {
    local usage=$(df /home/mauri | awk 'NR==2 {print $5}' | sed 's/%//')
    local available=$(df /home/mauri | awk 'NR==2 {print $4}')
    
    echo "$usage|$available"
}

# Funzione per test completo sistema
run_system_test() {
    local test_results=()
    local issues=()
    
    log "Esecuzione test completo sistema..."
    
    # Test health check API
    local response_time=$(test_health_check)
    if [ "$response_time" != "0" ]; then
        test_results+=("API: OK (${response_time}s)")
        if (( $(echo "$response_time > $MAX_RESPONSE_TIME" | bc -l) )); then
            issues+=("Tempo risposta API elevato: ${response_time}s")
        fi
    else
        test_results+=("API: FAIL")
        issues+=("API non raggiungibile")
    fi
    
    # Test frontend
    if test_frontend; then
        test_results+=("Frontend: OK")
    else
        test_results+=("Frontend: FAIL")
        issues+=("Frontend non raggiungibile")
    fi
    
    # Test database
    if test_database; then
        test_results+=("Database: OK")
    else
        test_results+=("Database: FAIL")
        issues+=("Database non raggiungibile")
    fi
    
    # Test servizi Docker
    local docker_services=$(docker ps | grep -c "gestionale" || echo "0")
    if [ "$docker_services" -ge 3 ]; then
        test_results+=("Docker: OK ($docker_services servizi)")
    else
        test_results+=("Docker: FAIL ($docker_services servizi)")
        issues+=("Servizi Docker insufficienti: $docker_services")
    fi
    
    # Test metriche performance
    local backend_cpu=$(get_docker_metrics "gestionale-backend" "cpu")
    local backend_memory=$(get_docker_metrics "gestionale-backend" "memory")
    
    if [ -n "$backend_cpu" ] && [ "$backend_cpu" -gt "$BASELINE_CPU_USAGE" ]; then
        issues+=("CPU backend elevata: ${backend_cpu}%")
    fi
    
    if [ -n "$backend_memory" ] && [ "$backend_memory" -gt "$BASELINE_MEMORY_USAGE" ]; then
        issues+=("Memoria backend elevata: ${backend_memory}%")
    fi
    
    # Test errori nei log
    local critical_errors=$(count_errors "gestionale-backend" "critical")
    if [ "$critical_errors" -gt 0 ]; then
        issues+=("Errori critici nei log: $critical_errors")
    fi
    
    # Test spazio disco
    local disk_metrics=$(check_disk_space)
    local disk_usage=$(echo "$disk_metrics" | cut -d'|' -f1)
    local disk_available=$(echo "$disk_metrics" | cut -d'|' -f2)
    
    if [ "$disk_usage" -gt 90 ]; then
        issues+=("Spazio disco critico: ${disk_usage}%")
    fi
    
    # Output risultati
    echo "=== RISULTATI TEST ==="
    for result in "${test_results[@]}"; do
        echo "  $result"
    done
    
    if [ ${#issues[@]} -gt 0 ]; then
        echo "=== PROBLEMI RILEVATI ==="
        for issue in "${issues[@]}"; do
            warning "$issue"
        done
        return 1
    else
        success "Tutti i test superati"
        return 0
    fi
}

# Funzione per monitoraggio continuo
continuous_monitoring() {
    local duration_minutes="${1:-60}"  # Default 60 minuti
    local interval_seconds="${2:-30}"  # Default 30 secondi
    local iterations=$((duration_minutes * 60 / interval_seconds))
    
    log "Avvio monitoraggio continuo per ${duration_minutes} minuti (intervallo: ${interval_seconds}s)"
    
    local iteration=0
    local critical_issues=0
    
    while [ $iteration -lt $iterations ]; do
        iteration=$((iteration + 1))
        log "Iterazione $iteration/$iterations"
        
        # Esegui test sistema
        if ! run_system_test; then
            critical_issues=$((critical_issues + 1))
            
            # Se troppi problemi critici, considera rollback
            if [ $critical_issues -ge 3 ]; then
                error "Troppi problemi critici rilevati ($critical_issues). Considerare rollback."
                send_alert "PROBLEMI CRITICI RILEVATI" "Monitoraggio ha rilevato $critical_issues problemi critici consecutivi.\nServer: 10.10.10.15\nConsiderare rollback automatico." "critical"
                
                # Trigger rollback automatico se script disponibile
                if [ -f "$ROLLBACK_SCRIPT" ]; then
                    log "Trigger rollback automatico..."
                    "$ROLLBACK_SCRIPT" auto
                fi
                break
            fi
        else
            critical_issues=0  # Reset contatore se tutto OK
        fi
        
        # Attendi prossima iterazione
        sleep $interval_seconds
    done
    
    log "Monitoraggio continuo completato"
}

# Funzione per monitoraggio pre-aggiornamento
pre_update_monitoring() {
    log "Monitoraggio pre-aggiornamento..."
    
    # Raccolta baseline
    log "Raccolta baseline performance..."
    
    local baseline_response_time=$(test_health_check)
    local baseline_cpu=$(get_docker_metrics "gestionale-backend" "cpu")
    local baseline_memory=$(get_docker_metrics "gestionale-backend" "memory")
    
    # Salva baseline
    cat > "/tmp/baseline_metrics.txt" << EOF
BASELINE_RESPONSE_TIME=$baseline_response_time
BASELINE_CPU_USAGE=$baseline_cpu
BASELINE_MEMORY_USAGE=$baseline_memory
BASELINE_TIMESTAMP=$(date +%s)
EOF
    
    success "Baseline salvata: response_time=${baseline_response_time}s, cpu=${baseline_cpu}%, memory=${baseline_memory}%"
}

# Funzione per monitoraggio post-aggiornamento
post_update_monitoring() {
    log "Monitoraggio post-aggiornamento..."
    
    # Carica baseline
    if [ -f "/tmp/baseline_metrics.txt" ]; then
        source "/tmp/baseline_metrics.txt"
    fi
    
    # Confronto con baseline
    local current_response_time=$(test_health_check)
    local current_cpu=$(get_docker_metrics "gestionale-backend" "cpu")
    local current_memory=$(get_docker_metrics "gestionale-backend" "memory")
    
    log "Confronto con baseline..."
    log "  Response time: $BASELINE_RESPONSE_TIME -> $current_response_time"
    log "  CPU: $BASELINE_CPU_USAGE -> $current_cpu"
    log "  Memory: $BASELINE_MEMORY_USAGE -> $current_memory"
    
    # Verifica degradazione
    local performance_degraded=false
    
    if (( $(echo "$current_response_time > $BASELINE_RESPONSE_TIME * 1.5" | bc -l) )); then
        warning "Performance degradata: tempo risposta aumentato del 50%"
        performance_degraded=true
    fi
    
    if [ "$current_cpu" -gt "$((BASELINE_CPU_USAGE + 20))" ]; then
        warning "Performance degradata: CPU aumentata del 20%"
        performance_degraded=true
    fi
    
    if [ "$current_memory" -gt "$((BASELINE_MEMORY_USAGE + 20))" ]; then
        warning "Performance degradata: memoria aumentata del 20%"
        performance_degraded=true
    fi
    
    if [ "$performance_degraded" = true ]; then
        send_alert "PERFORMANCE DEGRADATA" "Monitoraggio post-aggiornamento ha rilevato degradazione performance.\nServer: 10.10.10.15\nConsiderare ottimizzazioni." "warning"
    else
        success "Performance post-aggiornamento OK"
    fi
}

# Funzione per report monitoraggio
generate_monitoring_report() {
    log "Generazione report monitoraggio..."
    
    REPORT_FILE="/home/mauri/backup/reports/monitoring-report-$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$REPORT_FILE" << EOF
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
trap 'log "Script interrotto dall\'utente"; exit 1' INT TERM

# Esecuzione
main "$@" 