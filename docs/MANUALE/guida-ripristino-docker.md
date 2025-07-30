# 🐳 Guida Ripristino Docker - Gestionale Fullstack

**Per utenti non esperti** - Ripristino completo con Docker in 5 passi

---

## 📋 Prerequisiti

### **Cosa ti serve:**
- Server Ubuntu 22.04 LTS (nuovo o esistente)
- Accesso root al server
- Backup segreti Docker (sul NAS o locale)
- Master Password: `"La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"`

### **Cosa NON ti serve:**
- Conoscenze Docker avanzate
- Configurazioni manuali complesse
- Ricordare password tecniche

---

## 🎯 Ripristino Docker in 5 Passi

### **Passo 1: Clona Repository**
```bash
# Su un server Ubuntu pulito
git clone https://github.com/MauriFerrariF76/gestionale-fullstack.git
cd gestionale-fullstack
```

### **Passo 2: Installa Docker (se necessario)**
```bash
# Se Docker non è installato
sudo ./scripts/install_docker.sh

# Riavvia la sessione per applicare i gruppi
newgrp docker
```

### **Passo 3: Setup Segreti Docker**
```bash
# Crea segreti se non esistono
./scripts/setup_secrets.sh

# Oppure ripristina da backup
./scripts/restore_secrets.sh backup_file.tar.gz.gpg
```

### **Passo 4: Avvio Servizi Docker**
```bash
# Setup completo automatico
./scripts/setup_docker.sh

# Oppure avvio rapido
./scripts/docker_quick_start.sh
```

### **Passo 5: Verifica Funzionamento**
```bash
# Controlla stato servizi
docker-compose ps

# Testa accesso web
curl http://localhost/health
```

**Fine!** Il gestionale Docker è operativo. 🎉

---

## 🔄 Cosa Fa il Sistema Automaticamente

### **✅ Installazione Docker**
- ✅ Installa Docker e Docker Compose
- ✅ Configura utente e gruppi
- ✅ Verifica installazione
- ✅ Testa funzionamento

### **✅ Setup Segreti Sicuri**
- ✅ Crea cartella `secrets/`
- ✅ Genera password sicure
- ✅ Imposta permessi 600
- ✅ Backup cifrato automatico

### **✅ Build e Avvio Container**
- ✅ Build immagini Docker
- ✅ Avvia PostgreSQL database
- ✅ Avvia backend API
- ✅ Avvia frontend Next.js
- ✅ Avvia Nginx reverse proxy

### **✅ Verifica e Test**
- ✅ Health checks automatici
- ✅ Test connessione database
- ✅ Test endpoint API
- ✅ Test accesso frontend

---

## 🚨 Risoluzione Problemi

### **Problema: "Docker non installato"**
```bash
# Soluzione automatica
sudo ./scripts/install_docker.sh

# Verifica installazione
docker --version
docker-compose --version
```

### **Problema: "Segreti non trovati"**
```bash
# Crea segreti manualmente
mkdir -p secrets
echo "gestionale2025" > secrets/db_password.txt
echo "GestionaleFerrari2025JWT_UltraSecure_v1!" > secrets/jwt_secret.txt
chmod 600 secrets/*.txt
```

### **Problema: "Porte occupate"**
```bash
# Verifica porte in uso
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Ferma servizi esistenti
sudo systemctl stop nginx apache2
```

### **Problema: "Container non si avviano"**
```bash
# Controlla log
docker-compose logs

# Ricostruisci tutto
docker-compose down
docker-compose up -d --build
```

### **Problema: "Database non connette"**
```bash
# Verifica database
docker-compose exec postgres pg_isready -U gestionale_user -d gestionale

# Riavvia solo database
docker-compose restart postgres
```

---

## 🔐 Gestione Sicura Segreti

### **Backup Segreti**
```bash
# Backup cifrato
./scripts/backup_secrets.sh

# Il backup viene salvato come:
# secrets_backup_YYYY-MM-DD.tar.gz.gpg
```

### **Ripristino Segreti**
```bash
# Ripristina da backup
./scripts/restore_secrets.sh secrets_backup_2025-01-15.tar.gz.gpg

# Verifica ripristino
ls -la secrets/
```

### **Password Memorizzate**
- **Database**: `gestionale2025`
- **JWT**: `GestionaleFerrari2025JWT_UltraSecure_v1!`
- **Master**: `"La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"`

---

## 📊 Backup e Ripristino Dati

### **Backup Database**
```bash
# Backup database PostgreSQL
docker-compose exec postgres pg_dump -U gestionale_user gestionale > backup_db.sql

# Backup con timestamp
docker-compose exec postgres pg_dump -U gestionale_user gestionale > backup_db_$(date +%F).sql
```

### **Ripristino Database**
```bash
# Ripristina database
docker-compose exec -T postgres psql -U gestionale_user -d gestionale < backup_db.sql

# Verifica ripristino
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT COUNT(*) FROM users;"
```

