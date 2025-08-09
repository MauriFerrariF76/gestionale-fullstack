#!/bin/bash

# Script per configurazione crontab automatica
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

echo "⏰ CONFIGURAZIONE CRONTAB AUTOMATICA"
echo "===================================="

# Directory progetto
PROJECT_ROOT="/home/mauri/gestionale-fullstack"
CLEANUP_SCRIPT="$PROJECT_ROOT/scripts/cleanup-logs.sh"
MONITOR_SCRIPT="$PROJECT_ROOT/scripts/monitor-stabilita.sh"

# Verifica che gli script esistano
if [ ! -f "$CLEANUP_SCRIPT" ]; then
    print_error "Script pulizia non trovato: $CLEANUP_SCRIPT"
    exit 1
fi

if [ ! -f "$MONITOR_SCRIPT" ]; then
    print_error "Script monitoraggio non trovato: $MONITOR_SCRIPT"
    exit 1
fi

print_status "Verifica script..."

# Verifica che gli script siano eseguibili
if [ ! -x "$CLEANUP_SCRIPT" ]; then
    print_warning "Script pulizia non eseguibile, imposto permessi..."
    chmod +x "$CLEANUP_SCRIPT"
fi

if [ ! -x "$MONITOR_SCRIPT" ]; then
    print_warning "Script monitoraggio non eseguibile, imposto permessi..."
    chmod +x "$MONITOR_SCRIPT"
fi

print_success "Script verificati e resi eseguibili"

# Funzione per aggiungere entry crontab
add_cron_entry() {
    local schedule=$1
    local command=$2
    local description=$3
    
    print_status "Aggiunta entry crontab: $description"
    
    # Verifica se l'entry esiste già
    if crontab -l 2>/dev/null | grep -q "$command"; then
        print_warning "Entry già presente per: $description"
        return 0
    fi
    
    # Aggiungi entry al crontab
    (crontab -l 2>/dev/null; echo "$schedule $command # $description") | crontab -
    print_success "Entry aggiunta: $description"
}

# Funzione per rimuovere entry crontab
remove_cron_entry() {
    local command=$1
    local description=$2
    
    print_status "Rimozione entry crontab: $description"
    
    # Rimuovi entry dal crontab
    crontab -l 2>/dev/null | grep -v "$command" | crontab -
    print_success "Entry rimossa: $description"
}

# Funzione per mostrare crontab attuale
show_current_crontab() {
    echo ""
    echo "📋 CRONTAB ATTUALE:"
    echo "==================="
    if crontab -l 2>/dev/null; then
        print_success "Crontab configurato"
    else
        print_warning "Nessun crontab configurato"
    fi
}

# Funzione per backup crontab
backup_crontab() {
    local backup_file="$PROJECT_ROOT/logs/crontab-backup-$(date '+%Y%m%d-%H%M%S').txt"
    
    print_status "Backup crontab attuale..."
    
    if crontab -l 2>/dev/null > "$backup_file" 2>/dev/null; then
        print_success "Backup crontab salvato: $(basename "$backup_file")"
    else
        print_warning "Nessun crontab da salvare"
    fi
}

# Funzione per installazione completa
install_complete_crontab() {
    print_status "Installazione crontab completo..."
    
    # Backup crontab esistente
    backup_crontab
    
    # Entry per pulizia log (ogni giorno alle 2:00)
    add_cron_entry "0 2 * * *" "$CLEANUP_SCRIPT" "Pulizia automatica log giornaliera"
    
    # Entry per monitoraggio stabilità (ogni 5 minuti)
    add_cron_entry "*/5 * * * *" "$MONITOR_SCRIPT once" "Monitoraggio stabilità ogni 5 minuti"
    
    # Entry per backup configurazioni (ogni domenica alle 3:00)
    add_cron_entry "0 3 * * 0" "cp -r $PROJECT_ROOT/scripts $PROJECT_ROOT/logs/backup-scripts-\$(date +\%Y\%m\%d)" "Backup settimanale script"
    
    # Entry per verifica spazio disco (ogni ora)
    add_cron_entry "0 * * * *" "df -h | grep -E '^/dev/' > $PROJECT_ROOT/logs/disk-usage-\$(date +\%Y\%m\%d).log" "Monitoraggio spazio disco orario"
    
    # Entry per verifica servizi (ogni 15 minuti)
    add_cron_entry "*/15 * * * *" "systemctl status gestionale-dev > $PROJECT_ROOT/logs/service-status-\$(date +\%Y\%m\%d).log 2>&1" "Status servizi ogni 15 minuti"
    
    print_success "Crontab completo installato"
}

