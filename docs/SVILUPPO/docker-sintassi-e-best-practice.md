# 🐳 Docker: Sintassi e Best Practice - Gestionale Fullstack

## 📋 Indice
- [1. Sintassi Docker Compose V2](#1-sintassi-docker-compose-v2)
- [2. Configurazione Corretta](#2-configurazione-corretta)
- [3. Best Practice](#3-best-practice)
- [4. Troubleshooting](#4-troubleshooting)
- [5. Aggiornamenti e Manutenzione](#5-aggiornamenti-e-manutenzione)

---

## 1. Sintassi Docker Compose V2

### ✅ Sintassi Corretta (V2) - OBBLIGATORIA

```bash
# Comandi principali
docker compose up -d
docker compose down
docker compose ps
docker compose logs -f
docker compose restart
docker compose exec postgres psql -U user -d db
docker compose build --no-cache

# Backup e restore
docker compose exec postgres pg_dump -U gestionale_user gestionale > backup.sql
docker compose exec -T postgres psql -U gestionale_user gestionale < backup.sql
```

### ❌ Sintassi Deprecata (V1) - NON USARE

```bash
# DEPRECATO - NON USARE
docker-compose up -d
docker-compose down
docker-compose ps
docker-compose logs -f
docker-compose restart
docker-compose exec postgres psql -U user -d db
docker-compose build --no-cache
```

### 🚨 Regola Tassativa
- **SEMPRE usare `docker compose` (senza trattino)**
- **NON usare mai `docker-compose` (con trattino)**
- **Controllo obbligatorio** prima di ogni commit
- **Aggiornamento retroattivo** di tutti i file esistenti

---

## 2. Configurazione Corretta

### 📄 docker-compose.yml (Versione Corretta)

```yaml
# Docker Compose per Gestionale Fullstack
# Versione: 2.0 (Docker Compose V2)
# Descrizione: Orchestrazione completa di backend, frontend, database e nginx
# Sintassi: docker compose (senza trattino)
# IMPORTANTE: Usare sempre 'docker compose' (senza trattino)

services:
  # Database PostgreSQL - Database Docker isolato
  postgres:
    image: postgres:15-alpine
    container_name: gestionale_postgres
    restart: unless-stopped
    ports:
      - "5433:5432"  # Espone PostgreSQL per pgAdmin (porta 5433 esterna)
    environment:
      POSTGRES_DB: gestionale
      POSTGRES_USER: gestionale_user
      POSTGRES_PASSWORD: gestionale2025
      POSTGRES_HOST_AUTH_METHOD: trust
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init:/docker-entrypoint-initdb.d:ro
    networks:
      - gestionale_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U gestionale_user -d gestionale"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: gestionale_backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: gestionale
      DB_USER: gestionale_user
      PORT: 3001
    secrets:
      - db_password
      - jwt_secret
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - gestionale_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  # Frontend Next.js
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: gestionale_frontend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_BASE_URL: http://localhost/api
      NEXT_TELEMETRY_DISABLED: 1
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - gestionale_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: gestionale_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx-ssl.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      frontend:
        condition: service_healthy
      backend:
        condition: service_healthy
    networks:
      - gestionale_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

# Segreti Docker (gestione sicura password)
secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt

# Volumi persistenti
volumes:
  postgres_data:
    driver: local

# Rete isolata per i container
networks:
  gestionale_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### 🔧 Elementi Deprecati Rimossi

#### ❌ Rimosso: `version: '3.8'`
- **Motivo**: Deprecato in Docker Compose V2
- **Soluzione**: Rimuovere completamente la riga `version`
- **Risultato**: Configurazione più pulita e moderna

#### ✅ Aggiunto: Commenti Esplicativi
- **Versione**: Documentata nei commenti
- **Descrizione**: Scopo del file
- **Sintassi**: Specificata la versione corretta

---

## 3. Best Practice

### 🔒 Sicurezza

#### Container Non-Root
```yaml
# Esempio per container sicuro
services:
  backend:
    # ... altre configurazioni
    user: "1000:1000"  # Non root user
    security_opt:
      - no-new-privileges:true
```

#### Resource Limits
```yaml
services:
  backend:
    # ... altre configurazioni
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

#### Network Isolation
```yaml
networks:
  gestionale_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
    driver_opts:
      com.docker.network.bridge.name: gestionale_br0
```

### 📊 Health Checks

#### PostgreSQL
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U gestionale_user -d gestionale"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s
```

#### Backend API
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s
```

#### Frontend
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s
```

### 🔐 Secrets Management

#### Configurazione Sicura
```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

#### Uso nei Servizi
```yaml
services:
  backend:
    # ... altre configurazioni
    secrets:
      - db_password
      - jwt_secret
```

### 💾 Volumi Persistenti

#### Database
```yaml
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /opt/gestionale/postgres_data
```

#### Backup Volumi
```bash
# Backup volume PostgreSQL
docker run --rm -v gestionale_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore volume PostgreSQL
docker run --rm -v gestionale_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

---

## 4. Troubleshooting

### 🚨 Problemi Comuni

#### Container Non Si Avvia
```bash
# Verifica log
docker compose logs postgres

# Verifica configurazione
docker compose config

# Riavvia con rebuild
docker compose up -d --build
```

#### Problemi di Rete
```bash
# Verifica rete
docker network ls
docker network inspect gestionale_network

# Ricrea rete
docker compose down
docker network prune
docker compose up -d
```

#### Problemi di Permessi
```bash
# Verifica permessi volumi
ls -la /opt/gestionale/postgres_data

# Correggi permessi
sudo chown -R 999:999 /opt/gestionale/postgres_data
```

### 🔧 Comandi di Debug

#### Stato Servizi
```bash
# Stato generale
docker compose ps

# Log specifici
docker compose logs -f postgres
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
```

#### Accesso Container
```bash
# Accesso PostgreSQL
docker compose exec postgres psql -U gestionale_user -d gestionale

# Accesso Backend
docker compose exec backend sh

# Accesso Frontend
docker compose exec frontend sh
```

#### Backup e Restore
```bash
# Backup database
docker compose exec postgres pg_dump -U gestionale_user gestionale > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker compose exec -T postgres psql -U gestionale_user gestionale < backup_file.sql
```

---

## 5. Aggiornamenti e Manutenzione

### 🔄 Aggiornamento Docker

#### Verifica Versione
```bash
# Verifica versione Docker
docker --version
docker compose version

# Verifica versione Docker Compose
docker compose version
```

#### Aggiornamento Sistema
```bash
# Aggiorna Docker
sudo apt update
sudo apt upgrade docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verifica installazione
docker --version
docker compose version
```

### 🧹 Pulizia Sistema

#### Rimozione Container Non Utilizzati
```bash
# Rimuovi container fermati
docker container prune

# Rimuovi immagini non utilizzate
docker image prune

# Rimuovi volumi non utilizzati
docker volume prune

# Pulizia completa (ATTENZIONE!)
docker system prune -a
```

#### Monitoraggio Spazio
```bash
# Verifica spazio utilizzato
docker system df

# Verifica volumi
docker volume ls
docker volume inspect postgres_data
```

### 📊 Performance

#### Ottimizzazione Build
```bash
# Build con cache
docker compose build --no-cache

# Build parallelo
docker compose build --parallel

# Build specifico servizio
docker compose build backend
```

#### Monitoraggio Risorse
```bash
# Statistiche container
docker stats

# Statistiche specifiche
docker stats gestionale_postgres gestionale_backend gestionale_frontend
```

---

## 📋 Checklist Controllo Qualità

### ✅ Pre-Commit
- [ ] **Sintassi Docker**: Tutti i file usano `docker compose` (senza trattino)
- [ ] **Configurazione**: `docker-compose.yml` senza `version` deprecato
- [ ] **Health checks**: Configurati per tutti i servizi
- [ ] **Resource limits**: Impostati per container critici
- [ ] **Secrets**: Configurati correttamente
- [ ] **Volumi**: Permessi corretti

### ✅ Post-Deploy
- [ ] **Container attivi**: Tutti i servizi in stato "Up"
- [ ] **Health checks**: Tutti i check passano
- [ ] **Log puliti**: Nessun errore critico
- [ ] **Performance**: Tempi di risposta normali
- [ ] **Backup**: Backup automatici funzionanti

### ✅ Manutenzione Settimanale
- [ ] **Aggiornamenti**: Docker e immagini aggiornati
- [ ] **Pulizia**: Container e immagini non utilizzati rimossi
- [ ] **Log**: Log ruotati e compressi
- [ ] **Sicurezza**: Scan vulnerabilità eseguito
- [ ] **Backup**: Test restore eseguito

---

## 🎯 Note Importanti

### 🚨 Regole Obbligatorie
1. **SEMPRE usare `docker compose` (senza trattino)**
2. **NON usare mai `docker-compose` (con trattino)**
3. **Controllo obbligatorio** prima di ogni commit
4. **Documentazione sempre aggiornata**

### 📚 Risorse
- **Documentazione Docker**: https://docs.docker.com/
- **Docker Compose V2**: https://docs.docker.com/compose/
- **Best Practice**: https://docs.docker.com/develop/dev-best-practices/

### 🔧 Supporto
- **Log Docker**: `docker compose logs -f`
- **Debug**: `docker compose exec service_name sh`
- **Configurazione**: `docker compose config` 