# Automazione Essenziale - Gestionale Fullstack

## Panoramica

Questo documento descrive l'automazione essenziale implementata per garantire **manutenzione quasi zero** del gestionale, mantenendo solo i controlli di sicurezza critici.

**IMPORTANTE**: L'automazione si **integra** con il sistema di backup esistente, non lo sostituisce.

## Componenti Automatizzati

### 1. **Dependabot - Sicurezza Automatica**
- **File**: `.github/dependabot.yml`
- **Funzione**: Monitora automaticamente vulnerabilità di sicurezza
- **Frequenza**: Controllo settimanale (lunedì 09:00)
- **Azione**: Crea Pull Request solo per aggiornamenti di sicurezza
- **Copertura**: 
  - Dipendenze npm (backend e frontend)
  - GitHub Actions

### 2. **Backup Integrato (NON duplicato)**
- **Script**: `scripts/backup-automatico.sh`
- **Frequenza**: Giornaliero (02:00)
- **Integrazione con backup esistenti**:
  - ✅ **Backup principali**: `docs/server/backup_docker_automatic.sh` (su NAS)
  - ✅ **Backup configurazioni**: `docs/server/backup_config_server.sh` (su NAS)
  - ✅ **Backup emergenza**: Locale (solo se NAS non disponibile)
  - ✅ **Backup Git**: Sempre locale (aggiuntivo)

### 3. **Monitoraggio Base**
- **Script**: `scripts/monitoraggio-base.sh`
- **Frequenza**: Ogni 6 ore (02:00, 08:00, 14:00, 20:00)
- **Controlli**:
  - Server online
  - Database connesso
  - Certificato SSL valido
  - Spazio disco
  - Container Docker attivi

## Architettura Backup

### **Sistema Backup Completo**

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA BACKUP INTEGRATO                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔒 BACKUP PRINCIPALI (NAS)                                │
│  ├── docs/server/backup_docker_automatic.sh               │
│  │   ├── Database PostgreSQL (cifrato)                    │
│  │   ├── Segreti Docker (cifrati)                         │
│  │   ├── Test restore automatico                          │
│  │   └── Notifiche email                                  │
│  │                                                        │
│  ├── docs/server/backup_config_server.sh                  │
│  │   ├── Configurazioni server                            │
│  │   ├── Chiavi JWT (cifrate)                            │
│  │   └── Sincronizzazione NAS                             │
│  │                                                        │
│  🚨 BACKUP EMERGENZA (Locale)                             │
│  ├── scripts/backup-automatico.sh                         │
│  │   ├── Git (sempre locale)                              │
│  │   ├── Database (solo se NAS non disponibile)          │
│  │   └── Configurazioni (solo se NAS non disponibile)    │
│  │                                                        │
│  📊 MONITORAGGIO                                           │
│  └── scripts/monitoraggio-base.sh                         │
│      ├── Controllo server                                 │
│      ├── Controllo database                               │
│      ├── Controllo SSL                                    │
│      └── Alert automatici                                 │
└─────────────────────────────────────────────────────────────┘
```

## Configurazione

### Setup Iniziale

```bash
# Esegui lo script di setup
./scripts/setup-automazione.sh
```

### Verifica Configurazione

```bash
# Vedi job cron attivi
crontab -l

# Test manuale backup integrato
./scripts/backup-automatico.sh

