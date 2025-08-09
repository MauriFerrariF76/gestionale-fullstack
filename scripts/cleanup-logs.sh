#!/bin/bash

# Script di pulizia automatica log e gestione retention
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

echo "🧹 PULIZIA AUTOMATICA LOG E GESTIONE RETENTION"
echo "================================================"

# Directory progetto
PROJECT_ROOT="/home/mauri/gestionale-fullstack"
LOGS_DIR="$PROJECT_ROOT/logs"
CONFIG_FILE="$PROJECT_ROOT/scripts/stabilita-config.conf"

# Configurazione default
STATUS_RETENTION_DAYS=30
ALERT_RETENTION_DAYS=90
AUTO_COMPRESS=true

# Carica configurazione se esiste
if [ -f "$CONFIG_FILE" ]; then
    print_status "Caricamento configurazione da $CONFIG_FILE"
    source "$CONFIG_FILE"
    print_success "Configurazione caricata"
else
    print_warning "File configurazione non trovato, uso valori default"
fi

# Verifica directory log
if [ ! -d "$LOGS_DIR" ]; then
    print_error "Directory log non trovata: $LOGS_DIR"
    exit 1
fi

print_status "Avvio pulizia log..."

# Funzione per calcolare data limite
get_date_limit() {
    local days=$1
    date -d "$days days ago" '+%Y-%m-%d'
}

# Funzione per pulire file per data
cleanup_files_by_date() {
    local pattern=$1
    local retention_days=$2
    local file_type=$3
    
    local date_limit=$(get_date_limit $retention_days)
    local files_to_remove=$(find "$LOGS_DIR" -name "$pattern" -type f -newermt "$date_limit" ! -newermt "$(date '+%Y-%m-%d')" 2>/dev/null || true)
    
    if [ -n "$files_to_remove" ]; then
        print_status "Rimozione file $file_type più vecchi di $retention_days giorni..."
        echo "$files_to_remove" | while read -r file; do
            if [ -f "$file" ]; then
                rm -f "$file"
                print_success "Rimosso: $(basename "$file")"
            fi
        done
    else
        print_success "Nessun file $file_type da rimuovere"
    fi
}

# Funzione per comprimere file log vecchi
compress_old_logs() {
    if [ "$AUTO_COMPRESS" = true ]; then
        print_status "Compressione file log vecchi..."
        
        # Trova file .log non compressi più vecchi di 7 giorni
        local old_logs=$(find "$LOGS_DIR" -name "*.log" -type f -mtime +7 ! -name "*.gz" 2>/dev/null || true)
        
        if [ -n "$old_logs" ]; then
            echo "$old_logs" | while read -r log_file; do
                if [ -f "$log_file" ]; then
                    print_status "Compressione: $(basename "$log_file")"
                    gzip "$log_file"
                    print_success "Compresso: $(basename "$log_file").gz"
                fi
            done
        else
            print_success "Nessun file log da comprimere"
        fi
    fi
}

# Funzione per pulire file compressi vecchi
cleanup_compressed_logs() {
    print_status "Pulizia file compressi vecchi..."
    
    # Rimuovi file .gz più vecchi di 180 giorni
    local old_compressed=$(find "$LOGS_DIR" -name "*.gz" -type f -mtime +180 2>/dev/null || true)
    
    if [ -n "$old_compressed" ]; then
        echo "$old_compressed" | while read -r file; do
            if [ -f "$file" ]; then
                rm -f "$file"
                print_success "Rimosso compresso: $(basename "$file")"
            fi
        done
    else
        print_success "Nessun file compresso da rimuovere"
    fi
}

# Funzione per pulire file temporanei
cleanup_temp_files() {
    print_status "Pulizia file temporanei..."
    
    # Rimuovi file temporanei più vecchi di 1 giorno
    local temp_files=$(find "$LOGS_DIR" -name "*.tmp" -o -name "*.temp" -o -name "*~" -type f -mtime +1 2>/dev/null || true)
    
    if [ -n "$temp_files" ]; then
        echo "$temp_files" | while read -r file; do
            if [ -f "$file" ]; then
                rm -f "$file"
                print_success "Rimosso temporaneo: $(basename "$file")"
            fi
        done
    else
        print_success "Nessun file temporaneo da rimuovere"
    fi
}

