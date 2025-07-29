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

# Genera password sicure ma memorabili
echo "🔑 Generazione password sicure..."
echo "Carpenteria2024DB_v1" > secrets/db_password.txt
echo "Carpenteria2024JWT_v1" > secrets/jwt_secret.txt
echo "Carpenteria2024Admin_v1" > secrets/admin_password.txt
echo "Carpenteria2024API_v1" > secrets/api_key.txt

# Imposta permessi sicuri (solo root può leggere)
echo "🔒 Impostazione permessi sicuri..."
chmod 600 secrets/*.txt

# Verifica che i file siano stati creati
echo "✅ Verifica creazione file..."
if [ -f "secrets/db_password.txt" ] && [ -f "secrets/jwt_secret.txt" ] && [ -f "secrets/admin_password.txt" ] && [ -f "secrets/api_key.txt" ]; then
    echo "✅ Tutti i segreti sono stati creati correttamente!"
else
    echo "❌ Errore nella creazione dei segreti!"
    exit 1
fi

echo ""
echo "🎉 Setup completato con successo!"
echo ""
echo "🔑 MASTER PASSWORD (da ricordare):"
echo "   'La mia officina 2024 ha 3 torni e 2 frese!'"
echo ""
echo "📋 PASSWORD GENERATE:"
echo "   Database: Carpenteria2024DB_v1"
echo "   JWT: Carpenteria2024JWT_v1"
echo "   Admin: Carpenteria2024Admin_v1"
echo "   API: Carpenteria2024API_v1"
echo ""
echo "🚀 Prossimi passi:"
echo "   1. docker-compose up -d"
echo "   2. ./scripts/backup_secrets.sh (per backup)"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Mantieni al sicuro la master password"
echo "   - Fai backup regolari con ./scripts/backup_secrets.sh"
echo "   - Aggiorna il documento cartaceo di emergenza"