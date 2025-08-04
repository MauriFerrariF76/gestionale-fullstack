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
- ⚠️ `scripts/install-gestionale-completo.sh` - **DA AGGIORNARE**
- ⚠️ `scripts/install_docker.sh` - **DA AGGIORNARE**
- ⚠️ `public-scripts/install-gestionale-completo.sh` - **DA AGGIORNARE**

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
I seguenti file contengono ancora la sintassi deprecata e devono essere aggiornati:

1. **`scripts/install-gestionale-completo.sh`**
   - Linee: 120, 127, 128, 135, 313, 315, 376, 397-399

2. **`scripts/install_docker.sh`**
   - Linee: 85, 99, 100, 103, 140, 141

3. **`public-scripts/install-gestionale-completo.sh`**
   - Linee: 120, 127, 128, 135, 313, 315, 376, 397-399

### **Documentazione**
I seguenti file di documentazione contengono ancora riferimenti alla sintassi deprecata:

1. **`docs/MANUALE/guida-docker.md`** - Già contiene sezione di migrazione
2. **`docs/archivio/`** - File storici (opzionale)

## 🔧 Prossimi Passi

### **1. Aggiornamento Script di Installazione**
```bash
# Aggiornare i file di installazione per usare la sintassi corretta
# e rimuovere l'installazione di docker-compose standalone
```

### **2. Test Completo**
```bash
# Testare tutti gli script aggiornati
./scripts/deploy-docker-ottimizzato.sh
./scripts/backup_completo_docker.sh
./scripts/ripristino_docker_emergenza.sh
```

### **3. Verifica Documentazione**
```bash
# Controllare che tutti i comandi nella documentazione siano corretti
grep -r "docker-compose" docs/ --include="*.md"
```

## 📋 Checklist Completamento

- [x] **Regole aggiornate** in `.cursorrules`
- [x] **Script critici** corretti
- [x] **Documentazione principale** aggiornata
- [ ] **Script di installazione** da aggiornare
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
- **Stato**: In corso - File principali completati

---

**Importante**: Tutti i nuovi file e modifiche devono usare esclusivamente la sintassi `docker compose` (senza trattino). 