# Gestionale Fullstack

## 🐳 Containerizzazione e Docker

### 🚀 Avvio Rapido
```bash
# Primo setup (installazione completa)
./scripts/setup_docker.sh

# Avvio veloce (dopo il primo setup)
./scripts/docker_quick_start.sh

# Avvio manuale
docker compose up -d
```

### 🌐 Accesso Applicazione
- **Frontend**: http://localhost
- **API Backend**: http://localhost/api
- **Health Check**: http://localhost/health

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

### Strategia di Deploy
Il gestionale è progettato per essere **containerizzato con Docker**, garantendo:
- **Portabilità**: Funziona identicamente su qualsiasi server (sviluppo, test, produzione)
- **Isolamento**: Ogni servizio (backend, frontend, database) in container separati
- **Facilità di deploy**: Un comando per avviare l'intera applicazione
- **Versioning**: Rollback semplice a versioni precedenti
- **Sicurezza**: Gestione centralizzata dei segreti con Docker secrets

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

**⚠️ IMPORTANTE**: Le password sono ora gestite tramite variabili d'ambiente per maggiore sicurezza.

### Configurazione Sicura:
1. **Setup variabili d'ambiente**: `./scripts/setup_env.sh`
2. **Completa il file .env** con le tue credenziali
3. **Testa la configurazione**: `./scripts/test_env_config.sh`

### Credenziali di Default (solo per sviluppo):
- **Database**: Configurato tramite variabili d'ambiente
- **JWT**: Configurato tramite variabili d'ambiente  
- **Master Password**: Configurato tramite variabili d'ambiente

### Architettura Active-Passive (Resilienza)
- **Server Primario**: Gestisce tutto il traffico normalmente
- **Server Secondario**: In standby, pronto a subentrare in caso di guasto
- **Failover Manuale**: Intervento manuale per attivare il server di riserva
- **Sincronizzazione**: Database replicato in tempo reale tra i due server
- **Backup Segreti**: Segreti Docker sincronizzati tra i server

### Vantaggi della Containerizzazione
- **Ambiente uniforme**: Stessa configurazione ovunque
- **Deploy semplificato**: `docker compose up -d` per avviare tutto
- **Backup facilitato**: Backup dei volumi Docker e segreti cifrati
- **Scalabilità**: Facile aggiungere più istanze dei servizi
- **Sicurezza**: Gestione centralizzata dei segreti con Docker secrets

---

## 📚 Documentazione

### Organizzazione Documenti
La documentazione è organizzata secondo le convenzioni del progetto:

#### **📁 `/docs/SVILUPPO/` - Materiale di Sviluppo**
- **`checklist-operativa-unificata.md`** ⭐ **PRINCIPALE** - Checklist unificata per tutte le operazioni
- **`automazione.md`** - Automazione essenziale e monitoraggio
- **`architettura-e-docker.md`** - Architettura Docker e containerizzazione
- **`configurazione-nas.md`** - Configurazione NAS e backup
- **`configurazione-https-lets-encrypt.md`** - Configurazione SSL/HTTPS
- **`emergenza-passwords.md`** - Credenziali di emergenza (CRITICO)
- **`convenzioni-nomenclatura.md`** - Standard di nomenclatura

#### **📁 `/docs/MANUALE/` - Guide e Manuali**
- **`guida-docker.md`** - Guida completa per uso Docker
- **`guida-ripristino-rapido.md`** - Guida rapida ripristino automatico
- **`guida-backup.md`** - Guida operativa backup e restore
- **`manuale-utente.md`** - Manuale utente gestionale
- **`guida-gestione-log.md`** - Gestione log e monitoraggio

#### **📁 `/docs/server/` - Configurazione Server**
- **`guida-installazione-server.md`** - Installazione e configurazione server
- **`checklist-server-ubuntu.md`** - Checklist post-installazione
- **Script di backup**: Backup automatici configurazioni e database

### Documentazione Principale
- **`README.md`** (root) - Panoramica generale e quick start
- **`docs/guida-documentazione.md`** - Indice completo documentazione

---

## 🖥️ Documentazione Server Ubuntu

### Configurazione e Gestione
- **[docs/SVILUPPO/checklist-operativa-unificata.md](docs/SVILUPPO/checklist-operativa-unificata.md)** - Checklist unificata per tutte le operazioni
- **[docs/SVILUPPO/architettura-e-docker.md](docs/SVILUPPO/architettura-e-docker.md)** - Architettura Docker e containerizzazione

### Gestione Servizi
- **Servizi Docker**: Backend, frontend, database e nginx gestiti tramite Docker Compose
  ```bash
  docker-compose start|stop|restart|status
  docker-compose logs -f
  ```

### Backup e Configurazioni
- **[docs/server/backup_config_server.sh](docs/server/backup_config_server.sh)** - Script di backup automatico configurazioni server su NAS
- **Snapshot Server**: Versioni software e configurazioni in `/docs/server/`

---

## 🐳 Deploy con Docker (Nuovo)

### Prerequisiti
- Docker e Docker Compose installati
- Accesso al database PostgreSQL
- Configurazione Nginx per reverse proxy

### Setup Iniziale
```bash
# 1. Installa Docker (se necessario)
./scripts/install_docker.sh

# 2. Setup completo automatico
./scripts/setup_docker.sh

# 3. Verifica funzionamento
curl http://localhost/health
```

### Comandi Principali
```bash
# Avvio rapido
./scripts/docker_quick_start.sh

# Gestione servizi
docker compose up -d          # Avvia
docker compose down           # Ferma
docker compose restart        # Riavvia
docker compose logs -f        # Log

# Backup e ripristino
./scripts/backup_secrets.sh   # Backup segreti
./scripts/restore_secrets.sh  # Ripristino segreti
```

### Monitoraggio
```bash
# Stato servizi
docker compose ps

# Health checks
curl http://localhost/health

# Log specifici
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

---

## 🔧 Sviluppo Locale

### Prerequisiti
- Node.js 18+
- PostgreSQL 15+
- Docker (opzionale, per test)

### Setup Sviluppo
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Test
```bash
# Test backend
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000
```

---

## 🚨 Emergenze

### Ripristino Rapido
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

### Reset Completo
```bash
# 1. Ferma e rimuovi tutto
docker compose down -v

# 2. Setup da zero
./scripts/setup_docker.sh
```

---

## 📞 Supporto

### Documentazione
- **Guida Docker**: `docs/MANUALE/guida-docker.md`
- **Checklist Operativa**: `docs/SVILUPPO/checklist-docker.md`
- **Strategia Docker**: `docs/SVILUPPO/strategia-docker-active-passive.md`

### Script Utili
- **Setup**: `./scripts/setup_docker.sh`
- **Avvio rapido**: `./scripts/docker_quick_start.sh`
- **Backup**: `./scripts/backup_secrets.sh`
- **Ripristino**: `./scripts/restore_secrets.sh`

---

**🎯 Obiettivo: Ambiente Docker stabile, sicuro e facilmente riproducibile per il gestionale aziendale.**
