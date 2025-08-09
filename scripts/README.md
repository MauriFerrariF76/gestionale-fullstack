# 🔧 Script Essenziali Gestionale - SVILUPPO NATIVO

## 📋 Descrizione
Script essenziali per la gestione del gestionale aziendale in ambiente di sviluppo NATIVO.

## 📁 Script Disponibili

### 🛠️ Sviluppo e Manutenzione
- **`setup-ambiente-sviluppo.sh`** - Setup ambiente di sviluppo NATIVO
- **`start-sviluppo.sh`** - Avvio ambiente di sviluppo NATIVO
- **`stop-sviluppo.sh`** - Arresto ambiente di sviluppo NATIVO
- **`database-setup-dev.sh`** - Configurazione database sviluppo
- **`config.sh`** - Configurazione centralizzata

### 🔐 Gestione Segreti
- **`setup_secrets.sh`** - Setup iniziale dei segreti
- **`restore_secrets.sh`** - Ripristino dei segreti

### 💾 Backup e Test
- **`backup/backup.sh`** - Backup unificato (database|secrets|configs|development)
- **`test_restore_backup_dynamic.sh`** - Test dinamico del restore dei backup database

### ⚡ Ottimizzazione
- **`ottimizza-prestazioni.sh`** - Ottimizzazione prestazioni sistema

## 🎯 Utilizzo

### Setup Ambiente Sviluppo
```bash
# Setup completo ambiente sviluppo
sudo ./scripts/setup-ambiente-sviluppo.sh
```

### Avvio Sviluppo
```bash
# Avvio ambiente sviluppo
./scripts/start-sviluppo.sh
```

### Arresto Sviluppo
```bash
# Arresto ambiente sviluppo
./scripts/stop-sviluppo.sh
```

### Configurazione Database
```bash
# Setup database sviluppo
./scripts/database-setup-dev.sh
```

### Gestione Segreti
```bash
# Setup iniziale
./scripts/setup_secrets.sh

# Ripristino segreti
./scripts/restore_secrets.sh
```

### Backup
```bash
# Backup database (schema)
./scripts/backup/backup.sh database schema

# Backup segreti
./scripts/backup/backup.sh secrets

# Backup config
./scripts/backup/backup.sh configs

# Backup ambiente sviluppo
./scripts/backup/backup.sh development

# Test restore backup
./scripts/test_restore_backup_dynamic.sh
```

### Ottimizzazione
```bash
# Ottimizzazione prestazioni
./scripts/ottimizza-prestazioni.sh
```

## 🔒 Sicurezza

- **Backup crittografati**: I backup sono protetti con GPG
- **Segreti isolati**: I segreti sono gestiti separatamente
- **Ripristino sicuro**: Verifiche di integrità durante il ripristino
- **Test automatici**: Verifica automatica dei backup database

## 📊 Statistiche

- **Script sviluppo**: 12 (aggiornato)
- **Script produzione**: Rimossi (ancora in sviluppo)
- **Funzionalità**: Setup, sviluppo, backup, gestione segreti, test
- **Manutenzione**: Semplificata e centralizzata

## 📁 Organizzazione

```
scripts/
├── README.md                    # Questo file
├── config.sh                    # Configurazione centralizzata
├── setup-ambiente-sviluppo.sh   # Setup ambiente sviluppo
├── start-sviluppo.sh           # Avvio sviluppo
├── stop-sviluppo.sh            # Arresto sviluppo
├── database-setup-dev.sh       # Setup database sviluppo
├── setup_secrets.sh            # Setup segreti
├── restore_secrets.sh          # Ripristino segreti
├── restore-secrets-file.sh     # Ripristino file credenziali
├── backup/backup.sh            # Backup unificato
├── test_restore_backup_dynamic.sh # Test restore
└── ottimizza-prestazioni.sh    # Ottimizzazione
```

---
**Versione**: v2.2.0  
**Autore**: Mauri Ferrari 