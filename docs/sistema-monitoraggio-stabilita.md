# Sistema Monitoraggio Stabilità Gestionale

## 🎯 **PANORAMICA**

Sistema completo di monitoraggio della stabilità per l'ambiente di sviluppo Gestionale Fullstack, implementato seguendo le best practice enterprise-grade per rilevare reboot continui, crash frequenti e instabilità del sistema.

## 🏗️ **ARCHITETTURA DEL SISTEMA**

### **Componenti Principali**

1. **Script di Monitoraggio** (`monitor-stabilita.sh`)
   - Controllo continuo servizi e processi
   - Rilevamento automatico problemi
   - Generazione alert e log strutturati

2. **Sistema di Rotazione Log** (`logrotate-gestionale`)
   - Rotazione automatica giornaliera
   - Compressione e retention configurata
   - Gestione permessi e sicurezza

3. **Servizio Systemd** (`gestionale-monitor.service`)
   - Monitoraggio continuo come servizio
   - Riavvio automatico in caso di crash
   - Integrazione con sistema operativo

4. **Pulizia Automatica Log** (`cleanup-logs.sh`)
   - Gestione retention configurata
   - Compressione automatica file vecchi
   - Ottimizzazione spazio disco

5. **Configurazione Crontab** (`setup-cron.sh`)
   - Automazione completa operazioni
   - Backup e monitoraggio schedulato
   - Gestione configurazioni

## 🔍 **FUNZIONALITÀ DI MONITORAGGIO**

### **Controlli Automatici**

- **Uptime Sistema**: Rilevamento reboot recenti
- **Servizi Systemd**: Stato servizi critici
- **Processi Gestionale**: Backend e frontend attivi
- **Porte Servizi**: Verifica ascolto su porte critiche
- **Log Errori**: Analisi errori recenti
- **Utilizzo Risorse**: Memoria, CPU, spazio disco
- **Frequenza Reboot**: Conteggio reboot giornalieri
- **Salute Servizi**: Health check endpoint

### **Soglie Configurabili**

```bash
# File: scripts/stabilita-config.conf
MAX_REBOOTS_PER_HOUR=3
MAX_CRASHES_PER_HOUR=5
MEMORY_THRESHOLD=80
CPU_THRESHOLD=80
DISK_THRESHOLD=80
CHECK_INTERVAL=300  # 5 minuti
```

## 📊 **SISTEMA DI ALERT**

### **Tipologie di Alert**

1. **🚨 ALERT CRITICI**
   - Servizi non attivi
   - Porte non in ascolto
   - Processi non attivi
   - Backend/frontend non rispondono

2. **⚠️ ALERT DI ATTENZIONE**
   - Utilizzo risorse alto
   - Errori nei log recenti
   - Reboot frequenti
   - Servizi critici non attivi

### **File di Log**

- **`stabilita-status.log`**: Log completi monitoraggio
- **`stabilita-alerts.log`**: Solo alert e problemi
- **`cleanup-report-*.txt`**: Report pulizia automatica
- **`crontab-backup-*.txt`**: Backup configurazioni cron

## ⚙️ **INSTALLAZIONE E CONFIGURAZIONE**

### **1. Rotazione Log (Logrotate)**

```bash
# Copia configurazione
sudo cp scripts/logrotate-gestionale /etc/logrotate.d/gestionale

# Test configurazione
sudo logrotate -d /etc/logrotate.d/gestionale

# Esecuzione manuale
sudo logrotate /etc/logrotate.d/gestionale
```

### **2. Servizio Monitoraggio**

```bash
# Installazione servizio
sudo ./scripts/install-monitor.sh

# Controllo stato
sudo systemctl status gestionale-monitor

# Log servizio
sudo journalctl -u gestionale-monitor -f
```

### **3. Configurazione Crontab**

```bash
# Installazione minima (raccomandato)
./scripts/setup-cron.sh minimal

# Installazione completa
./scripts/setup-cron.sh install

# Verifica configurazione
./scripts/setup-cron.sh show
```

## 🚀 **UTILIZZO OPERATIVO**

### **Comandi Principali**

```bash
# Monitoraggio singolo
./scripts/monitor-stabilita.sh once

# Monitoraggio continuo
./scripts/monitor-stabilita.sh continuous

# Verifica stato
./scripts/monitor-stabilita.sh status

# Visualizza alert
./scripts/monitor-stabilita.sh alerts

# Pulizia log
./scripts/cleanup-logs.sh

# Configurazione cron
./scripts/setup-cron.sh minimal
```

### **Verifica Funzionamento**

```bash
# Controllo servizi
sudo systemctl status gestionale-dev
sudo systemctl status gestionale-monitor

# Verifica log
tail -f logs/stabilita-status.log
tail -f logs/stabilita-alerts.log

# Controllo crontab
crontab -l

# Verifica spazio log
du -sh logs/
```

## 📋 **SCHEDULAZIONE AUTOMATICA**

### **Crontab Minimo (Raccomandato)**

```
# Pulizia automatica log giornaliera
0 2 * * * /home/mauri/gestionale-fullstack/scripts/cleanup-logs.sh

# Monitoraggio stabilità ogni 10 minuti
*/10 * * * * /home/mauri/gestionale-fullstack/scripts/monitor-stabilita.sh once
```

