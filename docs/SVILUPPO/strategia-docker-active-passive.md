# 🐳 Strategia Docker e Active-Passive

## Obiettivo
Implementare una soluzione di containerizzazione con Docker per facilitare il deploy e la gestione del gestionale, con architettura Active-Passive per garantire alta disponibilità e resilienza.

---

## 🔐 Gestione Sicura delle Password con Docker

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
      - admin_password
    environment:
      - DB_HOST=postgres
      - DB_NAME=gestionale
      - DB_USER=gestionale_user
    depends_on:
      - postgres

  frontend:
    image: gestionale-frontend
    secrets:
      - api_key
    environment:
      - NEXT_PUBLIC_API_URL=https://gestionale.carpenteriaferrari.com

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

### Struttura File Sicura
```
gestionale-fullstack/
├── docker-compose.yml
├── secrets/                    # 🔐 Cartella protetta
│   ├── db_password.txt
│   └── jwt_secret.txt
├── scripts/
│   ├── setup_secrets.sh       # Script per creare segreti
│   ├── backup_secrets.sh      # Backup cifrato
│   └── restore_secrets.sh     # Ripristino
└── docs/
    └── EMERGENZA_PASSWORDS.md # Documento cartaceo
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

echo "✅ Segreti creati e protetti!"
echo "🔑 Master Password: 'La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo'"
```

### Backup Cifrato dei Segreti
```bash
#!/bin/bash
# backup_secrets.sh - Backup cifrato dei segreti Docker

echo "💾 Backup Segreti Docker"
echo "========================"

# Crea backup cifrato
tar czf secrets_backup_$(date +%F).tar.gz secrets/

# Cifra il backup
gpg --encrypt --recipient admin@carpenteriaferrari.com secrets_backup_$(date +%F).tar.gz

# Rimuovi backup non cifrato
rm secrets_backup_$(date +%F).tar.gz

echo "✅ Backup cifrato creato: secrets_backup_$(date +%F).tar.gz.gpg"
echo "🔑 Master Password: 'La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo'"
```

### Ripristino Segreti
```bash
#!/bin/bash
# restore_secrets.sh - Ripristino segreti Docker

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Specifica il file di backup: ./restore_secrets.sh backup_file.tar.gz.gpg"
    exit 1
fi

echo "🔄 Ripristino Segreti Docker"
echo "============================"

# Decifra il backup
gpg --decrypt $BACKUP_FILE > secrets_restored.tar.gz

# Estrai i segreti
tar xzf secrets_restored.tar.gz

# Imposta permessi sicuri
chmod 600 secrets/*.txt

# Pulisci file temporanei
rm secrets_restored.tar.gz

echo "✅ Segreti ripristinati!"
echo "🚀 Avvia Docker: docker-compose up -d"
```

---

## 🐳 Containerizzazione con Docker

### Vantaggi della Containerizzazione
- **Portabilità**: Stessa applicazione su qualsiasi server (sviluppo, test, produzione)
- **Isolamento**: Ogni servizio in container separato (backend, frontend, database, nginx)
- **Deploy semplificato**: `docker-compose up -d` per avviare tutto
- **Versioning**: Rollback semplice a versioni precedenti
- **Backup facilitato**: Backup dei volumi Docker
- **Scalabilità**: Facile aggiungere più istanze dei servizi
- **Sicurezza**: Gestione centralizzata dei segreti con Docker secrets

### Struttura Docker Proposta
```
gestionale-fullstack/
├── docker-compose.yml          # Orchestrazione completa
├── backend/
│   ├── Dockerfile             # Container per API
│   └── src/config/database.js # Lettura segreti Docker
├── frontend/
│   ├── Dockerfile             # Container per Next.js
│   └── .env.production        # Variabili frontend
├── nginx/
│   ├── Dockerfile             # Container per reverse proxy
│   └── nginx.conf             # Configurazione Nginx
├── postgres/
│   ├── Dockerfile             # Container per database
│   └── init.sql               # Script inizializzazione
├── secrets/                   # 🔐 Segreti Docker
│   ├── db_password.txt
│   ├── jwt_secret.txt
│   ├── admin_password.txt
│   └── api_key.txt
├── scripts/                   # Script di gestione
│   ├── setup_secrets.sh
│   ├── backup_secrets.sh
│   └── restore_secrets.sh
└── .env                       # Variabili globali (senza password)
```

