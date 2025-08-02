#!/bin/bash

# Script per configurare l'automazione del gestionale
# Configura cron jobs per backup e monitoraggio

set -e

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== SETUP AUTOMAZIONE GESTIONALE ===${NC}"

# Percorsi script
BACKUP_SCRIPT="/home/mauri/gestionale-fullstack/scripts/backup-automatico.sh"
MONITOR_SCRIPT="/home/mauri/gestionale-fullstack/scripts/monitoraggio-base.sh"

# Verifica esistenza script
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo -e "${RED}✗ Script backup non trovato: $BACKUP_SCRIPT${NC}"
    exit 1
fi

if [ ! -f "$MONITOR_SCRIPT" ]; then
    echo -e "${RED}✗ Script monitoraggio non trovato: $MONITOR_SCRIPT${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Script trovati${NC}"

# Crea file temporaneo per cron
TEMP_CRON=$(mktemp)

# Backup giornaliero alle 02:00
echo "0 2 * * * $BACKUP_SCRIPT >> /home/mauri/gestionale-fullstack/backup/backup.log 2>&1" >> "$TEMP_CRON"

# Monitoraggio ogni 6 ore (02:00, 08:00, 14:00, 20:00)
echo "0 2,8,14,20 * * * $MONITOR_SCRIPT >> /home/mauri/gestionale-fullstack/backup/monitoraggio.log 2>&1" >> "$TEMP_CRON"

# Verifica se i job esistono già
if crontab -l 2>/dev/null | grep -q "backup-automatico.sh"; then
    echo -e "${YELLOW}⚠️  Job backup già presente in crontab${NC}"
else
    echo -e "${GREEN}✓ Aggiunto job backup giornaliero${NC}"
fi

if crontab -l 2>/dev/null | grep -q "monitoraggio-base.sh"; then
    echo -e "${YELLOW}⚠️  Job monitoraggio già presente in crontab${NC}"
else
    echo -e "${GREEN}✓ Aggiunto job monitoraggio ogni 6 ore${NC}"
fi

# Installa i nuovi job cron
(crontab -l 2>/dev/null; cat "$TEMP_CRON") | crontab -

# Pulisci file temporaneo
rm "$TEMP_CRON"

echo -e "\n${GREEN}=== AUTOMAZIONE CONFIGURATA ===${NC}"
echo -e "${YELLOW}Job configurati:${NC}"
echo "• Backup automatico: ogni giorno alle 02:00"
echo "• Monitoraggio: ogni 6 ore (02:00, 08:00, 14:00, 20:00)"
echo ""
echo -e "${YELLOW}Per vedere i job attivi:${NC}"
echo "crontab -l"
echo ""
echo -e "${YELLOW}Per rimuovere l'automazione:${NC}"
echo "crontab -r"
echo ""
echo -e "${GREEN}✓ Setup completato!${NC}" 