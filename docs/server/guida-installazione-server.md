# Guida Installazione e Configurazione Server Ubuntu per Gestionale

## Obiettivo
Questa guida ti aiuta a installare, configurare e mantenere un server Ubuntu sicuro e pronto per ospitare il gestionale web aziendale. È pensata per essere aggiornata nel tempo e per facilitare sia nuove installazioni che la manutenzione.

---

## 1. Requisiti minimi
- Ubuntu Server (consigliato LTS, es. 22.04)
- Connessione Internet stabile
- Accesso amministratore (sudo)
- Backup dei dati importanti prima di ogni intervento

---

## 2. Installazione base
1. Scarica e installa Ubuntu Server.
2. Crea un utente amministratore NON root.
3. Aggiorna il sistema:
   ```bash
   sudo apt update && sudo apt upgrade
   ```
4. Configura SSH:
   - Solo autenticazione con chiave
   - Accesso solo da IP fidati
   - Disabilita login root
5. Attiva firewall (UFW o regole MikroTik)
6. Sincronizza orario (NTP)
7. Configura hostname e /etc/hosts
8. (Opzionale) Configura swap

---

## 3. Installazione servizi principali
### Nginx
- Installa:
  ```bash
  sudo apt install nginx
  ```
- Verifica versione:
  ```bash
  cat docs/versione_nginx.txt
  ```
- Configura secondo `/docs/DEPLOY_ARCHITETTURA_GESTIONALE.md`

### Certbot/Let’s Encrypt
- Installa:
  ```bash
  sudo apt install certbot python3-certbot-nginx
  ```
- Verifica versione:
  ```bash
  cat docs/versione_certbot.txt
  ```
- Segui la guida per HTTPS e rinnovo automatico.

### Node.js e npm
- Installa (esempio con nvm):
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  nvm install --lts
  ```
- Verifica versioni:
  ```bash
  cat docs/versione_node.txt
  cat docs/versione_npm.txt
  ```

### PM2 o systemd
- Consigliato: usa systemd per servizi di produzione (vedi esempio in `/docs/DEPLOY_ARCHITETTURA_GESTIONALE.md`)

### PostgreSQL
- Installa:
  ```bash
  sudo apt install postgresql
  ```
- Verifica versione:
  ```bash
  cat docs/versione_postgresql.txt
  ```
- Configura utente e permessi secondo checklist sicurezza.

---

## 4. Backup e versionamento configurazioni
- Crea una repo git locale (es. `/srv/config-repo`) per versionare file di configurazione importanti:
  - Nginx, systemd, script backup, ecc.
- Esegui backup automatici di database e configurazioni (vedi `/docs/strategia_backup_disaster_recovery.md`)
- Testa periodicamente il restore!

---

## 5. Servizi attivi e pacchetti installati (snapshot)
- **Pacchetti installati:** vedi `docs/lista_pacchetti_ubuntu.txt`
- **Servizi attivi:** vedi `docs/servizi_attivi_ubuntu.txt`
- **Versioni software principali:**
  - Nginx: `cat docs/versione_nginx.txt`
  - Node.js: `cat docs/versione_node.txt`
  - npm: `cat docs/versione_npm.txt`
  - PostgreSQL: `cat docs/versione_postgresql.txt`
  - Certbot: `cat docs/versione_certbot.txt`

Aggiorna questi file ogni volta che installi o aggiorni software critico!

---

## 6. Checklist post-installazione
Consulta `/docs/checklist_server_ubuntu.md` per una lista operativa da spuntare dopo ogni installazione o modifica.

---

## 7. Troubleshooting e comandi utili
- Riavviare un servizio:
  ```bash
  sudo systemctl restart nginx
  sudo systemctl restart gestionale-backend
  sudo systemctl restart postgresql
  ```
- Controllare lo stato:
  ```bash
  sudo systemctl status nginx
  sudo systemctl status gestionale-backend
  sudo systemctl status postgresql
  ```
- Verificare spazio disco:
  ```bash
  df -h
  ```
- Log di sistema:
  ```bash
  journalctl -u nginx
  journalctl -u gestionale-backend
  journalctl -u postgresql
  ```

---

## 8. Note operative
- Aggiorna questa guida ogni volta che cambia la configurazione o vengono installati nuovi servizi.
- Versiona sempre le configurazioni critiche.
- In caso di dubbi, consulta anche la documentazione ufficiale di Ubuntu, Nginx, Node.js, PostgreSQL.

---

## 9. Gestione backend con systemd (servizio automatico)

Per garantire l'avvio automatico e la resilienza del backend gestionale, crea un servizio systemd dedicato.

### Esempio di file di servizio: `/etc/systemd/system/gestionale-backend.service`

```ini
[Unit]
Description=Gestionale Backend Node.js
After=network.target

