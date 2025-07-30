#!/bin/bash
# docker_quick_start.sh - Avvio rapido Docker Gestionale
# Versione: 1.0
# Descrizione: Script semplificato per avviare l'applicazione Docker

set -e

# Colori
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Avvio Rapido Docker Gestionale${NC}"
echo "================================"
echo ""

# Verifica Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker non installato!${NC}"
    echo "   Installa con: ./scripts/install_docker.sh"
    exit 1
fi

# Verifica Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose non installato!${NC}"
    echo "   Installa con: ./scripts/install_docker.sh"
    exit 1
fi

# Verifica file necessari
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ File docker-compose.yml non trovato!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisiti verificati${NC}"

# Setup segreti se non esistono
if [ ! -f "secrets/db_password.txt" ]; then
    echo -e "${YELLOW}⚠️  Creazione segreti Docker...${NC}"
    mkdir -p secrets
    echo "gestionale2025" > secrets/db_password.txt
    echo "GestionaleFerrari2025JWT_UltraSecure_v1!" > secrets/jwt_secret.txt
    chmod 600 secrets/*.txt
    echo -e "${GREEN}✅ Segreti creati${NC}"
fi

# Crea cartelle necessarie
mkdir -p nginx/ssl postgres/init

# Avvia servizi
echo -e "${BLUE}🔧 Avvio servizi Docker...${NC}"
docker-compose up -d

echo ""
echo -e "${GREEN}🎉 Servizi avviati!${NC}"
echo ""
echo "📋 Accesso applicazione:"
echo "   🌐 Frontend: http://localhost"
echo "   🔧 API: http://localhost/api"
echo "   💚 Health: http://localhost/health"
echo ""
echo "🔧 Comandi utili:"
echo "   Log: docker-compose logs -f"
echo "   Stop: docker-compose down"
echo "   Status: docker-compose ps"
echo ""
echo -e "${YELLOW}⏳ Aspetta 30 secondi per l'avvio completo...${NC}" 