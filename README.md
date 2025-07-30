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
- Database: `gestionale2025`
- JWT: `GestionaleFerrari2025JWT_UltraSecure_v1!`
- Master Password: `"La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"`

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

### Organizzazione Documenti
La documentazione è organizzata secondo le convenzioni del progetto:

#### **📁 `/docs/SVILUPPO/` - Materiale di Sviluppo**
- **`configurazione-nas.md`** - Configurazione NAS e integrazione backup
- **`strategia-docker-active-passive.md`** - Architettura Docker e Active-Passive
- **`checklist-sicurezza.md`** - Checklist sicurezza e best practice
- **`strategia-backup-disaster-recovery.md`** - Strategia backup e disaster recovery

#### **📁 `/docs/MANUALE/` - Guide e Manuali**
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
```