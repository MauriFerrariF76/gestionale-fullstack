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

Per salvare automaticamente le configurazioni del server gestionale su NAS:

- Assicurati che la cartella di rete sia montata in `/mnt/backup_gestionale` con le opzioni:
  `uid=1000,gid=1000,file_mode=0770,dir_mode=0770` in `/etc/fstab`.
- Usa lo script `docs/server/backup_config_server.sh` che:
  - Monta automaticamente il NAS se non è già montato
  - Esegue il backup con `rsync` escludendo la cartella `#recycle`
  - Scrive un log dettagliato

Esempio di comando usato nello script:
```bash
rsync -av --delete --exclude='#recycle' /home/mauri/gestionale-fullstack/docs/server/ /mnt/backup_gestionale/
```

**Consigli:**
- Aggiungi lo script a `cron` per backup periodici
- Controlla regolarmente i log e lo spazio disponibile sul NAS
- Aggiorna questa guida se cambi la procedura o i permessi NAS

**Notifica email in caso di errore:**
- Se il mount del NAS o il backup con rsync falliscono, lo script invia una mail automatica a ferraripietrosnc.mauri@outlook.it (in copia a mauriferrari@hotmail.com) con il log dettagliato dell'errore.
- Per funzionare, è necessario che sia installato mailutils e Postfix configurato come "Internet Site".

---

**Aggiorna questa guida se cambi la strategia di backup o il nome del database!** 