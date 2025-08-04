# 🔍 Verifica Server Produzione 10.10.10.15

## 📋 Obiettivo
Verificare se il server di produzione è allineato con le nuove implementazioni Docker-only.

## 🚀 Istruzioni per il Collega

### **1. Accesso al Server**
```bash
# Accedi al server di produzione
ssh -p 27 mauri@10.10.10.15
# Password: [chiedere a Mauri]
```

### **2. Verifica Configurazione Attuale**
```bash
# Verifica configurazione attuale
echo "=== CONFIGURAZIONE ATTUALE ==="
ls -la /home/mauri/

echo "=== DOCKER ==="
docker --version
docker-compose --version

echo "=== CONTAINER ATTIVI ==="
docker ps

echo "=== SPAZIO DISCO ==="
df -h

echo "=== MEMORIA ==="
free -h
```

### **3. Verifica Se il Gestionale è Già Installato**
```bash
# Controlla se esiste la directory del progetto
ls -la /home/mauri/gestionale-fullstack/

# Se esiste, verifica lo stato
cd /home/mauri/gestionale-fullstack/
docker-compose ps
docker-compose logs --tail 20
```

### **4. Verifica Versioni e Dipendenze**
```bash
# Controlla se Node.js è installato (vecchio metodo)
node --version 2>/dev/null || echo "Node.js non installato (OK - ora usiamo Docker)"

# Controlla Docker
docker --version
docker-compose --version

# Controlla spazio disponibile
df -h /home/mauri
```

### **5. Test Funzionalità Attuali**
```bash
# Test backend (se attivo)
curl -f http://localhost:3001/health 2>/dev/null && echo "Backend OK" || echo "Backend non raggiungibile"

# Test frontend (se attivo)
curl -f http://localhost:3000 2>/dev/null && echo "Frontend OK" || echo "Frontend non raggiungibile"

# Test database
docker exec gestionale_postgres pg_isready -U gestionale_user 2>/dev/null && echo "Database OK" || echo "Database non raggiungibile"
```

## 📊 Scenari Possibili

### **Scenario A: Server Non Configurato**
- ✅ **Docker non installato** → Deploy completo necessario
- ✅ **Nessun progetto** → Installazione da zero

### **Scenario B: Server Configurato (Vecchio Metodo)**
- ⚠️ **Node.js installato** → Da rimuovere
- ⚠️ **Container attivi** → Da aggiornare
- ⚠️ **Script vecchi** → Da sostituire

### **Scenario C: Server Già Aggiornato**
- ✅ **Docker installato** → OK
- ✅ **Container attivi** → OK
- ✅ **Script aggiornati** → OK

## 🚀 Prossimi Passi Dopo la Verifica

### **Se Scenario A (Non Configurato):**
```bash
# Deploy completo
cd /home/mauri
wget https://raw.githubusercontent.com/MauriFerrariF76/gestionale-scripts-public/main/install-gestionale-completo.sh
chmod +x install-gestionale-completo.sh
sudo ./install-gestionale-completo.sh
```

### **Se Scenario B (Vecchio Metodo):**
```bash
# Backup e aggiornamento
cd /home/mauri/gestionale-fullstack
docker-compose down
git pull origin main
./scripts/deploy-docker-ottimizzato.sh
```

### **Se Scenario C (Già Aggiornato):**
```bash
# Solo verifica finale
cd /home/mauri/gestionale-fullstack
docker-compose ps
curl http://localhost:3001/health
```

## 📋 Checklist da Completare

- [ ] **Accedi al server**: `ssh -p 27 mauri@10.10.10.15`
- [ ] **Verifica Docker**: `docker --version`
- [ ] **Controlla container**: `docker ps`
- [ ] **Test servizi**: `curl http://localhost:3001/health`
- [ ] **Verifica spazio**: `df -h`
- [ ] **Controlla progetto**: `ls -la /home/mauri/gestionale-fullstack/`
- [ ] **Identifica scenario**: A, B o C
- [ ] **Esegui azioni appropriate**: Deploy, aggiornamento o verifica

## 📞 Risultati da Comunicare

**Invia a Mauri:**
1. **Output dei comandi** di verifica
2. **Scenario identificato** (A, B o C)
3. **Azioni eseguite** e risultati
4. **Eventuali errori** o problemi riscontrati

---

**Data**: $(date +%Y-%m-%d)  
**Versione**: 1.0  
**Autore**: Mauri Ferrari 