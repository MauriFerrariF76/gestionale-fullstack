# Documentazione Gestionale Fullstack

## Panoramica

Questo gestionale web aziendale gestisce clienti, fornitori, commesse, dipendenti e documenti, accessibile sia da LAN che da remoto tramite dominio pubblico e HTTPS.

## Struttura Documentazione

### 📁 `/docs/SVILUPPO/` - Materiale di Sviluppo
- **Architettura e configurazioni**: `architettura-e-docker.md`
- **Checklist operative**: `checklist-*.md`
- **Automazione**: `automazione.md`, `checklist-automazione.md`
- **Configurazioni server**: `configurazione-*.md`
- **Analisi e troubleshooting**: `analisi-*.md`, `emergenza-*.md`

### 📁 `/docs/MANUALE/` - Guide e Manuali
- **Manuale utente**: `manuale-utente.md`
- **Guide operative**: `guida-*.md`
- **Procedure backup**: `guida-backup-e-ripristino.md`
- **Deploy**: `guida-deploy-automatico-produzione.md`

### 📁 `/docs/server/` - Configurazioni Server
- **Script di backup**: `backup_*.sh`
- **Configurazioni nginx**: `*.conf`
- **Log e report**: `*.log`

## Tecnologie Utilizzate

- **Backend**: Node.js/Express con autenticazione JWT
- **Frontend**: Next.js/React con gestione ruoli
- **Database**: PostgreSQL
- **Reverse Proxy**: Nginx con HTTPS
- **Infrastruttura**: Docker, MikroTik, Let's Encrypt

## Automazione e Sicurezza

### 🔒 Automazione Essenziale
- **Dependabot**: Monitoraggio vulnerabilità automatico
- **Backup integrati**: NAS + locale di emergenza
- **Monitoraggio continuo**: Server, database, SSL
- **Manutenzione quasi zero**: Sistema automatizzato

**Documentazione**: `/docs/SVILUPPO/AUTOMAZIONE.md`

### 📋 Checklist Operative
- **Sicurezza**: `/docs/SVILUPPO/checklist-sicurezza.md`
- **Server**: `/docs/SVILUPPO/checklist-server-ubuntu.md`
- **Automazione**: `/docs/SVILUPPO/checklist-automazione.md`
- **Problemi critici**: `/docs/SVILUPPO/checklist-problemi-critici.md`

## Accesso e Deploy

### 🌐 Accesso Produzione
- **URL**: https://tuodominio.com
- **HTTPS**: Certificati Let's Encrypt automatici
- **Firewall**: MikroTik con regole specifiche

### 🚀 Deploy
- **Automatico**: Docker Compose
- **Backup**: NAS Synology + locale
- **Monitoraggio**: Script automatici

## Manutenzione

### Controlli Periodici
1. **Sicurezza**: Verifica vulnerabilità Dependabot
2. **Backup**: Controllo log backup NAS e locale
3. **Monitoraggio**: Verifica alert automatici
4. **Spazio disco**: Controllo utilizzo

### Interventi Solo Se
- 🔴 Vulnerabilità critica
- 🔴 Server down
- 🔴 Database offline
- 🔴 SSL scaduto
- 🔴 Spazio disco pieno

## Documentazione Principale

### 🛠️ Sviluppo
- **Architettura**: `/docs/SVILUPPO/architettura-e-docker.md`
- **Automazione**: `/docs/SVILUPPO/automazione.md`
- **Sicurezza**: `/docs/SVILUPPO/checklist-sicurezza.md`

### 📖 Manuali
- **Utente**: `/docs/MANUALE/manuale-utente.md`
- **Backup**: `/docs/MANUALE/guida-backup-e-ripristino.md`
- **Deploy**: `/docs/MANUALE/guida-deploy-automatico-produzione.md`

### ⚙️ Server
- **Backup**: `/docs/server/backup_*.sh`
- **Configurazioni**: `/docs/server/*.conf`

---

**Nota**: Tutta la documentazione segue le convenzioni del progetto. Il materiale di sviluppo è in `/docs/SVILUPPO/`, le guide in `/docs/MANUALE/`.