# Automazione Essenziale - Gestionale Fullstack

## Panoramica

Questo documento descrive l'automazione essenziale implementata per garantire **manutenzione quasi zero** del gestionale, mantenendo solo i controlli di sicurezza critici.

## Componenti Automatizzati

### 1. **Dependabot - Sicurezza Automatica**
- **File**: `.github/dependabot.yml`
- **Funzione**: Monitora automaticamente vulnerabilità di sicurezza
- **Frequenza**: Controllo settimanale (lunedì 09:00)
- **Azione**: Crea Pull Request solo per aggiornamenti di sicurezza
- **Copertura**: 
  - Dipendenze npm (backend e frontend)
  - GitHub Actions

### 2. **Backup Automatico**
- **Script**: `scripts/backup-automatico.sh`
- **Frequenza**: Giornaliero (02:00)
- **Cosa fa**:
  - Backup database PostgreSQL
  - Backup codice Git
  - Backup configurazioni (nginx, config, secrets)
  - Pulizia backup vecchi (30 giorni)
  - Verifica spazio disco

### 3. **Monitoraggio Base**
- **Script**: `scripts/monitoraggio-base.sh`
- **Frequenza**: Ogni 6 ore (02:00, 08:00, 14:00, 20:00)
- **Controlli**:
  - Server online
  - Database connesso
  - Certificato SSL valido
  - Spazio disco
  - Container Docker attivi

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

# Test manuale backup
./scripts/backup-automatico.sh

# Test manuale monitoraggio
./scripts/monitoraggio-base.sh
```

## File di Log

- **Backup**: `/backup/backup.log`
- **Monitoraggio**: `/backup/monitoraggio.log`
- **Alert**: `/backup/alert.log`

## Manutenzione

### Controlli Periodici (Mensili)

1. **Verifica log**: Controlla file di log per errori
2. **Spazio disco**: Verifica che non sia pieno
3. **Dependabot**: Controlla Pull Request di sicurezza

### Interventi Manuali Solo Se:

- 🔴 **Vulnerabilità critica**: Applica aggiornamenti Dependabot
- 🔴 **Server down**: Riavvia servizi
- 🔴 **Database offline**: Riavvia container PostgreSQL
- 🔴 **SSL scaduto**: Rinnova certificato Let's Encrypt
- 🔴 **Spazio disco pieno**: Pulisci backup vecchi

## Rimozione Automazione

```bash
# Rimuovi tutti i job cron
crontab -r

# Rimuovi file Dependabot
rm .github/dependabot.yml
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

### Modifica Retention Backup

In `scripts/backup-automatico.sh`, cambia:
```bash
RETENTION_DAYS=30  # Giorni di retention
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

### Dependabot Non Funziona
- Verifica che il repository sia su GitHub
- Controlla le impostazioni del repository
- Verifica che il file `.github/dependabot.yml` sia presente

## Sicurezza

- ✅ Solo aggiornamenti di sicurezza (no funzionalità)
- ✅ Backup crittografati (se necessario)
- ✅ Log di tutte le operazioni
- ✅ Alert automatici per problemi critici
- ✅ Retention automatica dei backup

## Benefici

- 🚀 **Manutenzione quasi zero**: Sistema gira da solo
- 🔒 **Sicurezza automatica**: Vulnerabilità scoperte automaticamente
- 💾 **Backup automatici**: Dati sempre protetti
- 📊 **Monitoraggio continuo**: Problemi rilevati subito
- ⚡ **Interventi solo in emergenza**: Nessuna manutenzione preventiva

---

**Nota**: Questa automazione è progettata per essere "set and forget". Una volta configurata, richiede interventi manuali solo in caso di emergenze o vulnerabilità critiche. 