# Test manuale monitoraggio
./scripts/monitoraggio-base.sh
```

## File di Log

- **Backup integrato**: `/backup/backup.log`
- **Monitoraggio**: `/backup/monitoraggio.log`
- **Alert**: `/backup/alert.log`
- **Backup NAS**: `/docs/server/backup_*.log`

## Manutenzione

### Controlli Periodici (Mensili)

1. **Verifica log**: Controlla file di log per errori
2. **Spazio disco**: Verifica che non sia pieno
3. **Dependabot**: Controlla Pull Request di sicurezza
4. **Backup NAS**: Verifica che i backup su NAS funzionino

### Interventi Manuali Solo Se:

- 🔴 **Vulnerabilità critica**: Applica aggiornamenti Dependabot
- 🔴 **Server down**: Riavvia servizi
- 🔴 **Database offline**: Riavvia container PostgreSQL
- 🔴 **SSL scaduto**: Rinnova certificato Let's Encrypt
- 🔴 **Spazio disco pieno**: Pulisci backup vecchi
- 🔴 **NAS non disponibile**: Verifica connessione NAS

## Differenze con Backup Esistenti

### **Backup Principali (NAS) - ESISTENTI**
- ✅ Database PostgreSQL (cifrato)
- ✅ Segreti Docker (cifrati)
- ✅ Configurazioni server
- ✅ Chiavi JWT (cifrate)
- ✅ Test restore automatico
- ✅ Notifiche email
- ✅ Report settimanali

### **Backup Emergenza (Locale) - NUOVI**
- ✅ Git (sempre salvato)
- ✅ Database (solo se NAS non disponibile)
- ✅ Configurazioni (solo se NAS non disponibile)
- ✅ Retention breve (7 giorni)
- ✅ Verifica integrità backup esistenti

## Rimozione Automazione

```bash
# Rimuovi solo i job cron aggiuntivi
crontab -r

# Rimuovi file Dependabot
rm .github/dependabot.yml

# I backup principali rimangono attivi
```

## Personalizzazione

### Modifica URL Monitoraggio

In `scripts/monitoraggio-base.sh`, cambia:
```bash
WEBSITE_URL="https://tuodominio.com"  # Il tuo dominio
```

### Modifica Frequenza Backup

In `scripts/setup-automazione.sh`, cambia:
```bash
# Backup giornaliero alle 02:00
echo "0 2 * * * $BACKUP_SCRIPT ..."
```

### Modifica Retention Backup Emergenza

In `scripts/backup-automatico.sh`, cambia:
```bash
RETENTION_DAYS=7  # Giorni di retention backup emergenza
```

## Troubleshooting

### Backup Non Funziona
```bash
# Verifica permessi
ls -la scripts/backup-automatico.sh

# Test manuale
./scripts/backup-automatico.sh

# Verifica log
tail -f backup/backup.log
```

### Monitoraggio Non Funziona
```bash
# Verifica URL
curl -I https://tuodominio.com

# Test manuale
./scripts/monitoraggio-base.sh

# Verifica log
tail -f backup/monitoraggio.log
```

### Backup NAS Non Funziona
```bash
# Verifica script esistenti
ls -la docs/server/backup_*.sh

# Test manuale backup Docker
./docs/server/backup_docker_automatic.sh

# Verifica log NAS
tail -f docs/server/backup_docker.log
```

### Dependabot Non Funziona
- Verifica che il repository sia su GitHub
- Controlla le impostazioni del repository
- Verifica che il file `.github/dependabot.yml` sia presente

## Sicurezza

- ✅ Solo aggiornamenti di sicurezza (no funzionalità)
- ✅ Backup cifrati su NAS (esistenti)
- ✅ Backup emergenza locale
- ✅ Log di tutte le operazioni
- ✅ Alert automatici per problemi critici
- ✅ Retention automatica dei backup

## Benefici

- 🚀 **Manutenzione quasi zero**: Sistema gira da solo
- 🔒 **Sicurezza automatica**: Vulnerabilità scoperte automaticamente
- 💾 **Backup ridondanti**: NAS + locale di emergenza
- 📊 **Monitoraggio continuo**: Problemi rilevati subito
- ⚡ **Interventi solo in emergenza**: Nessuna manutenzione preventiva
- 🔄 **Integrazione intelligente**: Non duplica, integra

---

**Nota**: Questa automazione si integra con il sistema di backup esistente, fornendo backup di emergenza e monitoraggio aggiuntivo senza duplicare le funzionalità già presenti. 