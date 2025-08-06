# Checklist Operativa Unificata - Gestionale Fullstack

## Panoramica
Questa checklist unifica tutte le procedure operative del gestionale, raggruppando per argomenti e eliminando duplicazioni.

**Versione**: 2.0  
**Data**: $(date +%Y-%m-%d)  
**Stato**: ✅ ATTIVA  
**Allineamento**: Guida Definitiva Gestionale Fullstack

---

## 🏗️ ARCHITETTURA E FOUNDATION

### Setup Architetturale
- [x] **PC-MAURI (10.10.10.33)**: Controller centrale
- [x] **pc-mauri-vaio (10.10.10.15)**: Sviluppo nativo
- [x] **gestionale-server (10.10.10.16)**: Produzione Docker
- [x] **Ambiente ibrido**: Sviluppo nativo → Produzione containerizzata
- [x] **Zero downtime**: Deploy senza interruzioni
- [x] **Healthcheck post-deploy**: Verifica automatica post-deploy

### Stack Tecnologico
- [x] **Sviluppo (pc-mauri-vaio)**: Next.js + TypeScript + PostgreSQL nativo
- [x] **Produzione (gestionale-server)**: Docker containers + Nginx reverse proxy
- [x] **Database**: PostgreSQL con Prisma ORM
- [x] **Migrations automatiche**: Via entrypoint.sh
- [x] **Backup automatici**: Giornalieri con retention
- [x] **Rollback immediato**: Procedure testate

---

## 🔒 SICUREZZA E DEPLOY

### Sicurezza Base
- [x] **HTTPS attivo**: Let's Encrypt configurato e funzionante
- [x] **Firewall MikroTik**: Solo porte 80/443 aperte verso server
- [x] **SSH sicuro**: Accessibile solo da IP fidati, porta 65, anti-bruteforce
- [x] **Rate limiting**: Attivo su API sensibili (login/reset password)
- [x] **Audit log**: Funzionante, logga tutte le azioni
- [x] **HSTS**: Strict Transport Security attivo
- [x] **OCSP Stapling**: Configurato in Nginx
- [x] **TLS 1.2+**: Solo TLS 1.2 e superiori, SSLv3/TLS 1.0/1.1 disabilitati
- [x] **Intestazioni sicurezza**: X-Frame-Options, X-Content-Type-Options, CSP
- [x] **HTTP TRACE bloccato**: Protezione da attacchi TRACE/Cross Site Tracing

### Sicurezza SSH (CRITICA)
- [x] **fail2ban**: Installato e configurato
- [x] **Password authentication**: Disabilitata
- [x] **Root login**: Disabilitato
- [x] **SSH key authentication**: Configurata
- [x] **Porta SSH**: 65 (non standard)
- [x] **IP whitelist**: Solo IP fidati

### Sicurezza Avanzata
- [ ] **MFA attivo**: Almeno per admin (implementazione in corso)
- [ ] **Password PostgreSQL**: Utenza app con permessi minimi (no superuser)
- [x] **Aggiornamenti sicurezza**: Patch applicate regolarmente
- [ ] **TTL DNS**: Impostare a 1 ora (3600 secondi) per resilienza

### Automazione Sicurezza
- [x] **Dependabot**: Monitoraggio automatico vulnerabilità (settimanale)
- [x] **Security scan**: npm audit automatico
- [x] **CVE monitoring**: Controllo vulnerabilità note
- [x] **Auto-update**: Aggiornamenti sicurezza automatici

### Aggiornamenti Software
- [x] **Node.js aggiornato**: Da v18.20.8 a v20.19.4 (2025-08-04)
  - Backend: Node.js 20.19.4 attivo
  - Frontend: Node.js 20.19.4 attivo
  - Build testati e funzionanti
  - Performance migliorate
  - Zero errori nei log

### Sicurezza Docker
- [x] **Container non-root**: Tutti i container con utente non-root
- [x] **Secrets management**: Password e chiavi in Docker secrets
- [x] **Network isolation**: Container isolati in rete Docker dedicata
- [x] **Volume permissions**: Volumi con permessi corretti (non root)
- [ ] **Image scanning**: Verifica vulnerabilità immagini Docker
- [x] **Resource limits**: Limiti CPU e memoria sui container
- [x] **Health checks**: Configurati per tutti i servizi
- [x] **Logging centralizzato**: Log per tutti i container

---

## 🚀 DEPLOY E WORKFLOW

