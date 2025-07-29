# Gestionale Fullstack

## 📚 Documentazione

### Guide Operative
- **[Guida Backup e Restore](docs/guida_backup.md)** - Procedure di backup automatico su NAS e restore
- **[Guida Deploy](docs/guida_deploy.md)** - Deploy e aggiornamenti del gestionale
- **[Guida Gestione Log](docs/guida_gestione_log.md)** - Gestione log, rotazione e monitoraggio
- **[Strategia Backup e Disaster Recovery](docs/strategia_backup_disaster_recovery.md)** - Strategia completa di protezione dati

Tutta la documentazione tecnica, operativa e di progetto è centralizzata nella cartella `docs/`.

- **docs/DEPLOY_ARCHITETTURA_GESTIONALE.md** – Checklist deploy, sicurezza, architettura, roadmap
- **docs/guida_deploy.md** – Guida operativa deploy
- **docs/guida_backup.md** – Backup e restore database **e backup automatico configurazioni server su NAS**
- **docs/strategia_backup_disaster_recovery.md** – Strategia aggiornata di backup, permessi NAS, disaster recovery
- **docs/guida_monitoring.md** – Monitoring e logging
- **docs/manuale_utente.md** – Manuale utente gestionale
- **docs/Gest-GPT5.txt** – Documento di progetto e visione architetturale
- **docs/checklist_sicurezza.md** – Checklist sicurezza deploy e configurazione firewall/Nginx

### Documentazione server Ubuntu
- **docs/server/** – Tutto ciò che riguarda la configurazione, checklist, guida e snapshot del server Ubuntu che ospita il gestionale:
  - **checklist_server_ubuntu.md** – Checklist operativa post-installazione, sicurezza e manutenzione server
  - **guida_installazione_server.md** – Guida dettagliata installazione/configurazione server
  - **lista_pacchetti_ubuntu.txt** – Elenco pacchetti installati (snapshot)
  - **servizi_attivi_ubuntu.txt** – Elenco servizi attivi (snapshot)
  - **versione_nginx.txt**, **versione_node.txt**, **versione_npm.txt**, **versione_postgresql.txt**, **versione_certbot.txt** – Versioni software principali
  - **backup_config_server.sh** – Script di backup automatico configurazioni server su NAS (con esclusione #recycle, permessi corretti, log e mount automatico)

### Gestione servizi backend e frontend
- Il backend (Node.js/Express) e il frontend (Next.js server-side) sono ora gestiti da systemd tramite i file di servizio dedicati in `docs/server/`.
- I servizi partono automaticamente all'avvio del server e possono essere gestiti con i comandi:
  ```bash
  sudo systemctl start|stop|restart|status gestionale-backend
  sudo systemctl start|stop|restart|status gestionale-frontend
  ```
- Nginx è gestito come servizio di sistema standard (`sudo systemctl ... nginx`).

**Procedura validata e funzionante (luglio 2025).**

Aggiorna e consulta questi file per tutte le procedure e le best practice!

**Best practice backup:**
- Verifica che la cartella di backup NAS sia montata con le opzioni `uid=1000,gid=1000,file_mode=0770,dir_mode=0770` in `/etc/fstab`.
- Usa lo script `docs/server/backup_config_server.sh` per backup automatici delle configurazioni server.
- Escludi sempre la cartella `#recycle` del NAS dal backup (già incluso nello script).
- Aggiorna la documentazione e le checklist ogni volta che cambi la procedura di backup o i permessi NAS.
- **Le notifiche email automatiche (backup, errori, ecc.) sono ora inviate tramite Gmail SMTP autenticato (porta 587, password per app), a più destinatari separati da virgola, garantendo affidabilità anche verso Gmail e Outlook.**