[Service]
Type=simple
User=mauri
WorkingDirectory=/home/mauri/gestionale-fullstack/backend
ExecStart=/usr/bin/node dist/app.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### Comandi utili
- **Ricarica systemd dopo aver creato/modificato il file:**
  ```bash
  sudo systemctl daemon-reload
  ```
- **Abilita avvio automatico all'accensione:**
  ```bash
  sudo systemctl enable gestionale-backend
  ```
- **Avvia il servizio:**
  ```bash
  sudo systemctl start gestionale-backend
  ```
- **Controlla lo stato:**
  ```bash
  sudo systemctl status gestionale-backend
  ```
- **Visualizza i log:**
  ```bash
  journalctl -u gestionale-backend
  ```

> **Nota:** Modifica il percorso e l'utente se la tua installazione differisce.

---

## 10. Gestione frontend Next.js server-side con systemd

Se il frontend è in modalità server-side (Next.js), crea un servizio systemd dedicato per garantirne l’avvio automatico e la resilienza.

### Esempio di file di servizio: `/etc/systemd/system/gestionale-frontend.service`

```ini
[Unit]
Description=Gestionale Frontend Next.js
After=network.target

[Service]
Type=simple
User=mauri
WorkingDirectory=/home/mauri/gestionale-fullstack/frontend
ExecStart=/usr/bin/node node_modules/next/dist/bin/next start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### Comandi utili
- **Ricarica systemd dopo aver creato/modificato il file:**
  ```bash
  sudo systemctl daemon-reload
  ```
- **Abilita avvio automatico all'accensione:**
  ```bash
  sudo systemctl enable gestionale-frontend
  ```
- **Avvia il servizio:**
  ```bash
  sudo systemctl start gestionale-frontend
  ```
- **Controlla lo stato:**
  ```bash
  sudo systemctl status gestionale-frontend
  ```
- **Visualizza i log:**
  ```bash
  journalctl -u gestionale-frontend
  ```

> **Nota:** Modifica il percorso e l'utente se la tua installazione differisce.

---

## 11. Gestione Nginx come servizio di sistema

Nginx viene installato come servizio systemd e si avvia automaticamente all’accensione del server. Non serve creare file di servizio personalizzati.

### Comandi principali
- **Stato del servizio:**
  ```bash
  sudo systemctl status nginx
  ```
- **Riavviare Nginx:**
  ```bash
  sudo systemctl restart nginx
  ```
- **Ricaricare la configurazione (senza interrompere il servizio):**
  ```bash
  sudo systemctl reload nginx
  ```
- **Abilitare/disabilitare avvio automatico:**
  ```bash
  sudo systemctl enable nginx
  sudo systemctl disable nginx
  ```
- **Fermare Nginx:**
  ```bash
  sudo systemctl stop nginx
  ```

### Best practice
- Dopo ogni modifica ai file di configurazione in `/etc/nginx/`, esegui sempre:
  ```bash
  sudo nginx -t   # Test della configurazione
  sudo systemctl reload nginx
  ```
- Tieni traccia delle modifiche ai file di configurazione (versionamento manuale o repo dedicata).
- Consulta i log in caso di problemi:
  ```bash
  journalctl -u nginx
  tail -f /var/log/nginx/error.log
  ```

---

*Ultimo aggiornamento: luglio 2025* 

---

**Procedura testata e validata: backend e frontend gestiti da systemd, funzionanti e resilienti (luglio 2025).** 