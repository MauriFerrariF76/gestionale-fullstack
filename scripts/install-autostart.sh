#!/bin/bash

# Script per installare l'avvio automatico del gestionale di sviluppo
# Versione: 1.0

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Ottieni il percorso assoluto dello script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SERVICE_NAME="gestionale-dev"
SERVICE_FILE="$SERVICE_NAME.service"

print_status "Installazione avvio automatico per Gestionale Development Environment"
print_status "Directory progetto: $PROJECT_ROOT"

# Verifica che siamo nella directory corretta
if [ ! -d "$PROJECT_ROOT/backend" ] || [ ! -d "$PROJECT_ROOT/frontend" ]; then
    print_error "Directory backend o frontend non trovate. Assicurati di essere nella root del progetto."
    exit 1
fi

# Verifica che lo script start-sviluppo.sh esista
if [ ! -f "$PROJECT_ROOT/scripts/start-sviluppo.sh" ]; then
    print_error "Script start-sviluppo.sh non trovato"
    exit 1
fi

# Verifica che il file di servizio esista
if [ ! -f "$PROJECT_ROOT/scripts/$SERVICE_FILE" ]; then
    print_error "File di servizio $SERVICE_FILE non trovato"
    exit 1
fi

# Rendi eseguibile lo script
print_status "Rendendo eseguibile lo script start-sviluppo.sh..."
chmod +x "$PROJECT_ROOT/scripts/start-sviluppo.sh"
print_success "Script reso eseguibile"

# Copia il file di servizio in systemd
print_status "Installazione servizio systemd..."
sudo cp "$PROJECT_ROOT/scripts/$SERVICE_FILE" /etc/systemd/system/
print_success "File di servizio copiato in /etc/systemd/system/"

# Ricarica la configurazione di systemd
print_status "Ricarica configurazione systemd..."
sudo systemctl daemon-reload
print_success "Configurazione ricaricata"

# Abilita il servizio per l'avvio automatico
print_status "Abilitazione servizio per avvio automatico..."
sudo systemctl enable "$SERVICE_NAME"
print_success "Servizio abilitato per avvio automatico"

# Test del servizio
print_status "Test del servizio..."
if sudo systemctl is-enabled "$SERVICE_NAME" > /dev/null 2>&1; then
    print_success "Servizio abilitato correttamente"
else
    print_error "Errore nell'abilitazione del servizio"
    exit 1
fi

# Informazioni finali
echo ""
print_success "Installazione completata con successo!"
echo ""
echo -e "${BLUE}📋 COMANDI UTILI:${NC}"
echo -e "   Avvia servizio: ${YELLOW}sudo systemctl start $SERVICE_NAME${NC}"
echo -e "   Ferma servizio: ${YELLOW}sudo systemctl stop $SERVICE_NAME${NC}"
echo -e "   Riavvia servizio: ${YELLOW}sudo systemctl restart $SERVICE_NAME${NC}"
echo -e "   Stato servizio: ${YELLOW}sudo systemctl status $SERVICE_NAME${NC}"
echo -e "   Log servizio: ${YELLOW}sudo journalctl -u $SERVICE_NAME -f${NC}"
echo -e "   Disabilita avvio automatico: ${YELLOW}sudo systemctl disable $SERVICE_NAME${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo -e "   - Il servizio si avvierà automaticamente al prossimo riavvio del sistema"
echo -e "   - Per testare subito: ${YELLOW}sudo systemctl start $SERVICE_NAME${NC}"
echo -e "   - I log sono disponibili con: ${YELLOW}sudo journalctl -u $SERVICE_NAME -f${NC}"
echo ""
