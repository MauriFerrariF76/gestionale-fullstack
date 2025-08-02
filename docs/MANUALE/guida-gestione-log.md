# Guida Gestione Log e Monitoring - Gestionale Fullstack

## Panoramica
Questa guida descrive come gestire i log del sistema gestionale e monitorare le performance, inclusi backup, applicazioni e sistema operativo.

## Log del Sistema

### 1. Log di Backup
**File:** `/mnt/backup_gestionale/backup_config_server.log`

#### Configurazione Logrotate
- **File:** `/etc/logrotate.d/backup_gestionale`
- **Rotazione:** Giornaliera
- **Retention:** 30 giorni
- **Compressione:** Gzip automatica
- **Permessi:** 770 (mauri:mauri)

#### Comandi utili
```bash
# Controllo log attuale
cat /mnt/backup_gestionale/backup_config_server.log

# Controllo log compressi
ls -la /mnt/backup_gestionale/backup_config_server.log*

# Decompressione log vecchio
zcat /mnt/backup_gestionale/backup_config_server.log.1.gz

# Rotazione manuale
sudo logrotate -f /etc/logrotate.d/backup_gestionale

# Test configurazione
sudo logrotate -d /etc/logrotate.d/backup_gestionale
```

### 2. Log di Sistema
**Directory:** `/var/log/`

#### Log principali
- `/var/log/syslog` - Log di sistema generale
- `/var/log/auth.log` - Autenticazioni e SSH
- `/var/log/nginx/` - Log web server
- `/var/log/postgresql/` - Log database
- `/var/log/mail.log` - Log email (Postfix)

#### Configurazione Logrotate
Ubuntu include già configurazioni per:
- `apache2` (se usato)
- `nginx` (se configurato)
- `postgresql`
- `syslog`
- `auth.log`

### 3. Log Applicazioni

#### Backend Node.js
**Gestione:** Docker o PM2
```bash
# Log PM2
pm2 logs

# Log Docker backend
docker compose logs -f backend

# Log Docker frontend
docker compose logs -f frontend
```

#### Database PostgreSQL
```bash
# Log PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*.log

# Query lente
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"
```

## Best Practice

### 1. Rotazione Log
- **Giornaliera** per log attivi
- **Compressione** automatica
- **Retention** 30-90 giorni
- **Permessi** appropriati

### 2. Monitoraggio
- **Controllo spazio** disco
- **Alert** per errori critici
- **Report** settimanali

### 3. Sicurezza
- **Permessi** minimi necessari
- **Separazione** log sensibili
- **Backup** configurazioni logrotate

## Comandi di Manutenzione

### Controllo Spazio
```bash
# Spazio log di sistema
du -sh /var/log/

# Spazio log backup
du -sh /mnt/backup_gestionale/backup_config_server.log*

# Spazio totale
df -h
```

### Pulizia Log
```bash
# Pulizia log vecchi (manuale)
sudo find /var/log -name "*.log.*" -mtime +30 -delete

# Pulizia log backup (automatica via logrotate)
# Non necessaria - gestita automaticamente
```

### Monitoraggio Errori
```bash
# Errori sistema
sudo grep -i error /var/log/syslog | tail -20

# Errori backup
grep -i error /mnt/backup_gestionale/backup_config_server.log

# Errori nginx
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Problemi Comuni

#### 1. Log troppo grandi
```bash
# Controllo dimensione
ls -lh /var/log/syslog

# Rotazione forzata
sudo logrotate -f /etc/logrotate.d/rsyslog
```

#### 2. Permessi log
```bash
# Correzione permessi
sudo chown mauri:mauri /mnt/backup_gestionale/backup_config_server.log
sudo chmod 770 /mnt/backup_gestionale/backup_config_server.log
```

#### 3. Spazio disco pieno
```bash
# Identificazione file grandi
sudo find /var/log -type f -size +100M

# Pulizia emergenza
sudo truncate -s 0 /var/log/syslog
```

## Configurazione Avanzata

### Log Centralizzati
Per un ambiente più complesso, considerare:
- **rsyslog** per log centralizzati
- **logwatch** per report automatici
- **ELK Stack** (Elasticsearch, Logstash, Kibana)

### Monitoraggio Real-time
```bash
# Monitoraggio continuo
tail -f /var/log/syslog | grep -i error

# Alert automatici
# Implementare script per invio email in caso di errori critici
```

## Note Operative
- I log vengono ruotati automaticamente ogni giorno
- I log compressi vengono mantenuti per 30 giorni
- Il sistema invia alert email per errori critici
- Controllare regolarmente lo spazio disco dedicato ai log

## Monitoring di Base

### Controllo Servizi
```bash
# Verifica stato servizi
docker compose ps

# Health check backend
curl -f http://localhost:3001/health

# Health check frontend
curl -f http://localhost:3000/

# Stato database
docker compose exec postgres pg_isready -U gestionale_user -d gestionale
```

### Monitoraggio Performance
```bash
# Utilizzo CPU e memoria
htop

# Utilizzo disco
df -h

# Processi Docker
docker stats

# Log in tempo reale
docker compose logs -f
```

### Audit Log
- Tutte le azioni critiche (login, logout, modifiche dati) vengono loggate nella tabella `audit_logs`
- Controlla regolarmente per accessi sospetti o anomalie
- Query utili:
```sql
-- Ultimi accessi
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;

-- Tentativi di login falliti
SELECT * FROM audit_logs WHERE action = 'LOGIN_FAILED' ORDER BY created_at DESC;

-- Modifiche critiche
SELECT * FROM audit_logs WHERE action IN ('CREATE', 'UPDATE', 'DELETE') ORDER BY created_at DESC;
```

## Alert e Notifiche

### Configurazione Email
- Backup automatici inviano notifiche in caso di errore
- Report settimanali inviati automaticamente
- Email di destinazione: `ferraripietrosnc.mauri@outlook.it`, `mauriferrari76@gmail.com`

### Monitoring Avanzato (Opzionale)
- **Prometheus + Grafana**: Per metriche e dashboard avanzate
- **OpenTelemetry**: Per tracing distribuito
- **Sentry**: Per error tracking in produzione