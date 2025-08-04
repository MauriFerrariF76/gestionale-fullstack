# Documentazione Gestionale Fullstack

## Panoramica

Questo gestionale web aziendale gestisce clienti, fornitori, commesse, dipendenti e documenti, accessibile sia da LAN che da remoto tramite dominio pubblico e HTTPS.

## Struttura Documentazione

### 📁 `/docs/SVILUPPO/` - Materiale di Sviluppo
- **Checklist operativa unificata**: `checklist-operativa-unificata.md` ⭐ **PRINCIPALE**
- **Automazione**: `automazione.md`
- **Architettura**: `architettura-e-docker.md`
- **Configurazioni**: `configurazione-*.md`
- **Emergenza**: `emergenza-passwords.md`
- **Sviluppo**: `convenzioni-nomenclatura.md`
- **Organizzazione**: `README.md` (guida alla cartella)

### 📁 `/docs/MANUALE/` - Guide e Manuali
- **Manuale utente**: `manuale-utente.md`
- **Guide operative**: `guida-*.md`
- **Procedure backup**: `guida-backup-e-ripristino.md`
- **Deploy**: `guida-deploy-automatico-produzione.md`

### 📁 `/docs/server/` - Configurazioni Server
- **Script di backup**: `backup_*.sh`
- **Configurazioni nginx**: `nginx_production.conf`
- **Log e report**: `*.log`

### 📁 `/docs/archivio/` - Materiale Storico
- **File obsoleti**: Configurazioni e script sostituiti
- **Analisi storiche**: Report e analisi completate
- **Versioni precedenti**: Documentazione superata

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

**Documentazione**: `/docs/SVILUPPO/automazione.md`

### 📋 Checklist Operativa
- **Checklist unificata**: `/docs/SVILUPPO/checklist-operativa-unificata.md`
  - Sicurezza e deploy
  - Backup e disaster recovery
  - Monitoraggio e automazione
  - Server e infrastruttura
  - Deploy e manutenzione

## Accesso e Deploy

### 🌐 Accesso Produzione
- **URL**: https://gestionale.carpenteriaferrari.com
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
- **Checklist operativa**: `/docs/SVILUPPO/checklist-operativa-unificata.md`

### 📖 Manuali
- **Utente**: `/docs/MANUALE/manuale-utente.md`
- **Backup**: `/docs/MANUALE/guida-backup-e-ripristino.md`
- **Deploy**: `/docs/MANUALE/guida-deploy-automatico-produzione.md`

### ⚙️ Server
- **Backup**: `/docs/server/backup_*.sh`
- **Configurazioni**: `/docs/server/nginx_production.conf`

---

**Nota**: Tutta la documentazione segue le convenzioni del progetto. Il materiale di sviluppo è in `/docs/SVILUPPO/`, le guide in `/docs/MANUALE/`. I file obsoleti sono stati spostati in `/docs/archivio/`.