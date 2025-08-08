#!/bin/bash
# restore_secrets.sh - Ripristino segreti Docker
# Versione: 1.0
# Data: $(date +%F)

echo "🔄 Ripristino Segreti Docker Gestionale"
echo "======================================"

# Verifica che siamo nella directory corretta
if [ ! -f "package.json" ] && [ ! -f "backend/package.json" ]; then
    echo "❌ Errore: Esegui questo script dalla directory root del progetto"
    echo "   cd gestionale-fullstack"
    echo "   ./scripts/restore_secrets.sh backup_file.tar.gz.gpg"
    exit 1
fi

# Verifica che sia stato specificato un file di backup
BACKUP_FILE=$1
if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Errore: Specifica il file di backup"
    echo "   Uso: ./scripts/restore_secrets.sh backup_file.tar.gz.gpg"
    echo ""
    echo "📋 File di backup disponibili:"
    ls -la *.tar.gz* 2>/dev/null || echo "   Nessun file di backup trovato"
    exit 1
fi

# Verifica che il file di backup esista
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Errore: File di backup non trovato: $BACKUP_FILE"
    echo "   Verifica il nome del file e la directory"
    exit 1
fi

echo "📁 File di backup: $BACKUP_FILE"

# Crea backup della cartella secrets attuale (se esiste)
if [ -d "secrets" ]; then
    echo "💾 Backup cartella secrets attuale..."
    mv secrets secrets_backup_$(date +%F_%H%M%S)
    echo "✅ Backup cartella secrets attuale creato"
fi

# Verifica se il file è cifrato (.gpg)
if [[ "$BACKUP_FILE" == *.gpg ]]; then
    echo "🔐 Decifratura backup..."
    
    # Verifica che GPG sia installato
    if ! command -v gpg &> /dev/null; then
        echo "❌ Errore: GPG non installato!"
        echo "   Installa GPG: sudo apt-get install gnupg"
        exit 1
    fi
    
    # Decifra il backup
    gpg --decrypt "$BACKUP_FILE" > secrets_restored.tar.gz
    
    if [ $? -ne 0 ]; then
        echo "❌ Errore nella decifratura!"
        echo "   Verifica la chiave GPG o la password"
        exit 1
    fi
    
    echo "✅ Backup decifrato con successo"
else
    echo "📦 Backup non cifrato rilevato..."
    cp "$BACKUP_FILE" secrets_restored.tar.gz
fi

# Estrai i segreti
echo "📂 Estrazione segreti..."
tar xzf secrets_restored.tar.gz

if [ $? -ne 0 ]; then
    echo "❌ Errore nell'estrazione del backup!"
    exit 1
fi

# Verifica che tutti i file segreti siano presenti
echo "🔍 Verifica file segreti..."
MISSING_FILES=0
for file in db_password.txt jwt_secret.txt; do
    if [ ! -f "secrets/$file" ]; then
        echo "❌ File mancante: secrets/$file"
        MISSING_FILES=1
    fi
done

if [ $MISSING_FILES -eq 1 ]; then
    echo "❌ Alcuni file segreti sono mancanti nel backup!"
    echo "   Il backup potrebbe essere corrotto o incompleto"
    exit 1
fi

# Imposta permessi sicuri
echo "🔒 Impostazione permessi sicuri..."
chmod 600 secrets/*.txt

# Pulisci file temporanei
rm -f secrets_restored.tar.gz

echo ""
echo "✅ Ripristino completato con successo!"
echo ""
echo "📋 File ripristinati:"
ls -la secrets/
echo ""
echo "🚀 Prossimi passi:"
    echo "   1. docker compose down (se attivo)"
    echo "   2. docker compose up -d"
echo "   3. Verifica che l'applicazione funzioni correttamente"
echo ""
echo "🔑 Master Password: [CONSULTA DOCUMENTAZIONE CARTACEA]"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Verifica che l'applicazione funzioni dopo il ripristino"
echo "   - Se ci sono problemi, ripristina il backup precedente"
echo "   - Aggiorna il documento cartaceo di emergenza se necessario"