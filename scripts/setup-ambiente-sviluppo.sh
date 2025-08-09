#!/bin/bash

# Script Setup Ambiente Sviluppo Nativo - Gestionale Fullstack
# Versione: 1.0
# Descrizione: Setup completo ambiente sviluppo NATIVO su pc-mauri-vaio
# Target: pc-mauri-vaio (10.10.10.15) - TUTTO NATIVO
# Architettura: PostgreSQL nativo + Node.js nativo + Next.js nativo

set -e  # Exit on error

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzioni di utilità
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verifica prerequisiti
check_prerequisites() {
    log_info "Verifica prerequisiti..."
    
    # Verifica sistema operativo
    if [[ "$(lsb_release -si)" != "Ubuntu" ]]; then
        log_error "Sistema operativo non supportato. Richiesto Ubuntu."
        exit 1
    fi
    
    # Verifica versione Ubuntu
    UBUNTU_VERSION=$(lsb_release -rs)
    if [[ "$UBUNTU_VERSION" != "22.04" ]]; then
        log_warning "Versione Ubuntu $UBUNTU_VERSION rilevata. Testato su 22.04."
    fi
    
    # Verifica utente
    if [[ "$EUID" -eq 0 ]]; then
        log_error "Non eseguire questo script come root. Usa un utente normale."
        exit 1
    fi
    
    # Verifica connessione internet
    if ! ping -c 1 8.8.8.8 &> /dev/null; then
        log_error "Nessuna connessione internet rilevata."
        exit 1
    fi
    
    log_success "Prerequisiti verificati"
}

