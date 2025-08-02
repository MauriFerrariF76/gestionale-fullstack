# Checklist Server Ubuntu - Gestionale Fullstack

## ✅ Configurazione iniziale
- [x] Installazione Ubuntu Server
- [x] Configurazione rete e firewall
- [x] Configurazione fuso orario (Europe/Rome - CEST/CET)
- [x] Installazione Node.js e npm
- [x] Installazione PostgreSQL
- [x] Configurazione Nginx
- [x] Installazione Certbot per SSL
- [x] Configurazione servizi systemd

## ✅ Sicurezza
- [x] Configurazione UFW firewall
- [x] Configurazione fail2ban
- [x] Configurazione SSH con chiavi
- [x] Configurazione certificati SSL
- [x] Configurazione rate limiting

## ✅ Backup e Disaster Recovery
- [x] Backup automatico configurazioni server su NAS
  - Script: `docs/server/backup_config_server.sh`
  - Cron: `0 2 * * *` (ogni notte alle 02:00 CEST)
  - Destinazione: `/mnt/backup_gestionale/` (NAS002)
  - Permessi: `uid=1000,gid=1000,file_mode=0770,dir_mode=0770`
  - Esclusione: cartella `#recycle`
- [x] Report settimanale backup
  - Script: `docs/server/backup_weekly_report.sh`
  - Cron: `0 8 * * 0` (ogni domenica alle 08:00 CEST)
  - Email: `ferraripietrosnc.mauri@outlook.it`, `mauriferrari76@gmail.com`
  - Contenuto: statistiche, log ultimi 7 giorni, verifiche sistema

## ✅ Monitoring e Notifiche
- [x] Configurazione Postfix per email
- [x] Notifiche email errori backup
- [x] Configurazione Gmail SMTP autenticato
- [x] Report settimanale automatico
- [x] Configurazione logrotate per backup
  - File: `/etc/logrotate.d/backup_gestionale`
  - Rotazione: giornaliera
  - Retention: 30 giorni
  - Compressione: automatica

## ✅ Gestione Log
- [x] Configurazione logrotate per backup
- [x] Rotazione automatica log di sistema
- [x] Compressione log vecchi
- [x] Retention policy (30 giorni)
- [x] Permessi appropriati (770 per mauri)

## ✅ Deploy e Manutenzione
- [x] Script di deploy automatizzato
- [x] Configurazione servizi systemd
- [x] Configurazione Nginx reverse proxy
- [x] Configurazione SSL con Let's Encrypt

## 🔄 Manutenzione periodica
- [ ] Aggiornamento pacchetti sistema (mensile)
- [ ] Verifica spazio disco (settimanale)
- [ ] Controllo log errori (giornaliero)
- [ ] Backup database (giornaliero)
- [ ] Test restore (mensile)

## 📋 Note operative
- Server: Ubuntu Server 22.04 LTS
- IP: 10.10.10.15
- NAS: 10.10.10.11 (Synology)
- Utente: mauri
- Fuso orario: Europe/Rome (CEST/CET)
- Documentazione: `/home/mauri/gestionale-fullstack/docs/` 

---

## Script utili per manutenzione server

- **Backup segreti:** `scripts/backup_secrets.sh`
- **Backup completo Docker:** `scripts/backup_completo_docker.sh`
- **Backup automatico su NAS:** `docs/server/backup_docker_automatic.sh`
- **Restore segreti:** `scripts/restore_secrets.sh`
- **Restore unificato:** `scripts/restore_unified.sh`
- **Ottimizzazione disco:** `scripts/ottimizza-disco-vm.sh`

Verifica che i backup siano schedulati e testati regolarmente.

--- 