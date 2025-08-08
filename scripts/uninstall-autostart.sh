#!/bin/bash

# Script per disinstallare l'avvio automatico del gestionale di sviluppo
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

SERVICE_NAME="gestionale-dev"

print_status "Disinstallazione avvio automatico per Gestionale Development Environment"

# Verifica se il servizio esiste
if ! sudo systemctl list-unit-files | grep -q "$SERVICE_NAME"; then
    print_warning "Servizio $SERVICE_NAME non trovato. Niente da disinstallare."
    exit 0
fi

# Ferma il servizio se è in esecuzione
print_status "Fermando il servizio se in esecuzione..."
sudo systemctl stop "$SERVICE_NAME" 2>/dev/null || true
print_success "Servizio fermato"

# Disabilita il servizio
print_status "Disabilitazione servizio..."
sudo systemctl disable "$SERVICE_NAME"
print_success "Servizio disabilitato"

# Rimuovi il file di servizio
print_status "Rimozione file di servizio..."
sudo rm -f "/etc/systemd/system/$SERVICE_NAME.service"
print_success "File di servizio rimosso"

# Ricarica la configurazione di systemd
print_status "Ricarica configurazione systemd..."
sudo systemctl daemon-reload
print_success "Configurazione ricaricata"

# Verifica rimozione
if ! sudo systemctl list-unit-files | grep -q "$SERVICE_NAME"; then
    print_success "Disinstallazione completata con successo!"
else
    print_error "Errore nella disinstallazione"
    exit 1
fi

echo ""
echo -e "${YELLOW}📝 Nota:${NC}"
echo -e "   - Il servizio non si avvierà più automaticamente al riavvio"
echo -e "   - Puoi ancora avviare manualmente con: ${YELLOW}./scripts/start-sviluppo.sh${NC}"
echo ""
