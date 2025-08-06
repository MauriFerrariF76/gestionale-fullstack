# 📁 Configurazione NAS - Gestionale Fullstack

**Data:** $(date +%F)  
**Versione:** 1.0  
**Stato:** ✅ Configurato e Funzionante  

---

## 🎯 Panoramica

Il sistema utilizza un **NAS Synology** per i backup automatici e il ripristino del gestionale. La configurazione è già operativa e utilizzata dagli script di backup esistenti.

---

## 📋 Configurazione Tecnica

### **Hardware NAS**
- **Modello**: Synology NAS
- **IP**: `10.10.10.21`
- **Share**: `backup_gestionale`
- **Protocollo**: CIFS/SMB

### **Configurazione Server**
- **Mount Point**: `/mnt/backup_gestionale`
- **Credenziali**: `/root/.nas_gestionale_creds`
- **Permessi**: `uid=1000,gid=1000,file_mode=0770,dir_mode=0770`

### **Comando Mount Manuale**
```bash
sudo mount -t cifs //10.10.10.21/backup_gestionale /mnt/backup_gestionale \
  -o credentials=/root/.nas_gestionale_creds,iocharset=utf8,vers=2.0
```

---

## 📁 Struttura Directory NAS

```
/mnt/backup_gestionale/
├── database/                    # Backup database PostgreSQL
│   ├── gestionale_db_*.backup  # Backup database
│   └── backup_database_adaptive.log
├── server/                      # Backup configurazioni server
│   ├── *.conf                  # File configurazione
│   ├── *.sh                    # Script server
│   └── backup_config_server.log
├── logs/                        # Log di sistema
│   ├── backup_*.log
│   └── restore_*.log
├── config/                      # Configurazioni ripristino
│   └── restore_config.conf.gpg
├── restore_all.sh              # Script ripristino automatico
├── README_ripristino.md        # Istruzioni rapide
└── backup_config_server.log    # Log backup configurazioni
```

---

## 🔄 Script di Backup Esistenti

### **1. Backup Configurazioni Server**
- **Script**: `docs/server/backup_config_server.sh`
- **Fonte**: `/home/mauri/gestionale-fullstack/docs/server/`
- **Destinazione**: `/mnt/backup_gestionale/`
- **Frequenza**: Automatico (cron)

### **2. Backup Database PostgreSQL**
- **Script**: `docs/server/backup_database_adaptive.sh`
- **Database**: `gestionale_ferrari`
- **Destinazione**: `/mnt/backup_gestionale/database/`
- **Frequenza**: Automatico (cron)

### **3. Report Settimanale**
- **Script**: `scripts/backup_weekly_report.sh`
- **Funzione**: Report spazio e stato backup
- **Notifica**: Email automatica

---

## 🔐 Sicurezza e Credenziali

### **File Credenziali**
```bash
# /root/.nas_gestionale_creds
username=user_nas
password=password_nas
```

### **Permessi Sicuri**
```bash
# Imposta permessi sicuri
sudo chmod 600 /root/.nas_gestionale_creds
sudo chown root:root /root/.nas_gestionale_creds
```

### **Verifica Accesso**
```bash
# Testa connessione NAS
ls -la /mnt/backup_gestionale/

# Verifica credenziali
cat /root/.nas_gestionale_creds
```

---

## 🚀 Integrazione con Ripristino Automatico

### **Script Ripristino Aggiornati**
Gli script di ripristino automatico sono stati aggiornati per utilizzare la configurazione NAS esistente:

- **`scripts/restore_all.sh`**: Monta automaticamente il NAS
- **`scripts/setup_config.sh`**: Configura backup nel NAS
- **`docs/MANUALE/guida-ripristino-rapido.md`**: Istruzioni aggiornate

### **Flusso Automatico**
1. **Verifica NAS**: Controlla se il NAS è montato
2. **Montaggio Automatico**: Usa credenziali esistenti
3. **Copia Backup**: Recupera file dal NAS
4. **Ripristino**: Usa backup esistenti

---

## 📊 Monitoraggio e Log

### **Log Principali**
- **Backup Config**: `/mnt/backup_gestionale/backup_config_server.log`
- **Backup Database**: `/home/mauri/gestionale-fullstack/docs/server/backup_database_adaptive.log`
- **Report Settimanale**: Email automatica

### **Comandi Monitoraggio**
```bash
# Verifica spazio NAS
df -h /mnt/backup_gestionale/

# Conta backup database
ls -la /mnt/backup_gestionale/database/ | grep -c "\.backup"

# Controlla log recenti
tail -f /mnt/backup_gestionale/backup_config_server.log
```

---

## ⚠️ Risoluzione Problemi

### **Problema: "NAS non montato"**
```bash
# Verifica credenziali
sudo cat /root/.nas_gestionale_creds

# Monta manualmente
sudo mount -t cifs //10.10.10.21/backup_gestionale /mnt/backup_gestionale \
  -o credentials=/root/.nas_gestionale_creds,iocharset=utf8,vers=2.0

# Verifica montaggio
ls -la /mnt/backup_gestionale/
```

### **Problema: "Accesso negato"**
```bash
# Verifica permessi credenziali
ls -la /root/.nas_gestionale_creds

# Ricrea credenziali
sudo nano /root/.nas_gestionale_creds
# Formato: username=user\npassword=pass
```

### **Problema: "Spazio insufficiente"**
```bash
# Verifica spazio
df -h /mnt/backup_gestionale/

# Pulisci backup vecchi
find /mnt/backup_gestionale/database/ -name "*.backup" -mtime +7 -delete
```

---

## 📋 Checklist Manutenzione

### **Giornaliera**
- [ ] Verifica backup config: `tail -f /mnt/backup_gestionale/backup_config_server.log`
- [ ] Verifica backup database: `ls -la /mnt/backup_gestionale/database/`

### **Settimanale**
- [ ] Controlla spazio NAS: `df -h /mnt/backup_gestionale/`
- [ ] Verifica report email
- [ ] Controlla log errori

### **Mensile**
- [ ] Testa ripristino automatico
- [ ] Verifica credenziali NAS
- [ ] Aggiorna documentazione

---

## 🎯 Vantaggi della Configurazione

### **Integrazione Perfetta**
- ✅ **Script esistenti**: Funzionano senza modifiche
- ✅ **Backup automatici**: Già configurati e operativi
- ✅ **Ripristino automatico**: Usa backup esistenti
- ✅ **Monitoraggio**: Log e report automatici

### **Sicurezza**
- ✅ **Credenziali protette**: File con permessi sicuri
- ✅ **Backup cifrati**: Segreti protetti con GPG
- ✅ **Accesso controllato**: Solo server autorizzato

### **Manutenzione**
- ✅ **Configurazione stabile**: Testata e operativa
- ✅ **Log dettagliati**: Tracciabilità completa
- ✅ **Recovery robusto**: Fallback multipli

---

**📁 Questa configurazione NAS è già operativa e utilizzata per i backup automatici del gestionale.**