### Comandi Docker Principali
```bash
# Setup iniziale
./scripts/setup_secrets.sh

# Avvia l'intera applicazione
docker-compose up -d

# Visualizza i log
docker-compose logs -f

# Ferma l'applicazione
docker-compose down

# Ricostruisci i container (dopo modifiche)
docker-compose up -d --build

# Backup volumi Docker
docker run --rm -v gestionale_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Backup segreti
./scripts/backup_secrets.sh

# Ripristino segreti
./scripts/restore_secrets.sh backup_file.tar.gz.gpg
```

### Lettura Segreti nel Backend
```javascript
// backend/src/config/database.js
const fs = require('fs');

const getSecret = (secretName) => {
  try {
    return fs.readFileSync(`/run/secrets/${secretName}`, 'utf8').trim();
  } catch (error) {
    // Fallback per sviluppo
    return process.env[`${secretName.toUpperCase()}`];
  }
};

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'gestionale',
  user: process.env.DB_USER || 'gestionale_user',
  password: getSecret('db_password'),
};

module.exports = dbConfig;
```

### Variabili d'Ambiente Docker (Senza Password)
```bash
# .env (NON contiene password - quelle sono in Docker secrets)
DB_HOST=postgres
DB_PORT=5432
DB_NAME=gestionale
DB_USER=gestionale_user
# DB_PASSWORD viene da Docker secrets

NEXT_PUBLIC_API_URL=https://gestionale.carpenteriaferrari.com
NODE_ENV=production

# Configurazione Nginx
NGINX_HOST=gestionale.carpenteriaferrari.com
SSL_CERT_PATH=/etc/letsencrypt/live/gestionale.carpenteriaferrari.com
```

---

## 🔄 Architettura Active-Passive

### Strategia di Resilienza
- **Server Primario**: Gestisce tutto il traffico normalmente
- **Server Secondario**: In standby, pronto a subentrare in caso di guasto
- **Failover Manuale**: Intervento manuale per attivare il server di riserva
- **Sincronizzazione**: Database replicato in tempo reale tra i due server
- **Backup Segreti**: Segreti Docker sincronizzati tra i server

### Scenario di Failover
1. **Monitoraggio**: Controllo automatico o manuale dello stato del server primario
2. **Rilevamento guasto**: Identificazione del problema (hardware, software, rete)
3. **Intervento manuale**: 
   - Spegnimento del server primario
   - Accensione del server secondario
   - Ripristino segreti Docker: `./scripts/restore_secrets.sh backup_file.tar.gz.gpg`
   - Avvio servizi: `docker-compose up -d`
   - Verifica che tutti i servizi siano attivi
4. **Ripristino**: Quando possibile, ripristino del server principale

### Sincronizzazione Database
- **Replica PostgreSQL**: Streaming replication tra master e slave
- **Configurazione replica**:
  ```sql
  -- Sul master (postgresql.conf)
  wal_level = replica
  max_wal_senders = 3
  wal_keep_segments = 64
  
  -- Sul slave (recovery.conf)
  standby_mode = 'on'
  primary_conninfo = 'host=master_ip port=5432 user=replica_user password=replica_password'
  ```

### Backup in Architettura Active-Passive
- **Backup automatici**: Su entrambi i server
- **Backup volumi Docker**: Backup dei volumi Docker per container
- **Backup segreti**: Backup cifrato dei segreti Docker su entrambi i server

---

## 📋 Piano di Implementazione

