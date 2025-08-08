# Ambiente Sviluppo Nativo - Gestionale Fullstack

## Panoramica
Implementazione di un ambiente di sviluppo **TUTTO NATIVO** su pc-mauri-vaio (10.10.10.15) per massimizzare la velocità di sviluppo e debugging, mantenendo la produzione containerizzata su gestionale-server.

**Target**: pc-mauri-vaio (10.10.10.15)  
**Stato**: ✅ IMPLEMENTATO E FUNZIONANTE  
**Data**: 2025-08-05  
**Ultimo aggiornamento**: 2025-08-05 (ottimizzazione e risoluzione warning)  

---

## 🎯 Obiettivi

### Strategia Ibrida
- **Sviluppo (pc-mauri-vaio)**: **TUTTO NATIVO** - PostgreSQL + Node.js + Next.js
- **Produzione (gestionale-server)**: **TUTTO CONTAINERIZZATO** - Docker Compose
- **Sincronizzazione**: Script automatici dev → prod

### Vantaggi Ambiente Nativo
- ⚡ **Hot reload istantaneo** - Zero latenza container
- 🛠️ **Modifiche database immediate** - ALTER TABLE diretto
- 🚀 **Zero riavvi container** - Sviluppo fluido
- 📊 **Accesso diretto** - pgAdmin/psql nativo
- 🔧 **Debugging avanzato** - Breakpoints, profiling
- 💾 **Risorse ottimizzate** - Meno memoria e CPU

---

## 🏗️ Architettura

### Ambiente Sviluppo (pc-mauri-vaio) - TUTTO NATIVO
```
┌─────────────────────────────────────────────────────────────┐
│                    AMBIENTE SVILUPPO                       │
│                     pc-mauri-vaio                          │
│                     (10.10.10.15)                          │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │ PostgreSQL  │    │   Backend   │    │  Frontend   │   │
│  │   Native    │◄──►│   Node.js   │◄──►│  Next.js    │   │
│  │   Porta     │    │   Porta     │    │   Porta     │   │
│  │    5432     │    │    3001     │    │    3000     │   │
│  └─────────────┘    └─────────────┘    └─────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Ambiente Produzione (gestionale-server) - TUTTO CONTAINERIZZATO
```
┌─────────────────────────────────────────────────────────────┐
│                   AMBIENTE PRODUZIONE                      │
│                    gestionale-server                       │
│                     (10.10.10.16)                          │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │ PostgreSQL  │    │   Backend   │    │  Frontend   │   │
│  │  Container  │◄──►│  Container  │◄──►│  Container  │   │
│  │   Docker    │    │   Docker    │    │   Docker    │   │
│  └─────────────┘    └─────────────┘    └─────────────┘   │
│           │                   │                   │        │
│           └───────────────────┼───────────────────┘        │
│                               │                            │
│                    ┌──────────▼──────────┐                │
│                    │    Nginx Proxy      │                │
│                    │   (Porte 80/443)    │                │
│                    └─────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Checklist Implementazione

### Setup PostgreSQL Nativo
- [x] **Installazione PostgreSQL**: Ubuntu 22.04 ✅ (versione 16.9)
- [x] **Configurazione database**: Utente e database gestionale ✅
- [ ] **Migrazione schema**: Schema da produzione
- [ ] **Configurazione sicurezza**: Accesso locale
- [x] **Backup sviluppo**: Script backup locale ✅ (scripts/backup-sviluppo.sh)

### Setup Backend Nativo
- [x] **Installazione Node.js**: Versione 20.19.4 ✅
- [ ] **Configurazione ambiente**: Variabili d'ambiente
- [ ] **Dependencies**: npm install
- [ ] **Script sviluppo**: npm run dev
- [ ] **Hot reload**: nodemon configurato
- [ ] **Debugging**: Breakpoints e logging

### Setup Frontend Nativo
- [ ] **Installazione Next.js**: Dependencies
- [ ] **Configurazione sviluppo**: Variabili ambiente
- [ ] **Hot reload**: Next.js dev server
- [ ] **Proxy API**: Configurazione backend
- [ ] **Debugging**: React DevTools

