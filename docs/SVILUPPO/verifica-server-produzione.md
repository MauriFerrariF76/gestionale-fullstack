# 🔍 Verifica Server Produzione 10.10.10.15

## 📋 Obiettivo
Verificare se il server di produzione è allineato con le nuove implementazioni Docker-only e identificare eventuali azioni necessarie per l'aggiornamento.

## 🚀 Istruzioni per il Collega

### **1. Accesso al Server**
```bash
# Accedi al server di produzione
ssh -p 27 mauri@10.10.10.15
# Password: [chiedere a Mauri]

# Verifica che l'accesso sia corretto
whoami
pwd
```

### **2. Verifica Configurazione Sistema**
```bash
# Informazioni sistema
echo "=== INFORMAZIONI SISTEMA ==="
uname -a
cat /etc/os-release
uptime

echo "=== CONFIGURAZIONE ATTUALE ==="
ls -la /home/mauri/

echo "=== DOCKER ==="
docker --version
docker compose version
docker info | grep -E "(Server Version|Operating System|Kernel Version)"

echo "=== CONTAINER ATTIVI ==="
docker ps -a

echo "=== SPAZIO DISCO ==="
df -h
du -sh /home/mauri/* 2>/dev/null | head -10

echo "=== MEMORIA E CPU ==="
free -h
nproc
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1
```

### **3. Verifica Se il Gestionale è Già Installato**
```bash
# Controlla se esiste la directory del progetto
echo "=== VERIFICA PROGETTO ==="
ls -la /home/mauri/gestionale-fullstack/ 2>/dev/null || echo "Directory progetto non trovata"

# Se esiste, verifica lo stato
if [ -d "/home/mauri/gestionale-fullstack" ]; then
    cd /home/mauri/gestionale-fullstack/
    echo "=== STATO CONTAINER ==="
    docker compose ps
    
    echo "=== LOG RECENTI ==="
    docker compose logs --tail 20
    
    echo "=== CONFIGURAZIONE DOCKER-COMPOSE ==="
    ls -la docker-compose.yml 2>/dev/null || echo "docker-compose.yml non trovato"
    
    echo "=== SCRIPT DISPONIBILI ==="
    ls -la scripts/ 2>/dev/null || echo "Directory scripts non trovata"
fi
```

### **4. Verifica Versioni e Dipendenze**
```bash
# Controlla se Node.js è installato (vecchio metodo)
echo "=== VERIFICA NODE.JS (VECCHIO METODO) ==="
node --version 2>/dev/null || echo "Node.js non installato (OK - ora usiamo Docker)"
npm --version 2>/dev/null || echo "NPM non installato (OK)"

# Controlla Docker
echo "=== VERIFICA DOCKER ==="
docker --version
docker compose version

# Controlla spazio disponibile
echo "=== SPAZIO DISPONIBILE ==="
df -h /home/mauri

# Verifica permessi Docker
echo "=== PERMESSI DOCKER ==="
docker ps 2>/dev/null && echo "Docker accessibile" || echo "Problemi con Docker"
```

### **5. Test Funzionalità Attuali**
```bash
echo "=== TEST SERVIZI ==="

# Test backend (se attivo)
echo "Test Backend:"
curl -f http://localhost:3001/health 2>/dev/null && echo "✅ Backend OK" || echo "❌ Backend non raggiungibile"

# Test frontend (se attivo)
echo "Test Frontend:"
curl -f http://localhost:3000 2>/dev/null && echo "✅ Frontend OK" || echo "❌ Frontend non raggiungibile"

# Test database
echo "Test Database:"
docker exec gestionale_postgres pg_isready -U gestionale_user 2>/dev/null && echo "✅ Database OK" || echo "❌ Database non raggiungibile"

# Test connessioni di rete
echo "=== TEST RETE ==="
ping -c 1 8.8.8.8 >/dev/null && echo "✅ Connessione internet OK" || echo "❌ Problemi connessione internet"
```

### **6. Verifica Sicurezza e Configurazione**
```bash
echo "=== VERIFICA SICUREZZA ==="

# Controlla firewall
echo "Stato firewall:"
sudo ufw status 2>/dev/null || echo "UFW non configurato"

# Controlla servizi attivi
echo "Servizi attivi sulla porta 27:"
sudo netstat -tlnp | grep :27 || echo "Nessun servizio sulla porta 27"

# Controlla certificati SSL
echo "Certificati SSL:"
ls -la /etc/letsencrypt/live/ 2>/dev/null || echo "Certificati Let's Encrypt non trovati"
```

## 📊 Scenari Possibili

### **Scenario A: Server Non Configurato**
- ✅ **Docker non installato** → Deploy completo necessario
- ✅ **Nessun progetto** → Installazione da zero
- ✅ **Sistema pulito** → Installazione diretta

