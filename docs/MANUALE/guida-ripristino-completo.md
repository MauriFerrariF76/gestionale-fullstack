# 🚀 Guida Ripristino Completo da Zero

**Data:** $(date +%F)  
**Versione:** 1.0  
**Scopo:** Ripristino completo del gestionale su nuova macchina  

---

## 📋 Prerequisiti

### **Hardware Richiesto**
- Server Ubuntu 22.04 LTS (minimo 4GB RAM, 50GB disco)
- Connessione internet stabile
- Accesso root al server

### **Backup Necessari**
- **Backup Database**: File `.backup` PostgreSQL
- **Backup Segreti**: File `secrets_backup_*.tar.gz.gpg`
- **Backup Configurazioni**: File di configurazione server
- **Codice Sorgente**: Repository Git o backup codice

### **Credenziali Critiche**
- **Master Password**: `"La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"`
- **Docker Secrets**: Vedi `EMERGENZA_PASSWORDS.md`
- **SSH Access**: Credenziali server

---

## 🔧 Fase 1: Preparazione Server

### **1.1 Installazione Ubuntu Server**
```bash
# Download Ubuntu 22.04 LTS Server
# Installazione con opzioni:
# - SSH server
# - OpenSSH server
# - Standard system utilities
```

### **1.2 Configurazione Base**
```bash
# Aggiorna sistema
sudo apt update && sudo apt upgrade -y

# Installa pacchetti essenziali
sudo apt install -y curl wget git vim htop

# Configura timezone
sudo timedatectl set-timezone Europe/Rome

# Configura hostname
sudo hostnamectl set-hostname gestionale-server
```

### **1.3 Installazione Docker**
```bash
# Installa Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Aggiungi utente al gruppo docker
sudo usermod -aG docker $USER

# Installa Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verifica installazione
docker --version
docker-compose --version
```

### **1.4 Configurazione Rete**
```bash
# Configura IP statico (se necessario)
sudo nano /etc/netplan/00-installer-config.yaml

# Esempio configurazione:
# network:
#   version: 2
#   ethernets:
#     ens33:
#       dhcp4: false
#       addresses: [10.10.10.15/24]
#       gateway4: 10.10.10.1
#       nameservers:
#         addresses: [8.8.8.8, 8.8.4.4]

# Applica configurazione
sudo netplan apply
```

---

## 📦 Fase 2: Clonazione Repository

### **2.1 Clona Codice Sorgente**
```bash
# Crea directory progetto
mkdir -p /home/mauri/gestionale-fullstack
cd /home/mauri/gestionale-fullstack

# Clona repository (se disponibile)
git clone https://github.com/MauriFerrariF76/gestionale-fullstack.git .

# Oppure copia backup codice
# scp -r backup_codice/ user@server:/home/mauri/gestionale-fullstack/
```

### **2.2 Verifica Struttura**
```bash
# Verifica che la struttura sia corretta
ls -la

# Dovrebbe contenere:
# - docker-compose.yml
# - backend/
# - frontend/
# - docs/
# - scripts/
```

---

## 🔐 Fase 3: Ripristino Segreti

### **3.1 Copia Backup Segreti**
```bash
# Copia file backup segreti
scp backup_secrets_*.tar.gz.gpg user@server:/home/mauri/gestionale-fullstack/

# Oppure copia da supporto fisico
# cp /path/to/backup_secrets_*.tar.gz.gpg /home/mauri/gestionale-fullstack/
```

### **3.2 Ripristina Segreti**
```bash
cd /home/mauri/gestionale-fullstack

# Rendi script eseguibili
chmod +x scripts/*.sh

# Ripristina segreti
./scripts/restore_secrets.sh backup_secrets_YYYY-MM-DD_HHMMSS.tar.gz.gpg

# Verifica che i segreti siano stati ripristinati
ls -la secrets/
# Dovrebbe contenere:
# - db_password.txt
# - jwt_secret.txt
```

### **3.3 Verifica Permessi**
```bash
# Imposta permessi sicuri
chmod 600 secrets/*.txt

# Verifica che solo root possa leggere
ls -la secrets/
```

---

## 🗄️ Fase 4: Ripristino Database

### **4.1 Copia Backup Database**
```bash
# Copia backup database
scp gestionale_db_*.backup user@server:/home/mauri/gestionale-fullstack/

# Oppure copia da supporto fisico
# cp /path/to/gestionale_db_*.backup /home/mauri/gestionale-fullstack/
```

### **4.2 Avvia Container Database**
```bash
# Avvia solo PostgreSQL
docker-compose up -d postgres

# Attendi che il container sia pronto
sleep 30

# Verifica che PostgreSQL sia attivo
docker-compose ps postgres
```

### **4.3 Ripristina Database**
```bash
# Trova il backup più recente
BACKUP_FILE=$(ls -t gestionale_db_*.backup | head -1)

# Ripristina database
docker-compose exec -T postgres pg_restore -U gestionale_user -d gestionale -v /backup/$BACKUP_FILE

# Verifica ripristino
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT COUNT(*) FROM information_schema.tables;"
```

---

## 🐳 Fase 5: Avvio Applicazione

### **5.1 Verifica Configurazione**
```bash
# Verifica docker-compose.yml
cat docker-compose.yml

# Verifica variabili ambiente
cat .env

# Verifica che tutti i file necessari siano presenti
ls -la
```

### **5.2 Avvia Tutti i Servizi**
```bash
# Avvia l'intera applicazione
docker-compose up -d

# Verifica che tutti i container siano attivi
docker-compose ps

# Controlla i log
docker-compose logs -f
```

