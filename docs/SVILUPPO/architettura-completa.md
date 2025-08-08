# 🏗️ Architettura Completa - Gestionale Fullstack

## 📋 Indice
- [1. Panoramica Architettura](#1-panoramica-architettura)
- [2. Ambiente di Sviluppo](#2-ambiente-di-sviluppo)
- [3. Ambiente di Produzione](#3-ambiente-di-produzione)
- [4. Strategia Deploy CI/CD](#4-strategia-deploy-cicd)
- [5. Gestione Database](#5-gestione-database)
- [6. Sicurezza e Backup](#6-sicurezza-e-backup)
- [7. Monitoring e Alerting](#7-monitoring-e-alerting)
- [8. Troubleshooting](#8-troubleshooting)

---

## 1. Panoramica Architettura

### 🏗️ Architettura di Sistema

```
PC-MAURI (10.10.10.33) - Controller
├── Cursor AI (interfaccia sviluppo)
└── SSH → pc-mauri-vaio (10.10.10.15) - SVILUPPO
    └── Deploy automatico → gestionale-server (10.10.10.16) - PRODUZIONE
```

### 🎯 Strategia Ibrida (Sviluppo + Produzione)

**Ambiente Sviluppo (pc-mauri-vaio)**: **TUTTO LOCALE**
- **App**: `npm run dev` (nativo, hot reload istantaneo)
- **Database**: PostgreSQL installato nativamente
- **Motivo**: Massima velocità, zero overhead Docker

**Ambiente Produzione (gestionale-server)**: **TUTTO CONTAINERIZZATO**
- **App**: Container Docker
- **Database**: Container PostgreSQL
- **Reverse Proxy**: Nginx container
- **Motivo**: Isolamento, backup automatici, deploy atomico

### 🏢 Struttura Progetto

```
gestionale-fullstack/
├── docker-compose.yml          # Orchestrazione produzione
├── backend/
│   ├── Dockerfile             # Container per API
│   └── src/                   # Codice sorgente
├── frontend/
│   ├── Dockerfile             # Container per Next.js
│   ├── app/                   # Codice sorgente
│   └── package.json           # Material Tailwind + Tailwind CSS v4
├── nginx/
│   └── nginx-ssl.conf         # Configurazione reverse proxy
├── postgres/
│   └── init/                  # Script inizializzazione DB
├── secrets/                   # 🔐 Gestione sicura password
│   ├── db_password.txt
│   └── jwt_secret.txt
├── scripts/                   # 🛠️ Script automazione
└── docs/                      # 📚 Documentazione completa
```

---

## 2. Ambiente di Sviluppo

### 🖥️ Setup Consigliato: **TUTTO LOCALE**

#### Configurazione
```bash
# Installazione PostgreSQL
sudo apt install postgresql postgresql-contrib
createdb gestionale_dev

# Workflow quotidiano
npm run dev                    # Hot reload immediato
psql gestionale_dev           # Modifiche schema immediate
```

#### Vantaggi
- ⚡ **Hot reload istantaneo**
- 🛠️ **Modifiche database immediate**
- 🚀 **Zero riavvi container**
- 📊 **Accesso diretto a pgAdmin/psql**

#### Workflow Sviluppo Quotidiano
1. **PC-MAURI** → Cursor AI
2. **SSH** → pc-mauri-vaio
3. **Modifica codice** → Hot reload immediato
4. **Modifica DB** → ALTER TABLE diretto
5. **Test locale** → Tutto veloce

---

## 3. Ambiente di Produzione

### 🏢 Setup: **TUTTO CONTAINERIZZATO**

#### Componenti
```yaml
services:
  - app (Next.js containerizzato)
  - postgres (database + backup automatico)
  - nginx (reverse proxy + SSL)
```

#### Comandi Docker Principali
```bash
# Avvia l'intera applicazione
docker compose up -d

# Visualizza i log
docker compose logs -f

# Ferma l'applicazione
docker compose down

# Ricostruisci i container (dopo modifiche)
docker compose up -d --build

# Backup volumi Docker
docker run --rm -v gestionale_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

#### Health Checks
```yaml
# Esempio health check per PostgreSQL
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U gestionale_user -d gestionale"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s
```

---

## 4. Strategia Deploy CI/CD

### 🔄 Processo Deploy con CI/CD

#### 1. Sviluppo (pc-mauri-vaio)
- Codice **nativo** per velocità
- Test locali immediati
- Modifiche database dirette

#### 2. CI/CD Pipeline (GitHub Actions)
```
git push → CI/CD Pipeline:

📦 CI (Continuous Integration):
├── Checkout codice
├── Install dependencies (npm ci)
├── Run tests (npm test)
├── Build Dockerfile
├── Create container image
└── Push to container registry

🚀 CD (Continuous Deployment):
├── Pull container image
├── Deploy to gestionale-server
├── Health check new version
├── Switch traffic (if healthy)
└── Rollback (if unhealthy)
```

#### 3. Produzione (gestionale-server)
- **Tutto containerizzato**
- Deploy atomico via CI/CD
- Rollback automatico se pipeline fallisce

### 🚀 Strategie Deploy Docker

#### Opzione A: Rolling Deploy (SEMPLICE)
- **Processo**: Ferma container vecchio → Avvia nuovo
- **Downtime**: 10-30 secondi
- **Complessità**: Bassa
- **Consigliato per**: Fase iniziale

#### Opzione B: Blue-Green Deploy (ZERO DOWNTIME)
- **Processo**: Nuovo container in parallelo → Switch quando pronto
- **Downtime**: Zero
- **Complessità**: Media
- **Consigliato per**: Produzione matura

#### Opzione C: Canary Deploy (SICURO)
- **Processo**: Nuovo container per % utenti → Switch graduale
- **Downtime**: Zero
- **Complessità**: Alta
- **Consigliato per**: Deploy critici

### 📅 Trigger Deploy

#### Automatico (Consigliato dopo rodaggio)
- **Push su main** → CI/CD completo automatico
- **Test failure** → Pipeline si ferma, no deploy
- **Deploy failure** → Rollback automatico
- **Notifiche** → Email/Slack su risultato pipeline

#### Manuale con Approval (Consigliato inizialmente)
- **Push su main** → CI completo automatico
- **Deploy gate** → Aspetta tua approvazione manuale
- **Tu approvi** → CD procede con deploy
- **Controllo totale** → Tu decidi quando fare deploy

---

## 5. Gestione Database

### 🗄️ Sviluppo
- **PostgreSQL nativo** su pc-mauri-vaio
- **Schema libero** - modifiche immediate
- **Database**: `gestionale_dev`

### 🗄️ Produzione
- **PostgreSQL containerizzato** su gestionale-server
- **Backup automatici** ogni 6 ore
- **Database**: `gestionale`

### 🔄 Sincronizzazione
```bash
# Migrazione schema dev → prod
psql -h 10.10.10.16 -f schema_changes.sql
```

### 💾 Backup Automatici
- **Frequenza**: Ogni 6 ore
- **Retention**: 30 giorni locali + 1 anno cloud
- **Encryption**: Backup criptati
- **Test**: Verifica automatica integrità

---

## 6. Sicurezza e Backup

### 🔒 Sicurezza
- **SSL/HTTPS** automatico
- **Variabili ambiente** criptate
- **Accesso SSH** con chiavi
- **Firewall** configurato

### 🔐 Gestione Sicura delle Password
Il sistema utilizza **Docker secrets** per la gestione sicura delle credenziali:

```bash
# Setup iniziale dei segreti
./scripts/setup_secrets.sh

# Backup cifrato dei segreti
./scripts/backup_secrets.sh

# Ripristino segreti (in caso di emergenza)
./scripts/restore_secrets.sh backup_file.tar.gz.gpg
```

### 🚨 Rollback Automatico
- **Health check** fallisce → Rollback immediato
- **Errori critici** → Torna versione precedente
- **Timeout** → Abort deploy

---

## 7. Monitoring e Alerting

### 📊 Monitoraggio
- **Performance** app dopo deploy
- **Errori** log applicazione
- **Disponibilità** servizi
- **Alert** amministratore

### 🔧 Automatismi CI/CD

#### Pre-Deploy (CI Pipeline)
- **Code quality check** (lint, type check)
- **Test automatici** (unit, integration)
- **Security scan** (vulnerabilità dipendenze)
- **Build container** image ottimizzata
- **Push registry** con tag versione

#### Durante Deploy (CD Pipeline)
- **Database backup** automatico pre-deploy
- **Pull image** from registry
- **Database migrations** se necessarie
- **Rolling update** container con health check
- **Traffic switch** quando nuovo container healthy
- **Rollback automatico** se health check fallisce

#### Post-Deploy (CD Pipeline)
- **Smoke tests** produzione
- **Performance monitoring** attivato
- **Log monitoring** per errori
- **Cleanup containers** vecchi
- **Notifica risultato** (Slack/Email)

---

## 8. Troubleshooting

### 🚨 Emergenze

#### Ripristino Rapido
```bash
# 1. Ferma tutto
docker compose down

# 2. Ripristina segreti
./scripts/restore_secrets.sh backup_file.tar.gz.gpg

# 3. Riavvia
docker compose up -d

# 4. Verifica
curl http://localhost/health
```

#### Reset Completo
```bash
# 1. Ferma e rimuovi tutto
docker compose down -v

# 2. Setup da zero
./scripts/setup_docker.sh
```

### 🔧 Comandi Utili
```bash
# Stato servizi
docker compose ps

# Log in tempo reale
docker compose logs -f

# Ferma servizi
docker compose down

# Ricostruisci (dopo modifiche)
docker compose up -d --build
```

---

## 🎨 Tecnologie UI e Frontend

### 🎯 Stack Frontend
- **Framework**: Next.js 15.4.5 (React 18)
- **Styling**: Material Tailwind + Tailwind CSS v4
- **Componenti**: @material-tailwind/react@2.1.10
- **Utility**: tailwind-merge@3.3.1

### 🎨 Design System
- **Material Design**: Componenti professionali
- **Responsive**: Adattamento automatico dispositivi
- **Accessibilità**: Componenti WCAG compliant
- **Temi**: Dark/Light mode supportati

### 🧩 Componenti Disponibili
- **Button**: Varianti (primary, secondary, danger, success, ghost, outline)
- **Input**: Con label, error, helper, icone (left/right)
- **Modal/Dialog**: Componenti modali riutilizzabili
- **Table/DataTable**: Tabelle con sorting, filtering, pagination
- **Form**: Sistema di form riutilizzabile con validazione
- **LoadingSpinner**: Indicatori di caricamento standardizzati
- **ErrorMessage**: Gestione errori uniforme
- **EmptyState**: Stati vuoti per liste e contenuti

### 🚀 Vantaggi UI
- **Sviluppo veloce**: Componenti pronti all'uso
- **Consistenza**: Design system uniforme
- **Professionalità**: Interfaccia moderna e aziendale
- **Manutenibilità**: Componenti riutilizzabili

---

## ⚖️ Vantaggi della Soluzione

### ✅ Vantaggi
- **Sviluppo rapidissimo** - Zero latenza container
- **DB development friendly** - Modifiche schema immediate
- **Produzione robusta** - Isolamento completo
- **Deploy automatico** - Zero intervento manuale
- **Backup sicuri** - Dati critici protetti

### ⚠️ Gestione Necessaria
- **Schema migration** dev → prod
- **Versioning database** (Prisma/Sequelize)
- **Backup environment** sviluppo
- **Monitoring** sistema produzione

---

## 🎯 Prossimi Step

1. **Setup ambiente sviluppo** nativo su pc-mauri-vaio
2. **Configurazione GitHub Actions** per CI/CD
3. **Infrastructure as Code** per gestionale-server
4. **Sistema backup** completo
5. **Monitoring e alert** produzione

---

## 📝 Note Tecniche

- **Rete**: 10.10.10.x (LAN aziendale)
- **SSH**: Accesso da PC-MAURI a entrambi i server
- **Database**: PostgreSQL (nativo dev, container prod)
- **App**: Next.js fullstack + Material Tailwind
- **Deploy**: GitHub Actions + Docker Compose
- **Sintassi Docker**: `docker compose` (senza trattino) - V2 