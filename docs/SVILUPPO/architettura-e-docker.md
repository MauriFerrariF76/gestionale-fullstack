# 🐳 Architettura e Docker - Gestionale Fullstack

## 📋 Indice
- [1. Introduzione e obiettivi](#1-introduzione-e-obiettivi)
- [2. Struttura generale del progetto](#2-struttura-generale-del-progetto)
- [3. Architettura Docker](#3-architettura-docker)
- [4. Strategie di resilienza](#4-strategie-di-resilienza)
- [5. Gestione segreti e sicurezza](#5-gestione-segreti-e-sicurezza)
- [6. Checklist di setup e manutenzione](#6-checklist-di-setup-e-manutenzione)
- [7. Best practice di sviluppo](#7-best-practice-di-sviluppo)
- [8. Ottimizzazioni implementate](#8-ottimizzazioni-implementate)
- [9. Note operative e troubleshooting](#9-note-operative-e-troubleshooting)

---

## 1. Introduzione e obiettivi

### Obiettivo Principale
Deploy di frontend (Next.js/React) e backend (Node.js/Express) su Ubuntu Server con accesso LAN e WAN tramite Nginx reverse proxy e sicurezza MikroTik.

**Strategia evoluta**: Containerizzazione con Docker per facilità di deploy e resilienza Active-Passive per alta disponibilità.

### Vantaggi della Containerizzazione
- **Portabilità**: Stessa applicazione su qualsiasi server (sviluppo, test, produzione)
- **Isolamento**: Ogni servizio in container separato (backend, frontend, database, nginx)
- **Deploy semplificato**: `docker compose up -d` per avviare tutto
- **Versioning**: Rollback semplice a versioni precedenti
- **Backup facilitato**: Backup dei volumi Docker

---

## 2. Struttura generale del progetto

### Struttura Docker
```
gestionale-fullstack/
├── docker-compose.yml          # Orchestrazione completa
├── backend/
│   ├── Dockerfile             # Container per API
│   └── .env                   # Variabili backend
├── frontend/
│   ├── Dockerfile             # Container per Next.js
│   └── .env.production        # Variabili frontend
├── nginx/
│   ├── Dockerfile             # Container per reverse proxy
│   └── nginx.conf             # Configurazione Nginx
├── postgres/
│   ├── Dockerfile             # Container per database
│   └── init.sql               # Script inizializzazione
├── secrets/                   # 🔐 Cartella protetta
│   ├── db_password.txt
│   └── jwt_secret.txt
└── .env                       # Variabili globali
```

### Servizi Principali
- **PostgreSQL**: Database relazionale con persistenza su volume Docker
- **Backend**: API RESTful in Node.js/Express con autenticazione JWT
- **Frontend**: Interfaccia Next.js/React con gestione sessione e ruoli
- **Nginx**: Reverse proxy con terminazione HTTPS e rate limiting

---

## 3. Architettura Docker

### Comandi Docker Principali
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

### Variabili d'Ambiente Docker
```bash
# .env
POSTGRES_DB=gestionale
POSTGRES_USER=gestionale_user
POSTGRES_PASSWORD=gestionale2025
NEXT_PUBLIC_API_BASE_URL=https://gestionale.miaazienda.com/api
JWT_SECRET=GestionaleFerrari2025JWT_UltraSecure_v1!
```

### Health Checks
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

## 4. Strategie di resilienza

### Architettura Active-Passive
- **Server Primario**: Gestisce tutto il traffico normalmente
- **Server Secondario**: In standby, pronto a subentrare in caso di guasto
- **Failover Manuale**: Intervento manuale per attivare il server di riserva
- **Sincronizzazione**: Database replicato in tempo reale tra i due server

### Scenario di Failover
1. **Monitoraggio**: Controllo automatico o manuale dello stato del server primario
2. **Rilevamento guasto**: Identificazione del problema (hardware, software, rete)
3. **Intervento manuale**: 
   - Spegnimento del server primario
   - Accensione del server secondario
   - Verifica che tutti i servizi siano attivi

---

## 5. Gestione segreti e sicurezza

### Docker Secrets (Raccomandato)
Docker fornisce un sistema nativo per la gestione sicura dei segreti:

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    image: gestionale-backend
    secrets:
      - db_password
      - jwt_secret
    environment:
      - DB_HOST=postgres
      - DB_NAME=gestionale
      - DB_USER=gestionale_user
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    secrets:
      - db_password
    environment:
      - POSTGRES_DB=gestionale
      - POSTGRES_USER=gestionale_user
    volumes:
      - postgres_data:/var/lib/postgresql/data

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt

volumes:
  postgres_data:
```

### Password "Intelligenti" e Memorabili
```bash
# Pattern: [AZIENDA][ANNO][SERVIZIO]_v1
Database: gestionale2025
JWT: GestionaleFerrari2025JWT_UltraSecure_v1!

# Master Password per Bitwarden (se usato)
"La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"
```

### Script di Setup Segreti
```bash
#!/bin/bash
# setup_secrets.sh - Crea i segreti Docker

echo "🔐 Setup Segreti Docker Gestionale"
echo "=================================="

# Crea cartella secrets se non esiste
mkdir -p secrets

# Genera password sicure ma memorabili
echo "gestionale2025" > secrets/db_password.txt
echo "GestionaleFerrari2025JWT_UltraSecure_v1!" > secrets/jwt_secret.txt

# Imposta permessi sicuri (solo root può leggere)
chmod 600 secrets/*.txt
```

---

## 6. Checklist di setup e manutenzione

### ✅ Fase 1: Setup Iniziale
- [x] **Docker installato** - Verifica con `docker --version` ✅
- [x] **Docker Compose installato** - Verifica con `docker compose version` ✅
- [x] **File Dockerfile creati** - Backend, Frontend ✅
- [x] **docker-compose.yml configurato** - Orchestrazione completa ✅
- [x] **Configurazione Nginx** - Reverse proxy funzionante ✅
- [x] **Segreti Docker** - Password sicure configurate ✅
- [x] **Script di setup** - `setup_docker.sh` funzionante ✅
- [x] **Servizio systemd** - Avvio automatico configurato ✅

### ✅ Fase 2: Test e Verifica
- [x] **Build immagini** - `docker compose build` senza errori ✅
- [x] **Avvio servizi** - `docker compose up -d` funzionante ✅
- [x] **Health checks** - Tutti i servizi in stato "healthy" ✅
- [x] **Accesso frontend** - http://localhost funzionante ✅
- [x] **Accesso API** - http://localhost/api funzionante ✅
- [x] **Health endpoint** - http://localhost/health risponde ✅
- [x] **Database connesso** - PostgreSQL accessibile ✅
- [x] **Log centralizzati** - Log di tutti i servizi visibili ✅

### ✅ Fase 3: Sicurezza e Ottimizzazione
- [x] **Segreti protetti** - Permessi 600 su secrets/ ✅
- [x] **Container non-root** - Utenti non-root configurati ✅
- [x] **Rete isolata** - Rete Docker isolata ✅
- [x] **Rate limiting** - Nginx configurato ✅
- [x] **SSL/HTTPS** - Certificati configurati ✅
- [x] **Backup automatici** - Script backup funzionanti ✅
- [x] **Documentazione** - Guide aggiornate ✅

### 🔧 Checklist Manutenzione Quotidiana

#### Verifica Stato Servizi
- [x] **Controllo stato** - `docker compose ps` ✅
- [x] **Health checks** - Tutti i servizi "Up" ✅
- [x] **Log recenti** - `docker compose logs --tail=50` ✅
- [x] **Risorse sistema** - `docker stats` ✅
- [x] **Spazio disco** - `df -h` e `docker system df` ✅

#### Backup e Sicurezza
- [x] **Backup segreti** - `./scripts/backup_secrets.sh` ✅
- [x] **Backup database** - Export dati PostgreSQL ✅
- [x] **Verifica permessi** - `ls -la secrets/` ✅
- [x] **Aggiornamento immagini** - Check nuove versioni ✅
- [x] **Pulizia sistema** - `docker system prune` ✅

---

## 7. Best practice di sviluppo

### Sicurezza
- **Container non-root**: Tutti i container eseguiti con utente non-root
- **Secrets management**: Password e chiavi in Docker secrets o variabili d'ambiente sicure
- **Network isolation**: Container isolati in rete Docker dedicata
- **Volume permissions**: Volumi Docker con permessi corretti (non root)
- **Image scanning**: Verifica vulnerabilità nelle immagini Docker
- **Resource limits**: Limiti di CPU e memoria sui container
- **Health checks**: Health check configurati per tutti i servizi
- **Logging**: Log centralizzati per tutti i container

### Best Practice Docker Security
```bash
# Container con utente non-root
USER node  # nel Dockerfile

# Resource limits in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

# Health checks
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Sicurezza Volumi Docker
```bash
# Backup sicuro volumi Docker
docker run --rm -v gestionale_postgres_data:/data -v /mnt/backup_gestionale:/backup \
  -e PGPASSWORD=password alpine tar czf /backup/postgres_$(date +%F).tar.gz -C /data .

# Verifica permessi volumi
docker run --rm -v gestionale_postgres_data:/data alpine ls -la /data
```

---

## 8. Ottimizzazioni implementate

### Configurazione Database PostgreSQL Ottimizzata
```conf
# postgresql.conf ottimizzato
shared_buffers = 256MB              # 25% RAM
effective_cache_size = 1GB           # 75% RAM
work_mem = 4MB                      # Query complesse
maintenance_work_mem = 64MB         # Manutenzione
max_connections = 200               # Connessioni
random_page_cost = 1.1              # SSD
effective_io_concurrency = 200      # I/O concorrente
```

### Limiti Risorse per Tutti i Servizi
- **PostgreSQL**: 2GB RAM, 2 CPU cores
- **Backend**: 1GB RAM, 1 CPU core  
- **Redis**: 512MB RAM, 0.5 CPU cores
- **Frontend**: Limiti standard
- **Nginx**: Limiti standard

### Health Checks Avanzati
```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]  # Redis
  test: ["CMD-SHELL", "pg_isready -U gestionale_user -d gestionale"]  # PostgreSQL
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]  # Backend
```

---

## 9. Note operative e troubleshooting

### 🚨 Checklist Emergenze

#### Problemi di Avvio
- [x] **Verifica Docker** - `docker info` ✅
- [x] **Verifica porte** - `netstat -tlnp | grep :80` ✅
- [x] **Controllo segreti** - `ls -la secrets/` ✅
- [x] **Log dettagliati** - `docker compose logs` ✅
- [x] **Reset completo** - `docker compose down -v && docker compose up -d` ✅

#### Problemi Database
- [x] **Test connessione** - `docker compose exec postgres pg_isready` ✅
- [x] **Verifica credenziali** - Controllo segreti ✅
- [x] **Ripristino backup** - Restore database ✅
- [x] **Riavvio database** - `docker compose restart postgres` ✅
- [x] **Check volumi** - `docker volume ls` ✅

#### Problemi Frontend/Backend
- [x] **Test endpoint** - `curl http://localhost/health` ✅
- [x] **Rebuild servizi** - `docker compose up -d --build` ✅
- [x] **Controllo log** - `docker compose logs -f [service]` ✅

### Comandi Utili per Troubleshooting
```bash
# Verifica stato servizi
docker compose ps

# Log di un servizio specifico
docker compose logs -f backend

# Entrare in un container
docker compose exec postgres bash

# Verifica volumi
docker volume ls

# Pulizia sistema
docker system prune -a

# Backup rapido
docker run --rm -v gestionale_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

---

**💡 Nota**: Questa documentazione è aggiornata alla versione attuale del gestionale. Per modifiche significative all'architettura, aggiorna questo documento e le relative checklist.