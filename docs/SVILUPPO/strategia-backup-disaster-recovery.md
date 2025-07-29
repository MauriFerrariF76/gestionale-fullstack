# Strategia di Backup e Disaster Recovery

## 1. Introduzione

Il backup e il disaster recovery (DR) sono fondamentali per garantire la sicurezza dei dati e la continuità del servizio. In questa guida troverai spiegazioni semplici, esempi pratici e checklist per proteggere il gestionale e il database PostgreSQL da guasti, errori o incidenti.

---

## 2. Strategia di backup

### Tipi di backup
- **Backup completo (full):** Copia tutti i dati. Da fare periodicamente (es. ogni notte).
- **Backup incrementale:** Copia solo i dati cambiati dall’ultimo backup. Utile per risparmiare spazio.
- **Backup manuale:** Eseguito dall’operatore quando serve.
- **Backup automatico:** Programmato (es. con cron) per evitare dimenticanze.

### Dove salvare i backup
- **Locale:** Sullo stesso server (rischioso se il server si rompe!)
- **Remoto:** Su un altro server, NAS o cloud (consigliato)
- **Best practice:** Conserva almeno una copia dei backup fuori sede.

### Frequenza consigliata
- Backup completo: ogni notte
- Backup incrementale: ogni ora (se necessario)
- Backup applicazione (file di configurazione, script): almeno settimanale

### Esempi pratici
- Backup manuale PostgreSQL:
  ```bash
  pg_dump -U gestionale -h localhost -F c -b -v -f /percorso/backup/gestionale_db_$(date +%F).backup gestionale_db
  ```
- Restore manuale PostgreSQL:
  ```bash
  pg_restore -U gestionale -h localhost -d gestionale_db -v /percorso/backup/gestionale_db_YYYY-MM-DD.backup
  ```
- Backup automatico (cron):
  ```
  0 2 * * * pg_dump -U gestionale -h localhost -F c -b -v -f /percorso/backup/gestionale_db_$(date +\%F).backup gestionale_db
  ```

### Esempio backup automatico configurazioni server su NAS

- Cartella di rete montata in `/mnt/backup_gestionale` con permessi corretti (`uid=1000,gid=1000,file_mode=0770,dir_mode=0770`)
- Script `docs/server/backup_config_server.sh` che esegue backup automatico delle configurazioni server, esclusione `#recycle`, log e notifica email tramite Gmail SMTP autenticato (porta 587, password per app), a più destinatari separati da virgola

```bash
rsync -av --delete --exclude='#recycle' /home/mauri/gestionale-fullstack/docs/server/ /mnt/backup_gestionale/
```

---

## 3. Replica e alta disponibilità

### Cos'è la replica
La replica permette di avere una copia aggiornata del database su un secondo server. Se il server principale si guasta, il secondo può subentrare (failover), riducendo i tempi di fermo.

### Tipi di replica PostgreSQL
- **Streaming replication (master/slave):** Il server secondario (standby) riceve in tempo reale le modifiche dal principale (master).
- **Hot standby:** Il server standby può rispondere a query in sola lettura.

### Schema architetturale (testuale)
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

*(Per i dettagli tecnici, vedi la documentazione ufficiale PostgreSQL o chiedi una guida passo-passo!)*

---

## 4. 🐳 Containerizzazione con Docker

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

## 5. 🔄 Architettura Active-Passive

### Strategia di Resilienza
- **Server Primario**: Gestisce tutto il traffico normalmente
- **Server Secondario**: In standby, pronto a subentrare in caso di guasto
- **Failover Manuale**: Intervento manuale per attivare il server di riserva
- **Sincronizzazione**: Database replicato in tempo reale tra i due server

### Scenario di Failover
1. **Monitoraggio**: Controllo automatico o manuale dello stato del server primario
2. **Rilevamento guasto**: Identificazione del problema (hardware, software, rete)
3. **Intervento manuale**: 
   - Spegnimento del server primario
   - Accensione del server secondario
   - Verifica che tutti i servizi siano attivi
4. **Ripristino**: Quando possibile, ripristino del server principale

### Backup in Architettura Active-Passive
- **Backup automatici**: Su entrambi i server
- **Backup volumi Docker**: Backup dei volumi Docker per container
- **Verifica integrità**: Test periodici di restore
- **Documentazione**: Procedure di failover sempre aggiornate

### Procedure di Failover
```bash
# 1. Verifica stato server primario
docker-compose ps

# 2. Se necessario, spegni server primario
docker-compose down

# 3. Sul server secondario, avvia i servizi
docker-compose up -d

# 4. Verifica che tutto funzioni
docker-compose logs -f
curl https://gestionale.miaazienda.com/api/health

# 5. Promuovi slave a master (se necessario)
# (vedi documentazione PostgreSQL per replica)
```

---

## 6. Disaster recovery

### Cos’è il disaster recovery
È l’insieme delle procedure per ripristinare il servizio dopo un guasto grave (es. rottura server, perdita dati, attacco ransomware).

### Cosa fare in caso di guasto
1. Identifica il problema (hardware, software, dati)
2. Se il database è danneggiato, ripristina l’ultimo backup funzionante
3. Se il server principale è irrecuperabile, promuovi lo standby a nuovo master
4. Ripristina l’applicazione gestionale (file, configurazioni)
5. Verifica che tutto funzioni prima di riaprire il servizio agli utenti

### Test periodici
- Simula almeno una volta ogni 6 mesi un ripristino completo (disaster recovery test)
- Documenta ogni test e aggiorna la procedura se necessario

---

## 7. Checklist operativa

### Backup
- [ ] Backup automatico giornaliero attivo
- [ ] Backup salvati anche su server remoto/cloud
- [ ] Test periodico del restore

> **Nota:** La strategia è aggiornata, ma l'automazione e il test restore sono ancora da implementare. Vedi checklist sicurezza e roadmap.

### Replica
- [ ] Replica PostgreSQL attiva e monitorata
- [ ] Standby aggiornato e pronto al failover
- [ ] Test failover almeno ogni 6 mesi

### Disaster recovery
- [ ] Procedura di ripristino aggiornata e accessibile
- [ ] Responsabili e ruoli definiti
- [ ] Test DR documentato

### Backup
- [x] Backup automatico configurazioni server attivo su NAS
- [x] Permessi NAS verificati e corretti
- [x] Esclusione cartella #recycle dal backup
- [x] Notifica email errori backup tramite Gmail SMTP autenticato (porta 587, password per app), destinatari multipli separati da virgola

---

## 8. Osservazioni e consigli
- Non affidarti mai a un solo backup!
- Conserva le password e le chiavi di accesso in un luogo sicuro
- Aggiorna la strategia ogni volta che cambia l’infrastruttura
- Se possibile, usa strumenti di monitoraggio per ricevere alert in caso di problemi

---

## 9. Risorse utili
- [Documentazione ufficiale PostgreSQL](https://www.postgresql.org/docs/)
- [Guida backup PostgreSQL](https://www.postgresql.org/docs/current/backup.html)
- [Guida replica PostgreSQL](https://www.postgresql.org/docs/current/warm-standby.html)
- [Disaster Recovery Wikipedia](https://it.wikipedia.org/wiki/Disaster_recovery)

---

*Aggiorna questo documento ogni volta che cambi la strategia di backup, replica o disaster recovery!* 