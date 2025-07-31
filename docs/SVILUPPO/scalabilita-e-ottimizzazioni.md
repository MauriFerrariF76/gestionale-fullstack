# 📈 Scalabilità e Ottimizzazioni - Gestionale Fullstack

## 📋 Indice
- [1. Introduzione alla scalabilità](#1-introduzione-alla-scalabilità)
- [2. Ottimizzazioni già implementate](#2-ottimizzazioni-già-implementate)
- [3. Strategie future di scalabilità](#3-strategie-future-di-scalabilità)
- [4. Checklist di verifica performance](#4-checklist-di-verifica-performance)
- [5. Note operative](#5-note-operative)

---

## 1. Introduzione alla scalabilità

### Obiettivi
- **Crescita sostenibile**: Supportare l'aumento di utenti e dati senza degradazione delle performance
- **Stabilità**: Mantenere il sistema stabile anche sotto carico elevato
- **Efficienza**: Ottimizzare l'uso delle risorse per ridurre i costi
- **Flessibilità**: Adattarsi facilmente a nuove esigenze aziendali

### Analisi situazione attuale
- **Frontend**: 1% completato
- **Backend**: 1% completato  
- **Database**: Struttura base (10 clienti)
- **Infrastruttura**: Docker configurato, avvio automatico

### Crescita prevista
- **Database**: Da 10 clienti a migliaia di record
- **Frontend**: Da 1 pagina a 50+ pagine/moduli
- **Backend**: Da 1 API a 100+ endpoint
- **Utenti**: Da 1 utente a 50+ utenti simultanei

---

## 2. Ottimizzazioni già implementate

### ✅ Database PostgreSQL Ottimizzato

#### Configurazione Docker Avanzata
```yaml
# Limiti risorse per database grandi
deploy:
  resources:
    limits:
      memory: 2G        # Limite memoria
      cpus: '2.0'       # Limite CPU
    reservations:
      memory: 1G        # Memoria garantita
      cpus: '1.0'       # CPU garantita

# Ottimizzazioni sistema
ulimits:
  nofile:
    soft: 65536         # File descriptors
    hard: 65536
sysctls:
  - kernel.shmmax=268435456    # Shared memory
  - kernel.shmall=2097152
```

#### Configurazione PostgreSQL Ottimizzata
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

### ✅ Caching Redis Implementato

#### Configurazione Redis
```yaml
# Servizio Redis per caching
redis:
  image: redis:7-alpine
  ports:
    - "6380:6379"  # Porta esterna 6380
  command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
  volumes:
    - redis_data:/data
  deploy:
    resources:
      limits:
        memory: 512M
        cpus: '0.5'
      reservations:
        memory: 256M
        cpus: '0.25'
```

#### Configurazione Backend con Redis
```yaml
# Backend ottimizzato
backend:
  environment:
    REDIS_HOST: redis
    REDIS_PORT: 6379
    NODE_OPTIONS: "--max-old-space-size=512"
  depends_on:
    redis:
      condition: service_healthy
```

### ✅ Ottimizzazioni Performance

#### Limiti Risorse per Tutti i Servizi
- **PostgreSQL**: 2GB RAM, 2 CPU cores
- **Backend**: 1GB RAM, 1 CPU core  
- **Redis**: 512MB RAM, 0.5 CPU cores
- **Frontend**: Limiti standard
- **Nginx**: Limiti standard

#### Health Checks Avanzati
```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]  # Redis
  test: ["CMD-SHELL", "pg_isready -U gestionale_user -d gestionale"]  # PostgreSQL
  test: ["CMD", "curl", "-f", "http://localhost:3001/health"]  # Backend
```

### 📊 Risultati Ottenuti

#### Performance Database
- ✅ **Memoria ottimizzata**: 256MB shared_buffers + 1GB effective_cache
- ✅ **Connessioni aumentate**: 200 max_connections
- ✅ **I/O ottimizzato**: 200 effective_io_concurrency
- ✅ **File descriptors**: 65536 per database grandi

#### Caching Implementato
- ✅ **Redis attivo**: Porta 6380, 256MB memoria
- ✅ **Backend connesso**: Variabili ambiente configurate
- ✅ **Persistence**: AOF (Append Only File) abilitato
- ✅ **Memory policy**: LRU per gestione memoria

#### Sistema Stabile
- ✅ **Tutti i container healthy**: 5/5 servizi attivi
- ✅ **Applicazione funzionante**: Health check OK
- ✅ **Redis responsive**: PONG response
- ✅ **Database connesso**: PostgreSQL operativo

---

## 3. Strategie future di scalabilità

### 🎯 Strategia Scalabilità Database

#### Ottimizzazioni PostgreSQL Immediate
```yaml
# docker-compose-optimized.yml
postgres:
  deploy:
    resources:
      limits:
        memory: 4G        # Aumentare per database grandi
        cpus: '4.0'       # Più CPU per query complesse
      reservations:
        memory: 2G        # Memoria garantita
        cpus: '2.0'       # CPU garantita
  ulimits:
    nofile:
      soft: 131072        # Più file descriptors
      hard: 131072
  sysctls:
    - kernel.shmmax=1073741824    # 1GB shared memory
    - kernel.shmall=4194304
```

#### Configurazione PostgreSQL Avanzata
```conf
# postgresql.conf ottimizzato
shared_buffers = 1GB              # 25% RAM (4GB)
effective_cache_size = 3GB         # 75% RAM
work_mem = 16MB                   # Query complesse
maintenance_work_mem = 256MB      # Manutenzione
max_connections = 500             # Più connessioni
random_page_cost = 1.1            # SSD
effective_io_concurrency = 400    # I/O concorrente
checkpoint_completion_target = 0.9
wal_buffers = 16MB
max_wal_size = 2GB
min_wal_size = 1GB
```

#### Strategie per Database Grandi

##### Partizionamento Tabelle
```sql
-- Partizionamento per anno
CREATE TABLE clienti PARTITION OF clienti_master
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Partizionamento per regione
CREATE TABLE clienti_lombardia PARTITION OF clienti_master
FOR VALUES IN ('Lombardia');
```

##### Indici Avanzati
```sql
-- Indici per performance
CREATE INDEX CONCURRENTLY idx_clienti_ragionesociale 
ON clienti("RagioneSocialeC");

CREATE INDEX CONCURRENTLY idx_clienti_telefono_email 
ON clienti("Telefono", "EmailFatturazione");

-- Indici parziali
CREATE INDEX CONCURRENTLY idx_clienti_attivi 
ON clienti("IdCliente") WHERE "AttivoC" = true;

-- Indici GIN per ricerca full-text
CREATE INDEX CONCURRENTLY idx_clienti_ricerca 
ON clienti USING GIN(to_tsvector('italian', "RagioneSocialeC"));
```

#### Architettura Database Scalabile

##### Replica Master-Slave
```yaml
# docker-compose-replica.yml
postgres_master:
  # Database principale per scritture
  ports:
    - "5433:5432"

postgres_slave:
  # Replica per letture
  ports:
    - "5434:5432"
  environment:
    POSTGRES_REPLICATION_MODE: slave
    POSTGRES_REPLICATION_USER: replica_user
```

### 🚀 Strategia Scalabilità Backend

#### Architettura Microservizi

##### Struttura Proposta
```
backend/
├── api-gateway/          # Gateway API
├── auth-service/         # Autenticazione
├── clienti-service/      # Gestione clienti
├── fornitori-service/    # Gestione fornitori
├── commesse-service/     # Gestione commesse
├── documenti-service/    # Gestione documenti
├── reporting-service/    # Report e analytics
└── shared/              # Librerie condivise
```

##### Docker Compose Microservizi
```yaml
# docker-compose-microservices.yml
services:
  api-gateway:
    build: ./backend/api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - auth-service
      - clienti-service

  auth-service:
    build: ./backend/auth-service
    environment:
      DB_HOST: postgres_master
    depends_on:
      - postgres_master

  clienti-service:
    build: ./backend/clienti-service
    environment:
      DB_HOST: postgres_master
      REDIS_HOST: redis
    depends_on:
      - postgres_master
      - redis
```

#### Ottimizzazioni Backend

##### Load Balancing
```yaml
# docker-compose-loadbalancer.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend-1
      - backend-2
      - backend-3

  backend-1:
    build: ./backend
    environment:
      NODE_ENV: production
      INSTANCE_ID: 1

  backend-2:
    build: ./backend
    environment:
      NODE_ENV: production
      INSTANCE_ID: 2

  backend-3:
    build: ./backend
    environment:
      NODE_ENV: production
      INSTANCE_ID: 3
```

##### Caching Avanzato
```javascript
// Redis caching per query frequenti
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

// Cache per lista clienti
async function getClienti(cacheKey = 'clienti_list') {
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const clienti = await db.query('SELECT * FROM clienti WHERE attivo = true');
  await client.setex(cacheKey, 3600, JSON.stringify(clienti)); // 1 ora
  return clienti;
}
```

### 📊 Strategia Scalabilità Frontend

#### Ottimizzazioni Next.js
```javascript
// next.config.js ottimizzato
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
    scrollRestoration: true
  },
  images: {
    domains: ['gestionale.miaazienda.com'],
    formats: ['image/webp', 'image/avif']
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false
}
```

#### Code Splitting e Lazy Loading
```javascript
// Lazy loading per componenti pesanti
const ClientiList = lazy(() => import('./components/ClientiList'));
const DocumentiUpload = lazy(() => import('./components/DocumentiUpload'));

// Suspense per loading states
<Suspense fallback={<LoadingSpinner />}>
  <ClientiList />
</Suspense>
```

---

## 4. Checklist di verifica performance

### ✅ Test Rapido
```bash
# Verifica container
docker-compose ps

# Test applicazione
curl -s https://gestionale.carpenteriaferrari.com/health

# Test Redis
docker-compose exec redis redis-cli ping

# Test database
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT version();"
```

### ✅ Test Performance
```bash
# Monitor risorse
docker stats

# Log container
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f backend
```

### ✅ Checklist Monitoraggio
- [ ] **CPU usage**: Sotto 80% per tutti i servizi
- [ ] **Memory usage**: Sotto 90% per tutti i servizi
- [ ] **Disk I/O**: Monitorare latenza database
- [ ] **Network**: Controllare throughput
- [ ] **Response time**: API sotto 200ms
- [ ] **Error rate**: Sotto 1% delle richieste
- [ ] **Database connections**: Sotto limite max_connections
- [ ] **Cache hit ratio**: Sopra 80% per Redis

### ✅ Test di Carico
```bash
# Test con Apache Bench
ab -n 1000 -c 10 https://gestionale.carpenteriaferrari.com/api/health

# Test con wrk
wrk -t12 -c400 -d30s https://gestionale.carpenteriaferrari.com/api/health
```

---

## 5. Note operative

### 🔧 Comandi di Verifica
```bash
# Verifica performance database
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE schemaname = 'public'
ORDER BY tablename, attname;
"

# Verifica cache Redis
docker-compose exec redis redis-cli info memory

# Verifica connessioni database
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "
SELECT 
  count(*) as active_connections,
  max_conn as max_connections
FROM pg_stat_activity, 
     (SELECT setting::int as max_conn FROM pg_settings WHERE name = 'max_connections') as max_connections;
"
```

### 📈 Metriche da Monitorare
- **Database**: Query performance, connection pool, cache hit ratio
- **Backend**: Response time, error rate, memory usage
- **Frontend**: Page load time, bundle size, cache efficiency
- **Infrastructure**: CPU, memory, disk, network utilization

### 🚨 Alert da Configurare
- **High CPU usage**: > 80% per più di 5 minuti
- **High memory usage**: > 90% per più di 5 minuti
- **Database slow queries**: > 1 secondo
- **High error rate**: > 5% delle richieste
- **Low disk space**: < 10% disponibile

---

**💡 Nota**: Questa documentazione è aggiornata alla versione attuale del gestionale. Per modifiche significative alla strategia di scalabilità, aggiorna questo documento e le relative procedure.