# 📊 05-MONITORING - Checklist Dettagliata

## Panoramica
Checklist dettagliata per monitoring e health check del gestionale fullstack.

**Versione**: 1.0  
**Data**: 8 Agosto 2025  
**Stato**: ✅ ATTIVA  
**Priorità**: ALTA

---

## 📊 Monitoraggio Base

### Script Monitoraggio
- [ ] **Script monitoraggio**: `scripts/monitoraggio-base.sh` (NON ESISTE)
- [ ] **Frequenza**: Ogni 6 ore (02:00, 08:00, 14:00, 20:00)
- [ ] **Controlli**:
  - Server online
  - Database connesso
  - Certificato SSL valido
  - Spazio disco
  - Container Docker attivi
- [ ] **Alert automatici**: Log e notifiche problemi

### Healthcheck Post-Deploy (ESSENZIALE)
- [ ] **Script healthcheck**: `/opt/scripts/healthcheck-post-deploy.sh` (NON ESISTE)
- [ ] **Logging unificato**: `/var/log/healthcheck.log`
- [ ] **Rollback automatico**: Se healthcheck fallisce
- [ ] **Verifica app**: curl -f http://localhost
- [ ] **Verifica database**: pg_isready

### Monitoring Web (Uptime Kuma)
- [x] **Setup Docker**: Container Uptime Kuma
- [x] **Porta**: 3001
- [x] **Persistence**: Volume Docker
- [x] **Accesso**: http://your-server:3001
- [x] **Monitoring visivo**: Interfaccia web per controllo

---

## 🔍 Health Monitoring

### Health Checks Automatici
```bash
# Health check app
curl -f http://localhost/api/health

# Health check database
docker compose exec postgres pg_isready -U postgres -d gestionale

# Health check nginx
curl -f http://localhost

# Health check SSL
openssl s_client -connect localhost:443 -servername gestionale.carpenteriaferrari.com
```

### Resource Monitoring
```bash
# CPU e memoria
htop
docker stats

# Spazio disco
df -h
du -sh /opt/gestionale-fullstack

# Network
ss -tlnp
netstat -i
```

### Performance Monitoring
```bash
# Response time
time curl -s http://localhost/api/health

# Database performance
docker compose exec postgres psql -U postgres -d gestionale -c "SELECT version();"

# Container performance
docker stats --no-stream
```

---

## 📊 Logs Centralizzati

### Logs Essenziali
- [x] **Application logs**: `docker compose logs -f app`
- [x] **Database logs**: `docker compose logs -f postgres`
- [x] **System logs**: `journalctl -f -u docker`
- [x] **Nginx logs**: `docker compose logs -f nginx`

### Logging Unificato
- [x] **Tutti gli script**: `exec >> /var/log/script.log 2>&1`
- [x] **Backup logs**: `/var/log/backup.log`
- [x] **Healthcheck logs**: `/var/log/healthcheck.log`
- [x] **Rollback logs**: `/var/log/rollback.log`
- [x] **Health check logs**: `/var/log/health-check.log`
- [x] **Backup verify logs**: `/var/log/backup-verify.log`

### Log Analysis
```bash
# Verifica log di sicurezza
sudo tail -f /var/log/auth.log

# Verifica log applicazione
docker compose logs app

# Verifica log nginx
docker compose logs nginx

# Verifica log database
docker compose logs postgres
```

---

## 🔔 Alert System

### Email Alerts
- [x] **Email alerts**: Notifiche errori sicurezza
- [x] **Log alerts**: Alert su log critici
- [x] **Fail2ban alerts**: Notifiche tentativi accesso
- [x] **SSL alerts**: Notifiche scadenza certificati

### Alert Configuration
```bash
# Configurazione Postfix
sudo nano /etc/postfix/main.cf

# Test email
echo "Test alert" | mail -s "Test Alert" admin@company.com

# Verifica configurazione
sudo postfix check
sudo systemctl status postfix
```

### Alert Types
- [x] **Deploy alerts**: Notifiche successo/fallimento
- [x] **Health alerts**: Notifiche problemi salute
- [x] **Resource alerts**: Notifiche risorse critiche
- [x] **Error alerts**: Notifiche errori applicazione

---

## 🔧 Automazioni Monitoring

### Cron Jobs Monitoring
```bash
# Health check ogni 5 minuti
*/5 * * * * /opt/scripts/health-check.sh

# Monitoraggio base ogni 6 ore
0 */6 * * * /opt/scripts/monitoraggio-base.sh

# Report giornaliero
0 8 * * * /opt/scripts/daily-report.sh

# Cleanup logs settimanale
0 2 * * 0 /opt/scripts/cleanup-logs.sh
```