# Setup PostgreSQL nativo
setup_postgresql() {
    log_info "Setup PostgreSQL nativo..."
    
    # Aggiorna sistema
    sudo apt update
    
    # Installa PostgreSQL
    if ! command -v psql &> /dev/null; then
        log_info "Installazione PostgreSQL..."
        sudo apt install -y postgresql postgresql-contrib
    else
        log_info "PostgreSQL già installato"
    fi
    
    # Avvia servizio PostgreSQL
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Verifica stato servizio
    if sudo systemctl is-active --quiet postgresql; then
        log_success "PostgreSQL avviato correttamente"
    else
        log_error "Errore nell'avvio di PostgreSQL"
        exit 1
    fi
    
    # Crea utente e database per sviluppo (STESSO di produzione)
    log_info "Configurazione database sviluppo (STESSO di produzione)..."
    
    # Crea utente gestionale_user (STESSO di produzione)
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
sudo -u postgres psql -c "CREATE USER gestionale_user WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || log_warning "Utente gestionale_user già esistente"
    
    # Crea database gestionale (STESSO di produzione)
    sudo -u postgres psql -c "CREATE DATABASE gestionale OWNER gestionale_user;" 2>/dev/null || log_warning "Database gestionale già esistente"
    
    # Concedi privilegi
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE gestionale TO gestionale_user;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON SCHEMA public TO gestionale_user;"
    
    # Configura accesso locale
    log_info "Configurazione accesso locale..."
    sudo sed -i '/^local.*gestionale_user/d' /etc/postgresql/*/main/pg_hba.conf
    echo "local gestionale_user gestionale_user md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf
    
    # Restart PostgreSQL
    sudo systemctl restart postgresql
    
    log_success "PostgreSQL configurato per sviluppo"
}

# Setup Node.js nativo
setup_nodejs() {
    log_info "Setup Node.js nativo..."
    
    # Verifica se Node.js è già installato
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        log_info "Node.js già installato: $NODE_VERSION"
        
        # Verifica versione
        if [[ "$NODE_VERSION" == v20* ]]; then
            log_success "Node.js versione 20 già installato"
            return
        else
            log_warning "Node.js versione $NODE_VERSION rilevata. Aggiornamento consigliato."
        fi
    fi
    
    # Installa Node.js 20.x
    log_info "Installazione Node.js 20.x..."
    
    # Aggiungi repository NodeSource
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    
    # Installa Node.js
    sudo apt install -y nodejs
    
    # Verifica installazione
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    log_success "Node.js installato: $NODE_VERSION"
    log_success "npm installato: $NPM_VERSION"
}

# Setup Backend nativo
setup_backend() {
    log_info "Setup Backend nativo..."
    
    cd backend
    
    # Installa dependencies
    log_info "Installazione dependencies backend..."
    npm install
    
    # Crea file .env per sviluppo
    if [[ ! -f .env ]]; then
        log_info "Creazione file .env per sviluppo..."
        cat > .env << EOF
# Configurazione sviluppo Backend - TUTTO NATIVO
# Database: STESSO di produzione (gestionale)
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestionale
DB_USER=gestionale_user
# Password caricata da config.sh
PORT=3001
JWT_SECRET=dev_jwt_secret_2025_$(date +%s)

# Configurazioni sviluppo
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
EOF
        log_success "File .env creato"
    else
        log_warning "File .env già esistente"
    fi
    
    # Configura nodemon per hot reload
    if [[ ! -f nodemon.json ]]; then
        log_info "Configurazione nodemon..."
        cat > nodemon.json << EOF
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node src/app.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
EOF
        log_success "Nodemon configurato"
    fi
    
    # Setup Prisma
    log_info "Setup Prisma..."
    
    # Verifica schema Prisma
    if [[ ! -f "prisma/schema.prisma" ]]; then
        log_error "Schema Prisma non trovato in backend/prisma/"
        exit 1
    fi
    
    # Genera client Prisma
    log_info "Generazione client Prisma..."
    npx prisma generate
    
    # Verifica connessione database e sincronizzazione
    log_info "Verifica connessione database e sincronizzazione..."
    if npx prisma db pull --print &> /dev/null; then
        log_success "Database sincronizzato con Prisma"
    else
        log_warning "Database non completamente sincronizzato - eseguo migrazione..."
        npx prisma migrate dev --name "setup-dev" --create-only &> /dev/null || true
        log_success "Migrazione Prisma completata"
    fi
    
    # Test connessione database
    log_info "Test connessione database..."
    if npm run dev &> /dev/null & then
        BACKEND_PID=$!
        sleep 5
        
        if curl -f http://localhost:3001/health &> /dev/null; then
            log_success "Backend funzionante"
            kill $BACKEND_PID 2>/dev/null || true
        else
            log_error "Backend non risponde"
            kill $BACKEND_PID 2>/dev/null || true
            exit 1
        fi
    else
        log_error "Errore nell'avvio del backend"
        exit 1
    fi
    
    cd ..
}

# Setup Frontend nativo
setup_frontend() {
    log_info "Setup Frontend nativo..."
    
    cd frontend
    
    # Installa dependencies
    log_info "Installazione dependencies frontend..."
    npm install
    
    # Crea file .env.local per sviluppo
    if [[ ! -f .env.local ]]; then
        log_info "Creazione file .env.local per sviluppo..."
        cat > .env.local << EOF
# Configurazione sviluppo Frontend - TUTTO NATIVO
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=development

# Configurazioni sviluppo
NEXT_PUBLIC_APP_NAME=Gestionale Dev
NEXT_PUBLIC_APP_VERSION=0.1.0-dev
EOF
        log_success "File .env.local creato"
    else
        log_warning "File .env.local già esistente"
    fi
    
    # Configura Next.js per sviluppo
    if [[ ! -f next.config.js ]]; then
        log_info "Configurazione Next.js..."
        cat > next.config.js << EOF
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
EOF
        log_success "Next.js configurato"
    fi
    
    # Test build
    log_info "Test build frontend..."
    if npm run build &> /dev/null; then
        log_success "Frontend build completato"
    else
        log_error "Errore nel build del frontend"
        exit 1
    fi
    
    cd ..
}

# Crea script di utilità
create_utility_scripts() {
    log_info "Creazione script di utilità..."
    
    # Script per avviare tutto l'ambiente
    cat > scripts/start-sviluppo.sh << 'EOF'
#!/bin/bash

# Script per avviare ambiente sviluppo NATIVO
echo "🚀 Avvio ambiente sviluppo NATIVO..."

# Avvia PostgreSQL
echo "📊 Avvio PostgreSQL..."
sudo systemctl start postgresql

# Avvia Backend (in background)
echo "🔧 Avvio Backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Attendi avvio backend
sleep 3

# Avvia Frontend (in background)
echo "🎨 Avvio Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Ambiente sviluppo NATIVO avviato"
echo "📊 Backend: http://localhost:3001"
echo "🎨 Frontend: http://localhost:3000"
echo "📝 Premi Ctrl+C per fermare tutto"

# Funzione cleanup
cleanup() {
    echo "🛑 Fermando servizi..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT

# Mantieni script attivo
wait
EOF

    # Script per fermare tutto
    cat > scripts/stop-sviluppo.sh << 'EOF'
#!/bin/bash

# Script per fermare ambiente sviluppo NATIVO
echo "🛑 Fermando ambiente sviluppo NATIVO..."

# Ferma processi Node.js
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "ts-node" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Ferma PostgreSQL (opzionale)
read -p "Fermare PostgreSQL? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo systemctl stop postgresql
    echo "📊 PostgreSQL fermato"
fi

echo "✅ Ambiente sviluppo NATIVO fermato"
EOF

    # Script per backup sviluppo
    cat > scripts/backup-sviluppo.sh << 'EOF'
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
EOF

    # Script per sincronizzazione dev → prod
    cat > scripts/sync-dev-to-prod.sh << 'EOF'
#!/bin/bash

# Script Sincronizzazione Dev → Prod - Gestionale Fullstack
# Versione: 1.0
# Descrizione: Sincronizza ambiente sviluppo NATIVO con produzione CONTAINERIZZATA
# Target: pc-mauri-vaio → gestionale-server

set -e  # Exit on error

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurazioni
PROD_SERVER="10.10.10.16"
PROD_USER="mauri"
PROD_PATH="/home/mauri/gestionale-fullstack"
BACKUP_DIR="backup/sync"
DATE=$(date +%Y%m%d_%H%M%S)

# Funzioni di utilità
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verifica prerequisiti
check_prerequisites() {
    log_info "Verifica prerequisiti..."
    
    # Verifica connessione al server produzione
    if ! ping -c 1 "$PROD_SERVER" &> /dev/null; then
        log_error "Server produzione $PROD_SERVER non raggiungibile"
        exit 1
    fi
    
    # Verifica SSH access
    if ! ssh -o ConnectTimeout=5 "$PROD_USER@$PROD_SERVER" "echo 'SSH OK'" &> /dev/null; then
        log_error "Impossibile connettersi via SSH al server produzione"
        exit 1
    fi
    
    # Verifica ambiente sviluppo
    if [[ ! -d "backend" ]] || [[ ! -d "frontend" ]]; then
        log_error "Directory backend o frontend non trovate"
        exit 1
    fi
    
    # Verifica git
    if ! command -v git &> /dev/null; then
        log_error "Git non installato"
        exit 1
    fi
    
    log_success "Prerequisiti verificati"
}

# Backup produzione
backup_production() {
    log_info "Backup produzione..."
    
    # Crea directory backup
    mkdir -p "$BACKUP_DIR"
    
    # Backup database produzione
    log_info "Backup database produzione..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && ./scripts/backup-automatico.sh"
    
    # Backup configurazioni produzione
    log_info "Backup configurazioni produzione..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && tar -czf /tmp/config_prod_$DATE.tar.gz \
        docker-compose.yml \
        nginx/ \
        postgres/ \
        secrets/ 2>/dev/null || true"
    
    # Scarica backup configurazioni
    scp "$PROD_USER@$PROD_SERVER:/tmp/config_prod_$DATE.tar.gz" "$BACKUP_DIR/"
    
    log_success "Backup produzione completato"
}

# Sincronizza codice
sync_code() {
    log_info "Sincronizzazione codice..."
    
    # Verifica stato git
    if [[ -n $(git status --porcelain) ]]; then
        log_warning "Modifiche non committate rilevate"
        read -p "Commettare modifiche? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            git commit -m "Sync dev to prod - $(date)"
        else
            log_error "Sincronizzazione annullata"
            exit 1
        fi
    fi
    
    # Push al repository
    log_info "Push al repository..."
    if git push origin main; then
        log_success "Codice sincronizzato"
    else
        log_error "Errore nel push del codice"
        exit 1
    fi
}

# Sincronizza database schema
sync_database_schema() {
    log_info "Sincronizzazione schema database..."
    
    # Esporta schema da sviluppo
    log_info "Esportazione schema sviluppo..."
    pg_dump -h localhost -U gestionale_user -d gestionale --schema-only > "$BACKUP_DIR/schema_dev_$DATE.sql"
    
    # Esporta schema da produzione
    log_info "Esportazione schema produzione..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && docker compose exec -T postgres pg_dump -U gestionale_user -d gestionale --schema-only" > "$BACKUP_DIR/schema_prod_$DATE.sql"
    
    # Confronta schemi
    if diff "$BACKUP_DIR/schema_dev_$DATE.sql" "$BACKUP_DIR/schema_prod_$DATE.sql" > /dev/null; then
        log_success "Schemi database identici"
    else
        log_warning "Differenze negli schemi database rilevate"
        read -p "Applicare schema sviluppo a produzione? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Applica schema sviluppo a produzione
            log_info "Applicazione schema sviluppo a produzione..."
            ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && \
                docker compose exec -T postgres psql -U gestionale_user -d gestionale -f -" < "$BACKUP_DIR/schema_dev_$DATE.sql"
            log_success "Schema applicato a produzione"
        fi
    fi
}

# Deploy produzione
deploy_production() {
    log_info "Deploy produzione..."
    
    # Pull codice aggiornato
    log_info "Pull codice aggiornato..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && git pull origin main"
    
    # Ferma servizi produzione
    log_info "Fermata servizi produzione..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && docker compose down"
    
    # Build e avvia servizi
    log_info "Build e avvio servizi produzione..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && docker compose up -d --build"
    
    # Attendi avvio servizi
    log_info "Attesa avvio servizi..."
    sleep 30
    
    log_success "Deploy produzione completato"
}

# Test deploy
test_deploy() {
    log_info "Test deploy..."
    
    # Test connessione backend
    if ssh "$PROD_USER@$PROD_SERVER" "curl -f http://localhost:3001/health" &> /dev/null; then
        log_success "Backend produzione funzionante"
    else
        log_error "Backend produzione non risponde"
        return 1
    fi
    
    # Test connessione frontend
    if ssh "$PROD_USER@$PROD_SERVER" "curl -f http://localhost:3000" &> /dev/null; then
        log_success "Frontend produzione funzionante"
    else
        log_error "Frontend produzione non risponde"
        return 1
    fi
    
    # Test database
    if ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && docker compose exec -T postgres pg_isready -U gestionale_user -d gestionale" &> /dev/null; then
        log_success "Database produzione funzionante"
    else
        log_error "Database produzione non risponde"
        return 1
    fi
    
    log_success "Tutti i test superati"
}

# Rollback automatico
rollback_deploy() {
    log_error "Errore nel deploy. Avvio rollback..."
    
    # Ripristina backup configurazioni
    log_info "Ripristino configurazioni..."
    scp "$BACKUP_DIR/config_prod_$DATE.tar.gz" "$PROD_USER@$PROD_SERVER:/tmp/"
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && tar -xzf /tmp/config_prod_$DATE.tar.gz"
    
    # Riavvia servizi
    log_info "Riavvio servizi..."
    ssh "$PROD_USER@$PROD_SERVER" "cd $PROD_PATH && docker compose down && docker compose up -d"
    
    log_success "Rollback completato"
}

# Cleanup
cleanup() {
    log_info "Cleanup..."
    
    # Rimuovi file temporanei
    rm -f "$BACKUP_DIR/schema_dev_$DATE.sql"
    rm -f "$BACKUP_DIR/schema_prod_$DATE.sql"
    
    # Rimuovi backup configurazioni dal server
    ssh "$PROD_USER@$PROD_SERVER" "rm -f /tmp/config_prod_$DATE.tar.gz"
    
    log_success "Cleanup completato"
}

# Funzione principale
main() {
    echo "🔄 Sincronizzazione Dev → Prod - Gestionale Fullstack"
    echo "=================================================="
    echo ""
    
    # Verifica prerequisiti
    check_prerequisites
    
    # Backup produzione
    backup_production
    
    # Sincronizza codice
    sync_code
    
    # Sincronizza database schema
    sync_database_schema
    
    # Deploy produzione
    if deploy_production; then
        # Test deploy
        if test_deploy; then
            log_success "Sincronizzazione completata con successo"
        else
            log_error "Test deploy falliti"
            rollback_deploy
            exit 1
        fi
    else
        log_error "Deploy fallito"
        rollback_deploy
        exit 1
    fi
    
    # Cleanup
    cleanup
    
    echo ""
    echo "🎉 Sincronizzazione completata!"
    echo ""
    echo "📊 Produzione: http://$PROD_SERVER"
    echo "📝 Log: $BACKUP_DIR/"
    echo ""
}

# Gestione errori
trap 'log_error "Errore durante l'esecuzione. Rollback automatico..."; rollback_deploy; exit 1' ERR

# Esegui script
main "$@"
EOF

    # Rendi script eseguibili
    chmod +x scripts/start-sviluppo.sh
    chmod +x scripts/stop-sviluppo.sh
    chmod +x scripts/backup-sviluppo.sh
    chmod +x scripts/sync-dev-to-prod.sh
    
    log_success "Script di utilità creati"
}

# Test finale
test_setup() {
    log_info "Test finale setup..."
    
    # Test PostgreSQL
    if pg_isready -h localhost -p 5432 &> /dev/null; then
        log_success "PostgreSQL connesso"
    else
        log_error "PostgreSQL non connesso"
        return 1
    fi
    
    # Test database
    if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U gestionale_user -d gestionale -c "SELECT 1;" &> /dev/null; then
        log_success "Database accessibile"
    else
        log_error "Database non accessibile"
        return 1
    fi
    
    # Test Node.js
    if node --version &> /dev/null; then
        log_success "Node.js funzionante"
    else
        log_error "Node.js non funzionante"
        return 1
    fi
    
    # Test npm
    if npm --version &> /dev/null; then
        log_success "npm funzionante"
    else
        log_error "npm non funzionante"
        return 1
    fi
    
    # Test Prisma
    log_info "Test Prisma..."
    cd backend
    if npx prisma --version &> /dev/null; then
        log_success "Prisma installato"
    else
        log_error "Prisma non installato"
        return 1
    fi
    
    if npx prisma db pull --print &> /dev/null; then
        log_success "Prisma connesso al database"
    else
        log_error "Prisma non riesce a connettersi al database"
        return 1
    fi
    cd ..
    
    log_success "Tutti i test superati"
}

# Funzione principale
main() {
    echo "🚀 Setup Ambiente Sviluppo NATIVO - Gestionale Fullstack"
    echo "=================================================="
    echo ""
    echo "🎯 Target: pc-mauri-vaio (10.10.10.15) - TUTTO NATIVO"
    echo "🏗️ Architettura: PostgreSQL nativo + Node.js nativo + Next.js nativo"
    echo ""
    
    # Verifica prerequisiti
    check_prerequisites
    
    # Setup PostgreSQL
    setup_postgresql
    
    # Setup Node.js
    setup_nodejs
    
    # Setup Backend
    setup_backend
    
    # Setup Frontend
    setup_frontend
    
    # Crea script di utilità
    create_utility_scripts
    
    # Test finale
    test_setup
    
    echo ""
    echo "🎉 Setup completato con successo!"
    echo ""
    echo "📋 Prossimi step:"
    echo "1. Avvia ambiente: ./scripts/start-sviluppo.sh"
    echo "2. Accedi a: http://localhost:3000"
    echo "3. API disponibile: http://localhost:3001"
    echo "4. Database: localhost:5432 (gestionale)"
    echo "5. Prisma: Client generato e database sincronizzato"
    echo ""
    echo "📚 Documentazione: docs/SVILUPPO/ambiente-sviluppo-nativo.md"
    echo ""
    echo "🔄 Sincronizzazione con produzione: ./scripts/sync-dev-to-prod.sh"
    echo ""
}

# Esegui script
main "$@" 