### **Crontab Completo**

```
# Pulizia automatica log giornaliera
0 2 * * * /home/mauri/gestionale-fullstack/scripts/cleanup-logs.sh

# Monitoraggio stabilità ogni 5 minuti
*/5 * * * * /home/mauri/gestionale-fullstack/scripts/monitor-stabilita.sh once

# Backup settimanale script
0 3 * * 0 cp -r /home/mauri/gestionale-fullstack/scripts /home/mauri/gestionale-fullstack/logs/backup-scripts-$(date +%Y%m%d)

# Monitoraggio spazio disco orario
0 * * * * df -h | grep -E '^/dev/' > /home/mauri/gestionale-fullstack/logs/disk-usage-$(date +%Y%m%d).log

# Status servizi ogni 15 minuti
*/15 * * * * systemctl status gestionale-dev > /home/mauri/gestionale-fullstack/logs/service-status-$(date +%Y%m%d).log 2>&1
```

## 🔧 **MANUTENZIONE E TROUBLESHOOTING**

### **Problemi Comuni**

1. **Servizio non si avvia**
   ```bash
   sudo systemctl status gestionale-monitor
   sudo journalctl -u gestionale-monitor -n 50
   ```

2. **Log non ruotano**
   ```bash
   sudo logrotate -d /etc/logrotate.d/gestionale
   sudo logrotate /etc/logrotate.d/gestionale
   ```

3. **Crontab non esegue**
   ```bash
   crontab -l
   tail -f /var/log/syslog | grep CRON
   ```

4. **Permessi file log**
   ```bash
   ls -la logs/
   chmod 644 logs/*.log
   ```

### **Aggiornamenti**

```bash
# Aggiorna configurazione
sudo cp scripts/stabilita-config.conf /etc/gestionale/

# Riavvia servizio
sudo systemctl restart gestionale-monitor

# Ricarica logrotate
sudo logrotate /etc/logrotate.d/gestionale
```

## 📈 **MONITORAGGIO E REPORTING**

### **Metriche Disponibili**

- **Stabilità Sistema**: Uptime, reboot, crash
- **Performance**: CPU, memoria, disco
- **Servizi**: Stato, risposta, errori
- **Log**: Volume, errori, retention

### **Dashboard Operativo**

```bash
# Stato generale
./scripts/monitor-stabilita.sh status

# Alert recenti
./scripts/monitor-stabilita.sh alerts

# Spazio log
du -sh logs/

# Ultimi controlli
tail -20 logs/stabilita-status.log
```

## 🛡️ **SICUREZZA E BEST PRACTICE**

### **Principi Implementati**

1. **Separazione Responsabilità**: Ogni componente ha ruolo specifico
2. **Logging Sicuro**: Nessuna informazione sensibile nei log
3. **Permessi Minimale**: Accesso solo ai file necessari
4. **Audit Trail**: Tracciamento completo operazioni
5. **Rollback Plan**: Backup configurazioni prima modifiche

### **Configurazioni Sicurezza**

```bash
# Servizio systemd
PrivateTmp=true
ReadWritePaths=/home/mauri/gestionale-fullstack/logs
NoNewPrivileges=true

# Logrotate
su mauri mauri
create 644 mauri mauri
```

## 🔄 **INTEGRAZIONE CON SISTEMA ESISTENTE**

### **Compatibilità**

- ✅ **Systemd**: Integrazione nativa servizi
- ✅ **Logrotate**: Rotazione log standard Linux
- ✅ **Crontab**: Schedulazione standard Unix
- ✅ **Gestionale**: Monitoraggio specifico applicazione
- ✅ **Backup**: Integrazione sistema backup esistente

### **Estensioni Future**

- **Notifiche Email**: Alert via SMTP
- **Webhook**: Integrazione sistemi esterni
- **Grafana**: Dashboard grafici metriche
- **Prometheus**: Metriche time-series
- **ELK Stack**: Analisi log avanzata

## 📚 **RIFERIMENTI E DOCUMENTAZIONE**

### **File di Configurazione**

- `scripts/stabilita-config.conf` - Configurazione principale
- `scripts/logrotate-gestionale` - Configurazione rotazione log
- `scripts/gestionale-monitor.service` - Servizio systemd

### **Script Operativi**

- `scripts/monitor-stabilita.sh` - Monitoraggio principale
- `scripts/cleanup-logs.sh` - Pulizia automatica log
- `scripts/setup-cron.sh` - Configurazione crontab
- `scripts/install-monitor.sh` - Installazione servizio

### **Log e Output**

- `logs/stabilita-status.log` - Log completi monitoraggio
- `logs/stabilita-alerts.log` - Alert e problemi
- `logs/cleanup-report-*.txt` - Report pulizia
- `logs/crontab-backup-*.txt` - Backup configurazioni

---

**Ultimo aggiornamento**: 09/08/2025 - 11:20 CEST  
**Stato**: ✅ COMPLETATO - Sistema di monitoraggio stabilità implementato e funzionante  
**Prossima azione**: Nessuna - Sistema operativo e configurato  
**Responsabile**: Sistema automatico con supervisione umana