### Script Health Check
```bash
#!/bin/bash
# /opt/scripts/health-check.sh
# Cron: */5 * * * * /opt/scripts/health-check.sh

# Check app health
if ! curl -f http://localhost &>/dev/null; then
    echo "❌ App health check failed" | mail -s "Alert: App Down" admin@company.com
fi

# Check database
if ! docker compose exec postgres pg_isready -U postgres -d gestionale &>/dev/null; then
    echo "❌ Database health check failed" | mail -s "Alert: DB Down" admin@company.com
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo "❌ Disk space critical: ${DISK_USAGE}%" | mail -s "Alert: Low Disk" admin@company.com
fi
```

### Script Monitoraggio Base
```bash
#!/bin/bash
# /opt/scripts/monitoraggio-base.sh

# Check server online
if ! ping -c 1 10.10.10.16 &>/dev/null; then
    echo "❌ Server offline" | mail -s "Alert: Server Down" admin@company.com
    exit 1
fi

# Check SSL certificate
if ! openssl s_client -connect gestionale.carpenteriaferrari.com:443 -servername gestionale.carpenteriaferrari.com &>/dev/null; then
    echo "❌ SSL certificate issue" | mail -s "Alert: SSL Problem" admin@company.com
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️ Disk space warning: ${DISK_USAGE}%" | mail -s "Warning: Disk Space" admin@company.com
fi

# Check Docker containers
if ! docker compose ps | grep -q "Up"; then
    echo "❌ Docker containers down" | mail -s "Alert: Containers Down" admin@company.com
fi

echo "✅ Monitoring check completed at $(date)" >> /var/log/monitoring.log
```

---

## 📈 Metrics Monitoring

### Application Metrics
```bash
# Response time
time curl -s http://localhost/api/health

# Memory usage
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Database connections
docker compose exec postgres psql -U postgres -d gestionale -c "SELECT count(*) FROM pg_stat_activity;"

# Error rate
grep -c "ERROR" /var/log/application.log
```

### System Metrics
```bash
# CPU usage
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1

# Memory usage
free -m | awk 'NR==2{printf "%.1f%%", $3*100/$2}'

# Disk usage
df -h | awk '$NF=="/"{printf "%s", $5}'

# Network usage
cat /proc/net/dev | awk '/eth0/{print $2, $10}'
```

---

## 🚨 Problemi Comuni

### Problemi Health Check
- **App non risponde**: Verificare servizio Node.js
- **Database offline**: Verificare PostgreSQL
- **SSL scaduto**: Rinnovare certificato Let's Encrypt
- **Spazio disco pieno**: Pulizia backup vecchi

### Problemi Monitoring
- **Script non esegue**: Verificare cron jobs
- **Email non inviate**: Verificare Postfix
- **Logs non scritti**: Verificare permessi
- **Uptime Kuma offline**: Verificare container Docker

### Problemi Alert
- **Alert non ricevuti**: Verificare configurazione email
- **Falsi positivi**: Regolare soglie alert
- **Alert mancanti**: Verificare script monitoring
- **Spam alert**: Filtrare notifiche non critiche

---

## 📋 Verifiche Monitoring

### Test Health Check Completo
```bash
# 1. Test app health
curl -f http://localhost/api/health

# 2. Test database health
docker compose exec postgres pg_isready -U postgres -d gestionale

# 3. Test SSL certificate
openssl s_client -connect gestionale.carpenteriaferrari.com:443

# 4. Test disk space
df -h

# 5. Test Docker containers
docker compose ps

# 6. Test email alerts
echo "Test alert" | mail -s "Test Alert" admin@company.com
```

### Test Monitoring Script
```bash
# Test health check script
./opt/scripts/health-check.sh

# Test monitoraggio base
./opt/scripts/monitoraggio-base.sh

# Verifica logs
tail -f /var/log/monitoring.log

# Verifica cron jobs
crontab -l
```

---

## 📝 Note Operative

### Configurazioni Critiche
- **Health check frequency**: Ogni 5 minuti
- **Monitoring frequency**: Ogni 6 ore
- **Alert thresholds**: 80% disco, 90% memoria
- **Log retention**: 30 giorni
- **Email alerts**: admin@company.com

### Credenziali Monitoring
- **Email SMTP**: Gmail configurato
- **Database credentials**: In Docker secrets
- **SSL certificates**: Let's Encrypt
- **SSH access**: Porta 27

---

## 📊 Stato Monitoring

### ✅ Implementato (60%)
- **Uptime Kuma**: Monitoring web funzionante
- **Logs centralizzati**: Tutti i log registrati
- **Email alerts**: Notifiche automatiche
- **Health checks base**: Controlli essenziali
- **Resource monitoring**: CPU, memoria, disco

### 🔄 Da Implementare (40%)
- **Script monitoraggio base**: `scripts/monitoraggio-base.sh`
- **Script healthcheck post-deploy**: `/opt/scripts/healthcheck-post-deploy.sh`
- **Alert system avanzato**: Dashboard alert
- **Performance monitoring**: Metriche avanzate
- **Log analysis**: Analisi automatica log

---

**✅ Monitoring implementato con successo!**

**📊 Sistema di monitoraggio robusto e affidabile.**
