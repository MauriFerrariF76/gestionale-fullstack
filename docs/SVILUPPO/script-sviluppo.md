# Script di Sviluppo - Gestionale Fullstack

## Panoramica

Questi script gestiscono l'ambiente di sviluppo nativo per il progetto gestionale-fullstack, risolvendo i problemi di configurazione e gestione del database PostgreSQL.

## Script Disponibili

### 1. `start-sviluppo.sh` - Avvio Ambiente Sviluppo

**Funzionalità:**
- ✅ Avvia PostgreSQL automaticamente
- ✅ Configura utente e database PostgreSQL
- ✅ Avvia backend (Node.js/Express)
- ✅ Avvia frontend (Next.js)
- ✅ Gestione errori completa
- ✅ Monitoraggio processi in tempo reale
- ✅ Output colorato e informativo

**Utilizzo:**
```bash
./scripts/start-sviluppo.sh
```

**Risolve i problemi:**
- ❌ **Errore percorso**: Ora usa percorsi assoluti
- ❌ **Errore npm**: Verifica esistenza package.json
- ❌ **Problema PostgreSQL**: Configurazione automatica utente/database
- ❌ **Gestione errori**: Controlli completi ad ogni step

### 2. `database-setup.sh` - Configurazione Database

**Funzionalità:**
- ✅ Verifica installazione PostgreSQL
- ✅ Avvia PostgreSQL se necessario
- ✅ Crea utente database se non esiste
- ✅ Crea database se non esiste
- ✅ Configura permessi
- ✅ Test connessione

**Utilizzo:**
```bash
./scripts/database-setup.sh
```

**Configurazione automatica:**
- **Database**: `gestionale`
- **Utente**: `gestionale_user`
- **Password**: `gestionale2025`
- **Host**: `localhost:5432`

### 3. `stop-sviluppo.sh` - Fermare Ambiente Sviluppo

**Funzionalità:**
- ✅ Ferma backend (ts-node/node)
- ✅ Ferma frontend (next dev)
- ✅ Ferma processi Node.js rimanenti
- ✅ Opzione per fermare PostgreSQL
- ✅ Gestione pulita dei processi

**Utilizzo:**
```bash
./scripts/stop-sviluppo.sh
```

## Configurazione Backend

Dopo aver eseguito `database-setup.sh`, aggiorna le variabili d'ambiente nel backend:

```env
# backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestionale
DB_USER=gestionale_user
DB_PASSWORD=gestionale2025
```

## Flusso di Lavoro Consigliato

### Prima volta:
1. **Configura database**: `./scripts/database-setup.sh`
2. **Avvia sviluppo**: `./scripts/start-sviluppo.sh`

### Sviluppo quotidiano:
1. **Avvia sviluppo**: `./scripts/start-sviluppo.sh`
2. **Lavora sul progetto**
3. **Ferma sviluppo**: `./scripts/stop-sviluppo.sh`

## Risoluzione Problemi

### PostgreSQL non si avvia
```bash
# Verifica stato
sudo systemctl status postgresql

# Riavvia se necessario
sudo systemctl restart postgresql
```

### Porte già in uso
```bash
# Verifica processi sulle porte
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :3001
sudo netstat -tlnp | grep :5432

# Ferma processi se necessario
./scripts/stop-sviluppo.sh
```

### Errori di connessione database
```bash
# Ricrea configurazione database
./scripts/database-setup.sh
```

## Output degli Script

### start-sviluppo.sh
```
ℹ️  Avvio ambiente sviluppo NATIVO...
ℹ️  Directory progetto: /home/mauri/gestionale-fullstack
ℹ️  Avvio PostgreSQL...
✅ PostgreSQL avviato
ℹ️  Configurazione database...
✅ Database configurato
ℹ️  Avvio Backend...
✅ Backend avviato (PID: 12345)
ℹ️  Avvio Frontend...
✅ Frontend avviato (PID: 12346)

✅ Ambiente sviluppo NATIVO avviato con successo!

📊 Backend: http://localhost:3001
🎨 Frontend: http://localhost:3000
🗄️  Database: PostgreSQL (localhost:5432)

⚠️  Premi Ctrl+C per fermare tutti i servizi
```

### database-setup.sh
```
ℹ️  Configurazione database PostgreSQL...
✅ PostgreSQL già in esecuzione
ℹ️  Creazione utente database...
✅ Utente gestionale creato
ℹ️  Creazione database...
✅ Database gestionale_db creato
ℹ️  Configurazione permessi...
✅ Permessi configurati
ℹ️  Test connessione database...
✅ Connessione database riuscita

✅ Database configurato con successo!

📊 Database: gestionale
👤 Utente: gestionale_user
🔑 Password: gestionale2025
🌐 Host: localhost:5432

⚠️  Ricorda di aggiornare le variabili d'ambiente nel backend con queste credenziali
```

## Sicurezza

- Le password sono hardcoded per sviluppo locale
- Per produzione, usare variabili d'ambiente
- Gli script usano `sudo` solo quando necessario
- I permessi sono configurati in modo sicuro

## Manutenzione

- Gli script sono auto-documentati
- Ogni funzione ha commenti esplicativi
- Gestione errori robusta
- Output informativo e colorato
- Facile da debuggare e modificare

## Note Tecniche

### Gestione Processi
- Uso di `kill -0` per verificare processi attivi
- Cleanup automatico con `trap`
- Gestione graceful shutdown

### Percorsi
- Uso di percorsi assoluti per evitare errori
- Rilevamento automatico directory progetto
- Verifica esistenza file e directory

### Database
- Creazione condizionale (se non esiste)
- Gestione errori PostgreSQL
- Test connessione automatico 