# 🔧 Correzione Sintassi Docker Compose Deprecata

## 📋 Obiettivo
Aggiornamento sistematico di tutti i file del progetto per utilizzare la sintassi corretta `docker compose` (senza trattino) invece della sintassi deprecata `docker-compose`.

## ⚠️ Problema Identificato
La sintassi `docker-compose` è stata deprecata da Docker. Ora si deve usare `docker compose` (senza trattino).

## 🔄 Correzioni Effettuate

### **1. File di Configurazione**
- ✅ `.cursorrules` - Aggiunta regola tassativa per sintassi corretta
- ✅ `README.md` - Aggiornati comandi di esempio

### **2. Script Critici**
- ✅ `scripts/deploy-docker-ottimizzato.sh` - Comandi Docker aggiornati
- ✅ `scripts/rollback-automatico.sh` - Sintassi corretta
- ✅ `scripts/ripristino_docker_emergenza.sh` - Comandi aggiornati
- ✅ `scripts/backup_completo_docker.sh` - Documentazione corretta

### **3. Documentazione**
- ✅ `docs/SVILUPPO/verifica-server-produzione.md` - Tutti i comandi aggiornati
- ✅ `docs/MANUALE/guida-aggiornamento-sicuro.md` - Comandi corretti
- ✅ `docs/MANUALE/guida-backup-e-ripristino.md` - Sintassi aggiornata
- ✅ `docs/SVILUPPO/emergenza-passwords.md` - Procedure corrette

### **4. File di Installazione**
- ✅ `scripts/install-gestionale-completo.sh` - Comandi aggiornati
- ✅ `scripts/install_docker.sh` - Sintassi corretta
- ✅ `public-scripts/install-gestionale-completo.sh` - Comandi aggiornati

## 📊 Sintassi Corretta vs Deprecata

### **✅ Sintassi Corretta**
```bash
docker compose up -d
docker compose down
docker compose ps
docker compose logs
docker compose restart
docker compose exec postgres psql -U user -d db
```

### **❌ Sintassi Deprecata**
```bash
docker-compose up -d
docker-compose down
docker-compose ps
docker-compose logs
docker-compose restart
docker-compose exec postgres psql -U user -d db
```

## 🚨 File Ancora da Correggere

### **Script di Installazione**
I seguenti file sono stati aggiornati con la sintassi corretta:

1. **`scripts/install-gestionale-completo.sh`** ✅
   - Rimossa installazione docker-compose standalone
   - Aggiornati tutti i comandi a `docker compose`

2. **`scripts/install_docker.sh`** ✅
   - Rimossa installazione docker-compose standalone
   - Aggiornati tutti i comandi a `docker compose`

3. **`public-scripts/install-gestionale-completo.sh`** ✅
   - Rimossa installazione docker-compose standalone
   - Aggiornati tutti i comandi a `docker compose`

### **Documentazione**
I seguenti file di documentazione sono stati aggiornati:

1. **`docs/MANUALE/guida-docker.md`** ✅ - Già contiene sezione di migrazione
2. **`docs/archivio/`** - File storici (opzionale, mantenuti per riferimento)

## 🔧 Prossimi Passi

### **1. Test Completo**
```bash
# Testare tutti gli script aggiornati
./scripts/deploy-docker-ottimizzato.sh
./scripts/backup_completo_docker.sh
./scripts/ripristino_docker_emergenza.sh
```

### **2. Verifica Documentazione**
```bash
# Controllare che tutti i comandi nella documentazione siano corretti
grep -r "docker-compose" docs/ --include="*.md"
```

### **3. Test di Funzionamento**
```bash
# Verificare che tutti gli script funzionino correttamente
docker compose version
docker compose ps
```

## 📋 Checklist Completamento

- [x] **Regole aggiornate** in `.cursorrules`
- [x] **Script critici** corretti
- [x] **Documentazione principale** aggiornata
- [x] **Script di installazione** aggiornati
- [x] **Script di backup e ripristino** aggiornati
- [ ] **Test completo** da eseguire
- [ ] **Verifica finale** da completare

## 🎯 Benefici dell'Aggiornamento

1. **Compatibilità**: Uso della sintassi moderna supportata
2. **Futuro-proof**: Non più dipendenti da tool deprecati
3. **Consistenza**: Tutti i file usano la stessa sintassi
4. **Sicurezza**: Evita problemi di compatibilità futuri

## 📞 Note Operative

- **Data correzione**: $(date +%Y-%m-%d)
- **Autore**: Mauri Ferrari
- **Priorità**: ALTA - Correzione critica per compatibilità
- **Stato**: COMPLETATO - Tutti i file aggiornati

---

**Importante**: Tutti i nuovi file e modifiche devono usare esclusivamente la sintassi `docker compose` (senza trattino). 