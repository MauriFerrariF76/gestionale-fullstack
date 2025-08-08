#!/bin/bash
# setup_secrets.sh - Crea i segreti Docker per il gestionale
# Versione: 1.0
# Data: $(date +%F)

echo "🔐 Setup Segreti Docker Gestionale Carpenteria Ferrari"
echo "======================================================"

# Verifica che siamo nella directory corretta (sviluppo)
if [ ! -f "scripts/config.sh" ] && [ ! -f "../scripts/config.sh" ]; then
    echo "❌ Errore: Esegui questo script dalla directory root del progetto"
    echo "   cd gestionale-fullstack"
    echo "   ./scripts/setup_secrets.sh"
    exit 1
fi

# Crea cartella secrets se non esiste
echo "📁 Creazione cartella secrets..."
mkdir -p secrets

# Carica variabili d'ambiente se disponibili
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Carica configurazione centralizzata
if [ -f "scripts/config.sh" ]; then
    source "scripts/config.sh"
elif [ -f "../scripts/config.sh" ]; then
    source "../scripts/config.sh"
else
    echo "❌ Errore: File config.sh non trovato"
    exit 1
fi

echo "🔑 Generazione file secrets..."
echo "$DB_PASSWORD" > secrets/db_password.txt
echo "$JWT_SECRET" > secrets/jwt_secret.txt

# Imposta permessi sicuri (solo root può leggere)
echo "🔒 Impostazione permessi sicuri..."
chmod 600 secrets/*.txt

# Verifica che i file siano stati creati
echo "✅ Verifica creazione file..."
if [ -f "secrets/db_password.txt" ] && [ -f "secrets/jwt_secret.txt" ]; then
    echo "✅ Tutti i segreti sono stati creati correttamente!"
else
    echo "❌ Errore nella creazione dei segreti!"
    exit 1
fi

echo ""
echo "🎉 Setup completato con successo!"
echo ""
echo "🔑 MASTER PASSWORD (da ricordare):"
echo "   [CONSULTA DOCUMENTAZIONE CARTACEA]"
echo ""
echo "📋 PASSWORD GENERATE:"
echo "   Database: $DB_PASSWORD"
echo "   JWT: $JWT_SECRET"
echo ""
echo "🚀 Prossimi passi:"
echo "   1. ./scripts/start-sviluppo.sh"
echo "   2. ./scripts/backup_secrets.sh (per backup)"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Mantieni al sicuro la master password"
echo "   - Fai backup regolari con ./scripts/backup_secrets.sh"
echo "   - Aggiorna il documento cartaceo di emergenza"