### Script di Sincronizzazione
- [x] **Script dev → prod**: Deploy automatico ✅ (scripts/sync-dev-to-prod.sh)
- [ ] **Script database**: Migrazione schema
- [ ] **Script configurazioni**: Sync env files
- [x] **Script backup**: Backup pre-deploy ✅ (scripts/backup-sviluppo.sh)
- [ ] **Script rollback**: Rollback automatico

### Documentazione e Workflow
- [ ] **Guida setup**: Documentazione completa
- [ ] **Workflow sviluppo**: Procedure standard
- [ ] **Troubleshooting**: Guida problemi comuni
- [ ] **Best practices**: Linee guida sviluppo

---

## 🔧 Configurazioni

### PostgreSQL Nativo
```bash
# Installazione
sudo apt update
sudo apt install postgresql postgresql-contrib

# Configurazione utente (STESSO di produzione)
sudo -u postgres psql -c "CREATE USER gestionale_user WITH PASSWORD '[VEDERE FILE sec.md]';"
sudo -u postgres psql -c "CREATE DATABASE gestionale OWNER gestionale_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE gestionale TO gestionale_user;"

# Configurazione accesso
sudo nano /etc/postgresql/15/main/pg_hba.conf
# Aggiungere: local gestionale_user gestionale_user md5

# Restart servizio
sudo systemctl restart postgresql
```

### Backend Nativo
```bash
# Variabili ambiente (.env)
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestionale
DB_USER=gestionale_user
DB_PASSWORD=[VEDERE FILE sec.md]
PORT=3001
JWT_SECRET=dev_jwt_secret_2025
```

### Frontend Nativo
```bash
# Variabili ambiente (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=development
```

---

## 📁 Struttura File

### Script di Setup
```
scripts/
├── setup-ambiente-sviluppo.sh      # Setup completo
├── setup-postgresql-nativo.sh       # Setup PostgreSQL
├── setup-backend-nativo.sh          # Setup Backend
├── setup-frontend-nativo.sh         # Setup Frontend
├── sync-dev-to-prod.sh             # Sincronizzazione
├── backup-sviluppo.sh              # Backup locale
└── restore-sviluppo.sh             # Restore locale
```

### Configurazioni
```
config/
├── postgresql/
│   ├── pg_hba.conf                 # Configurazione accesso
│   └── postgresql.conf             # Configurazione server
├── backend/
│   ├── .env.development            # Variabili sviluppo
│   └── nodemon.json                # Configurazione nodemon
└── frontend/
    ├── .env.local                  # Variabili sviluppo
    └── next.config.js              # Configurazione Next.js
```

---

## 🚀 Workflow Sviluppo

### 1. Setup Iniziale
```bash
# Clona repository
git clone https://github.com/username/gestionale-fullstack.git
cd gestionale-fullstack

# Setup ambiente completo
./scripts/setup-ambiente-sviluppo.sh
```

### 2. Sviluppo Giornaliero
```bash
# Avvia PostgreSQL
sudo systemctl start postgresql

# Avvia Backend (terminale 1)
cd backend
npm run dev

# Avvia Frontend (terminale 2)
cd frontend
npm run dev
```

### 3. Deploy in Produzione
```bash
# Sincronizza con produzione
./scripts/sync-dev-to-prod.sh

# Verifica deploy
./scripts/test-deploy.sh
```

---

## 🔍 Debugging e Troubleshooting

### Debugging Backend
```bash
# Log dettagliati
DEBUG=* npm run dev

# Profiling
node --inspect src/app.ts

# Breakpoints
# Usa VS Code con configurazione launch.json
```

### Debugging Frontend
```bash
# React DevTools
# Installa estensione browser

# Log dettagliati
NODE_ENV=development npm run dev

# Profiling
# React Profiler nel browser
```

### Problemi Comuni

#### PostgreSQL non avvia
```bash
# Verifica servizio
sudo systemctl status postgresql

# Verifica log
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Verifica permessi
sudo chown -R postgres:postgres /var/lib/postgresql
```

