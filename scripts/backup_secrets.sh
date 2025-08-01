#!/bin/bash
# backup_secrets.sh - Backup cifrato dei segreti Docker
# Versione: 1.0
# Data: $(date +%F)

echo "💾 Backup Segreti Docker Gestionale"
echo "==================================="

# Verifica che siamo nella directory corretta
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Errore: Esegui questo script dalla directory root del progetto"
    echo "   cd gestionale-fullstack"
    echo "   ./scripts/backup_secrets.sh"
    exit 1
fi

# Verifica che la cartella secrets esista
if [ ! -d "secrets" ]; then
    echo "❌ Errore: Cartella secrets non trovata!"
    echo "   Esegui prima: ./scripts/setup_secrets.sh"
    exit 1
fi

# Verifica che tutti i file segreti esistano
echo "🔍 Verifica file segreti..."
MISSING_FILES=0
for file in db_password.txt jwt_secret.txt; do
    if [ ! -f "secrets/$file" ]; then
        echo "❌ File mancante: secrets/$file"
        MISSING_FILES=1
    fi
done

if [ $MISSING_FILES -eq 1 ]; then
    echo "❌ Alcuni file segreti sono mancanti!"
    echo "   Esegui prima: ./scripts/setup_secrets.sh"
    exit 1
fi

echo "✅ Tutti i file segreti sono presenti"

# Crea nome file backup con timestamp
BACKUP_NAME="secrets_backup_$(date +%F_%H%M%S)"
BACKUP_DIR="/home/mauri/gestionale-fullstack/backup/docker/"

echo "📦 Creazione backup cifrato..."

# Crea backup compresso
tar czf ${BACKUP_NAME}.tar.gz secrets/

if [ $? -ne 0 ]; then
    echo "❌ Errore nella creazione del backup compresso!"
    exit 1
fi

# Verifica che GPG sia installato
if ! command -v gpg &> /dev/null; then
    echo "⚠️  GPG non installato. Backup non cifrato creato: ${BACKUP_NAME}.tar.gz"
    echo "   Installa GPG per cifrare il backup: sudo apt-get install gnupg"
    exit 0
fi

# Cifra il backup
echo "🔐 Cifratura backup..."
gpg --encrypt --recipient admin@carpenteriaferrari.com ${BACKUP_NAME}.tar.gz

if [ $? -eq 0 ]; then
    # Rimuovi backup non cifrato
    rm ${BACKUP_NAME}.tar.gz
    
    # Sposta backup nella cartella dedicata
    mkdir -p "$BACKUP_DIR"
    mv "${BACKUP_NAME}.tar.gz.gpg" "$BACKUP_DIR"/
    
    echo "✅ Backup cifrato creato: ${BACKUP_NAME}.tar.gz.gpg"
    echo "📁 Posizione: $BACKUP_DIR${BACKUP_NAME}.tar.gz.gpg"
else
    echo "⚠️  Errore nella cifratura. Backup non cifrato mantenuto: ${BACKUP_NAME}.tar.gz"
    echo "   Verifica la configurazione GPG o la chiave admin@carpenteriaferrari.com"
fi

echo ""
echo "🎉 Backup completato!"
echo ""
echo "📁 File di backup:"
if [ -f "${BACKUP_NAME}.tar.gz.gpg" ]; then
    echo "   ${BACKUP_NAME}.tar.gz.gpg (cifrato)"
else
    echo "   ${BACKUP_NAME}.tar.gz (non cifrato)"
fi
echo ""
echo "🔑 Master Password: 'La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo'"
echo ""
echo "💡 Suggerimenti:"
echo "   - Conserva il backup in luogo sicuro"
echo "   - Testa il ripristino con: ./scripts/restore_secrets.sh ${BACKUP_NAME}.tar.gz.gpg"
echo "   - Fai backup regolari (settimanali)"