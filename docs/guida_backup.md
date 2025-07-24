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

---

**Aggiorna questa guida se cambi la strategia di backup o il nome del database!** 