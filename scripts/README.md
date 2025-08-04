# 🔧 Script Essenziali Gestionale

## 📋 Descrizione
Script essenziali per la gestione del gestionale aziendale.

## 📁 Script Disponibili

### 🚀 Deploy e Installazione
- **`install-gestionale-completo.sh`** - Deploy automatico completo (Docker-based)

### 💾 Backup e Ripristino
- **`backup_completo_docker.sh`** - Backup completo del sistema Docker
- **`restore_unified.sh`** - Ripristino unificato del sistema

### 🔐 Gestione Segreti
- **`setup_secrets.sh`** - Setup iniziale dei segreti
- **`backup_secrets.sh`** - Backup dei segreti
- **`restore_secrets.sh`** - Ripristino dei segreti

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

### Gestione Segreti
```bash
# Setup iniziale
sudo ./scripts/setup_secrets.sh

# Backup segreti
sudo ./scripts/backup_secrets.sh

# Ripristino segreti
sudo ./scripts/restore_secrets.sh
```

## 🔒 Sicurezza

- **Backup crittografati**: I backup sono protetti con GPG
- **Segreti isolati**: I segreti sono gestiti separatamente
- **Ripristino sicuro**: Verifiche di integrità durante il ripristino

## 📊 Statistiche

- **Script totali**: 6 (ridotti da 22)
- **Funzionalità**: Deploy, backup, ripristino, gestione segreti
- **Manutenzione**: Semplificata e centralizzata

---
**Versione**: v2.0.0  
**Autore**: Mauri Ferrari 