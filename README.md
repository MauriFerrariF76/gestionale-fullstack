# Gestionale Fullstack

## 🐳 Containerizzazione e Docker

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

**Password "Intelligenti" e Memorabili:**
- Database: `Carpenteria2024DB_v1`
- JWT: `Carpenteria2024JWT_v1`
- Admin: `Carpenteria2024Admin_v1`
- API: `Carpenteria2024API_v1`
- Master Password: `"La mia officina 2024 ha 3 torni e 2 frese!"`

### Architettura Active-Passive (Resilienza)
- **Server Primario**: Gestisce tutto il traffico normalmente
- **Server Secondario**: In standby, pronto a subentrare in caso di guasto
- **Failover Manuale**: Intervento manuale per attivare il server di riserva
- **Sincronizzazione**: Database replicato in tempo reale tra i due server
- **Backup Segreti**: Segreti Docker sincronizzati tra i server

### Vantaggi della Containerizzazione
- **Ambiente uniforme**: Stessa configurazione ovunque
- **Deploy semplificato**: `docker-compose up -d` per avviare tutto
- **Backup facilitato**: Backup dei volumi Docker e segreti cifrati
- **Scalabilità**: Facile aggiungere più istanze dei servizi
- **Sicurezza**: Gestione centralizzata dei segreti con Docker secrets

---

## 📚 Documentazione

### 📁 Organizzazione della Documentazione

La documentazione è organizzata in tre sezioni principali per facilitare la navigazione:

#### 📖 [MANUALE/](docs/MANUALE/) - Guide Operative e Manuale Utente
**Per operatori, utenti finali e amministratori di sistema**

- **[📖 Manuale Utente](docs/MANUALE/manuale-utente.md)** - Guida pratica per l'utilizzo del gestionale
- **[💾 Guida Backup](docs/MANUALE/guida-backup.md)** - Procedure backup database e configurazioni
- **[🔄 Guida Ripristino Completo](docs/MANUALE/guida-ripristino-completo.md)** - Ripristino completo da zero su nuova macchina
- **[📊 Guida Gestione Log](docs/MANUALE/guida-gestione-log.md)** - Gestione log, rotazione e monitoraggio
- **[📈 Guida Monitoring](docs/MANUALE/guida-monitoring.md)** - Monitoring e logging per container
- **[📝 Guida Documentazione](docs/MANUALE/guida-documentazione.md)** - Come organizzare la documentazione

#### 🛠️ [SVILUPPO/](docs/SVILUPPO/) - Documentazione Tecnica e Checklist
**Per sviluppatori, DevOps e amministratori tecnici**

- **[🔒 Checklist Sicurezza](docs/SVILUPPO/checklist-sicurezza.md)** - Checklist sicurezza deploy e configurazione firewall/Nginx
- **[🚀 Deploy e Architettura](docs/SVILUPPO/deploy-architettura-gestionale.md)** - Guida completa deploy, architettura e checklist operative
- **[🐳 Strategia Docker e Active-Passive](docs/SVILUPPO/strategia-docker-active-passive.md)** - Strategia completa di containerizzazione e resilienza
- **[💾 Strategia Backup e Disaster Recovery](docs/SVILUPPO/strategia-backup-disaster-recovery.md)** - Strategia completa di protezione dati con Active-Passive
- **[📝 Convenzioni Nomenclatura](docs/SVILUPPO/convenzioni-nomenclatura.md)** - Standard di nomenclatura per file, cartelle e codice
- **[🚨 EMERGENZA_PASSWORDS.md](docs/SVILUPPO/EMERGENZA_PASSWORDS.md)** - **CRITICO** - Credenziali di emergenza per accesso al sistema
- **[📋 Checklist Server](docs/SVILUPPO/checklist-server-ubuntu.md)** - Checklist post-installazione server
- **[🛠️ Guida Installazione](docs/SVILUPPO/guida-installazione-server.md)** - Guida installazione/configurazione server

#### 🖥️ [server/](docs/server/) - Script e Configurazioni Operative
**Script attivi, configurazioni e log per il server Ubuntu**

- **[💾 backup_database_adaptive.sh](docs/server/backup_database_adaptive.sh)** - Script backup database adattivo
- **[⚙️ backup_config_server.sh](docs/server/backup_config_server.sh)** - Script backup configurazioni server
- **[📊 backup_weekly_report.sh](docs/server/backup_weekly_report.sh)** - Script report settimanali
- **[🌐 nginx_gestionale.conf](docs/server/nginx_gestionale.conf)** - Configurazione Nginx per il gestionale
- **[🔧 gestionale-backend.service](docs/server/gestionale-backend.service)** - Servizio systemd per il backend
- **[🔧 gestionale-frontend.service](docs/server/gestionale-frontend.service)** - Servizio systemd per il frontend

### 📋 Panoramica Documentazione
- **[docs/README.md](docs/README.md)** - Guida completa alla documentazione e organizzazione

---

