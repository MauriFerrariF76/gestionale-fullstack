# Guida Aggiornamento Sicuro - Gestionale Fullstack

## Panoramica
Questa guida pratica spiega come utilizzare le best practices per aggiornamenti sicuri del gestionale, garantendo continuità operativa e minimizzazione dei rischi.

**Versione**: 1.0  
**Data**: $(date +%Y-%m-%d)  
**Server Test**: 10.10.10.15  

---

## 🎯 OBIETTIVI

### Perché Aggiornamenti Sicuri?
- **Continuità operativa**: Zero downtime per gli utenti
- **Minimizzazione rischi**: Backup e rollback automatici
- **Qualità**: Test completi prima del rilascio
- **Monitoraggio**: Controllo continuo delle performance
- **Resilienza**: Sistema sempre operativo

### Best Practices Implementate
1. **Backup prima di tutto** - Backup completo pre-aggiornamento
2. **Test incrementali** - Test graduali su ambiente isolato
3. **Rollback plan** - Piano di ripristino automatico
4. **Monitoraggio** - Controllo continuo 24/7

---

## 🚀 PROCEDURA COMPLETA

### Fase 1: Preparazione (24 ore prima)

#### 1.1 Notifica e Pianificazione
```bash
# Notifica utenti del downtime pianificato
echo "Aggiornamento pianificato per domani alle 02:00"
echo "Durata stimata: 30 minuti"
echo "Sistema sarà offline durante l'aggiornamento"
```

#### 1.2 Backup Pre-Aggiornamento
```bash
# Esegui backup completo
cd /home/mauri/gestionale-fullstack
./scripts/backup_completo_docker.sh

# Se lo script fallisce, usa backup manuale:
docker exec gestionale_postgres pg_dump -U gestionale_user gestionale > backup/db_backup_$(date +%Y-%m-%d_%H%M%S).sql

# Verifica integrità backup
ls -la /home/mauri/backup/db_*.sql | tail -1
```

#### 1.3 Preparazione Ambiente Test
```bash
# Clona ambiente su server test
ssh mauri@10.10.10.15
cd /home/mauri/gestionale-fullstack
git checkout -b test-aggiornamento-$(date +%Y%m%d)
```

### Fase 2: Test su Ambiente Isolato

#### 2.1 Test Completo
```bash
# Esegui test completo su 10.10.10.15
./scripts/test-aggiornamento-completo.sh

# Se lo script fallisce, usa test manuali:
cd backend && npm audit && npm update --save && npm run build
cd frontend && npm audit && npm run build
docker exec gestionale_postgres psql -U gestionale_user -d gestionale -c "SELECT 1;"

# Verifica risultati
cat /home/mauri/backup/reports/test-report-*.md | tail -1
```

#### 2.2 Test Incrementali
```bash
# Test solo backend
cd backend
npm audit
npm update --save
npm test

# Test solo frontend
cd ../frontend
npm audit
npm update --save
npm run build
npm test

# Test database
cd ../backend
npm run migrate:test
```

#### 2.3 Criteri di Successo
- ✅ **Performance**: Tempo risposta < 2 secondi
- ✅ **Errori**: 0 errori critici nei log
- ✅ **Funzionalità**: 100% test passati
- ✅ **Sicurezza**: Nessuna vulnerabilità rilevata

### Fase 3: Aggiornamento Produzione

#### 3.1 Pre-Aggiornamento
```bash
# Avvia monitoraggio pre-aggiornamento
./scripts/monitor-aggiornamento.sh pre

# Se lo script fallisce, usa controlli manuali:
docker stats --no-stream
docker logs gestionale_backend --tail 10
curl -s -w "%{time_total}" -o /dev/null http://localhost:3001/health

# Verifica baseline performance
curl -s http://localhost:3001/api/health
docker stats --no-stream
```

#### 3.2 Esecuzione Aggiornamento
```bash
# 1. Stop servizi
docker-compose down

# 2. Backup finale
./scripts/backup_completo_docker.sh

# 3. Aggiornamento backend
cd backend
npm update --save
npm test

# 4. Aggiornamento frontend
cd ../frontend
npm update --save
npm run build

# 5. Riavvio servizi
docker-compose up -d
```