### Fase 1: Dockerizzazione (Priorità Alta)
- [ ] **Analisi struttura attuale**: Mappatura dei servizi esistenti
- [ ] **Creazione Dockerfile**: Per backend, frontend, nginx, postgres
- [ ] **Docker Compose**: Orchestrazione completa
- [ ] **Test locale**: Verifica funzionamento su pc-mauri-vaio
- [ ] **Deploy test**: Deploy su server di produzione
- [ ] **Documentazione**: Aggiornamento guide operative

### Fase 2: Active-Passive (Futura)
- [ ] **Acquisto secondo server**: Server rackmount identico al primo
- [ ] **Configurazione replica**: PostgreSQL streaming replication
- [ ] **Test failover**: Procedure di switch manuale
- [ ] **Monitoraggio**: Health checks e alert automatici
- [ ] **Documentazione**: Procedure di failover

### Fase 3: Ottimizzazioni (Futura)
- [ ] **Automazione**: Script automatici per failover
- [ ] **Monitoring avanzato**: Prometheus, Grafana
- [ ] **Backup automatizzati**: Backup volumi Docker
- [ ] **CI/CD**: Deploy automatizzato

---

## 🔧 Configurazioni Tecniche

### Docker Compose (docker-compose.yml)
```yaml
version: '3.8'

services:
  postgres:
    build: ./postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - gestionale_network

  backend:
    build: ./backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${POSTGRES_DB}
      DB_USER: ${POSTGRES_USER}
      DB_PASSWORD: ${POSTGRES_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres
    networks:
      - gestionale_network

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL}
    depends_on:
      - backend
    networks:
      - gestionale_network

  nginx:
    build: ./nginx
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
    networks:
      - gestionale_network

volumes:
  postgres_data:

networks:
  gestionale_network:
    driver: bridge
```

### Health Checks
```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## 📊 Monitoraggio e Logging

### Log Centralizzati
```bash
# Visualizza log di tutti i servizi
docker-compose logs -f

# Log di un servizio specifico
docker-compose logs -f backend

# Log con timestamp
docker-compose logs -f --timestamps
```

### Health Checks
```bash
# Verifica stato servizi
docker-compose ps

# Health check manuale
docker-compose exec backend curl -f http://localhost:3001/health
```

### Backup Automatici
```bash
#!/bin/bash
# backup_docker_volumes.sh

DATE=$(date +%F)
BACKUP_DIR="/mnt/backup_gestionale/docker"

mkdir -p $BACKUP_DIR

# Backup volumi Docker
docker run --rm -v gestionale_postgres_data:/data -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/postgres_$DATE.tar.gz -C /data .

# Mantieni solo gli ultimi 7 giorni
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

---

## 🚨 Procedure di Emergenza

### Failover Manuale
```bash
# 1. Verifica stato server primario
docker-compose ps

# 2. Se necessario, spegni server primario
docker-compose down

# 3. Sul server secondario, avvia i servizi
docker-compose up -d

# 4. Verifica che tutto funzioni
docker-compose logs -f
curl https://gestionale.miaazienda.com/api/health

# 5. Promuovi slave a master (se necessario)
# (vedi documentazione PostgreSQL per replica)
```

### Ripristino da Backup
```bash
# 1. Ferma i servizi
docker-compose down

# 2. Ripristina volume PostgreSQL
docker run --rm -v gestionale_postgres_data:/data -v /backup:/backup \
  alpine tar xzf /backup/postgres_YYYY-MM-DD.tar.gz -C /data

# 3. Riavvia i servizi
docker-compose up -d

# 4. Verifica integrità
docker-compose logs -f
```

---

## 📚 Risorse e Riferimenti

### Documentazione Docker
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Volumes](https://docs.docker.com/storage/volumes/)
- [Docker Networks](https://docs.docker.com/network/)

### Documentazione PostgreSQL
- [Streaming Replication](https://www.postgresql.org/docs/current/warm-standby.html)
- [Backup e Restore](https://www.postgresql.org/docs/current/backup.html)

### Best Practice
- [Docker Security](https://docs.docker.com/engine/security/)
- [Container Orchestration](https://kubernetes.io/docs/concepts/overview/)

---

**Aggiorna questo documento ogni volta che implementi nuove funzionalità o cambi la strategia!**