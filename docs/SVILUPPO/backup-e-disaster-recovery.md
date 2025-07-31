# 💾 Backup e Disaster Recovery - Gestionale Fullstack

## 📋 Indice
- [1. Introduzione](#1-introduzione)
- [2. Strategia di backup](#2-strategia-di-backup)
- [3. Script e automazioni](#3-script-e-automazioni)
- [4. Disaster recovery](#4-disaster-recovery)
- [5. Replica e alta disponibilità](#5-replica-e-alta-disponibilità)
- [6. Backup con Docker](#6-backup-con-docker)
- [7. Best practice](#7-best-practice)
- [8. Troubleshooting](#8-troubleshooting)

---

## 1. Introduzione

Il backup e il disaster recovery (DR) sono fondamentali per garantire la sicurezza dei dati e la continuità del servizio. In questa guida troverai spiegazioni semplici, esempi pratici e checklist per proteggere il gestionale e il database PostgreSQL da guasti, errori o incidenti.

### Obiettivi
- **Sicurezza dei dati**: Proteggere i dati aziendali da perdite accidentali o maliziose
- **Continuità del servizio**: Ridurre i tempi di fermo in caso di guasti
- **Conformità**: Rispettare le normative sulla protezione dei dati
- **Ripristino rapido**: Procedure testate per il ripristino completo

---

## 2. Strategia di backup

### Tipi di backup
- **Backup completo (full)**: Copia tutti i dati. Da fare periodicamente (es. ogni notte)
- **Backup incrementale**: Copia solo i dati cambiati dall'ultimo backup. Utile per risparmiare spazio
- **Backup manuale**: Eseguito dall'operatore quando serve
- **Backup automatico**: Programmato (es. con cron) per evitare dimenticanze

### Dove salvare i backup
- **Locale**: Sullo stesso server (rischioso se il server si rompe!)
- **Remoto**: Su un altro server, NAS o cloud (consigliato)
- **Best practice**: Conserva almeno una copia dei backup fuori sede

### Frequenza consigliata
- Backup completo: ogni notte
- Backup incrementale: ogni ora (se necessario)
- Backup applicazione (file di configurazione, script): almeno settimanale

### Esempi pratici
```bash
# Backup manuale PostgreSQL
pg_dump -U gestionale_user -h localhost -F c -b -v -f /percorso/backup/gestionale_db_$(date +%F).backup gestionale

# Restore manuale PostgreSQL
pg_restore -U gestionale_user -h localhost -d gestionale -v /percorso/backup/gestionale_db_YYYY-MM-DD.backup

# Backup automatico (cron)
0 2 * * * pg_dump -U gestionale_user -h localhost -F c -b -v -f /percorso/backup/gestionale_db_$(date +\%F).backup gestionale
```

---

## 3. Script e automazioni

### Backup automatico configurazioni server su NAS

#### Descrizione
Il sistema esegue automaticamente il backup delle configurazioni del server su NAS002 (Synology) ogni notte alle 02:00.

#### Script utilizzato
- **File**: `docs/server/backup_config_server.sh`
- **Cron job**: `0 2 * * *` (ogni notte alle 02:00 CEST)
- **Destinazione**: `/mnt/backup_gestionale/` (NAS002)

#### Configurazione NAS
Il NAS è montato con i seguenti parametri in `/etc/fstab`:
```
//10.10.10.11/cartella_backup /mnt/backup_gestionale cifs credentials=/percorso/credenziali,uid=1000,gid=1000,file_mode=0770,dir_mode=0770 0 0
```

#### Comando rsync utilizzato
```bash
rsync -av --delete --exclude='#recycle' /home/mauri/gestionale-fullstack/docs/server/ /mnt/backup_gestionale/
```

### Notifiche email
In caso di errore, viene inviata una email a:
- `ferraripietrosnc.mauri@outlook.it`
- `mauriferrari76@gmail.com`

### Report settimanale
Ogni domenica alle 08:00 viene generato e inviato un report settimanale dei backup.

#### Script utilizzato
- **File**: `docs/server/backup_weekly_report.sh`
- **Cron job**: `0 8 * * 0` (ogni domenica alle 08:00 CEST)

#### Contenuto del report
- 📊 Statistiche generali (backup riusciti, errori, tentativi mount)
- 📅 Log degli ultimi 7 giorni
- 📋 Riepilogo file backupati
- 🔍 Verifiche aggiuntive (spazio, permessi, cron attivo)

### Verifica manuale
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

---

## 4. Disaster recovery

### Procedure di ripristino

#### Ripristino completo da zero
1. **Preparazione server**: Installazione Ubuntu Server e configurazione base
2. **Installazione Docker**: Setup Docker e Docker Compose
3. **Clonazione repository**: Download del codice sorgente
4. **Ripristino segreti**: Configurazione password e chiavi
5. **Ripristino database**: Restore del backup PostgreSQL
6. **Avvio servizi**: Test di tutti i servizi
7. **Verifica funzionamento**: Test completo dell'applicazione

#### Ripristino rapido (solo database)
```bash
# Stop servizi
docker-compose down

# Restore database
docker-compose exec -T postgres pg_restore -U gestionale_user -d gestionale -v < backup_file.backup

# Riavvio servizi
docker-compose up -d
```

### Checklist di ripristino
- [ ] Backup disponibile e integro
- [ ] Credenziali di accesso note
- [ ] Script di ripristino testati
- [ ] Spazio disco sufficiente
- [ ] Connessione di rete attiva
- [ ] Permessi file corretti
- [ ] Servizi Docker funzionanti

---

## 5. Replica e alta disponibilità

### Cos'è la replica
La replica permette di avere una copia aggiornata del database su un secondo server. Se il server principale si guasta, il secondo può subentrare (failover), riducendo i tempi di fermo.

### Tipi di replica PostgreSQL
- **Streaming replication (master/slave)**: Il server secondario (standby) riceve in tempo reale le modifiche dal principale (master)
- **Hot standby**: Il server standby può rispondere a query in sola lettura

### Schema architetturale
- Due server fisici identici
- Database PostgreSQL configurato in replica
- Applicazione gestionale installata su entrambi
- Backup automatici su entrambi i server

### Passi base per configurare la replica
1. Prepara entrambi i server (stessa versione PostgreSQL, rete affidabile)
2. Configura il master per permettere la replica (modifica postgresql.conf e pg_hba.conf)
3. Crea un utente dedicato alla replica
4. Fai un backup iniziale del database e copialo sullo standby
5. Configura lo standby per collegarsi al master
6. Avvia la replica e verifica che sia attiva

---

## 6. Backup con Docker

### Vantaggi di Docker per il backup
- **Isolamento**: Ogni servizio in container separato facilita il backup
- **Volumi Docker**: Backup dedicati per ogni tipo di dato
- **Portabilità**: Stessa applicazione su qualsiasi server
- **Versioning**: Rollback semplice a versioni precedenti

### Backup dei volumi Docker
```bash
# Backup volume PostgreSQL
docker run --rm -v gestionale_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup_$(date +%F).tar.gz -C /data .

# Backup volume configurazioni
docker run --rm -v gestionale_config_data:/data -v $(pwd):/backup alpine tar czf /backup/config_backup_$(date +%F).tar.gz -C /data .

# Restore volume PostgreSQL
docker run --rm -v gestionale_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup_YYYY-MM-DD.tar.gz -C /data
```

### Backup automatico con Docker
```bash
#!/bin/bash
# backup_docker_volumes.sh

DATE=$(date +%F)
BACKUP_DIR="/mnt/backup_gestionale/docker"

# Crea directory backup
mkdir -p $BACKUP_DIR

# Backup volumi Docker
docker run --rm -v gestionale_postgres_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/postgres_$DATE.tar.gz -C /data .
docker run --rm -v gestionale_config_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/config_$DATE.tar.gz -C /data .

# Mantieni solo gli ultimi 7 giorni
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

---

## 7. Best practice

### Sicurezza
- **Crittografia**: Cifra i backup sensibili
- **Accesso limitato**: Solo utenti autorizzati possono accedere ai backup
- **Verifica integrità**: Testa periodicamente i restore
- **Backup multipli**: Conserva backup su supporti diversi

### Automazione
- **Script automatici**: Usa cron per backup periodici
- **Notifiche**: Configura alert per errori di backup
- **Logging**: Mantieni log dettagliati delle operazioni
- **Monitoraggio**: Controlla regolarmente lo spazio disponibile

### Test e verifica
- **Test restore**: Esegui test di ripristino almeno mensilmente
- **Verifica integrità**: Controlla che i backup siano completi
- [ ] **Documentazione**: Mantieni aggiornate le procedure
- [ ] **Training**: Assicurati che il team conosca le procedure

---

## 8. Troubleshooting

### Problemi comuni

#### Backup fallisce
```bash
# Verifica spazio disco
df -h

# Verifica permessi
ls -la /mnt/backup_gestionale/

# Controllo log
tail -f /var/log/backup.log

# Test connessione NAS
ping 10.10.10.11
```

#### Restore fallisce
```bash
# Verifica integrità backup
file backup_file.backup

# Controllo spazio database
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT pg_size_pretty(pg_database_size('gestionale'));"

# Verifica permessi utente
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "\du"
```

#### Problemi NAS
```bash
# Remount NAS
sudo umount /mnt/backup_gestionale
sudo mount -a

# Verifica connessione
smbclient -L //10.10.10.11 -U username

# Controllo log sistema
dmesg | grep -i cifs
```

### Comandi utili
```bash
# Verifica backup recenti
find /mnt/backup_gestionale/ -name "*.backup" -mtime -7

# Controllo spazio backup
du -sh /mnt/backup_gestionale/*

# Test restore rapido
docker-compose exec -T postgres pg_restore --list backup_file.backup

# Verifica cron attivo
crontab -l | grep backup
```

---

**💡 Nota**: Questa documentazione è aggiornata alla versione attuale del gestionale. Per modifiche significative alla strategia di backup, aggiorna questo documento e le relative procedure.