# Guida Operativa Deploy Gestionale

## Indice
- [Build del frontend](#1-build-del-frontend)
- [Build del backend](#2-build-del-backend)
- [Aggiornamento variabili d’ambiente](#3-aggiornamento-variabili-dambiente)
- [Deploy file statici e backend](#4-deploy-file-statici-e-backend)
- [Configurazione Nginx](#5-configurazione-nginx)
- [Avvio servizi](#6-avvio-servizi)
- [Test](#7-test)
- [Backup](#8-backup)


## 1. Build del frontend

```bash
cd frontend
npm install
npm run build
```

## 2. Build del backend

```bash
cd ../backend
npm install
npm run build
```

## 3. Aggiornamento variabili d’ambiente
- Modifica i file `.env.production` (frontend) e `.env` (backend) con i valori corretti.

## 4. Deploy file statici e backend
- Copia la build del frontend in `/home/app/frontend`
- Copia la build del backend in `/home/app/backend`

## 5. Configurazione Nginx
- Aggiorna la configurazione Nginx come da file principale.
- Riavvia Nginx:
```bash
sudo systemctl reload nginx
```

## 6. Avvio servizi
- Avvia il backend con PM2 o systemd:
```bash
pm start
```
- (Consigliato) Usa PM2 per gestire i processi in produzione.

## 7. Test
- Verifica accesso frontend da LAN e WAN
- Verifica chiamate API e login

## 8. Backup
- Esegui backup del database prima e dopo il deploy
- Il backup automatico delle configurazioni server è gestito tramite lo script `docs/server/backup_config_server.sh`.
- In caso di errore nel backup automatico, viene inviata una notifica email agli amministratori tramite Gmail SMTP autenticato (porta 587, password per app) a più destinatari separati da virgola.

---

**Aggiorna questa guida ogni volta che cambi la procedura di deploy!** 