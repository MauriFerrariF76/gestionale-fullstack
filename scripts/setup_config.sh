#!/bin/bash
# setup_config.sh - Setup configurazione per ripristino automatico
# Versione: 1.0
# Data: $(date +%F)

set -e  # Esci se un comando fallisce

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzioni di utilità
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verifica prerequisiti
check_prerequisites() {
    log_info "Verifica prerequisiti..."
    
    # Verifica GPG
    if ! command -v gpg &> /dev/null; then
        log_error "GPG non installato"
        echo "   Installa GPG: sudo apt install gnupg"
        exit 1
    fi
    
    # Verifica che siamo nella directory corretta
    if [ ! -f "docker-compose.yml" ]; then
        log_error "Esegui questo script dalla directory root del progetto"
        echo "   cd gestionale-fullstack"
        echo "   ./scripts/setup_config.sh"
        exit 1
    fi
    
    log_success "Prerequisiti verificati"
}

# Crea configurazione
create_config() {
    log_info "Creazione configurazione..."
    
    # Crea directory config se non esiste
    mkdir -p config
    
    # Crea file di configurazione
    cat > restore_config.conf << 'EOF'
# Configurazione per ripristino automatico gestionale
# ⚠️ IMPORTANTE: NON committare questo file nel repository!

# Credenziali critiche
MASTER_PASSWORD="La mia officina 2024 ha 3 torni e 2 frese!"
DB_PASSWORD="Carpenteria2024DB_v1"
JWT_SECRET="Carpenteria2024JWT_v1"
ADMIN_PASSWORD="Carpenteria2024Admin_v1"
API_KEY="Carpenteria2024API_v1"

# Configurazioni server
SERVER_IP="10.10.10.15"
DOMAIN="gestionale.carpenteriaferrari.com"
SSL_EMAIL="admin@carpenteriaferrari.com"

# Opzioni di ripristino
AUTO_SSL=true
AUTO_FIREWALL=true
SKIP_TESTS=false

# Configurazioni NAS
NAS_MOUNT="/mnt/backup_gestionale"
NAS_BACKUP_PATH="/mnt/backup_gestionale/backup"
NAS_SHARE="//10.10.10.21/backup_gestionale"
NAS_CREDENTIALS="/root/.nas_gestionale_creds"

# Configurazioni Docker
DOCKER_COMPOSE_VERSION="3.8"
POSTGRES_VERSION="15"
NODE_VERSION="18"

# Configurazioni backup
BACKUP_RETENTION_DAYS=30
BACKUP_COMPRESSION=true
BACKUP_ENCRYPTION=true

# Configurazioni sicurezza
SSL_RENEWAL_DAYS=30
FIREWALL_ALLOW_SSH=true
FIREWALL_ALLOW_HTTP=true
FIREWALL_ALLOW_HTTPS=true
EOF
    
    log_success "Configurazione creata: restore_config.conf"
}

# Cifra configurazione
encrypt_config() {
    log_info "Cifratura configurazione..."
    
    # Verifica se esiste una chiave GPG
    if ! gpg --list-keys admin@carpenteriaferrari.com &>/dev/null; then
        log_warning "Chiave GPG non trovata, creazione chiave..."
        
        # Crea chiave GPG
        cat > gpg_batch << 'EOF'
%echo Generating GPG key for backup encryption
Key-Type: RSA
Key-Length: 4096
Subkey-Type: RSA
Subkey-Length: 4096
Name-Real: Gestionale Backup
Name-Email: admin@carpenteriaferrari.com
Expire-Date: 0
%commit
%echo GPG key generation complete
EOF
        
        gpg --batch --generate-key gpg_batch
        rm gpg_batch
        
        log_success "Chiave GPG creata"
    fi
    
    # Cifra configurazione
    if gpg --encrypt --recipient admin@carpenteriaferrari.com restore_config.conf; then
        log_success "Configurazione cifrata: restore_config.conf.gpg"
        
        # Sposta in directory config
        mv restore_config.conf.gpg config/
        
        # Rimuovi file in chiaro
        rm restore_config.conf
        
        log_success "Configurazione cifrata salvata in config/"
    else
        log_error "Errore nella cifratura"
        return 1
    fi
}

