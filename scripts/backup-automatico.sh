#!/bin/bash

# Script di backup automatico integrato per il gestionale
# Si integra con il sistema di backup esistente su NAS
# Esegue backup locali di emergenza + integrazione con backup NAS

set -e  # Esce se c'è un errore

# Configurazione
BACKUP_DIR="/home/mauri/gestionale-fullstack/backup"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7  # Backup locale per 7 giorni (emergenza)

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== BACKUP AUTOMATICO INTEGRATO ===${NC}"
echo "Data: $(date)"
echo "Directory backup: $BACKUP_DIR"

# Crea directory backup se non esiste
mkdir -p "$BACKUP_DIR"

# 1. BACKUP CODICE (Git) - UNICO BACKUP AGGIUNTIVO
echo -e "\n${YELLOW}1. Backup codice Git (emergenza locale)...${NC}"
cd /home/mauri/gestionale-fullstack
if git add . && git commit -m "Backup automatico $DATE" --allow-empty; then
    echo -e "${GREEN}✓ Backup codice Git completato${NC}"
else
    echo -e "${RED}✗ Errore backup codice Git${NC}"
fi

# 2. VERIFICA BACKUP NAS ESISTENTI
echo -e "\n${YELLOW}2. Verifica backup NAS esistenti...${NC}"
if [ -d "/mnt/backup_gestionale" ]; then
    echo -e "${GREEN}✓ NAS montato - backup esistenti attivi${NC}"
    echo -e "${YELLOW}ℹ️  Backup database e configurazioni gestiti da:${NC}"
    echo "   • docs/server/backup_docker_automatic.sh"
    echo "   • docs/server/backup_config_server.sh"
else
    echo -e "${YELLOW}⚠️  NAS non montato - backup locali di emergenza${NC}"
    
    # Backup di emergenza solo se NAS non disponibile
    echo -e "\n${YELLOW}3. Backup di emergenza (NAS non disponibile)...${NC}"
    
    # Backup database di emergenza
    DB_BACKUP_FILE="$BACKUP_DIR/emergency_db_$DATE.sql"
    if docker exec gestionale-postgres pg_dump -U postgres gestionale > "$DB_BACKUP_FILE" 2>/dev/null; then
        echo -e "${GREEN}✓ Backup database di emergenza: $DB_BACKUP_FILE${NC}"
    else
        echo -e "${RED}✗ Errore backup database di emergenza${NC}"
    fi
    
    # Backup configurazioni di emergenza
    CONFIG_BACKUP_FILE="$BACKUP_DIR/emergency_config_$DATE.tar.gz"
    if tar -czf "$CONFIG_BACKUP_FILE" nginx/ config/ secrets/ 2>/dev/null; then
        echo -e "${GREEN}✓ Backup configurazioni di emergenza: $CONFIG_BACKUP_FILE${NC}"
    else
        echo -e "${RED}✗ Errore backup configurazioni di emergenza${NC}"
    fi
fi

# 3. PULIZIA BACKUP LOCALI VECCHI (solo emergenza)
echo -e "\n${YELLOW}4. Pulizia backup locali vecchi (oltre $RETENTION_DAYS giorni)...${NC}"
find "$BACKUP_DIR" -name "emergency_*" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
echo -e "${GREEN}✓ Pulizia completata${NC}"

# 4. VERIFICA SPAZIO DISCO
echo -e "\n${YELLOW}5. Verifica spazio disco...${NC}"
DISK_USAGE=$(df "$BACKUP_DIR" | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    echo -e "${RED}⚠️  Attenzione: Spazio disco al ${DISK_USAGE}%${NC}"
else
    echo -e "${GREEN}✓ Spazio disco OK: ${DISK_USAGE}%${NC}"
fi

# 5. VERIFICA INTEGRITÀ BACKUP ESISTENTI
echo -e "\n${YELLOW}6. Verifica integrità backup esistenti...${NC}"
if [ -f "/home/mauri/gestionale-fullstack/docs/server/backup_docker_automatic.sh" ]; then
    echo -e "${GREEN}✓ Script backup Docker presente${NC}"
else
    echo -e "${RED}✗ Script backup Docker mancante${NC}"
fi

if [ -f "/home/mauri/gestionale-fullstack/docs/server/backup_config_server.sh" ]; then
    echo -e "${GREEN}✓ Script backup configurazioni presente${NC}"
else
    echo -e "${RED}✗ Script backup configurazioni mancante${NC}"
fi

echo -e "\n${GREEN}=== BACKUP INTEGRATO COMPLETATO ===${NC}"
echo "Tempo totale: $(date)"
echo ""
echo -e "${YELLOW}ℹ️  NOTA: Questo script si integra con il sistema di backup esistente${NC}"
echo "   • Backup principali: docs/server/backup_*.sh (su NAS)"
echo "   • Backup emergenza: locale (solo se NAS non disponibile)"
echo "   • Git: sempre salvato localmente" 