### **5.3 Verifica Funzionamento**
```bash
# Testa backend
curl http://localhost:3001/api/health

# Testa frontend
curl http://localhost:3000

# Testa database
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT version();"
```

---

## 🌐 Fase 6: Configurazione Nginx

### **6.1 Installa Nginx**
```bash
sudo apt install -y nginx

# Abilita Nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### **6.2 Configura Reverse Proxy**
```bash
# Copia configurazione Nginx
sudo cp docs/server/nginx_gestionale.conf /etc/nginx/sites-available/gestionale

# Abilita sito
sudo ln -s /etc/nginx/sites-available/gestionale /etc/nginx/sites-enabled/

# Rimuovi default
sudo rm /etc/nginx/sites-enabled/default

# Testa configurazione
sudo nginx -t

# Riavvia Nginx
sudo systemctl restart nginx
```

### **6.3 Configura SSL (se necessario)**
```bash
# Installa Certbot
sudo apt install -y certbot python3-certbot-nginx

# Ottieni certificato SSL
sudo certbot --nginx -d gestionale.carpenteriaferrari.com

# Verifica rinnovo automatico
sudo certbot renew --dry-run
```

---

## 🔧 Fase 7: Configurazione Firewall

### **7.1 Configura UFW**
```bash
# Abilita UFW
sudo ufw enable

# Regole base
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Regole specifiche (se necessario)
sudo ufw allow from 10.10.10.0/24

# Verifica stato
sudo ufw status
```

### **7.2 Configura MikroTik (se esterno)**
```bash
# Configura port forwarding su MikroTik:
# - Porta 80 → 10.10.10.15:80
# - Porta 443 → 10.10.10.15:443
# - Porta 22 → 10.10.10.15:22 (se necessario)
```

---

## 📋 Fase 8: Verifica Finale

### **8.1 Checklist Verifica**
```bash
# ✅ Docker container attivi
docker-compose ps

# ✅ Database accessibile
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT COUNT(*) FROM users;"

# ✅ Backend risponde
curl -s http://localhost:3001/api/health | jq .

# ✅ Frontend accessibile
curl -s http://localhost:3000 | head -10

# ✅ Nginx funziona
curl -s http://gestionale.carpenteriaferrari.com | head -10

# ✅ SSL funziona (se configurato)
curl -s https://gestionale.carpenteriaferrari.com | head -10
```

### **8.2 Test Accesso Utente**
```bash
# Testa login admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@carpenteriaferrari.com","password":"Carpenteria2024Admin_v1"}'
```

### **8.3 Verifica Backup**
```bash
# Testa backup automatico
./scripts/backup_secrets.sh

# Verifica che il backup sia stato creato
ls -la secrets_backup_*.tar.gz.gpg
```

---

## 🚨 Risoluzione Problemi

### **Problema: Container non si avviano**
```bash
# Controlla log dettagliati
docker-compose logs

# Verifica configurazione
docker-compose config

# Ricostruisci container
docker-compose up -d --build
```

### **Problema: Database non si connette**
```bash
# Verifica segreti
cat secrets/db_password.txt

# Testa connessione manuale
docker-compose exec postgres psql -U gestionale_user -d gestionale

# Ripristina database se necessario
docker-compose exec -T postgres pg_restore -U gestionale_user -d gestionale -v /backup/backup_file.backup
```

### **Problema: Nginx non funziona**
```bash
# Controlla configurazione
sudo nginx -t

# Controlla log
sudo tail -f /var/log/nginx/error.log

# Riavvia Nginx
sudo systemctl restart nginx
```

### **Problema: SSL non funziona**
```bash
# Verifica certificato
sudo certbot certificates

# Rinnova certificato
sudo certbot renew

# Verifica configurazione SSL
sudo nginx -t
```

---

## 📞 Contatti Emergenza

### **Credenziali Critiche**
- **Master Password**: `"La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"`
- **Docker Secrets**: Vedi `EMERGENZA_PASSWORDS.md`
- **SSH Server**: [CREDENZIALI_SSH]

### **Contatti**
- **Amministratore**: [NOME] - [TELEFONO] - [EMAIL]
- **Backup Admin**: [NOME] - [TELEFONO] - [EMAIL]
- **Supporto Tecnico**: [NOME] - [TELEFONO] - [EMAIL]

---

## ✅ Checklist Completamento

### **Fase 1: Preparazione** ✅
- [ ] Ubuntu Server installato
- [ ] Docker installato
- [ ] Rete configurata

### **Fase 2: Codice** ✅
- [ ] Repository clonato
- [ ] Struttura verificata

### **Fase 3: Segreti** ✅
- [ ] Backup segreti copiato
- [ ] Segreti ripristinati
- [ ] Permessi verificati

### **Fase 4: Database** ✅
- [ ] Backup database copiato
- [ ] Database ripristinato
- [ ] Connessione verificata

### **Fase 5: Applicazione** ✅
- [ ] Container avviati
- [ ] Servizi funzionanti
- [ ] Log verificati

### **Fase 6: Nginx** ✅
- [ ] Nginx installato
- [ ] Configurazione applicata
- [ ] SSL configurato (se necessario)

### **Fase 7: Sicurezza** ✅
- [ ] Firewall configurato
- [ ] MikroTik configurato (se esterno)

### **Fase 8: Verifica** ✅
- [ ] Tutti i test superati
- [ ] Accesso utente funzionante
- [ ] Backup testato

---

**🎉 Ripristino completato! Il gestionale è ora operativo sulla nuova macchina.**

**⚠️ IMPORTANTE:**
- Aggiorna il documento `EMERGENZA_PASSWORDS.md` con le nuove credenziali
- Testa regolarmente i backup
- Monitora i log per problemi
- Mantieni aggiornata la documentazione