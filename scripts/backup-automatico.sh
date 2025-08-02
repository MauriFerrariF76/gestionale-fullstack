#!/bin/bash

# Script di backup automatico per il gestionale
# Esegue backup di database, codice e configurazioni

set -e  # Esce se c'è un errore

# Configurazione
BACKUP_DIR="/home/mauri/gestionale-fullstack/backup"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30  # Mantieni backup per 30 giorni

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== BACKUP AUTOMATICO GESTIONALE ===${NC}"
echo "Data: $(date)"
echo "Directory backup: $BACKUP_DIR"

# Crea directory backup se non esiste
mkdir -p "$BACKUP_DIR"

# 1. BACKUP DATABASE
echo -e "\n${YELLOW}1. Backup database PostgreSQL...${NC}"
DB_BACKUP_FILE="$BACKUP_DIR/database_$DATE.sql"
if docker exec gestionale-postgres pg_dump -U postgres gestionale > "$DB_BACKUP_FILE" 2>/dev/null; then
    echo -e "${GREEN}✓ Database backup completato: $DB_BACKUP_FILE${NC}"
else
    echo -e "${RED}✗ Errore backup database${NC}"
    # Non esce, continua con altri backup
fi

# 2. BACKUP CODICE (Git)
echo -e "\n${YELLOW}2. Backup codice Git...${NC}"
cd /home/mauri/gestionale-fullstack
if git add . && git commit -m "Backup automatico $DATE" --allow-empty; then
    echo -e "${GREEN}✓ Backup codice Git completato${NC}"
else
    echo -e "${RED}✗ Errore backup codice Git${NC}"
fi

# 3. BACKUP CONFIGURAZIONI
echo -e "\n${YELLOW}3. Backup configurazioni...${NC}"
CONFIG_BACKUP_FILE="$BACKUP_DIR/config_$DATE.tar.gz"
if tar -czf "$CONFIG_BACKUP_FILE" nginx/ config/ secrets/ 2>/dev/null; then
    echo -e "${GREEN}✓ Backup configurazioni completato: $CONFIG_BACKUP_FILE${NC}"
else
    echo -e "${RED}✗ Errore backup configurazioni${NC}"
fi

# 4. PULIZIA BACKUP VECCHI
echo -e "\n${YELLOW}4. Pulizia backup vecchi (oltre $RETENTION_DAYS giorni)...${NC}"
find "$BACKUP_DIR" -name "*.sql" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
echo -e "${GREEN}✓ Pulizia completata${NC}"

# 5. VERIFICA SPAZIO DISCO
echo -e "\n${YELLOW}5. Verifica spazio disco...${NC}"
DISK_USAGE=$(df "$BACKUP_DIR" | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    echo -e "${RED}⚠️  Attenzione: Spazio disco al ${DISK_USAGE}%${NC}"
else
    echo -e "${GREEN}✓ Spazio disco OK: ${DISK_USAGE}%${NC}"
fi

echo -e "\n${GREEN}=== BACKUP COMPLETATO ===${NC}"
echo "Tempo totale: $(date)" 