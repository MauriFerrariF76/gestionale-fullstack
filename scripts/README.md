# 🔧 Script Essenziali Gestionale

## 📋 Descrizione
Script essenziali per la gestione del gestionale aziendale.

## 📁 Script Disponibili

### 🚀 Deploy e Installazione
- **`install-gestionale-completo.sh`** - Deploy automatico completo (Docker-based)

### 💾 Backup e Ripristino
- **`backup_completo_docker.sh`** - Backup completo del sistema Docker
- **`restore_unified.sh`** - Ripristino unificato del sistema
- **`backup_weekly_report.sh`** - Report settimanale automatico dei backup
- **`test_restore_backup_dynamic.sh`** - Test dinamico del restore dei backup database

### 🔐 Gestione Segreti
- **`setup_secrets.sh`** - Setup iniziale dei segreti
- **`backup_secrets.sh`** - Backup dei segreti
- **`restore_secrets.sh`** - Ripristino dei segreti

### 🛠️ Sviluppo e Manutenzione
- **`setup-ambiente-sviluppo.sh`** - Setup ambiente di sviluppo
- **`sync-dev-to-prod.sh`** - Sincronizzazione da sviluppo a produzione
- **`start-sviluppo.sh`** - Avvio ambiente di sviluppo
- **`stop-sviluppo.sh`** - Arresto ambiente di sviluppo
- **`backup-sviluppo.sh`** - Backup ambiente di sviluppo

## 🎯 Utilizzo

### Deploy Automatico
```bash
# Dalla directory principale
sudo ./scripts/install-gestionale-completo.sh
```

### Backup Completo
```bash
# Backup di tutto il sistema
sudo ./scripts/backup_completo_docker.sh
```

### Ripristino Completo
```bash
# Ripristino del sistema
sudo ./scripts/restore_unified.sh
```

### Test Backup Database
```bash
# Test dinamico del restore
sudo ./scripts/test_restore_backup_dynamic.sh
```

### Report Settimanale
```bash
# Genera e invia report settimanale backup
sudo ./scripts/backup_weekly_report.sh
```

### Gestione Segreti
```bash
# Setup iniziale
sudo ./scripts/setup_secrets.sh

# Backup segreti
sudo ./scripts/backup_secrets.sh

# Ripristino segreti
sudo ./scripts/restore_secrets.sh
```

### Ambiente di Sviluppo
```bash
# Setup ambiente
sudo ./scripts/setup-ambiente-sviluppo.sh

# Avvio sviluppo
sudo ./scripts/start-sviluppo.sh

# Arresto sviluppo
sudo ./scripts/stop-sviluppo.sh

# Backup sviluppo
sudo ./scripts/backup-sviluppo.sh

# Sync dev-to-prod
sudo ./scripts/sync-dev-to-prod.sh
```

## 🔒 Sicurezza

- **Backup crittografati**: I backup sono protetti con GPG
- **Segreti isolati**: I segreti sono gestiti separatamente
- **Ripristino sicuro**: Verifiche di integrità durante il ripristino
- **Test automatici**: Verifica automatica dei backup database

## 📊 Statistiche

- **Script totali**: 13 (aggiornato)
- **Funzionalità**: Deploy, backup, ripristino, gestione segreti, sviluppo, test
- **Manutenzione**: Semplificata e centralizzata

---
**Versione**: v2.1.0  
**Autore**: Mauri Ferrari 