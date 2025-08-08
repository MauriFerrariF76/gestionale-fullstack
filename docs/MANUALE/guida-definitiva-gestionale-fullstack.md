# Guida Definitiva - Gestionale Fullstack (Revisionata da Esperto DevOps)

## 🎯 Profilo e Obiettivi

### Sviluppatore

- Tipo: Part-time/hobby developer
- Esperienza: Non programmatore professionale
- Priorità: Tranquillità e affidabilità over complessità
- Approccio: Basi robuste, evoluzione graduale
- Constraint: Tempo limitato, zero tolerance per downtime produzione
- Obiettivo: Peace of mind con setup enterprise-grade ma manageable

### Principi Guida

- Semplicità first: Soluzioni più semplici che funzionano
- Robustezza over features: Affidabilità priorità assoluta
- Gradualità: Implementare incrementalmente
- Professional grade: Industry standard practices
- Documentazione: Ogni procedura documentata e testata

## 🏗️ Architettura Foundation (CONFERMATA)

### Setup Definitivo
PC-MAURI (10.10.10.33) - Controller
├── Cursor AI Remote SSH
└── pc-mauri-vaio (10.10.10.15) - SVILUPPO NATIVO
    └── Deploy → gestionale-server (10.10.10.16) - PRODUZIONE DOCKER

### Stack Tecnologico
# Sviluppo (pc-mauri-vaio)
Frontend/Backend: Next.js + TypeScript
Database: PostgreSQL nativo (velocità sviluppo)
ORM: Prisma (migrations automatiche)
Development: npm run dev (hot reload istantaneo)

# Produzione (gestionale-server)  
App: Next.js containerizzato
Database: PostgreSQL container
Reverse Proxy: Nginx container
Orchestration: docker compose

### 🏗️ Strategia Backup per Ambiente Ibrido

#### **PRINCIPIO FONDAMENTALE: SEPARAZIONE DELLE RESPONSABILITÀ**

**Ambiente Sviluppo (pc-mauri-vaio) - SOLO BACKUP SVILUPPO**
```
✅ DOVREBBE CONTENERE:
- Backup database sviluppo (locale)
- Backup configurazioni sviluppo
- Backup codice sorgente (Git)
- Log di sviluppo

❌ NON DOVREBBE CONTENERE:
- Backup database produzione
- Backup configurazioni produzione
- Dati sensibili produzione
```

**Ambiente Produzione (gestionale-server) - SOLO BACKUP PRODUZIONE**
```
✅ DOVREBBE CONTENERE:
- Backup database produzione
- Backup configurazioni produzione
- Backup segreti produzione
- Log di produzione

❌ NON DOVREBBE CONTENERE:
- Backup sviluppo
- Codice sorgente (solo runtime)
```

**NAS Synology (10.10.10.21) - BACKUP CENTRALIZZATO**
```
✅ CONTIENE:
- Copia di sicurezza produzione
- Copia di sicurezza sviluppo (opzionale)
- Versioning e deduplicazione
- Cifratura GPG per sicurezza
```

#### **Vantaggi di Questa Strategia**
- ✅ **Sicurezza**: Dati sensibili separati
- ✅ **Performance**: Backup veloci e locali
- ✅ **Manutenibilità**: Responsabilità chiare
- ✅ **Scalabilità**: Ogni ambiente gestisce i suoi dati

## 📋 Configurazione Production-Ready

### docker-compose.yml (REVISIONATO)
# docker-compose.yml - PRODUCTION-READY
# IMPORTANTE: Usare sempre 'docker compose' (senza trattino)
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    expose:
      - "3000"
    depends_on:
      postgres:
        condition: service_healthy  # Attende DB ready
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@postgres:5432/gestionale
      - NODE_ENV=production
      - PORT=3000
    networks:
      - default

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_DB=gestionale
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backups:/backups
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d gestionale"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - default

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/certs:/etc/letsencrypt
    depends_on:
      - app
    networks:
      - default

volumes:
  postgres-data:
    name: gestionale-postgres-data

networks:
  default:
    name: gestionale-network

### .env File (SECURITY)
# .env - NON INCLUDERE IN GIT!
DB_PASSWORD=unaPasswordMoltoSicuraSuperSegreta