### **Scenario B: Server Configurato (Vecchio Metodo)**
- ⚠️ **Node.js installato** → Da rimuovere
- ⚠️ **Container attivi** → Da aggiornare
- ⚠️ **Script vecchi** → Da sostituire
- ⚠️ **Configurazioni obsolete** → Da migrare

### **Scenario C: Server Già Aggiornato**
- ✅ **Docker installato** → OK
- ✅ **Container attivi** → OK
- ✅ **Script aggiornati** → OK
- ✅ **Configurazione corretta** → OK

### **Scenario D: Server Parzialmente Configurato**
- ⚠️ **Docker installato ma progetto mancante** → Deploy progetto
- ⚠️ **Progetto presente ma container non attivi** → Avvio servizi
- ⚠️ **Configurazione mista** → Pulizia e reinstallazione

## 🚀 Prossimi Passi Dopo la Verifica

### **Se Scenario A (Non Configurato):**
```bash
# Deploy completo
cd /home/mauri
wget https://raw.githubusercontent.com/MauriFerrariF76/gestionale-scripts-public/main/install-gestionale-completo.sh
chmod +x install-gestionale-completo.sh
sudo ./install-gestionale-completo.sh

# Verifica post-installazione
cd /home/mauri/gestionale-fullstack
docker compose ps
curl http://localhost:3001/health
```

### **Se Scenario B (Vecchio Metodo):**
```bash
# Backup configurazione attuale
cd /home/mauri
cp -r gestionale-fullstack gestionale-fullstack-backup-$(date +%Y%m%d)

# Pulizia vecchie installazioni
sudo apt remove nodejs npm -y 2>/dev/null
sudo apt autoremove -y

# Aggiornamento progetto
cd /home/mauri/gestionale-fullstack
docker compose down
git pull origin main
./scripts/deploy-docker-ottimizzato.sh

# Verifica aggiornamento
docker compose ps
curl http://localhost:3001/health
```

### **Se Scenario C (Già Aggiornato):**
```bash
# Solo verifica finale e aggiornamento
cd /home/mauri/gestionale-fullstack
git pull origin main
docker compose down && docker compose up -d
docker compose ps
curl http://localhost:3001/health
```

### **Se Scenario D (Parzialmente Configurato):**
```bash
# Identifica problema specifico e risolvi
cd /home/mauri/gestionale-fullstack

# Se progetto mancante
if [ ! -f "docker-compose.yml" ]; then
    git clone https://github.com/MauriFerrariF76/gestionale-fullstack.git temp
    cp -r temp/* .
    rm -rf temp
fi

# Se container non attivi
docker compose up -d
docker compose ps
```

## 📋 Checklist da Completare

- [ ] **Accedi al server**: `ssh -p 27 mauri@10.10.10.15`
- [ ] **Verifica sistema**: `uname -a`, `uptime`
- [ ] **Verifica Docker**: `docker --version`, `docker compose version`
- [ ] **Controlla container**: `docker ps -a`
- [ ] **Test servizi**: `curl http://localhost:3001/health`
- [ ] **Verifica spazio**: `df -h`, `du -sh /home/mauri/*`
- [ ] **Controlla progetto**: `ls -la /home/mauri/gestionale-fullstack/`
- [ ] **Verifica sicurezza**: `sudo ufw status`, `sudo netstat -tlnp`
- [ ] **Identifica scenario**: A, B, C o D
- [ ] **Esegui azioni appropriate**: Deploy, aggiornamento o verifica
- [ ] **Test post-azione**: Verifica funzionamento finale

## 📞 Risultati da Comunicare

**Invia a Mauri:**
1. **Output completo dei comandi** di verifica
2. **Scenario identificato** (A, B, C o D)
3. **Azioni eseguite** e risultati dettagliati
4. **Eventuali errori** o problemi riscontrati
5. **Stato finale** del sistema
6. **Raccomandazioni** per eventuali azioni aggiuntive

## 🔧 Troubleshooting Comune

### **Problema: Docker non installato**
```bash
# Installazione Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### **Problema: Container non si avviano**
```bash
# Verifica log dettagliati
docker compose logs
docker system prune -f
docker compose up -d
```

### **Problema: Porte già in uso**
```bash
# Verifica porte occupate
sudo netstat -tlnp | grep -E "(3000|3001|5432)"
# Modifica docker-compose.yml se necessario
```

### **Problema: Spazio disco insufficiente**
```bash
# Pulizia sistema
docker system prune -a -f
sudo apt autoremove -y
sudo apt autoclean
```

---

**Data**: $(date +%Y-%m-%d)  
**Versione**: 2.0  
**Autore**: Mauri Ferrari  
**Ultimo aggiornamento**: Aggiornamento completo con verifiche estese e troubleshooting 