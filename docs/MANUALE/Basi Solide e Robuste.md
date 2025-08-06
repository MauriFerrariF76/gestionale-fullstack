# Basi Solide e Robuste - AI Assistant Guide

## 🎯 Profilo e Obiettivi

### Sviluppatore

- Tipo: Part-time/hobby developer
- Esperienza: Non programmatore professionale
- Priorità: Tranquillità e affidabilità over complessità
- Approccio: Basi robuste, evoluzione graduale
- Constraint: Tempo limitato, zero tolerance per downtime produzione

### Obiettivi Primari

- Affidabilità: App aziendale stabile e sicura
- Semplicità: Workflow manageable per part-time dev
- Robustezza: Backup automatici e rollback immediato
- Professionalità: Setup industry-standard ma accessibile
- Peace of mind: Dormire sereno con app in produzione

## 🏗️ Architettura Foundation

### Setup Definitivo
PC-MAURI (10.10.10.33) - Controller
├── Cursor AI Remote SSH
└── pc-mauri-vaio (10.10.10.15) - SVILUPPO NATIVO
    └── Deploy → gestionale-server (10.10.10.16) - PRODUZIONE DOCKER

### Principi Architetturali

- Sviluppo: Nativo per velocità massima
- Produzione: Docker per affidabilità massima
- Backup: Automatici e ridondanti
- Rollback: Immediato e testato
- Monitoring: Essenziale ma semplice

## 🛠️ Stack Tecnologico Foundation

### Sviluppo (pc-mauri-vaio)
# TUTTO NATIVO per velocità
Frontend/Backend: Next.js + TypeScript
Database: PostgreSQL nativo (apt install)
ORM: Prisma (migrations automatiche)
Development: npm run dev (hot reload istantaneo)
Database GUI: Prisma Studio + pgAdmin

### Produzione (gestionale-server)
# TUTTO CONTAINERIZZATO per affidabilità
App: Next.js in Docker container
Database: PostgreSQL container
Reverse Proxy: Nginx container
Orchestration: docker-compose
Persistence: Docker volumes
Backup: Automated scripts + cron

## 📋 Configurazione Minimale Robusta

### Stack Container Produzione
# docker-compose.yml - FOUNDATION
version: '3.8'
services:
  app:
    build: .
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      - postgres
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@postgres:5432/gestionale
      - NODE_ENV=production

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
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app

volumes:
  postgres-data:

### Prisma Setup (Database Management)
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Models here...

## 🔄 Workflow Quotidiano Semplificato

### Sviluppo (Tutti i giorni)
# Su pc-mauri-vaio via Cursor SSH
cd gestionale-fullstack
npm run dev                    # Sviluppo normale con hot reload
npx prisma studio             # GUI database quando serve
git add . && git commit -m "..." # Version control regolare

### Deploy Produzione (Quando ready)
# 1. Push codice
git push origin main

# 2. Deploy su gestionale-server (SSH)
ssh gestionale-server
cd /opt/gestionale-fullstack
git pull origin main
docker-compose build app --no-cache
docker-compose up -d
docker-compose logs -f        # Verifica tutto ok

### Database Changes
# Sviluppo (pc-mauri-vaio)
# 1. Modifica schema.prisma
# 2. Generate migration
npx prisma migrate dev --name "add-feature-x"

# Produzione (gestionale-server)
# 3. Apply migration (automatic via Dockerfile/startup script)
npx prisma migrate deploy

## 🛡️ Safety Net Foundation

### Backup Automatico (Critico)
#!/bin/bash
# /opt/scripts/backup-daily.sh
set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
RETENTION_DAYS=30

# Database backup
docker exec gestionale-postgres pg_dump -U postgres gestionale > $BACKUP_DIR/db_backup_$DATE.sql

# Application backup (code + config)
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /opt/gestionale-fullstack

# Cleanup old backups
find $BACKUP_DIR -name "*.sql" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Log backup status
echo "$(date): Backup completed successfully" >> /var/log/backup.log

### Rollback Immediato (Emergenza)
#!/bin/bash
# /opt/scripts/rollback.sh
set -e

echo "🚨 EMERGENCY ROLLBACK INITIATED"

# Stop current version
docker-compose down

# Restore from backup (latest)
LATEST_BACKUP=$(ls -t /opt/backups/db_backup_*.sql | head -n1)
docker-compose up -d postgres
sleep 10
cat $LATEST_BACKUP | docker exec -i gestionale-postgres psql -U postgres -d gestionale

# Start previous app version
docker-compose -f docker-compose.backup.yml up -d

echo "✅ Rollback completed. Check application status."

### Health Monitoring (Essenziale)
#!/bin/bash
# /opt/scripts/health-check.sh
# Cron: */5 * * * * /opt/scripts/health-check.sh

