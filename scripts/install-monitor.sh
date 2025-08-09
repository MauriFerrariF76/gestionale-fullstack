#!/bin/bash

# Script di installazione servizio monitoraggio stabilità
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

echo "🚀 INSTALLAZIONE SERVIZIO MONITORAGGIO STABILITÀ"
echo "=================================================="

# Verifica che siamo root
if [ "$EUID" -ne 0 ]; then
    print_error "Questo script deve essere eseguito come root (sudo)"
    exit 1
fi

# Directory progetto
PROJECT_ROOT="/home/mauri/gestionale-fullstack"
SERVICE_FILE="gestionale-monitor.service"
SERVICE_PATH="/etc/systemd/system/$SERVICE_FILE"

print_status "Verifica ambiente..."

# Verifica che la directory progetto esista
if [ ! -d "$PROJECT_ROOT" ]; then
    print_error "Directory progetto non trovata: $PROJECT_ROOT"
    exit 1
fi

# Verifica che lo script di monitoraggio esista
if [ ! -f "$PROJECT_ROOT/scripts/monitor-stabilita.sh" ]; then
    print_error "Script monitoraggio non trovato: $PROJECT_ROOT/scripts/monitor-stabilita.sh"
    exit 1
fi

# Verifica che il file servizio esista
if [ ! -f "$PROJECT_ROOT/scripts/$SERVICE_FILE" ]; then
    print_error "File servizio non trovato: $PROJECT_ROOT/scripts/$SERVICE_FILE"
    exit 1
fi

print_success "Ambiente verificato"

# Copia file servizio
print_status "Installazione servizio systemd..."
cp "$PROJECT_ROOT/scripts/$SERVICE_FILE" "$SERVICE_PATH"
print_success "File servizio copiato in $SERVICE_PATH"

# Imposta permessi corretti
chmod 644 "$SERVICE_PATH"
print_success "Permessi file servizio impostati"

# Ricarica configurazione systemd
print_status "Ricarica configurazione systemd..."
systemctl daemon-reload
print_success "Configurazione systemd ricaricata"

# Abilita servizio per avvio automatico
print_status "Abilitazione servizio per avvio automatico..."
systemctl enable "$SERVICE_FILE"
print_success "Servizio abilitato per avvio automatico"

# Avvia servizio
print_status "Avvio servizio monitoraggio..."
systemctl start "$SERVICE_FILE"
print_success "Servizio monitoraggio avviato"

# Verifica stato
print_status "Verifica stato servizio..."
sleep 2
systemctl status "$SERVICE_FILE" --no-pager

echo ""
echo "🎯 INSTALLAZIONE COMPLETATA CON SUCCESSO!"
echo "=========================================="
echo ""
echo "📋 SERVIZIO INSTALLATO:"
echo "   Nome: $SERVICE_FILE"
echo "   File: $SERVICE_PATH"
echo "   Stato: $(systemctl is-active $SERVICE_FILE)"
echo "   Abilitato: $(systemctl is-enabled $SERVICE_FILE)"
echo ""
echo "🔍 COMANDI UTILI:"
echo "   Status: sudo systemctl status $SERVICE_FILE"
echo "   Log: sudo journalctl -u $SERVICE_FILE -f"
echo "   Stop: sudo systemctl stop $SERVICE_FILE"
echo "   Start: sudo systemctl start $SERVICE_FILE"
echo "   Restart: sudo systemctl restart $SERVICE_FILE"
echo ""
echo "📁 FILE DI LOG:"
echo "   Status: $PROJECT_ROOT/logs/stabilita-status.log"
echo "   Alert: $PROJECT_ROOT/logs/stabilita-alerts.log"
echo ""
echo "⏰ MONITORAGGIO:"
echo "   Controllo ogni 5 minuti"
echo "   Alert automatici per problemi"
echo "   Riavvio automatico in caso di crash"
echo ""
print_success "Sistema di monitoraggio stabilità attivo e funzionante!"