### **Backup Completo**
```bash
# 1. Backup segreti
./scripts/backup_secrets.sh

# 2. Backup database
docker-compose exec postgres pg_dump -U gestionale_user gestionale > backup_db_$(date +%F).sql

# 3. Backup configurazioni
tar czf config_backup_$(date +%F).tar.gz docker-compose.yml nginx/ postgres/

# 4. Backup volumi Docker
docker run --rm -v gestionale_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_volume_$(date +%F).tar.gz -C /data .
```

---

## 🔍 Diagnostica e Debug

### **Verifica Stato Servizi**
```bash
# Stato container
docker-compose ps

# Log in tempo reale
docker-compose logs -f

# Log specifico servizio
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### **Test Connessioni**
```bash
# Test backend API
curl http://localhost/health

# Test database
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT NOW();"

# Test frontend
curl -I http://localhost
```

### **Accesso Container**
```bash
# Entra nel container backend
docker-compose exec backend sh

# Entra nel database
docker-compose exec postgres psql -U gestionale_user -d gestionale

# Verifica volumi
docker volume ls
```

---

## 🚨 Emergenze

### **Ripristino Rapido**
```bash
# 1. Ferma tutto
docker-compose down

# 2. Ripristina segreti
./scripts/restore_secrets.sh backup_file.tar.gz.gpg

# 3. Riavvia
docker-compose up -d

# 4. Verifica
curl http://localhost/health
```

### **Reset Completo**
```bash
# 1. Ferma e rimuovi tutto
docker-compose down -v

# 2. Rimuovi immagini
docker rmi $(docker images -q gestionale-fullstack_*)

# 3. Setup da zero
./scripts/setup_docker.sh
```

### **Ripristino da Backup Completo**
```bash
# 1. Ripristina segreti
./scripts/restore_secrets.sh secrets_backup_*.tar.gz.gpg

# 2. Ripristina database
docker-compose exec -T postgres psql -U gestionale_user -d gestionale < backup_db.sql

# 3. Ripristina configurazioni
tar xzf config_backup_*.tar.gz

# 4. Riavvia servizi
docker-compose up -d
```

---

## ✅ Checklist Post-Ripristino

### **Verifica Funzionamento**
- [ ] Container attivi: `docker-compose ps`
- [ ] Health check OK: `curl http://localhost/health`
- [ ] Frontend accessibile: http://localhost
- [ ] API funzionante: http://localhost/api
- [ ] Database connesso: Test query PostgreSQL

### **Configurazione Finale**
- [ ] Backup segreti: `./scripts/backup_secrets.sh`
- [ ] Test backup database
- [ ] Configura monitoring
- [ ] Aggiorna documentazione

### **Sicurezza**
- [ ] Permessi segreti: `ls -la secrets/` (600)
- [ ] Container non-root: `docker-compose exec backend id`
- [ ] Rete isolata: `docker network ls`
- [ ] Log sicuri: Nessun dato sensibile nei log

---

## 📚 Comandi Utili

### **Gestione Servizi**
```bash
# Avvia servizi
docker-compose up -d

# Ferma servizi
docker-compose down

# Riavvia servizi
docker-compose restart

# Ricostruisci (dopo modifiche)
docker-compose up -d --build
```

### **Monitoraggio**
```bash
# Stato servizi
docker-compose ps

# Log in tempo reale
docker-compose logs -f

# Risorse sistema
docker stats

# Spazio disco
docker system df
```

### **Backup e Manutenzione**
```bash
# Backup segreti
./scripts/backup_secrets.sh

# Backup database
docker-compose exec postgres pg_dump -U gestionale_user gestionale > backup.sql

# Pulizia sistema
docker system prune

# Aggiornamento immagini
docker-compose pull
```

---

## 🎯 Vantaggi del Sistema Docker

### **Per Utenti Non Esperti**
- ✅ **Setup automatico** - Un comando per tutto
- ✅ **Ambiente isolato** - Nessun conflitto con sistema
- ✅ **Rollback semplice** - Versioni precedenti
- ✅ **Documentazione integrata** - Guide sempre aggiornate

### **Per Sicurezza**
- ✅ **Segreti protetti** - Docker secrets
- ✅ **Container isolati** - Sicurezza per processo
- ✅ **Utenti non-root** - Sicurezza container
- ✅ **Rete isolata** - Isolamento servizi

### **Per Manutenzione**
- ✅ **Backup facilitato** - Volumi Docker
- ✅ **Deploy semplificato** - Un comando
- ✅ **Versioning** - Controllo versioni
- ✅ **Monitoring** - Health checks automatici

---

## 📞 Contatti Emergenza

### **Se tutto fallisce:**
- **Amministratore**: [NOME] - [TELEFONO]
- **Backup Admin**: [NOME] - [TELEFONO]
- **Supporto Tecnico**: [NOME] - [TELEFONO]

### **Credenziali Critiche:**
- **Master Password**: `"La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"`
- **Accesso SSH**: [CREDENZIALI]
- **Documento Emergenza**: `EMERGENZA_PASSWORDS.md`

---

**🎉 Con Docker, il ripristino è ancora più semplice e affidabile!**

**⚠️ IMPORTANTE:**
- Mantieni sempre aggiornati i backup
- Testa il ripristino periodicamente
- Conserva al sicuro la Master Password
- Aggiorna i contatti di emergenza
- Usa sempre gli script automatici 