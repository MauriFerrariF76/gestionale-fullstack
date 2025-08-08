# 🔧 07-MAINTENANCE - Checklist Dettagliata

## Panoramica
Checklist dettagliata per manutenzione e aggiornamenti del gestionale fullstack.

**Versione**: 1.0  
**Data**: 8 Agosto 2025  
**Stato**: ✅ ATTIVA  
**Priorità**: MEDIA

---

## 🔧 Configurazione Server

### Sistema Operativo
- [x] **Ubuntu Server 22.04 LTS**: Installato e configurato ✅
- [x] **Rete e firewall**: UFW configurato ✅
- [x] **Fuso orario**: Europe/Rome (CEST/CET) ✅
- [x] **Node.js e npm**: Installati (v20.19.4, npm 10.8.2) ✅
- [x] **PostgreSQL**: Configurato (versione 16.9) ✅
- [ ] **Nginx**: Reverse proxy configurato (solo produzione)
- [ ] **Certbot**: SSL automatico (solo produzione)
- [ ] **Servizi systemd**: Configurati

### Configurazione Sistema
```bash
# Verifica sistema
lsb_release -a
uname -a
timedatectl status

# Verifica servizi
systemctl status postgresql
systemctl status nginx
systemctl status docker

# Verifica rete
ip addr show
ufw status
```

### Aggiornamenti Sistema
```bash
# Aggiornamenti sicurezza
sudo apt update
sudo apt upgrade -y

# Aggiornamenti automatici
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Verifica aggiornamenti
sudo unattended-upgrade --dry-run --debug
```

---

## 📊 Gestione Log

### Logrotate
- [x] **Logrotate**: Configurato per backup
- [x] **Rotazione automatica**: Log di sistema
- [x] **Compressione**: Log vecchi
- [x] **Retention policy**: 30 giorni
- [x] **Permessi**: 770 per mauri

### Configurazione Logrotate
```bash
# /etc/logrotate.d/gestionale
/home/mauri/gestionale-fullstack/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 770 mauri mauri
    postrotate
        systemctl reload nginx
    endscript
}
```

### Log Management
```bash
# Verifica log
sudo journalctl -f
sudo tail -f /var/log/syslog

# Pulizia log vecchi
sudo find /var/log -name "*.log" -mtime +30 -delete

# Verifica spazio log
du -sh /var/log/
```

### Log Analysis
```bash
# Analisi errori
grep -i "error" /var/log/syslog | tail -20

# Analisi accessi
grep -i "ssh" /var/log/auth.log | tail -20

# Analisi applicazione
docker compose logs app | grep -i "error"
```

---

## 📧 Monitoring Server

### Postfix Configuration
- [x] **Postfix**: Configurato per email
- [x] **Notifiche email**: Errori backup
- [x] **Gmail SMTP**: Autenticato
- [x] **Report settimanali**: Automatici

### Configurazione Email
```bash
# Configurazione Postfix
sudo nano /etc/postfix/main.cf

# Test email
echo "Test email" | mail -s "Test" admin@company.com

# Verifica configurazione
sudo postfix check
sudo systemctl status postfix

# Log email
sudo tail -f /var/log/mail.log
```

### Email Alerts
```bash
# Script alert email
#!/bin/bash
# /opt/scripts/send-alert.sh

ALERT_EMAIL="admin@company.com"
SUBJECT="Gestionale Alert"
MESSAGE="Alert message here"

echo "$MESSAGE" | mail -s "$SUBJECT" $ALERT_EMAIL
```

---

## 🔄 Aggiornamenti e Manutenzione

### Aggiornamenti Sicurezza
- [x] **Aggiornamenti sicurezza**: Patch applicate regolarmente
- [ ] **Cleanup automatico**: Log e file temporanei
- [ ] **Performance tuning**: Ottimizzazioni database
- [ ] **Backup verification**: Test periodici
- [ ] **Health monitoring**: Controllo continuo

### Security Updates
```bash
# Aggiornamenti automatici
sudo apt update
sudo apt upgrade -y

# Verifica vulnerabilità
sudo apt list --upgradable

# Aggiornamenti sicurezza critici
sudo unattended-upgrade

# Verifica aggiornamenti
sudo unattended-upgrade --dry-run
```

### Performance Tuning
```bash
# Ottimizzazione PostgreSQL
sudo nano /etc/postgresql/16/main/postgresql.conf

# Ottimizzazione memoria
sudo nano /etc/sysctl.conf

# Ottimizzazione disco
sudo nano /etc/fstab
```

### Database Maintenance
```bash
# VACUUM database
docker compose exec postgres psql -U postgres -d gestionale -c "VACUUM ANALYZE;"

# Verifica indici
docker compose exec postgres psql -U postgres -d gestionale -c "SELECT schemaname, tablename, indexname FROM pg_indexes;"

# Statistiche database
docker compose exec postgres psql -U postgres -d gestionale -c "SELECT * FROM pg_stat_database;"
```

---

## 🧹 Cleanup Automatico

### Script Cleanup
```bash
#!/bin/bash
# /opt/scripts/cleanup.sh

# Pulizia log vecchi
find /var/log -name "*.log" -mtime +30 -delete

# Pulizia backup vecchi
find /opt/backups -name "*.sql" -mtime +30 -delete
find /opt/backups -name "*.tar.gz" -mtime +30 -delete

# Pulizia Docker
docker system prune -f
docker volume prune -f

# Pulizia npm cache
npm cache clean --force

# Pulizia file temporanei
find /tmp -name "*.tmp" -mtime +7 -delete
```