### Deploy Zero Downtime
- [x] **Script deploy**: `docker compose up -d --build app`
- [x] **Healthcheck post-deploy**: `/opt/scripts/healthcheck-post-deploy.sh`
- [x] **Rollback automatico**: Se healthcheck fallisce
- [x] **Migrations automatiche**: Via entrypoint.sh
- [x] **Verifica deployment**: Logs e health endpoint

### Workflow Sviluppo
- [x] **Sviluppo nativo**: pc-mauri-vaio con PostgreSQL nativo
- [x] **Hot reload**: npm run dev su porta 3000
- [x] **Prisma Studio**: GUI database per sviluppo
- [x] **Version control**: Git con commit regolari
- [x] **Database changes**: Migrations automatiche

### Shortcuts Dev (Makefile)
- [x] **make deploy**: Deploy sicuro con healthcheck
- [x] **make backup**: Backup manuale
- [x] **make rollback**: Rollback rapido
- [x] **make logs**: Visualizzare logs
- [x] **make health**: Health check
- [x] **make restart**: Restart servizi
- [x] **make clean**: Pulizia sistema

---

## 💾 BACKUP E DISASTER RECOVERY

### Backup Principali (NAS)
- [x] **Backup database**: `docs/server/backup_docker_automatic.sh`
  - Frequenza: Giornaliero (02:15)
  - Destinazione: NAS Synology
  - Cifratura: GPG attiva
  - Test restore: Settimanale automatico
- [x] **Backup configurazioni**: `docs/server/backup_config_server.sh`
  - Frequenza: Giornaliero (02:00)
  - Destinazione: NAS Synology
  - Sincronizzazione: rsync con esclusioni
- [x] **Backup segreti**: Chiavi JWT cifrate
- [x] **Report settimanali**: `docs/server/backup_weekly_report_docker.sh`

### Backup Emergenza (Locale)
- [x] **Backup integrato**: `scripts/backup-automatico.sh`
  - Frequenza: Giornaliero (02:00)
  - Git: Sempre salvato localmente
  - Database: Solo se NAS non disponibile
  - Retention: 7 giorni
- [x] **Verifica integrità**: Controllo backup esistenti
- [x] **Spazio disco**: Monitoraggio automatico

### Verifica Backup Mensile (CRITICO)
- [x] **Script verifica**: `/opt/scripts/verify-backup.sh`
- [x] **Cron job**: Mensile automatico
- [x] **Database temporaneo**: Test sicuro dei backup
- [x] **Logging unificato**: Tutti i log in `/var/log/backup-verify.log`
- [x] **Alert automatici**: Notifiche se verifica fallisce

### Disaster Recovery
- [x] **Script restore unificato**: `scripts/restore_unified.sh`
- [x] **Procedure documentate**: `/docs/MANUALE/guida-backup-e-ripristino.md`
- [x] **Test restore**: Settimanale automatico
- [x] **Alert email**: Notifiche errori backup
- [x] **Rollback immediato**: Script di emergenza testato

---

## 📊 MONITORAGGIO E AUTOMAZIONE

### Monitoraggio Base
- [x] **Script monitoraggio**: `scripts/monitoraggio-base.sh`
- [x] **Frequenza**: Ogni 6 ore (02:00, 08:00, 14:00, 20:00)
- [x] **Controlli**:
  - Server online
  - Database connesso
  - Certificato SSL valido
  - Spazio disco
  - Container Docker attivi
- [x] **Alert automatici**: Log e notifiche problemi

### Healthcheck Post-Deploy (ESSENZIALE)
- [x] **Script healthcheck**: `/opt/scripts/healthcheck-post-deploy.sh`
- [x] **Logging unificato**: `/var/log/healthcheck.log`
- [x] **Rollback automatico**: Se healthcheck fallisce
- [x] **Verifica app**: curl -f http://localhost
- [x] **Verifica database**: pg_isready

### Monitoring Web (Uptime Kuma)
- [x] **Setup Docker**: Container Uptime Kuma
- [x] **Porta**: 3001
- [x] **Persistence**: Volume Docker
- [x] **Accesso**: http://your-server:3001
- [x] **Monitoring visivo**: Interfaccia web per controllo

### Automazione Sicurezza
- [x] **Dependabot**: `.github/dependabot.yml`
  - Monitoraggio vulnerabilità settimanale
  - Solo aggiornamenti di sicurezza
  - Pull Request automatici
- [x] **Cron jobs**: Configurati e attivi
- [x] **Log centralizzati**: Tutti i log in `/backup/`