### nginx.conf (CONFIGURAZIONE BASE)
# nginx/nginx.conf
server {
    listen 80;
    server_name tuodominio.com;  # O IP 10.10.10.16

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

### Dockerfile con Migrations Automatiche
# Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Build app
RUN npm run build

# Copy and setup entrypoint
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE 3000

# Use entrypoint for automatic migrations
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

### entrypoint.sh (MIGRATIONS AUTOMATICHE)
#!/bin/sh
# entrypoint.sh

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting the application..."
exec npm start

## 🔄 Workflow Robusto

### Sviluppo Quotidiano
# Su pc-mauri-vaio via Cursor SSH
cd gestionale-fullstack
npm run dev                    # Sviluppo con hot reload
npx prisma studio             # GUI database quando serve
git add . && git commit -m "..." # Version control

# Database changes
npx prisma migrate dev --name "feature-name"  # Auto-migration

### Deploy Produzione (SICURO)
# 1. Push codice
git push origin main

# 2. Deploy su gestionale-server
ssh gestionale-server
cd /opt/gestionale-fullstack
git pull origin main

# 3. Deploy con migrations automatiche
docker compose build app --no-cache
docker compose up -d

# 4. Verifica deployment
docker compose logs -f app
curl http://localhost/api/health  # Se hai endpoint health

## 🛡️ Safety Net Robusto

### Backup Automatico (TESTATO)
#!/bin/bash
# /opt/scripts/backup-daily.sh
set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
RETENTION_DAYS=30

# Database backup
docker compose exec postgres pg_dump -U postgres gestionale > $BACKUP_DIR/db_backup_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /opt/gestionale-fullstack

# Cleanup old backups
find $BACKUP_DIR -name "*.sql" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Log backup status
echo "$(date): Backup completed successfully" >> /var/log/backup.log

### Rollback Database (ROBUSTO)
#!/bin/bash
# /opt/scripts/rollback-db.sh
set -e

echo "🚨 EMERGENCY DATABASE ROLLBACK INITIATED"

# Find latest backup
LATEST_DB_BACKUP=$(ls -t /opt/backups/db_backup_*.sql | head -n1)

if [ -z "$LATEST_DB_BACKUP" ]; then
    echo "❌ No database backup found. Aborting."
    exit 1
fi

echo "Found latest backup: $LATEST_DB_BACKUP"

# Start postgres service
docker compose up -d postgres

# Wait for database to be ready (ROBUST)
echo "Waiting for database to be ready..."
until docker compose exec postgres pg_isready -U postgres -d gestionale; do
    >&2 echo "Postgres is unavailable - sleeping"
    sleep 2
done

echo "✅ Database is ready. Restoring from backup..."
cat $LATEST_DB_BACKUP | docker compose exec -T postgres psql -U postgres -d gestionale

echo "✅ Database restore completed."
echo "MANUAL ACTION REQUIRED: Deploy last known good version via git and docker compose."

### Health Monitoring (ESSENZIALE)
#!/bin/bash
# /opt/scripts/health-check.sh
# Cron: */5 * * * * /opt/scripts/health-check.sh

# Check app health
if ! curl -f http://localhost &>/dev/null; then
    echo "❌ App health check failed" | mail -s "Alert: App Down" admin@company.com
fi

# Check database
if ! docker compose exec postgres pg_isready -U postgres -d gestionale &>/dev/null; then
    echo "❌ Database health check failed" | mail -s "Alert: DB Down" admin@company.com
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo "❌ Disk space critical: ${DISK_USAGE}%" | mail -s "Alert: Low Disk" admin@company.com
fi

## 🔒 Security Foundation

### SSL Setup (Let’s Encrypt)
# Dopo aver configurato dominio → IP server
sudo apt install certbot python3-certbot-nginx
certbot --nginx -d tuodominio.com

# Auto-renewal (già configurato da certbot)
systemctl status certbot.timer

### Firewall Configuration
# Ubuntu firewall setup
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status

### Backup Security (ADVANCED)
# Encrypted offsite backup
gpg --symmetric --cipher-algo AES256 backup.sql
rclone copy backup.sql.gpg remote:backups/

# Setup rclone per cloud storage (Google Drive, Backblaze B2, etc.)
rclone config

## 🎓 Knowledge Foundation

### Comandi Essential Daily
# Docker operations
docker compose up -d              # Start services
docker compose down               # Stop services
docker compose logs app           # View app logs
docker compose build --no-cache   # Rebuild containers
docker compose exec postgres psql -U postgres # DB access

# Prisma operations
npx prisma migrate dev            # Create migration (dev)
npx prisma migrate deploy         # Apply migrations (prod)
npx prisma studio                # GUI database
npx prisma generate              # Generate client

# System monitoring