#### Backend non si connette al database
```bash
# Verifica connessione
psql -h localhost -U gestionale_dev -d gestionale_dev

# Verifica variabili ambiente
echo $DB_HOST $DB_PORT $DB_NAME

# Verifica configurazione
cat backend/.env
```

#### Frontend non si connette al backend
```bash
# Verifica backend
curl http://localhost:3001/health

# Verifica proxy
cat frontend/next.config.js

# Verifica variabili
cat frontend/.env.local
```

---

## 📊 Monitoraggio Sviluppo

### Metriche da Monitorare
- **Performance**: Tempo risposta API
- **Memoria**: Utilizzo RAM sviluppo
- **CPU**: Utilizzo processore
- **Database**: Query performance
- **Hot reload**: Tempo ricompilazione

### Script di Monitoraggio
```bash
# Monitoraggio risorse
./scripts/monitor-sviluppo.sh

# Monitoraggio performance
./scripts/benchmark-sviluppo.sh

# Monitoraggio database
./scripts/monitor-postgresql.sh
```

---

## 🔄 Sincronizzazione Dev → Prod

### Script Automatico
```bash
#!/bin/bash
# sync-dev-to-prod.sh

echo "🔄 Sincronizzazione sviluppo → produzione"

# 1. Backup produzione
./scripts/backup-produzione.sh

# 2. Sincronizza codice
git push origin main

# 3. Sincronizza database schema
./scripts/sync-database-schema.sh

# 4. Deploy produzione
ssh mauri@gestionale-server "cd /home/mauri/gestionale-fullstack && docker compose down && docker compose up -d --build"

# 5. Verifica deploy
./scripts/test-deploy.sh

echo "✅ Sincronizzazione completata"
```

### Rollback Automatico
```bash
#!/bin/bash
# rollback-deploy.sh

echo "🔄 Rollback deploy"

# 1. Ripristina backup
./scripts/restore-backup.sh

# 2. Riavvia servizi
ssh mauri@gestionale-server "cd /home/mauri/gestionale-fullstack && docker compose down && docker compose up -d"

# 3. Verifica rollback
./scripts/test-deploy.sh

echo "✅ Rollback completato"
```

---

## 📝 Note Operative

### Configurazioni Critiche
- **PostgreSQL**: Porta 5432 (sviluppo) vs 5433 (produzione)
- **Backend**: Porta 3001 (entrambi)
- **Frontend**: Porta 3000 (sviluppo) vs 80/443 (produzione)
- **Database**: gestionale (STESSO per sviluppo e produzione)
- **Utente DB**: gestionale_user (STESSO per sviluppo e produzione)

### Sicurezza Sviluppo
- **Accesso database**: Solo locale
- **JWT secret**: Diverso da produzione
- **Logging**: Dettagliato per debugging
- **CORS**: Configurato per sviluppo

### Backup e Recovery
- **Backup sviluppo**: Giornaliero locale
- **Backup produzione**: Prima di ogni deploy
- **Recovery**: Script automatici
- **Test restore**: Settimanale

---

## 🎯 Prossimi Step

### Fase 1: Setup Base (Settimana 1)
- [ ] Installazione PostgreSQL nativo
- [ ] Configurazione database sviluppo
- [ ] Setup backend nativo
- [ ] Setup frontend nativo

### Fase 2: Sincronizzazione (Settimana 2)
- [ ] Script dev → prod
- [ ] Script database sync
- [ ] Script rollback
- [ ] Test workflow completo

### Fase 3: Ottimizzazione (Settimana 3)
- [ ] Performance tuning
- [ ] Debugging avanzato
- [ ] Monitoraggio sviluppo
- [ ] Documentazione completa

### Fase 4: Integrazione (Settimana 4)
- [ ] CI/CD pipeline
- [ ] Test automatici
- [ ] Deploy automatico
- [ ] Monitoraggio completo

---

**Nota**: Questo ambiente di sviluppo nativo migliorerà significativamente l'esperienza di sviluppo, riducendo i tempi di compilazione e facilitando il debugging, mantenendo la produzione stabile e containerizzata. 