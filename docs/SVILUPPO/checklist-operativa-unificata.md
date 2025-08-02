# Checklist Operativa Unificata - Gestionale Fullstack

## Panoramica
Questa checklist unifica tutte le procedure operative del gestionale, raggruppando per argomenti e eliminando duplicazioni.

**Versione**: 1.0  
**Data**: $(date +%Y-%m-%d)  
**Stato**: ✅ ATTIVA  

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

### Sicurezza Avanzata
- [ ] **MFA attivo**: Almeno per admin (implementazione in corso)
- [ ] **Password PostgreSQL**: Utenza app con permessi minimi (no superuser)
- [ ] **Aggiornamenti sicurezza**: Patch applicate regolarmente
- [ ] **TTL DNS**: Impostare a 1 ora (3600 secondi) per resilienza

### Sicurezza Docker
- [ ] **Container non-root**: Tutti i container con utente non-root
- [ ] **Secrets management**: Password e chiavi in Docker secrets
- [ ] **Network isolation**: Container isolati in rete Docker dedicata
- [ ] **Volume permissions**: Volumi con permessi corretti (non root)
- [ ] **Image scanning**: Verifica vulnerabilità immagini Docker
- [ ] **Resource limits**: Limiti CPU e memoria sui container
- [ ] **Health checks**: Configurati per tutti i servizi
- [ ] **Logging centralizzato**: Log per tutti i container

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

### Disaster Recovery
- [x] **Script restore unificato**: `scripts/restore_unified.sh`
- [x] **Procedure documentate**: `/docs/MANUALE/guida-backup-e-ripristino.md`
- [x] **Test restore**: Settimanale automatico
- [x] **Alert email**: Notifiche errori backup

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

### Automazione Sicurezza
- [x] **Dependabot**: `.github/dependabot.yml`
  - Monitoraggio vulnerabilità settimanale
  - Solo aggiornamenti di sicurezza
  - Pull Request automatici
- [x] **Cron jobs**: Configurati e attivi
- [x] **Log centralizzati**: Tutti i log in `/backup/`

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

## 🚀 DEPLOY E MANUTENZIONE

### Deploy Automatico
- [x] **Script deploy**: Automatizzato
- [x] **Docker Compose**: Orchestrazione container
- [x] **Nginx reverse proxy**: Configurato
- [x] **SSL con Let's Encrypt**: Automatico

### Manutenzione Periodica
- [ ] **Aggiornamento pacchetti**: Sistema (mensile)
- [ ] **Verifica spazio disco**: Settimanale
- [ ] **Controllo log errori**: Giornaliero
- [ ] **Test restore**: Mensile

---

## 🔧 SCRIPT UTILI

### Backup e Restore
- **Backup segreti**: `scripts/backup_secrets.sh`
- **Backup completo Docker**: `scripts/backup_completo_docker.sh`
- **Backup automatico NAS**: `docs/server/backup_docker_automatic.sh`
- **Restore segreti**: `scripts/restore_secrets.sh`
- **Restore unificato**: `scripts/restore_unified.sh`

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

---

## 📋 NOTE OPERATIVE

### Configurazioni Critiche
- **Server**: Ubuntu Server 22.04 LTS
- **IP Server**: 10.10.10.15
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

---

## 📊 STATO ATTUALE

### ✅ Completato
- Sicurezza base e avanzata
- Backup principali e emergenza
- Monitoraggio e automazione
- Configurazione server
- Deploy automatico

### 🔄 In Corso
- MFA per admin
- Password PostgreSQL sicure
- Container non-root
- Aggiornamenti sicurezza

### 📝 Da Implementare
- Image scanning Docker
- Resource limits container
- Health checks avanzati
- Logging centralizzato

---

**Nota**: Questa checklist unifica le precedenti `checklist-sicurezza.md`, `checklist-server-ubuntu.md`, `checklist-problemi-critici.md` e `checklist-automazione.md`, eliminando duplicazioni e migliorando la manutenibilità. 