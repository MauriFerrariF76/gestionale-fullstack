#!/bin/bash
# setup_secrets.sh - Crea i segreti Docker per il gestionale
# Versione: 1.0
# Data: $(date +%F)

echo "🔐 Setup Segreti Docker Gestionale Carpenteria Ferrari"
echo "======================================================"

# Verifica che siamo nella directory corretta
if [ ! -f "docker-compose.yml" ]; then
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

# Genera password sicure ma memorabili usando variabili d'ambiente o valori di default
echo "🔑 Generazione password sicure..."
DB_PASSWORD=${DB_PASSWORD:-"gestionale2025"}
JWT_SECRET=${JWT_SECRET:-"GestionaleFerrari2025JWT_UltraSecure_v1!"}

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
echo "   'La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo'"
echo ""
echo "📋 PASSWORD GENERATE:"
echo "   Database: $DB_PASSWORD"
echo "   JWT: $JWT_SECRET"
echo ""
echo "🚀 Prossimi passi:"
    echo "   1. docker compose up -d"
echo "   2. ./scripts/backup_secrets.sh (per backup)"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Mantieni al sicuro la master password"
echo "   - Fai backup regolari con ./scripts/backup_secrets.sh"
echo "   - Aggiorna il documento cartaceo di emergenza"