# Funzione per pulire file di lock
cleanup_lock_files() {
    print_status "Pulizia file di lock..."
    
    # Rimuovi file di lock più vecchi di 1 ora
    local lock_files=$(find "$LOGS_DIR" -name "*.lock" -type f -mmin +60 2>/dev/null || true)
    
    if [ -n "$lock_files" ]; then
        echo "$lock_files" | while read -r file; do
            if [ -f "$file" ]; then
                rm -f "$file"
                print_success "Rimosso lock: $(basename "$file")"
            fi
        done
    else
        print_success "Nessun file di lock da rimuovere"
    fi
}

# Funzione per ottimizzare spazio disco
optimize_disk_space() {
    print_status "Ottimizzazione spazio disco..."
    
    # Calcola spazio utilizzato dai log
    local log_size=$(du -sh "$LOGS_DIR" 2>/dev/null | cut -f1)
    print_status "Spazio utilizzato dai log: $log_size"
    
    # Se i log occupano più di 1GB, avvisa
    local log_size_bytes=$(du -sb "$LOGS_DIR" 2>/dev/null | cut -f1)
    if [ "$log_size_bytes" -gt 1073741824 ]; then  # 1GB in bytes
        print_warning "Log occupano più di 1GB, considerare pulizia più aggressiva"
    fi
}

# Funzione per creare report pulizia
create_cleanup_report() {
    local report_file="$LOGS_DIR/cleanup-report-$(date '+%Y%m%d-%H%M%S').txt"
    
    print_status "Creazione report pulizia..."
    
    {
        echo "REPORT PULIZIA LOG - $(date)"
        echo "================================="
        echo ""
        echo "Configurazione utilizzata:"
        echo "  Retention status log: $STATUS_RETENTION_DAYS giorni"
        echo "  Retention alert log: $ALERT_RETENTION_DAYS giorni"
        echo "  Compressione automatica: $AUTO_COMPRESS"
        echo ""
        echo "Spazio liberato:"
        echo "  File rimossi: $(find "$LOGS_DIR" -name "*.log" -o -name "*.gz" | wc -l)"
        echo "  Spazio totale log: $(du -sh "$LOGS_DIR" 2>/dev/null | cut -f1)"
        echo ""
        echo "Prossima pulizia programmata: $(date -d "+1 day" '+%Y-%m-%d %H:%M:%S')"
    } > "$report_file"
    
    print_success "Report creato: $(basename "$report_file")"
}

# Esecuzione pulizia
print_status "Esecuzione pulizia log..."

# Pulizia per data
cleanup_files_by_date "stabilita-status-*.log" "$STATUS_RETENTION_DAYS" "status"
cleanup_files_by_date "stabilita-alerts-*.log" "$ALERT_RETENTION_DAYS" "alert"
cleanup_files_by_date "sviluppo-*.log" "$STATUS_RETENTION_DAYS" "sviluppo"

# Compressione file vecchi
compress_old_logs

# Pulizia file compressi
cleanup_compressed_logs

# Pulizia file temporanei
cleanup_temp_files

# Pulizia file di lock
cleanup_lock_files

# Ottimizzazione spazio
optimize_disk_space

# Report finale
create_cleanup_report

echo ""
echo "🎯 PULIZIA COMPLETATA CON SUCCESSO!"
echo "===================================="
echo ""
echo "📊 STATISTICHE:"
echo "   Directory log: $LOGS_DIR"
echo "   Retention status: $STATUS_RETENTION_DAYS giorni"
echo "   Retention alert: $ALERT_RETENTION_DAYS giorni"
echo "   Compressione: $AUTO_COMPRESS"
echo ""
echo "🔍 COMANDI UTILI:"
echo "   Verifica spazio: du -sh $LOGS_DIR"
echo "   Lista file: ls -la $LOGS_DIR"
echo "   Log recenti: tail -f $LOGS_DIR/stabilita-status.log"
echo ""
print_success "Sistema di pulizia log attivo e funzionante!"