### Logging Unificato
- [x] **Tutti gli script**: `exec >> /var/log/script.log 2>&1`
- [x] **Backup logs**: `/var/log/backup.log`
- [x] **Healthcheck logs**: `/var/log/healthcheck.log`
- [x] **Rollback logs**: `/var/log/rollback.log`
- [x] **Health check logs**: `/var/log/health-check.log`
- [x] **Backup verify logs**: `/var/log/backup-verify.log`

---

## 🖥️ SERVER E INFRASTRUTTURA

### Configurazione Server
- [x] **Ubuntu Server 22.04 LTS**: Installato e configurato
- [x] **Rete e firewall**: UFW configurato
- [x] **Fuso orario**: Europe/Rome (CEST/CET)
- [x] **Node.js e npm**: Installati
- [x] **PostgreSQL**: Configurato
- [x] **Nginx**: Reverse proxy configurato
- [x] **Certbot**: SSL automatico
- [x] **Servizi systemd**: Configurati

### Gestione Log
- [x] **Logrotate**: Configurato per backup
- [x] **Rotazione automatica**: Log di sistema
- [x] **Compressione**: Log vecchi
- [x] **Retention policy**: 30 giorni
- [x] **Permessi**: 770 per mauri

### Monitoring Server
- [x] **Postfix**: Configurato per email
- [x] **Notifiche email**: Errori backup
- [x] **Gmail SMTP**: Autenticato
- [x] **Report settimanali**: Automatici

---

## 🔧 SCRIPT UTILI

### Backup e Restore
- **Backup segreti**: `scripts/backup_secrets.sh`
- **Backup completo Docker**: `scripts/backup_completo_docker.sh`
- **Backup automatico NAS**: `docs/server/backup_docker_automatic.sh`
- **Restore segreti**: `scripts/restore_secrets.sh`
- **Restore unificato**: `scripts/restore_unified.sh`
- **Verifica backup**: `/opt/scripts/verify-backup.sh`

### Deploy e Healthcheck
- **Healthcheck post-deploy**: `/opt/scripts/healthcheck-post-deploy.sh`
- **Rollback immediato**: `/opt/scripts/rollback.sh`
- **Rollback database**: `/opt/scripts/rollback-db.sh`
- **Backup automatico**: `/opt/scripts/backup-daily.sh`

### Manutenzione
- **Ottimizzazione disco**: `scripts/ottimizza-disco-vm.sh`
- **Setup automazione**: `scripts/setup-automazione.sh`
- **Monitoraggio**: `scripts/monitoraggio-base.sh`

### Deploy e Installazione
- **Installazione completa**: `scripts/install-gestionale-completo.sh`
- **Deploy automatico VM**: `scripts/deploy-vm-automatico.sh`
- **Monitoraggio deploy**: `scripts/monitor-deploy-vm.sh`
- **Test VM clone**: `scripts/test-vm-clone.sh`
- **Ripristino emergenza**: `scripts/ripristino_docker_emergenza.sh`

### Script Aggiornamento Sicuro
- **Test completo**: `scripts/test-aggiornamento-completo.sh` ✅ CORRETTO
- **Rollback automatico**: `scripts/rollback-automatico.sh`
- **Monitoraggio**: `scripts/monitor-aggiornamento.sh` ✅ CORRETTO
- **Test incrementale**: `scripts/test-incrementale.sh`
- **Test rollback**: `scripts/test-rollback.sh`

---

## 📋 NOTE OPERATIVE

### Configurazioni Critiche
- **Server**: Ubuntu Server 22.04 LTS
- **IP Server**: 10.10.10.16 (gestionale-server)
- **IP Sviluppo**: 10.10.10.15 (pc-mauri-vaio)
- **IP Controller**: 10.10.10.33 (PC-MAURI)
- **NAS**: 10.10.10.11 (Synology)
- **Utente**: mauri
- **Fuso orario**: Europe/Rome (CEST/CET)
- **Documentazione**: `/home/mauri/gestionale-fullstack/docs/`

### Credenziali di Emergenza
- **File protetto**: `sudo cat /root/emergenza-passwords.md`
- **Permessi**: 600 (solo root)
- **Backup**: Incluso nei backup automatici

### Interventi Solo Se
- 🔴 **Vulnerabilità critica**: Applica aggiornamenti Dependabot
- 🔴 **Server down**: Riavvia servizi
- 🔴 **Database offline**: Riavvia container PostgreSQL
- 🔴 **SSL scaduto**: Rinnova certificato Let's Encrypt
- 🔴 **Spazio disco pieno**: Pulisci backup vecchi
- 🔴 **NAS non disponibile**: Verifica connessione NAS
- 🔴 **Healthcheck fallito**: Trigger rollback automatico
- 🔴 **Backup verification fallita**: Controlla integrità backup