# Crea configurazione NAS
create_nas_config() {
    log_info "Configurazione NAS..."
    
    # Configurazione NAS esistente
    local MOUNTPOINT="/mnt/backup_gestionale"
    local CREDENTIALS="/root/.nas_gestionale_creds"
    
    # Crea directory NAS se non esiste
    if [ ! -d "$MOUNTPOINT" ]; then
        log_warning "Directory NAS non trovata: $MOUNTPOINT"
        echo "   Crea la directory: sudo mkdir -p $MOUNTPOINT"
        echo "   Monta il NAS: sudo mount -t cifs $NAS_SHARE $MOUNTPOINT -o credentials=$CREDENTIALS,iocharset=utf8,vers=2.0"
    else
        log_success "Directory NAS trovata"
    fi
    
    # Crea struttura NAS
    if [ -d "$MOUNTPOINT" ]; then
        mkdir -p "$MOUNTPOINT"/{backup,logs,config}
        
        # Copia script nel NAS
        cp scripts/restore_all.sh "$MOUNTPOINT"/
        cp config/restore_config.conf.gpg "$MOUNTPOINT"/
        
        # Crea README per NAS
        cat > "$MOUNTPOINT"/README_ripristino.md << 'EOF'
# 🚀 Ripristino Automatico Gestionale

## File Contenuti
- `restore_all.sh` - Script principale di ripristino
- `restore_config.conf.gpg` - Configurazione cifrata
- `backup/` - Directory per backup segreti e database
- `logs/` - Directory per log di ripristino

## Utilizzo
1. Clona repository: `git clone [repository]`
2. Copia file dal NAS: `cp /mnt/backup_gestionale/* ./`
3. Lancia ripristino: `./restore_all.sh`

## Backup Necessari
- `secrets_backup_*.tar.gz.gpg` - Backup segreti Docker
- `gestionale_db_*.backup` - Backup database PostgreSQL

## Credenziali
- Master Password: "La mia officina 2024 ha 3 torni e 2 frese!"
- Vedi EMERGENZA_PASSWORDS.md per dettagli

## Contatti Emergenza
- Amministratore: [NOME] - [TELEFONO]
- Backup Admin: [NOME] - [TELEFONO]
- Supporto Tecnico: [NOME] - [TELEFONO]

## Configurazione NAS
- IP: 10.10.10.21 (Synology)
- Share: backup_gestionale
- Mount: /mnt/backup_gestionale
- Credenziali: /root/.nas_gestionale_creds
EOF
        
        log_success "Configurazione NAS completata"
    fi
}

# Crea .gitignore per sicurezza
create_gitignore() {
    log_info "Configurazione sicurezza Git..."
    
    # Aggiungi al .gitignore se non presente
    if [ -f ".gitignore" ]; then
        # Verifica se restore_config.conf è già ignorato
        if ! grep -q "restore_config.conf" .gitignore; then
            echo "" >> .gitignore
            echo "# Configurazione ripristino (sicurezza)" >> .gitignore
            echo "restore_config.conf" >> .gitignore
            echo "secrets/" >> .gitignore
            echo "backup/" >> .gitignore
            echo "logs/" >> .gitignore
            log_success ".gitignore aggiornato"
        fi
    else
        # Crea .gitignore
        cat > .gitignore << 'EOF'
# Configurazione ripristino (sicurezza)
restore_config.conf
secrets/
backup/
logs/

# File temporanei
*.tmp
*.log
*.bak

# Docker
.dockerignore

# Node.js
node_modules/
npm-debug.log*

# Next.js
.next/
out/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo
EOF
        log_success ".gitignore creato"
    fi
}

# Verifica configurazione
verify_config() {
    log_info "Verifica configurazione..."
    
    # Verifica file cifrato
    if [ -f "config/restore_config.conf.gpg" ]; then
        log_success "✅ Configurazione cifrata presente"
    else
        log_error "❌ Configurazione cifrata mancante"
        return 1
    fi
    
    # Verifica script
    if [ -f "scripts/restore_all.sh" ]; then
        log_success "✅ Script ripristino presente"
    else
        log_error "❌ Script ripristino mancante"
        return 1
    fi
    
    # Verifica .gitignore
    if [ -f ".gitignore" ] && grep -q "restore_config.conf" .gitignore; then
        log_success "✅ Sicurezza Git configurata"
    else
        log_warning "⚠️ Sicurezza Git non configurata"
    fi
    
    log_success "Configurazione verificata"
}

# Funzione principale
main() {
    echo "🔧 Setup Configurazione Ripristino Automatico"
    echo "============================================"
    echo ""
    
    # Verifica prerequisiti
    check_prerequisites
    
    # Crea configurazione
    create_config
    
    # Cifra configurazione
    encrypt_config
    
    # Crea configurazione NAS
    create_nas_config
    
    # Crea .gitignore per sicurezza
    create_gitignore
    
    # Verifica configurazione
    verify_config
    
    echo ""
    echo "🎉 Setup configurazione completato!"
    echo ""
    echo "📋 File creati:"
    echo "   - config/restore_config.conf.gpg (configurazione cifrata)"
    echo "   - scripts/restore_all.sh (script ripristino)"
    echo "   - .gitignore (sicurezza Git)"
    echo ""
    echo "📁 Struttura NAS:"
    echo "   - /mnt/backup_gestionale/restore_all.sh"
    echo "   - /mnt/backup_gestionale/restore_config.conf.gpg"
    echo "   - /mnt/backup_gestionale/README_ripristino.md"
    echo ""
    echo "📋 Prossimi passi:"
    echo "   1. Copia backup segreti nel NAS"
    echo "   2. Copia backup database nel NAS"
    echo "   3. Testa ripristino: ./scripts/restore_all.sh"
    echo ""
    echo "⚠️ IMPORTANTE:"
    echo "   - Mantieni al sicuro la Master Password"
    echo "   - Fai backup regolari dei file nel NAS"
    echo "   - Testa il ripristino su ambiente di prova"
}

# Esegui funzione principale
main "$@"