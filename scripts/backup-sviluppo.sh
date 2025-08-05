#!/bin/bash

# Script per backup ambiente sviluppo NATIVO
echo "💾 Backup ambiente sviluppo NATIVO..."

BACKUP_DIR="backup/sviluppo"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_sviluppo_$DATE.sql"

# Crea directory backup
mkdir -p "$BACKUP_DIR"

    # Backup database
    echo "📊 Backup database..."
    pg_dump -h localhost -U gestionale_user -d gestionale > "$BACKUP_FILE"

# Backup configurazioni
echo "⚙️ Backup configurazioni..."
tar -czf "$BACKUP_DIR/config_sviluppo_$DATE.tar.gz" \
    backend/.env \
    frontend/.env.local \
    config/ 2>/dev/null || true

echo "✅ Backup completato: $BACKUP_FILE"