#### 3.3 Verifica Post-Aggiornamento
```bash
# Test immediato
curl -s http://localhost:3001/api/health
curl -s http://localhost:3000

# Avvia monitoraggio post-aggiornamento
./scripts/monitor-aggiornamento.sh post
```

### Fase 4: Monitoraggio 24/7

#### 4.1 Monitoraggio Continuo
```bash
# Avvia monitoraggio per 24 ore
./scripts/monitor-aggiornamento.sh continuous 1440 30

# Controllo manuale ogni ora
./scripts/monitor-aggiornamento.sh test
```

#### 4.2 Alert Automatici
- **Email alert**: Inviato automaticamente in caso di problemi
- **Log centralizzati**: `/home/mauri/backup/logs/`
- **Report automatici**: `/home/mauri/backup/reports/`

---

## 🔄 ROLLBACK AUTOMATICO

### Quando si Attiva
Il rollback automatico si attiva quando:
- Health check fallisce per 3 volte consecutive
- Errori critici nei log > 10
- Tempo di risposta > 5 secondi
- Servizi Docker non attivi

### Esecuzione Rollback
```bash
# Rollback automatico
./scripts/rollback-automatico.sh auto

# Rollback manuale
./scripts/rollback-automatico.sh manual
```

### Cosa Fa il Rollback
1. **Ripristino database** dal backup più recente
2. **Rollback configurazioni** Docker e Nginx
3. **Rollback codice** Git al tag precedente
4. **Verifica post-rollback** di tutti i servizi
5. **Monitoraggio continuo** per 10 minuti

### Tempi di Rollback
- **Rollback completo**: < 15 minuti
- **Ripristino database**: < 10 minuti
- **Rollback codice**: < 5 minuti

---

## 📊 MONITORAGGIO E METRICHE

### Metriche da Monitorare
```bash
# Performance API
curl -s -w "%{time_total}" -o /dev/null http://localhost:3001/api/health

# Utilizzo risorse Docker
docker stats --no-stream

# Errori nei log
docker logs gestionale-backend 2>&1 | grep -c "ERROR"

# Spazio disco
df /home/mauri
```

### Baseline Performance
- **Tempo risposta API**: < 2 secondi
- **CPU Backend**: < 80%
- **Memoria Backend**: < 80%
- **Spazio disco**: < 90%
- **Errori log**: < 10 per ora

### Alert Automatici
- **Email critico**: Problemi che richiedono intervento immediato
- **Email warning**: Degradazione performance
- **Log dettagliato**: Tutti gli eventi tracciati

---

## 🛠️ SCRIPT UTILI

### Test e Verifica
```bash
# Test completo sistema
./scripts/test-aggiornamento-completo.sh

# Test singolo
./scripts/monitor-aggiornamento.sh test

# Monitoraggio continuo (60 minuti)
./scripts/monitor-aggiornamento.sh continuous 60 30
```

### Rollback e Emergenza
```bash
# Rollback automatico
./scripts/rollback-automatico.sh auto

# Rollback manuale
./scripts/rollback-automatico.sh manual

# Verifica backup
ls -la /home/mauri/backup/db_*.sql
```

### Report e Log
```bash
# Visualizza report test
cat /home/mauri/backup/reports/test-report-*.md

# Visualizza log monitoraggio
tail -f /home/mauri/backup/logs/monitor-aggiornamento-*.log

# Visualizza log rollback
tail -f /home/mauri/backup/logs/rollback-*.log
```

---

## 📋 CHECKLIST OPERATIVA

### Pre-Aggiornamento (24 ore prima)
- [ ] **Notifica utenti** del downtime pianificato
- [ ] **Backup completo** database e configurazioni
- [ ] **Test ambiente** 10.10.10.15
- [ ] **Verifica spazio disco** (minimo 50GB)
- [ ] **Team disponibile** per supporto

### Durante Aggiornamento
- [ ] **Monitoraggio continuo** log e performance
- [ ] **Test incrementali** Backend → Frontend → Database
- [ ] **Rollback ready** script pronti per emergenza
- [ ] **Comunicazione** status update ogni 30 minuti

### Post-Aggiornamento (24 ore dopo)
- [ ] **Monitoraggio intensivo** ogni ora per 24 ore
- [ ] **Test funzionalità** tutte le feature critiche
- [ ] **Performance check** confronto con baseline
- [ ] **Documentazione** aggiorna note operative
- [ ] **Notifica successo** comunicazione agli utenti