---

## 📊 STATO ATTUALE

### ✅ Completato (Priorità Alta)
- **Architettura foundation**: Setup completo e funzionante
- **Zero downtime deploy**: Implementato e testato
- **Healthcheck post-deploy**: Automatico con rollback
- **Backup verification**: Test mensili automatici
- **SSH security**: fail2ban + no password auth
- **Logging unificato**: Tutti gli script con logging centralizzato
- **Shortcuts dev**: Makefile con operazioni comuni
- **Monitoring web**: Uptime Kuma configurato
- **Sicurezza base**: HTTPS, firewall, rate limiting
- **Backup principali**: NAS + locale con cifratura
- **Disaster recovery**: Procedure testate
- **Ambiente sviluppo nativo**: pc-mauri-vaio funzionante

### 🔄 In Corso (Priorità Media)
- **MFA per admin**: Implementazione in corso
- **Password PostgreSQL sicure**: Utenza app con permessi minimi
- **Image scanning Docker**: Verifica vulnerabilità immagini
- **TTL DNS**: Impostare a 1 ora per resilienza

### 📝 Da Implementare (Priorità Bassa)
- **Monitoring avanzato**: Prometheus/Grafana
- **Rate limiting aggressivo**: Protezione avanzata API
- **WAF**: Web Application Firewall
- **Intrusion detection**: Sistema di rilevamento intrusioni
- **High availability**: Load balancer per ridondanza
- **Database clustering**: Replicazione database
- **Backup cross-site**: Backup automatico su siti multipli
- **CI/CD Pipeline**: GitHub Actions per deploy automatico

### ✅ Ambiente Sviluppo Nativo - IMPLEMENTATO E FUNZIONANTE
- [x] **Documentazione completa**: `docs/SVILUPPO/ambiente-sviluppo-nativo.md`
- [x] **Script setup completo**: `scripts/setup-ambiente-sviluppo.sh` ✅ FUNZIONANTE
- [x] **Script sincronizzazione**: `scripts/sync-dev-to-prod.sh` ✅ FUNZIONANTE
- [x] **Script utilità**: start-sviluppo.sh, stop-sviluppo.sh, backup-sviluppo.sh ✅ CREATI
- [x] **Configurazioni**: PostgreSQL nativo, Backend nativo, Frontend nativo ✅ FUNZIONANTI
- [x] **Workflow sviluppo**: Ambiente ibrido (sviluppo nativo + produzione containerizzata) ✅ ATTIVO
- [x] **Target**: pc-mauri-vaio (10.10.10.15) - TUTTO NATIVO ✅ IMPLEMENTATO
- [x] **Porte**: PostgreSQL 5432, Backend 3001, Frontend 3000 ✅ ATTIVE
- [x] **Database**: gestionale (STESSO per sviluppo e produzione) ✅ CONFIGURATO
- [x] **Architettura**: Sviluppo nativo → Produzione containerizzata ✅ FUNZIONANTE
- [x] **Test completati**: Backend OK, Frontend OK, Database OK ✅ VERIFICATO

---

## 🎯 PRIORITÀ IMPLEMENTAZIONE

### Weekend 1: Foundation Setup (CRITICO)
- [x] Docker compose configuration
- [x] Prisma setup e first migration
- [x] Backup scripts creation
- [x] Health check scripts
- [x] First production deploy
- [x] Test rollback procedure
- [x] Configure SSH security (fail2ban, no password auth)
- [x] Setup logging unificato per tutti gli script
- [x] Create Makefile con shortcuts

### Settimana 2-4: Stabilizzazione
- [x] Multiple deploys per validation
- [x] Backup strategy refinement
- [x] Monitoring setup completion
- [x] Documentation creation
- [x] Troubleshooting guide completion
- [x] Setup Uptime Kuma per monitoring web
- [x] Test verifica backup mensile
- [x] Refine healthcheck post-deploy

### Mese 2+: Ottimizzazione (Se necessario)
- [ ] CI/CD automation (GitHub Actions)
- [ ] SSL automation (Let's Encrypt)
- [ ] Advanced monitoring (Grafana/Prometheus)
- [ ] VM test environment setup

---

**Nota**: Questa checklist è allineata con la Guida Definitiva Gestionale Fullstack e include tutte le migliorie per garantire un deployment professionale ma manageable da sviluppatore part-time. 