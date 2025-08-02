#!/bin/bash

# Script di monitoraggio base per il gestionale
# Controlla: server online, database, SSL, spazio disco

set -e

# Configurazione
LOG_FILE="/home/mauri/gestionale-fullstack/backup/monitoraggio.log"
ALERT_FILE="/home/mauri/gestionale-fullstack/backup/alert.log"
WEBSITE_URL="https://tuodominio.com"  # Sostituisci con il tuo dominio
DB_CONTAINER="gestionale-postgres"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== MONITORAGGIO BASE GESTIONALE ===${NC}"
echo "Data: $(date)"

# Funzione per log
log_message() {
    echo "$(date): $1" >> "$LOG_FILE"
}

alert_message() {
    echo "$(date): ALERT - $1" >> "$ALERT_FILE"
    echo -e "${RED}ALERT: $1${NC}"
}

# 1. CONTROLLO SERVER ONLINE
echo -e "\n${YELLOW}1. Controllo server online...${NC}"
if curl -s --max-time 10 "$WEBSITE_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Server online${NC}"
    log_message "Server online - OK"
else
    alert_message "Server non raggiungibile"
    echo -e "${RED}✗ Server offline${NC}"
fi

# 2. CONTROLLO DATABASE
echo -e "\n${YELLOW}2. Controllo database...${NC}"
if docker exec "$DB_CONTAINER" pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Database connesso${NC}"
    log_message "Database connesso - OK"
else
    alert_message "Database non connesso"
    echo -e "${RED}✗ Database offline${NC}"
fi

# 3. CONTROLLO CERTIFICATO SSL
echo -e "\n${YELLOW}3. Controllo certificato SSL...${NC}"
SSL_EXPIRY=$(echo | openssl s_client -servername "$WEBSITE_URL" -connect "$WEBSITE_URL":443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
if [ ! -z "$SSL_EXPIRY" ]; then
    SSL_DAYS=$(echo "$SSL_EXPIRY" | xargs -I {} date -d {} +%s | xargs -I {} echo $(( ({} - $(date +%s)) / 86400 )))
    if [ "$SSL_DAYS" -gt 30 ]; then
        echo -e "${GREEN}✓ SSL valido per $SSL_DAYS giorni${NC}"
        log_message "SSL valido per $SSL_DAYS giorni - OK"
    else
        alert_message "SSL scade in $SSL_DAYS giorni"
        echo -e "${YELLOW}⚠️  SSL scade in $SSL_DAYS giorni${NC}"
    fi
else
    alert_message "Impossibile verificare certificato SSL"
    echo -e "${RED}✗ Errore verifica SSL${NC}"
fi

# 4. CONTROLLO SPAZIO DISCO
echo -e "\n${YELLOW}4. Controllo spazio disco...${NC}"
DISK_USAGE=$(df /home/mauri/gestionale-fullstack | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✓ Spazio disco OK: ${DISK_USAGE}%${NC}"
    log_message "Spazio disco OK: ${DISK_USAGE}%"
else
    alert_message "Spazio disco critico: ${DISK_USAGE}%"
    echo -e "${RED}✗ Spazio disco critico: ${DISK_USAGE}%${NC}"
fi

# 5. CONTROLLO CONTAINER DOCKER
echo -e "\n${YELLOW}5. Controllo container Docker...${NC}"
if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "$DB_CONTAINER.*Up"; then
    echo -e "${GREEN}✓ Container database attivo${NC}"
    log_message "Container database attivo - OK"
else
    alert_message "Container database non attivo"
    echo -e "${RED}✗ Container database non attivo${NC}"
fi

# 6. PULIZIA LOG VECCHI (mantieni ultimi 30 giorni)
find /home/mauri/gestionale-fullstack/backup -name "*.log" -mtime +30 -delete 2>/dev/null || true

echo -e "\n${GREEN}=== MONITORAGGIO COMPLETATO ===${NC}"

# Se ci sono alert, mostra riepilogo
if [ -f "$ALERT_FILE" ] && [ -s "$ALERT_FILE" ]; then
    echo -e "\n${RED}=== ALERT ATTIVI ===${NC}"
    tail -5 "$ALERT_FILE"
fi 