## 🖥️ Documentazione Server Ubuntu

### Configurazione e Gestione
- **[docs/SVILUPPO/checklist-server-ubuntu.md](docs/SVILUPPO/checklist-server-ubuntu.md)** - Checklist operativa post-installazione, sicurezza e manutenzione server
- **[docs/SVILUPPO/guida-installazione-server.md](docs/SVILUPPO/guida-installazione-server.md)** - Guida dettagliata installazione/configurazione server

### Gestione Servizi
- **Servizi Systemd**: Backend e frontend gestiti tramite systemd
  ```bash
  sudo systemctl start|stop|restart|status gestionale-backend
  sudo systemctl start|stop|restart|status gestionale-frontend
  ```
- **Nginx**: Gestito come servizio di sistema standard (`sudo systemctl ... nginx`)

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
# 1. Clona il repository
git clone [repository-url]
cd gestionale-fullstack

# 2. Setup segreti Docker
./scripts/setup_secrets.sh

# 3. Avvia l'intera applicazione
docker-compose up -d
```

### Comandi Principali
```bash
# Avvia l'intera applicazione
docker-compose up -d

# Visualizza i log
docker-compose logs -f

# Ferma l'applicazione
docker-compose down

# Ricostruisci i container (dopo modifiche)
docker-compose up -d --build

# Backup segreti
./scripts/backup_secrets.sh

# Ripristino segreti
./scripts/restore_secrets.sh backup_file.tar.gz.gpg
```

### Struttura Docker
```
gestionale-fullstack/
├── docker-compose.yml          # Orchestrazione completa
├── backend/Dockerfile          # Container per API
├── frontend/Dockerfile         # Container per Next.js
├── nginx/Dockerfile            # Container per reverse proxy
├── postgres/Dockerfile         # Container per database
├── secrets/                    # 🔐 Segreti Docker (protetti)
│   ├── db_password.txt
│   ├── jwt_secret.txt
│   ├── admin_password.txt
│   └── api_key.txt
├── scripts/                    # Script di gestione
│   ├── setup_secrets.sh
│   ├── backup_secrets.sh
│   └── restore_secrets.sh
└── .env                       # Variabili d'ambiente (senza password)
```

### Gestione Segreti
```bash
# Lettura segreti nel backend
const getSecret = (secretName) => {
  try {
    return fs.readFileSync(`/run/secrets/${secretName}`, 'utf8').trim();
  } catch (error) {
    return process.env[`${secretName.toUpperCase()}`];
  }
};
```

---

## 🔄 Architettura Active-Passive

### Scenario di Failover
1. **Server Primario attivo**: Gestisce tutto il traffico normalmente
2. **Guasto rilevato**: Monitoraggio automatico o manuale
3. **Intervento manuale**: 
   - Spegnimento primario, accensione secondario
   - Ripristino segreti Docker: `./scripts/restore_secrets.sh backup_file.tar.gz.gpg`
   - Avvio servizi: `docker-compose up -d`
4. **Verifica servizi**: Controllo che tutto funzioni correttamente
5. **Ripristino primario**: Quando possibile, ripristino del server principale

### Sincronizzazione Database
- **Replica PostgreSQL**: Streaming replication tra master e slave
- **Backup automatici**: Su entrambi i server
- **Monitoraggio**: Controllo stato replica in tempo reale
- **Backup segreti**: Backup cifrato dei segreti Docker su entrambi i server

---

## 📋 Best Practice Operative

### Backup
- Verifica che la cartella di backup NAS sia montata con le opzioni `uid=1000,gid=1000,file_mode=0770,dir_mode=0770` in `/etc/fstab`
- Usa lo script `docs/server/backup_config_server.sh` per backup automatici delle configurazioni server
- Escludi sempre la cartella `#recycle` del NAS dal backup (già incluso nello script)
- **Backup volumi Docker**: Backup automatico dei volumi Docker per container
- **Backup segreti**: Backup cifrato dei segreti Docker con `./scripts/backup_secrets.sh`

### Sicurezza
- Aggiorna la documentazione e le checklist ogni volta che cambi la procedura di backup o i permessi NAS
- **Le notifiche email automatiche** (backup, errori, ecc.) sono inviate tramite Gmail SMTP autenticato (porta 587, password per app), a più destinatari separati da virgola
- **Gestione segreti**: Usa sempre Docker secrets per le password, mai variabili d'ambiente
- **Backup cifrato**: Mantieni sempre un backup cifrato dei segreti
- **Documento emergenza**: Mantieni aggiornato il documento cartaceo con le credenziali critiche

### Deploy
- **Procedura validata e funzionante** (luglio 2025)
- Test manuale obbligatorio prima di ogni deploy
- Aggiorna sempre la documentazione dopo modifiche significative
- **Setup segreti**: Esegui sempre `./scripts/setup_secrets.sh` prima del primo deploy

---

**Aggiorna e consulta questi file per tutte le procedure e le best practice!**


