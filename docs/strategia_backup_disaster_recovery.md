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

---

## 3. Replica e alta disponibilità

### Cos’è la replica
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

## 4. Disaster recovery

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

## 5. Checklist operativa

### Backup
- [ ] Backup automatico giornaliero attivo
- [ ] Backup salvati anche su server remoto/cloud
- [ ] Test periodico del restore

### Replica
- [ ] Replica PostgreSQL attiva e monitorata
- [ ] Standby aggiornato e pronto al failover
- [ ] Test failover almeno ogni 6 mesi

### Disaster recovery
- [ ] Procedura di ripristino aggiornata e accessibile
- [ ] Responsabili e ruoli definiti
- [ ] Test DR documentato

---

## 6. Osservazioni e consigli
- Non affidarti mai a un solo backup!
- Conserva le password e le chiavi di accesso in un luogo sicuro
- Aggiorna la strategia ogni volta che cambia l’infrastruttura
- Se possibile, usa strumenti di monitoraggio per ricevere alert in caso di problemi

---

## 7. Risorse utili
- [Documentazione ufficiale PostgreSQL](https://www.postgresql.org/docs/)
- [Guida backup PostgreSQL](https://www.postgresql.org/docs/current/backup.html)
- [Guida replica PostgreSQL](https://www.postgresql.org/docs/current/warm-standby.html)
- [Disaster Recovery Wikipedia](https://it.wikipedia.org/wiki/Disaster_recovery)

---

*Aggiorna questo documento ogni volta che cambi la strategia di backup, replica o disaster recovery!* 