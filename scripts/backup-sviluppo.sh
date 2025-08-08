#!/bin/bash

# Carica configurazione centralizzata
# Carica configurazione centralizzata
if [ -f "scripts/config.sh" ]; then
    source "scripts/config.sh"
elif [ -f "../scripts/config.sh" ]; then
    source "../scripts/config.sh"
else
    echo "❌ Errore: File config.sh non trovato"
    exit 1
fi

# Script per backup ambiente sviluppo NATIVO
echo "💾 Backup ambiente sviluppo NATIVO..."

BACKUP_DIR="backup/sviluppo"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_sviluppo_$DATE.sql"

# Crea directory backup
mkdir -p "$BACKUP_DIR"

# Backup database
echo "📊 Backup database..."
PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"

# Backup configurazioni
echo "⚙️ Backup configurazioni..."
tar -czf "$BACKUP_DIR/config_sviluppo_$DATE.tar.gz" \
    backend/.env \
    frontend/.env.local \
    config/ 2>/dev/null || true

echo "✅ Backup completato: $BACKUP_FILE"
