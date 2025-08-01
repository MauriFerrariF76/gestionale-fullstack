# 🚀 Guida Deploy Produzione - Gestionale Fullstack

## 📋 Indice
- [1. Prerequisiti](#1-prerequisiti)
- [2. Installazione Ubuntu Server](#2-installazione-ubuntu-server)
- [3. Configurazione di rete](#3-configurazione-di-rete)
- [4. Ottenere il progetto](#4-ottenere-il-progetto)
- [5. Installazione Docker](#5-installazione-docker)
- [6. Importazione segreti](#6-importazione-segreti)
- [7. Deploy applicazione](#7-deploy-applicazione)
- [8. Test post-deploy](#8-test-post-deploy)
- [9. Rollback](#9-rollback)
- [10. Test Deploy su VM](#10-test-deploy-su-vm)

---

## 1. Prerequisiti

### Prima di iniziare il deploy:
- ✅ Backup completo del sistema esistente
- ✅ Test di ripristino completato su VM
- ✅ Accesso fisico al server
- ✅ Connessione internet stabile
- ✅ Credenziali di accesso al server
- ✅ Backup dei segreti e configurazioni

### Materiale necessario:
- USB con Ubuntu Server 22.04.3 LTS
- Documentazione del progetto
- Checklist di sicurezza
- Credenziali di accesso

---

## 2. Installazione Ubuntu Server

### 2.1 Preparazione USB
1. **Scarica** Ubuntu Server 22.04.3 LTS da https://ubuntu.com/download/server
2. **Crea** USB bootabile con Rufus o Balena Etcher
3. **Verifica** che l'USB sia riconosciuto dal server

### 2.2 Avvio e installazione
1. **Inserisci** l'USB nel server
2. **Avvia** il server e premi F12 (o tasto appropriato) per boot menu
3. **Seleziona** l'USB come dispositivo di boot
4. **Aspetta** il caricamento dell'installer

### 2.3 Configurazione lingua e tastiera
1. **Lingua**: Italiano
2. **Layout tastiera**: Italiano
3. **Premi**: Invio per continuare

### 2.4 Configurazione di rete
1. **Seleziona**: "Edit IPv4"
2. **Metodo**: "Manual" (non DHCP)
3. **Configura**:
   - **IP**: `10.10.10.15` (IP del server di produzione)
   - **Netmask**: `255.255.255.0`
   - **Gateway**: `10.10.10.1`
   - **DNS**: `8.8.8.8, 8.8.4.4`
4. **Search Domains**: Lascia vuoto
5. **Proxy Address**: Lascia vuoto

### 2.5 Mirror Ubuntu
1. **Lascia** il mirror predefinito
2. **Aspetta** che finisca il test dei mirror
3. **Premi**: Invio per continuare

### 2.6 Layout disco
1. **Seleziona**: "Use entire disk"
2. **Premi**: Invio per confermare
3. **Aspetta** che finisca il partizionamento

### 2.7 Configurazione utente
1. **Your name**: `Mauri`
2. **Your server's name**: `gestionale-server`
3. **Username**: `mauri`
4. **Password**: Scegli una password sicura (es: `solita`)

### 2.8 SSH
1. **Seleziona**: "Install OpenSSH server"
2. **Premi**: Invio per continuare

### 2.9 Ubuntu Pro
1. **Seleziona**: "No, thanks"
2. **Premi**: Invio per continuare

### 2.10 Fine installazione
1. **Aspetta** che finisca l'installazione
2. **Premi**: Invio quando chiede di riavviare
3. **Rimuovi** l'USB dopo il riavvio

### 2.11 Primo login
1. **Aspetta** che finisca cloud-init
2. **Premi**: Invio per vedere il prompt di login
3. **Username**: `mauri`
4. **Password**: `solita` (o quella scelta)

---

## 3. Configurazione di rete

### 3.1 Verifica configurazione
```bash
hostname
whoami
ip addr show
```

### 3.2 Se la rete non funziona
```bash
# Modifica configurazione di rete
sudo nano /etc/netplan/00-installer-config.yaml
```

### Contenuto del file:
```yaml
network:
  version: 2
  ethernets:
    enp0s3:
      addresses:
        - 10.10.10.15/24
      gateway4: 10.10.10.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

### Applica configurazione:
```bash
sudo netplan apply
```

### 3.3 Test connettività
```bash
ping -c 3 10.10.10.1
ping -c 3 8.8.8.8
```

---

## 4. Ottenere il progetto (Best Practice)

### 4.1 Metodo principale: Git + Token
```bash
cd /home/mauri

# Crea token GitHub: https://github.com/settings/tokens
# Seleziona: "repo" (tutti i repository)
git clone https://ghp_YOUR_TOKEN@github.com/MauriFerrariF76/gestionale-fullstack.git
cd gestionale-fullstack
git checkout v1.0.0  # Tag di produzione
```

### 4.2 Fallback: Backup NAS (se Git non funziona)
```bash
# Se git clone fallisce, usa backup NAS
scp -r mauri@10.10.10.21:/backup/gestionale/gestionale-fullstack /home/mauri/
cd /home/mauri/gestionale-fullstack
```

### 4.3 Test e fallback automatico
```bash
# Test Git clone
cd /home/mauri
git clone https://ghp_YOUR_TOKEN@github.com/MauriFerrariF76/gestionale-fullstack.git

# Se Git fallisce, usa backup NAS
if [ $? -ne 0 ]; then
    echo "⚠️ Git fallito, uso backup NAS..."
    scp -r mauri@10.10.10.21:/backup/gestionale/gestionale-fullstack /home/mauri/
fi

cd /home/mauri/gestionale-fullstack

# Verifica integrità
ls -la
test -f docker-compose.yml && echo "✅ docker-compose.yml presente"
test -f scripts/setup_docker.sh && echo "✅ Script setup presente"
```

### 4.4 Setup backup automatico GitHub → NAS
```bash
# Crea script backup
sudo nano /usr/local/bin/backup_github_to_nas.sh
```

### Contenuto script backup:
```bash
#!/bin/bash
# backup_github_to_nas.sh
# Backup automatico da GitHub a NAS002

# Configurazione
GITHUB_REPO="https://github.com/MauriFerrariF76/gestionale-fullstack.git"
NAS_BACKUP="/mnt/nas_backup/gestionale/"
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)

# Crea backup
git clone --mirror $GITHUB_REPO /tmp/gestionale_backup
tar -czf /tmp/gestionale_$BACKUP_DATE.tar.gz -C /tmp gestionale_backup

# Copia su NAS
scp /tmp/gestionale_$BACKUP_DATE.tar.gz mauri@10.10.10.21:/backup/gestionale/

# Pulizia
rm -rf /tmp/gestionale_backup
rm /tmp/gestionale_$BACKUP_DATE.tar.gz
```

### Rendi eseguibile e configura cron:
```bash
# Rendi eseguibile
sudo chmod +x /usr/local/bin/backup_github_to_nas.sh

# Aggiungi a crontab (backup settimanale)
crontab -e
# Aggiungi: 0 2 * * 0 /usr/local/bin/backup_github_to_nas.sh
```

---

## 5. Installazione Docker

### 5.1 Verifica prerequisiti
```bash
# Verifica che il progetto sia presente
cd /home/mauri/gestionale-fullstack
ls -la
test -f docker-compose.yml && echo "✅ docker-compose.yml presente"
test -f scripts/setup_docker.sh && echo "✅ Script setup presente"
```

### 5.2 Installazione Docker automatica
```bash
# Installa Docker e Docker Compose
./scripts/install_docker.sh
```

### 5.3 Verifica installazione Docker
```bash
# Verifica Docker
docker --version
docker-compose --version

# Test Docker
docker run hello-world
```

### 5.4 Setup automatico Docker
```bash
# Setup completo Docker e applicazione
./scripts/setup_docker.sh
```

### 5.5 Verifica funzionamento
```bash
# Stato servizi
docker-compose ps

# Test backend
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000

# Log servizi
docker-compose logs -f
```

---

## 6. Importazione segreti

### 6.1 Verifica segreti
```bash
# Verifica che i segreti siano presenti
ls -la secrets/
test -f secrets/db_password.txt && echo "✅ db_password presente"
test -f secrets/jwt_secret.txt && echo "✅ jwt_secret presente"
```

### 6.2 Se i segreti non esistono
```bash
# Crea segreti automaticamente
./scripts/setup_secrets.sh
```

### 6.3 Backup segreti
```bash
# Backup segreti per sicurezza
./scripts/backup_secrets.sh
```

---

## 7. Deploy applicazione

### 7.1 Avvio completo
```bash
# Avvia tutti i servizi
docker-compose up -d

# Verifica stato
docker-compose ps
```

### 7.2 Test funzionalità
```bash
# Test backend API
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000

# Test database
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT version();"
```

### 7.3 Configurazione Nginx (se necessario)
```bash
# Copia configurazioni Nginx
sudo cp nginx/nginx.conf /etc/nginx/sites-available/gestionale
sudo ln -s /etc/nginx/sites-available/gestionale /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 8. Test post-deploy

### 8.1 Test funzionalità critiche
```bash
# Test connettività
ping -c 3 8.8.8.8

# Test servizi
docker-compose ps

# Test API
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000
```

### 8.2 Test sicurezza
```bash
# Verifica permessi segreti
ls -la secrets/

# Verifica firewall
sudo ufw status

# Verifica log
docker-compose logs --tail=50
```

### 8.3 Test performance
```bash
# Monitora risorse
htop

# Verifica spazio disco
df -h

# Verifica memoria
free -h
```

---

## 9. Rollback

### 9.1 Se qualcosa va storto
```bash
# Ferma tutto
docker-compose down

# Ripristina da backup
./scripts/restore_unified.sh --docker

# Riavvia
docker-compose up -d
```

### 9.2 Reset completo
```bash
# Ferma e rimuovi tutto
docker-compose down -v
docker system prune -a

# Ripristina da zero
./scripts/setup_docker.sh
```

---

## ⚠️ Note importanti

### Sicurezza:
- **Cambia password** dopo il primo login
- **Configura SSH** con chiavi
- **Attiva firewall** UFW
- **Aggiorna** regolarmente il sistema

### Backup:
- **Crea backup** prima di ogni modifica
- **Testa ripristino** su VM
- **Documenta** ogni configurazione

### Troubleshooting:
- **Se la rete non funziona**: Verifica configurazione MikroTik
- **Se SSH non funziona**: Controlla firewall
- **Se cloud-init si blocca**: Aspetta 10 minuti prima di riavviare
- **Se Git non funziona**: Usa backup NAS
- **Se Docker non si avvia**: Verifica permessi e spazio disco

---

---

## 10. Test Deploy su VM (Preparazione Produzione)

### Prima del Deploy Produzione
**IMPORTANTE**: Testa sempre il deploy su VM prima del deploy produzione!

### Configurazione VM di Test
- **IP VM**: `10.10.10.43` (diverso da produzione `10.10.10.15`)
- **Hostname**: `gestionale-vm-test`
- **Sistema**: Ubuntu Server 22.04.3 LTS
- **Utente**: `mauri`
- **Password**: `solita` (solo per test)

### Procedura Test Rapida
```bash
# 1. Installa Ubuntu Server sulla VM
# 2. Configura IP statico: 10.10.10.43
# 3. Ottieni progetto:
cd /home/mauri
git clone https://ghp_YOUR_TOKEN@github.com/MauriFerrariF76/gestionale-fullstack.git
cd gestionale-fullstack

# 4. Installa Docker:
./scripts/install_docker.sh
./scripts/setup_docker.sh

# 5. Deploy applicazione:
docker-compose up -d

# 6. Test funzionalità:
curl http://localhost:3001/health
curl http://localhost:3000

# 7. Test accesso esterno (da PC-MAURI):
curl http://10.10.10.43:3000
curl http://10.10.10.43:3001/health

# 8. Test completo automatico:
./scripts/test_vm_deploy.sh --full
```

### Checklist Test Essenziale
- [ ] VM accessibile da PC-MAURI: `ssh mauri@10.10.10.43`
- [ ] Docker installato e funzionante
- [ ] Progetto clonato correttamente
- [ ] Segreti configurati in `secrets/`
- [ ] Servizi avviati: `docker-compose ps`
- [ ] Backend risponde: `curl http://localhost:3001/health`
- [ ] Frontend accessibile: `curl http://localhost:3000`
- [ ] Accesso esterno funziona da PC-MAURI
- [ ] Report test generato

### Troubleshooting Test VM
- **Rete non funziona**: Verifica configurazione bridge adapter
- **Docker non si avvia**: Verifica permessi e spazio disco
- **Servizi non rispondono**: Controlla log con `docker-compose logs`
- **Accesso esterno fallisce**: Verifica firewall e routing

### Script di Supporto
```bash
# Test completo automatico
./scripts/test_vm_deploy.sh --full

# Menu interattivo
./scripts/test_vm_deploy.sh
```

### Prima del Deploy Produzione
1. **Testa sempre** il deploy su VM
2. **Verifica** tutti i punti della checklist
3. **Documenta** eventuali problemi e soluzioni
4. **Aggiorna** questa guida se necessario

---

**La procedura è completa. Testa sempre su VM prima del deploy produzione!** 