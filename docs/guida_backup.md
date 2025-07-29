# Guida Operativa Backup e Restore Database

## Indice
- [Backup manuale PostgreSQL](#1-backup-manuale-postgresql)
- [Restore manuale PostgreSQL](#2-restore-manuale-postgresql)
- [Backup automatico (cron)](#3-backup-automatico-cron)
- [Best practice](#4-best-practice)


## 1. Backup manuale PostgreSQL

Esegui dal server:
```bash
pg_dump -U gestionale -h localhost -F c -b -v -f /percorso/backup/gestionale_db_$(date +%F).backup gestionale_db
```
- Cambia `/percorso/backup/` con la cartella dove vuoi salvare i backup.
- Il file sarà nominato con la data del backup.

## 2. Restore manuale PostgreSQL

Per ripristinare un backup:
```bash
pg_restore -U gestionale -h localhost -d gestionale_db -v /percorso/backup/gestionale_db_YYYY-MM-DD.backup
```
- Sostituisci `YYYY-MM-DD` con la data del backup da ripristinare.

## 3. Backup automatico (cron)

Aggiungi una riga a `crontab -e` per backup giornaliero:
```
0 2 * * * pg_dump -U gestionale -h localhost -F c -b -v -f /percorso/backup/gestionale_db_$(date +\%F).backup gestionale_db
```

## 4. Best practice
- Conserva i backup in una cartella sicura e, se possibile, anche su un altro server/disco.
- Testa periodicamente il restore!
- Non committare mai i backup su git.

## 5. Backup automatico configurazioni server su NAS

### Descrizione
Il sistema esegue automaticamente il backup delle configurazioni del server su NAS002 (Synology) ogni notte alle 02:00.

### Script utilizzato
- **File:** `docs/server/backup_config_server.sh`
- **Cron job:** `0 2 * * *` (ogni notte alle 02:00 CEST)
- **Destinazione:** `/mnt/backup_gestionale/` (NAS002)

### Configurazione NAS
Il NAS è montato con i seguenti parametri in `/etc/fstab`:
```
//10.10.10.11/cartella_backup /mnt/backup_gestionale cifs credentials=/percorso/credenziali,uid=1000,gid=1000,file_mode=0770,dir_mode=0770 0 0
```

### Notifiche email
In caso di errore, viene inviata una email a:
- `ferraripietrosnc.mauri@outlook.it`
- `mauriferrari76@gmail.com`

### Report settimanale
Ogni domenica alle 08:00 viene generato e inviato un report settimanale dei backup.

#### Script utilizzato
- **File:** `docs/server/backup_weekly_report.sh`
- **Cron job:** `0 8 * * 0` (ogni domenica alle 08:00 CEST)

#### Contenuto del report
- 📊 Statistiche generali (backup riusciti, errori, tentativi mount)
- 📅 Log degli ultimi 7 giorni
- 📋 Riepilogo file backupati
- 🔍 Verifiche aggiuntive (spazio, permessi, cron attivo)

#### Destinatari email
- `ferraripietrosnc.mauri@outlook.it`
- `mauriferrari76@gmail.com`

### Verifica manuale
Per verificare lo stato dei backup:
```bash
# Controllo file backupati
ls -la /mnt/backup_gestionale/

# Controllo log
cat /mnt/backup_gestionale/backup_config_server.log

# Test manuale backup
sudo /home/mauri/gestionale-fullstack/docs/server/backup_config_server.sh

# Test manuale report
/home/mauri/gestionale-fullstack/docs/server/backup_weekly_report.sh
```

**Consigli:**
- Aggiungi lo script a `cron` per backup periodici
- Controlla regolarmente i log e lo spazio disponibile sul NAS
- Aggiorna questa guida se cambi la procedura o i permessi NAS

**Notifica email in caso di errore:**
- Se il mount del NAS o il backup con rsync falliscono, lo script invia una mail automatica a ferraripietrosnc.mauri@outlook.it e mauriferrari76@gmail.com (destinatari separati da virgola) con il log dettagliato dell'errore.
- Per funzionare, è necessario che sia installato mailutils e che Postfix sia configurato per inviare tramite Gmail SMTP autenticato (porta 587, password per app). Questa soluzione garantisce notifiche affidabili anche verso provider esterni (Gmail, Outlook, ecc.).

---

**Aggiorna questa guida se cambi la strategia di backup o il nome del database!** 