# Funzione per installazione minima
install_minimal_crontab() {
    print_status "Installazione crontab minimo..."
    
    # Backup crontab esistente
    backup_crontab
    
    # Entry per pulizia log (ogni giorno alle 2:00)
    add_cron_entry "0 2 * * *" "$CLEANUP_SCRIPT" "Pulizia automatica log giornaliera"
    
    # Entry per monitoraggio stabilità (ogni 10 minuti)
    add_cron_entry "*/10 * * * *" "$MONITOR_SCRIPT once" "Monitoraggio stabilità ogni 10 minuti"
    
    print_success "Crontab minimo installato"
}

# Funzione per rimozione crontab
remove_crontab() {
    print_status "Rimozione crontab..."
    
    # Backup prima della rimozione
    backup_crontab
    
    # Rimuovi tutto il crontab
    crontab -r 2>/dev/null || true
    print_success "Crontab rimosso completamente"
}

# Gestione parametri
case "${1:-}" in
    "install"|"full")
        install_complete_crontab
        ;;
    "minimal")
        install_minimal_crontab
        ;;
    "remove"|"uninstall")
        remove_crontab
        ;;
    "backup")
        backup_crontab
        ;;
    "show"|"status")
        show_current_crontab
        ;;
    "test")
        print_status "Test esecuzione script..."
        print_status "Test script pulizia..."
        $CLEANUP_SCRIPT
        print_status "Test script monitoraggio..."
        $MONITOR_SCRIPT once
        print_success "Test completato con successo"
        ;;
    *)
        echo "⏰ CONFIGURAZIONE CRONTAB AUTOMATICA GESTIONALE"
        echo "==============================================="
        echo ""
        echo "Uso: $0 [COMANDO]"
        echo ""
        echo "Comandi disponibili:"
        echo "  install     - Installa crontab completo (raccomandato)"
        echo "  minimal     - Installa crontab minimo (solo essenziale)"
        echo "  remove      - Rimuove tutto il crontab"
        echo "  backup      - Backup crontab attuale"
        echo "  show        - Mostra crontab attuale"
        echo "  test        - Testa esecuzione script"
        echo ""
        echo "📋 ENTRY CRONTAB COMPLETO:"
        echo "   Pulizia log: Ogni giorno alle 2:00"
        echo "   Monitoraggio: Ogni 5 minuti"
        echo "   Backup script: Ogni domenica alle 3:00"
        echo "   Spazio disco: Ogni ora"
        echo "   Status servizi: Ogni 15 minuti"
        echo ""
        echo "📋 ENTRY CRONTAB MINIMO:"
        echo "   Pulizia log: Ogni giorno alle 2:00"
        echo "   Monitoraggio: Ogni 10 minuti"
        echo ""
        echo "🔍 COMANDI UTILI:"
        echo "   Verifica: crontab -l"
        echo "   Log cron: tail -f /var/log/syslog | grep CRON"
        echo "   Test manuale: $CLEANUP_SCRIPT"
        echo ""
        echo "Esempi:"
        echo "  $0 install     # Installazione completa"
        echo "  $0 minimal     # Installazione minima"
        echo "  $0 show        # Verifica configurazione"
        echo "  $0 test        # Test funzionamento"
        ;;
esac

# Mostra stato finale
if [ "$1" = "install" ] || [ "$1" = "minimal" ]; then
    echo ""
    show_current_crontab
    echo ""
    print_success "Configurazione crontab completata!"
    echo ""
    echo "📁 File di log:"
    echo "   Status: $PROJECT_ROOT/logs/stabilita-status.log"
    echo "   Alert: $PROJECT_ROOT/logs/stabilita-alerts.log"
    echo "   Backup: $PROJECT_ROOT/logs/crontab-backup-*.txt"
    echo ""
    echo "⏰ Prossima esecuzione:"
    echo "   Pulizia log: $(date -d "tomorrow 2:00" '+%Y-%m-%d %H:%M:%S')"
    echo "   Monitoraggio: $(date -d "+5 minutes" '+%H:%M:%S')"
fi
