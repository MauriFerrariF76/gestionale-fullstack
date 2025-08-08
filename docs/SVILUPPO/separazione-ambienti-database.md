# 🔐 Separazione Ambienti Database - Gestionale Fullstack

## Panoramica
Implementazione di credenziali separate per ambiente sviluppo e produzione per garantire sicurezza e isolamento.

**Data implementazione**: $(date +%Y-%m-%d)  
**Stato**: ✅ IMPLEMENTATO  
**Motivazione**: Sicurezza e best practice  

---

## 🎯 Obiettivi

### Sicurezza
- ✅ **Isolamento credenziali** = Sviluppo e produzione hanno credenziali diverse
- ✅ **Prevenzione errori** = Impossibile connettersi per errore al database sbagliato
- ✅ **Controllo accessi** = Permessi specifici per ambiente

### Gestione Operativa
- ✅ **Ambienti distinti** = Facile identificazione sviluppo vs produzione
- ✅ **Debugging migliorato** = Logs e errori specifici per ambiente
- ✅ **Compliance** = Segue best practice standard

---

## 🗄️ Configurazione Database

### **Ambiente Sviluppo (pc-mauri-vaio)**
```bash
# Database
DB_NAME="gestionale_dev"
DB_USER="gestionale_dev_user"
DB_PASSWORD="[VEDERE FILE sec.md - Ambiente Sviluppo]"

# Connessione
psql -U gestionale_dev_user -d gestionale_dev
```

### **Ambiente Produzione (gestionale-server)**
```bash
# Database
DB_NAME="gestionale"
DB_USER="gestionale_user"
DB_PASSWORD="[VEDERE FILE sec.md - Ambiente Produzione]"

# Connessione
docker compose exec postgres psql -U gestionale_user -d gestionale
```

---

## 🛠️ Script Implementati

### **Setup Database Sviluppo**
```bash
# Configurazione database sviluppo
./scripts/database-setup-dev.sh

# Credenziali create:
# - Database: gestionale_dev
# - User: gestionale_dev_user
# - Password: [VEDERE FILE sec.md - Ambiente Sviluppo]
```

### **Setup Database Produzione**
```bash
# Configurazione database produzione
./scripts/database-setup.sh

# Credenziali create:
# - Database: gestionale
# - User: gestionale_user
# - Password: [VEDERE FILE sec.md - Ambiente Produzione]
```

### **Backup Separati**
```bash
# Backup sviluppo
./scripts/backup-sviluppo.sh
# Backup: backup/sviluppo/gestionale_dev_YYYYMMDD_HHMMSS.sql

# Backup produzione
./scripts/backup_completo_docker.sh
# Backup: /mnt/backup_gestionale/database/gestionale_db_YYYYMMDD_HHMMSS.backup
```

---

## 🔧 Configurazione Applicazione

### **Backend Sviluppo**
```bash
# Variabili ambiente sviluppo
DATABASE_URL="postgresql://gestionale_dev_user:[VEDERE FILE sec.md]@localhost:5432/gestionale_dev"
NODE_ENV=development
PORT=3001
```

### **Backend Produzione**
```bash
# Variabili ambiente produzione (Docker secrets)
DATABASE_URL="postgresql://gestionale_user:[VEDERE FILE sec.md]@postgres:5432/gestionale"
NODE_ENV=production
PORT=3001
```

---

## 📋 Procedure Operative

### **Setup Iniziale Sviluppo**
```bash
# 1. Configura database sviluppo
./scripts/database-setup-dev.sh

# 2. Avvia ambiente sviluppo
./scripts/start-sviluppo.sh

# 3. Verifica connessione
psql -U gestionale_dev_user -d gestionale_dev -c "SELECT version();"
```

### **Setup Iniziale Produzione**
```bash
# 1. Configura database produzione
./scripts/database-setup.sh

# 2. Setup Docker secrets
./scripts/setup_secrets.sh

# 3. Avvia servizi Docker
docker compose up -d

# 4. Verifica connessione
docker compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT version();"
```

### **Migrazione Schema**
```bash
# Sviluppo → Produzione
# 1. Esporta schema sviluppo
pg_dump -U gestionale_dev_user -d gestionale_dev --schema-only > schema_dev.sql

# 2. Applica a produzione
docker compose exec -T postgres psql -U gestionale_user -d gestionale < schema_dev.sql
```

---

## 🔒 Sicurezza

### **Isolamento Credenziali**
- ✅ **Sviluppo**: `gestionale_dev_user` / `[VEDERE FILE sec.md]`
- ✅ **Produzione**: `gestionale_user` / `[VEDERE FILE sec.md]`
- ✅ **Nessuna sovrapposizione** = Impossibile accesso incrociato

### **Permessi Specifici**
- ✅ **Sviluppo**: Permessi completi per testing
- ✅ **Produzione**: Permessi limitati per sicurezza
- ✅ **Audit trail**: Log separati per ambiente

### **Backup Sicuri**
- ✅ **Sviluppo**: Backup locale cifrato
- ✅ **Produzione**: Backup NAS + cloud cifrato
- ✅ **Retention diversa**: 7 giorni (sviluppo) vs 30 giorni (produzione)

---

## 📊 Monitoring

### **Health Check Separati**
```bash
# Sviluppo
curl http://localhost:3001/health

# Produzione
curl https://gestionale.ferraripietro.it/health
```

### **Logs Separati**
```bash
# Sviluppo
tail -f backend/logs/development.log

# Produzione
docker compose logs -f backend
```

---

## ⚠️ Note Importanti

### **Non Condividere Credenziali**
- ❌ **Non committare** file .env con credenziali
- ❌ **Non condividere** password tra ambienti
- ✅ **Usa sempre** script dedicati per setup

### **Backup Regolari**
- ✅ **Sviluppo**: Backup prima di modifiche importanti
- ✅ **Produzione**: Backup automatici ogni 6 ore
- ✅ **Test restore**: Verifica integrità backup

### **Aggiornamenti**
- ✅ **Schema**: Migra sempre da sviluppo a produzione
- ✅ **Dati**: Backup prima di modifiche produzione
- ✅ **Rollback**: Procedure testate per entrambi gli ambienti

---

## 📝 Checklist Implementazione

### **Setup Completato**
- [x] **Script database sviluppo**: `scripts/database-setup-dev.sh`
- [x] **Script database produzione**: `scripts/database-setup.sh`
- [x] **Backup separati**: Script aggiornati
- [x] **Documentazione**: Credenziali aggiornate in `temp.md`
- [x] **Start script**: Aggiornato per credenziali sviluppo

### **Verifiche Necessarie**
- [ ] **Test connessione sviluppo**: `psql -U gestionale_dev_user -d gestionale_dev`
- [ ] **Test connessione produzione**: `docker compose exec postgres psql -U gestionale_user -d gestionale`
- [ ] **Test backup sviluppo**: `./scripts/backup-sviluppo.sh`
- [ ] **Test backup produzione**: `./scripts/backup_completo_docker.sh`

---

**✅ Separazione ambienti implementata con successo!**

**🔐 Credenziali separate garantiscono sicurezza e isolamento operativo.**
