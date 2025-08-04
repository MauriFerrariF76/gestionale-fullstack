# Checklist Aggiornamento Sicuro - Gestionale Fullstack

## Panoramica
Questa checklist definisce le best practices per aggiornamenti sicuri del gestionale, garantendo continuità operativa e minimizzazione dei rischi.

**Versione**: 1.0  
**Data**: $(date +%Y-%m-%d)  
**Stato**: ✅ ATTIVA  
**Server Test**: 10.10.10.15  

---

## 🛡️ BEST PRACTICES - AGGIORNAMENTO SICURO

### 1. BACKUP PRIMA DI TUTTO

#### Backup Pre-Aggiornamento (OBBLIGATORIO)
- [ ] **Backup database completo**: `scripts/backup_completo_docker.sh`
  - Verifica integrità backup
  - Test restore su ambiente isolato
  - Conserva backup per 30 giorni
- [ ] **Backup configurazioni**: `docs/server/backup_config_server.sh`
  - File di configurazione Docker
  - Configurazioni Nginx
  - Certificati SSL
- [ ] **Backup codice**: Git commit e push
  - Tag della versione corrente
  - Branch di backup
- [ ] **Snapshot VM** (se disponibile)
  - Snapshot completo del server
  - Etichetta con data e versione

#### Verifica Backup
- [ ] **Test restore database**: Su ambiente isolato
- [ ] **Verifica integrità**: Controllo checksum
- [ ] **Spazio disponibile**: Minimo 50GB liberi
- [ ] **Documentazione backup**: Registra timestamp e posizione

---

### 2. TEST INCREMENTALE

#### Ambiente di Test (10.10.10.15)
- [ ] **Clone ambiente**: Replica esatta produzione
  - Database clone
  - Configurazioni identiche
  - Dati di test realistici
- [ ] **Test funzionalità base**:
  - Login/logout utenti
  - CRUD operazioni principali
  - Report e statistiche
  - Upload/download documenti
- [ ] **Test performance**:
  - Tempo di risposta API
  - Caricamento pagine frontend
  - Concorrenza utenti
- [ ] **Test sicurezza**:
  - Autenticazione JWT
  - Rate limiting
  - Validazione input
  - Permessi utenti

#### Test Incrementali
- [ ] **Aggiornamento backend**: Solo Node.js/Express
  - Test API endpoints
  - Verifica connessione database
  - Controllo log errori
- [ ] **Aggiornamento frontend**: Solo Next.js/React
  - Test interfaccia utente
  - Verifica routing
  - Controllo responsive design
- [ ] **Aggiornamento database**: Solo schema/modifiche
  - Test migrazioni
  - Verifica integrità dati
  - Controllo performance query

---

### 3. ROLLBACK PLAN

#### Piano di Rollback Automatico
- [ ] **Script rollback**: `scripts/rollback_emergenza.sh`
  - Ripristino database da backup
  - Rollback codice Git
  - Ripristino configurazioni
- [ ] **Trigger automatici**:
  - Health check fallito
  - Errori critici nei log
  - Tempo di risposta > 5 secondi
- [ ] **Notifiche rollback**:
  - Email amministratore
  - Log dettagliato
  - Registrazione motivo

#### Rollback Manuale
- [ ] **Procedura documentata**: `/docs/MANUALE/guida-rollback.md`
- [ ] **Tempi massimi**:
  - Rollback completo: < 15 minuti
  - Ripristino database: < 10 minuti
  - Rollback codice: < 5 minuti
- [ ] **Verifica post-rollback**:
  - Test funzionalità critiche
  - Verifica integrità dati
  - Controllo log errori

---

### 4. MONITORAGGIO

#### Monitoraggio Pre-Aggiornamento
- [ ] **Baseline performance**:
  - Tempo di risposta medio
  - Utilizzo CPU/memoria
  - Connessioni database
  - Spazio disco
- [ ] **Alert configurazione**:
  - Notifiche email attive
  - Log monitoring attivo
  - Health checks funzionanti

#### Monitoraggio Durante Aggiornamento
- [ ] **Monitoraggio real-time**:
  - Log errori in tempo reale
  - Metriche performance
  - Stato servizi Docker
  - Connessioni utenti attive
- [ ] **Alert automatici**:
  - Errori critici
  - Performance degradata
  - Servizi down
  - Database disconnesso

#### Monitoraggio Post-Aggiornamento
- [ ] **Verifica 24/7**:
  - Controllo ogni ora per 24 ore
  - Monitoraggio errori log
  - Verifica performance
  - Test funzionalità critiche
- [ ] **Report post-aggiornamento**:
  - Statistiche performance
  - Errori riscontrati
  - Tempo di downtime
  - Note operative

---

## 🚀 PROCEDURA DI TEST SU 10.10.10.15