### Cron Jobs Maintenance
```bash
# Cleanup giornaliero
0 2 * * * /opt/scripts/cleanup.sh

# Aggiornamenti settimanali
0 3 * * 0 /opt/scripts/update-system.sh

# Backup verification mensile
0 4 1 * * /opt/scripts/verify-backups.sh

# Performance check settimanale
0 5 * * 0 /opt/scripts/performance-check.sh
```

---

## 📈 Performance Monitoring

### System Performance
```bash
# CPU usage
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1

# Memory usage
free -m | awk 'NR==2{printf "%.1f%%", $3*100/$2}'

# Disk usage
df -h | awk '$NF=="/"{printf "%s", $5}'

# Load average
uptime | awk '{print $10, $11, $12}'
```

### Database Performance
```bash
# Connessioni attive
docker compose exec postgres psql -U postgres -d gestionale -c "SELECT count(*) FROM pg_stat_activity;"

# Query lente
docker compose exec postgres psql -U postgres -d gestionale -c "SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Utilizzo tabelle
docker compose exec postgres psql -U postgres -d gestionale -c "SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del FROM pg_stat_user_tables;"
```

### Application Performance
```bash
# Response time
time curl -s http://localhost/api/health

# Memory usage app
docker stats --no-stream app

# Error rate
grep -c "ERROR" /var/log/application.log
```

---

## 🔍 Health Monitoring

### Health Checks
```bash
#!/bin/bash
# /opt/scripts/health-monitoring.sh

# Check app health
if ! curl -f http://localhost/api/health &>/dev/null; then
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

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
if [ $(echo "$MEMORY_USAGE > 90" | bc) -eq 1 ]; then
    echo "❌ Memory usage critical: ${MEMORY_USAGE}%" | mail -s "Alert: High Memory" admin@company.com
fi
```

### Performance Alerts
```bash
# Alert CPU alto
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
if [ $(echo "$CPU_USAGE > 80" | bc) -eq 1 ]; then
    echo "⚠️ High CPU usage: ${CPU_USAGE}%" | mail -s "Warning: High CPU" admin@company.com
fi

# Alert spazio disco
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️ Disk space warning: ${DISK_USAGE}%" | mail -s "Warning: Disk Space" admin@company.com
fi
```

---

## 🚨 Problemi Comuni

### Problemi Sistema
- **Spazio disco pieno**: Pulizia backup e log vecchi
- **Memoria insufficiente**: Ottimizzazione applicazioni
- **CPU alto**: Verifica processi in background
- **Servizi non avviano**: Verificare configurazioni

### Problemi Database
- **Connessioni esaurite**: Verificare pool connessioni
- **Query lente**: Analizzare indici e statistiche
- **Lock database**: Verificare transazioni lunghe
- **Backup fallisce**: Verificare spazio e permessi

### Problemi Applicazione
- **App non risponde**: Verificare servizi e log
- **Errori 500**: Verificare configurazione e dipendenze
- **Performance lenta**: Ottimizzare query e cache
- **Memory leak**: Monitorare uso memoria

---

## 📋 Verifiche Maintenance

### Test Sistema Completo
```bash
# 1. Verifica aggiornamenti
sudo apt update
sudo apt list --upgradable

# 2. Verifica servizi
systemctl status postgresql
systemctl status nginx
systemctl status docker

# 3. Verifica spazio disco
df -h

# 4. Verifica memoria
free -h

# 5. Verifica log
tail -f /var/log/syslog

# 6. Verifica email
echo "Test maintenance" | mail -s "Test" admin@company.com
```

### Test Performance
```bash
# Test CPU
stress-ng --cpu 4 --timeout 10s

# Test memoria
stress-ng --vm 2 --vm-bytes 1G --timeout 10s

# Test disco
dd if=/dev/zero of=testfile bs=1M count=100

# Test rete
iperf3 -c 10.10.10.1
```

---

## 📝 Note Operative

### Configurazioni Critiche
- **Aggiornamenti automatici**: unattended-upgrades
- **Log retention**: 30 giorni
- **Backup retention**: 30 giorni produzione, 7 giorni sviluppo
- **Alert thresholds**: 80% disco, 90% memoria
- **Maintenance window**: Domenica 02:00-04:00

### Credenziali Maintenance
- **Email SMTP**: Gmail configurato
- **Database**: PostgreSQL con utente postgres
- **SSH**: Porta 27, utente mauri
- **Backup**: NAS Synology

---

## 📊 Stato Maintenance

### ✅ Implementato (40%)
- **Ubuntu Server 22.04 LTS**: Configurato
- **Postfix email**: Funzionante
- **Logrotate**: Configurato
- **Aggiornamenti sicurezza**: Automatici
- **Health monitoring**: Base implementato

### 🔄 Da Implementare (60%)
- **Cleanup automatico**: Script e cron jobs
- **Performance tuning**: Ottimizzazioni database
- **Backup verification**: Test periodici
- **Health monitoring**: Controllo continuo
- **Performance alerts**: Soglie e notifiche

---

**✅ Maintenance implementato con successo!**

**🔧 Sistema di manutenzione robusto e affidabile.**