# Check app health
if ! curl -f http://localhost/api/health &>/dev/null; then
    echo "❌ App health check failed" | mail -s "Alert: App Down" admin@company.com
fi

# Check database
if ! docker exec gestionale-postgres pg_isready -U postgres &>/dev/null; then
    echo "❌ Database health check failed" | mail -s "Alert: DB Down" admin@company.com
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo "❌ Disk space critical: ${DISK_USAGE}%" | mail -s "Alert: Low Disk" admin@company.com
fi

## 🎓 Knowledge Foundation

### Competenze Minime Richieste
# Docker basics
docker-compose up -d          # Start services
docker-compose down           # Stop services  
docker-compose logs app       # View logs
docker-compose build --no-cache # Rebuild containers

# PostgreSQL basics
pg_dump -U postgres gestionale > backup.sql    # Backup
psql -U postgres -d gestionale < backup.sql    # Restore
docker exec -it postgres psql -U postgres      # Connect

# Prisma essentials
npx prisma migrate dev        # Create migration
npx prisma migrate deploy     # Apply migrations
npx prisma studio            # GUI database
npx prisma generate          # Generate client

# Linux basics
ssh user@server              # Remote access
scp file user@server:/path   # Copy files
crontab -e                   # Schedule tasks
systemctl status service     # Check service status

### Troubleshooting Guide
# App non risponde
docker-compose logs app
docker-compose restart app

# Database problemi
docker-compose logs postgres
docker exec -it postgres psql -U postgres
# Check connections: SELECT * FROM pg_stat_activity;

# Spazio disco pieno
df -h                        # Check usage
docker system prune -a       # Clean unused images
find /var/log -name "*.log" -mtime +7 -delete

# Rollback emergency
/opt/scripts/rollback.sh

## 📅 Implementation Timeline

### Weekend 1: Foundation Setup

- [ ] Docker compose configuration
- [ ] Prisma setup e first migration
- [ ] Backup scripts creation
- [ ] Health check scripts
- [ ] First production deploy
- [ ] Test rollback procedure

### Settimana 2-4: Stabilizzazione

- [ ] Multiple deploys per validation
- [ ] Backup strategy refinement
- [ ] Monitoring setup completion
- [ ] Documentation creation
- [ ] Troubleshooting guide completion

### Mese 2+: Ottimizzazione (Se necessario)

- [ ] CI/CD automation (GitHub Actions)
- [ ] SSL automation (Let’s Encrypt)
- [ ] Advanced monitoring (Grafana/Prometheus)
- [ ] VM test environment setup

## 🔒 Security Foundation

### Sicurezza Base (Non negoziabile)
# Firewall configuration
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# SSL Certificate (Let's Encrypt)
certbot --nginx -d your-domain.com

# Environment variables security
# Use .env files with proper permissions (600)
# Never commit secrets to git

# Database security
# Strong passwords in environment variables
# Connection limits in PostgreSQL config
# Regular security updates

### Backup Security
# Encrypted backups
gpg --symmetric --cipher-algo AES256 backup.sql
# Upload encrypted backups to cloud storage
rclone copy backup.sql.gpg remote:backups/

## 📊 Monitoring Foundation

### Logs Essenziali
# Application logs  
docker-compose logs -f app

# Database logs
docker-compose logs -f postgres

# System logs
journalctl -f -u docker

# Nginx logs
docker-compose logs -f nginx

### Metrics Monitoring
# Resource usage
docker stats
htop
df -h

# Application metrics
curl http://localhost/api/health
# Response time monitoring via curl + logging

## 💡 Guidelines per AI Assistant

### Principi Guida

- Semplicità first: Sempre preferire soluzione più semplice che funzioni
- Robustezza over features: Affidabilità priorità assoluta
- Documentazione: Ogni procedura deve essere documentata
- Testing: Ogni script/procedura deve essere testata
- Gradualità: Implementare features incrementalmente

### Quando Suggerire Cosa

- Problemi semplici: Soluzioni native/dirette
- Problemi complessi: Docker-based solutions
- Sicurezza: Mai compromessi, sempre best practices
- Performance: Bilanciare con semplicità di maintenance
- Scaling: Solo quando realmente necessario

### Red Flags da Evitare

- ❌ Over-engineering per problemi semplici
- ❌ Soluzioni che richiedono maintenance continua
- ❌ Single points of failure senza backup
- ❌ Configurazioni senza rollback plan
- ❌ Security shortcuts per semplicità

-----

*Questa guida definisce le basi solide per un deployment professionale ma manageable da sviluppatore part-time, con focus su affidabilità e tranquillità operativa.*