### Setup Ambiente Test
```bash
# 1. Clona ambiente produzione
cd /home/mauri/gestionale-fullstack
git checkout -b test-aggiornamento-$(date +%Y%m%d)

# 2. Backup pre-test
./scripts/backup_completo_docker.sh
./docs/server/backup_config_server.sh

# 3. Setup ambiente isolato
docker-compose -f docker-compose.test.yml up -d
```

### Test Incrementali Specifici

#### Test Backend (Node.js/Express)
- [ ] **Aggiornamento dipendenze**:
  ```bash
  cd backend
  npm audit
  npm update --save
  npm test
  ```
- [ ] **Test API endpoints**:
  - Login/logout
  - CRUD clienti/fornitori
  - Upload documenti
  - Report generazione
- [ ] **Test sicurezza**:
  - JWT token validazione
  - Rate limiting
  - Input sanitization

#### Test Frontend (Next.js/React)
- [ ] **Aggiornamento dipendenze**:
  ```bash
  cd frontend
  npm audit
  npm update --save
  npm run build
  npm run test
  ```
- [ ] **Test interfaccia**:
  - Navigazione pagine
  - Form submission
  - Responsive design
  - Browser compatibility

#### Test Database (PostgreSQL)
- [ ] **Test migrazioni**:
  ```bash
  cd backend
  npm run migrate:test
  npm run seed:test
  ```
- [ ] **Test integrità**:
  - Foreign key constraints
  - Data validation
  - Performance query

### Criteri di Successo
- [ ] **Performance**: Tempo risposta < 2 secondi
- [ ] **Errori**: 0 errori critici nei log
- [ ] **Funzionalità**: 100% test passati
- [ ] **Sicurezza**: Nessuna vulnerabilità rilevata
- [ ] **Compatibilità**: Funzionamento su browser target

---

## 📋 CHECKLIST OPERATIVA AGGIORNAMENTO

### Pre-Aggiornamento (24 ore prima)
- [ ] **Notifica utenti**: Comunicazione downtime
- [ ] **Backup completo**: Database + configurazioni
- [ ] **Test ambiente**: Verifica 10.10.10.15
- [ ] **Documentazione**: Aggiorna procedure
- [ ] **Team disponibile**: Supporto durante aggiornamento

### Durante Aggiornamento
- [ ] **Monitoraggio continuo**: Log e performance
- [ ] **Test incrementali**: Backend → Frontend → Database
- [ ] **Rollback ready**: Script pronti per emergenza
- [ ] **Comunicazione**: Status update ogni 30 minuti

### Post-Aggiornamento (24 ore dopo)
- [ ] **Monitoraggio intensivo**: Ogni ora per 24 ore
- [ ] **Test funzionalità**: Tutte le feature critiche
- [ ] **Performance check**: Confronto con baseline
- [ ] **Documentazione**: Aggiorna note operative
- [ ] **Notifica successo**: Comunicazione agli utenti

---

## 🔧 SCRIPT UTILI

### Script di Test
- **Test completo**: `scripts/test-aggiornamento-completo.sh`
- **Test incrementale**: `scripts/test-incrementale.sh`
- **Test rollback**: `scripts/test-rollback.sh`
- **Monitoraggio**: `scripts/monitor-aggiornamento.sh`

### Script di Emergenza
- **Rollback automatico**: `scripts/rollback-automatico.sh`
- **Ripristino backup**: `scripts/restore-aggiornamento.sh`
- **Alert emergenza**: `scripts/alert-emergenza.sh`

---

## 📊 METRICHE DI SUCCESSO

### Performance
- **Tempo risposta**: < 2 secondi (95 percentile)
- **Uptime**: > 99.9%
- **Errori**: < 0.1% delle richieste
- **Downtime**: < 15 minuti per aggiornamento

### Sicurezza
- **Vulnerabilità**: 0 vulnerabilità critiche
- **Test sicurezza**: 100% test passati
- **Audit log**: Tutte le azioni tracciate
- **Backup**: 100% backup verificati

### Funzionalità
- **Test coverage**: > 90%
- **Funzionalità critiche**: 100% operative
- **Compatibilità**: Tutti i browser target
- **Usabilità**: Nessuna regressione UX

---

## 📝 NOTE OPERATIVE

### Configurazioni Critiche
- **Server Test**: 10.10.10.15
- **Ambiente**: Isolato da produzione
- **Backup**: Conservazione 30 giorni
- **Rollback**: Tempo massimo 15 minuti

### Contatti Emergenza
- **Amministratore**: mauri@dominio.com
- **Supporto tecnico**: support@dominio.com
- **Log centralizzati**: `/backup/logs/`

### Documentazione Correlata
- **Checklist operativa**: `/docs/SVILUPPO/checklist-operativa-unificata.md`
- **Guida backup**: `/docs/MANUALE/guida-backup-e-ripristino.md`
- **Procedura rollback**: `/docs/MANUALE/guida-rollback.md`

---

**Nota**: Questa checklist garantisce aggiornamenti sicuri seguendo le best practices: backup completo, test incrementali, piano di rollback e monitoraggio continuo. Ogni aggiornamento deve seguire rigorosamente questa procedura. 