---

## 🚨 GESTIONE EMERGENZE

### Troubleshooting Script

#### Script di Test Non Funzionanti
```bash
# Errore: unexpected EOF while looking for matching `"'
# Soluzione: Usa test manuali
cd backend && npm audit && npm run build
cd frontend && npm run build
docker exec gestionale_postgres psql -U gestionale_user -d gestionale -c "SELECT 1;"
```

#### Script di Monitoraggio Non Funzionanti
```bash
# Errore: unexpected EOF while looking for matching `"'
# Soluzione: Usa controlli manuali
docker stats --no-stream
docker logs gestionale_backend --tail 20
curl -s -w "%{time_total}" -o /dev/null http://localhost:3001/health
```

#### Backup Script Fallito
```bash
# Errore: Permission denied o docker compose non riconosciuto
# Soluzione: Backup manuale database
docker exec gestionale_postgres pg_dump -U gestionale_user gestionale > backup/db_backup_$(date +%Y-%m-%d_%H%M%S).sql
```

#### npm Update Frontend Error
```bash
# Errore: Unsupported URL Type "workspace:"
# Soluzione: Ignora se build funziona
npm run build  # Se funziona, procedi
```

### Problemi Comuni

#### 1. API Non Raggiungibile
```bash
# Verifica servizi Docker
docker ps | grep gestionale

# Riavvia backend
docker-compose restart backend

# Controlla log errori
docker logs gestionale-backend
```

#### 2. Database Disconnesso
```bash
# Verifica PostgreSQL
docker exec gestionale-postgres pg_isready -U postgres

# Riavvia database
docker-compose restart postgres

# Test connessione
docker exec gestionale-postgres psql -U postgres -d gestionale -c "SELECT 1;"
```

#### 3. Frontend Non Carica
```bash
# Verifica build
cd frontend
npm run build

# Riavvia frontend
docker-compose restart frontend

# Test accesso
curl -s http://localhost:3000
```

#### 4. Performance Degradata
```bash
# Analizza metriche
docker stats --no-stream

# Controlla log errori
docker logs gestionale-backend | grep ERROR

# Considera rollback se necessario
./scripts/rollback-automatico.sh manual
```

### Contatti Emergenza
- **Amministratore**: mauri@dominio.com
- **Supporto tecnico**: support@dominio.com
- **Log centralizzati**: `/home/mauri/backup/logs/`

---

## 📚 DOCUMENTAZIONE CORRELATA

### Checklist e Procedure
- **Checklist aggiornamento**: `/docs/SVILUPPO/checklist-aggiornamento-sicuro.md`
- **Checklist operativa**: `/docs/SVILUPPO/checklist-operativa-unificata.md`
- **Guida backup**: `/docs/MANUALE/guida-backup-e-ripristino.md`

### Script e Automazione
- **Test completo**: `scripts/test-aggiornamento-completo.sh`
- **Rollback automatico**: `scripts/rollback-automatico.sh`
- **Monitoraggio**: `scripts/monitor-aggiornamento.sh`

### Configurazioni
- **Server test**: 10.10.10.15
- **Backup directory**: `/home/mauri/backup/`
- **Log directory**: `/home/mauri/backup/logs/`
- **Report directory**: `/home/mauri/backup/reports/`

---

## ✅ VERIFICA FINALE

### Criteri di Successo
- [ ] **Zero downtime** per gli utenti
- [ ] **Performance mantenute** rispetto al baseline
- [ ] **Tutti i test passati** senza errori critici
- [ ] **Backup verificati** e integri
- [ ] **Rollback testato** e funzionante
- [ ] **Monitoraggio attivo** per 24 ore
- [ ] **Documentazione aggiornata** con note operative

### Metriche di Successo
- **Uptime**: > 99.9%
- **Tempo risposta**: < 2 secondi
- **Errori**: < 0.1% delle richieste
- **Downtime**: < 15 minuti per aggiornamento

---

**Nota**: Questa guida garantisce aggiornamenti sicuri seguendo le best practices: backup completo, test incrementali, piano di rollback e monitoraggio continuo. Ogni aggiornamento deve seguire rigorosamente questa procedura. 