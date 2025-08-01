# 🧪 Guida Test Deploy VM - Gestionale Fullstack

## 📋 Scenario di Test
- **VM Target**: `10.10.10.43` (VM di test)
- **PC Sorgente**: `10.10.10.33` (PC-MAURI)
- **Obiettivo**: Testare il deploy completo seguendo la guida di produzione
- **Ambiente**: Test/Staging

## 📋 Indice
- [1. Preparazione ambiente di test](#1-preparazione-ambiente-di-test)
- [2. Installazione Ubuntu Server sulla VM](#2-installazione-ubuntu-server-sulla-vm)
- [3. Configurazione di rete VM](#3-configurazione-di-rete-vm)
- [4. Ottenere il progetto sulla VM](#4-ottenere-il-progetto-sulla-vm)
- [5. Installazione Docker sulla VM](#5-installazione-docker-sulla-vm)
- [6. Importazione segreti](#6-importazione-segreti)
- [7. Deploy applicazione](#7-deploy-applicazione)
- [8. Test post-deploy](#8-test-post-deploy)
- [9. Validazione e documentazione](#9-validazione-e-documentazione)

---

## 1. Preparazione ambiente di test

### 1.1 Prerequisiti PC-MAURI (10.10.10.33)
```bash
# Verifica connettività con VM
ping -c 3 10.10.10.43

# Verifica accesso SSH (se VM già configurata)
ssh mauri@10.10.10.43

# Backup del progetto corrente
cd /home/mauri/gestionale-fullstack
git status
git add .
git commit -m "Backup pre-test VM deploy"
git push
```

### 1.2 Preparazione VM
- **Sistema**: Ubuntu Server 22.04.3 LTS
- **IP**: `10.10.10.43`
- **Hostname**: `gestionale-vm-test`
- **Utente**: `mauri`
- **Password**: `solita` (per test)

### 1.3 Checklist pre-test
- ✅ Backup completo del progetto
- ✅ VM accessibile da PC-MAURI
- ✅ Documentazione aggiornata
- ✅ Script di rollback pronti

---

## 2. Installazione Ubuntu Server sulla VM

### 2.1 Configurazione VM (VirtualBox/VMware)
1. **Crea** nuova VM Ubuntu Server 22.04.3 LTS
2. **Configura**:
   - **RAM**: 4GB minimo
   - **CPU**: 2 core minimo
   - **Disco**: 50GB minimo
   - **Rete**: Bridge adapter (accesso diretto alla rete)

### 2.2 Installazione Ubuntu Server
1. **Avvia** la VM
2. **Seleziona**: "Install Ubuntu Server"
3. **Lingua**: Italiano
4. **Layout tastiera**: Italiano

### 2.3 Configurazione di rete VM
1. **Seleziona**: "Edit IPv4"
2. **Metodo**: "Manual" (non DHCP)
3. **Configura**:
   - **IP**: `10.10.10.43` (IP della VM di test)
   - **Netmask**: `255.255.255.0`
   - **Gateway**: `10.10.10.1`
   - **DNS**: `8.8.8.8, 8.8.4.4`

### 2.4 Configurazione sistema
1. **Layout disco**: "Use entire disk"
2. **Your name**: `Mauri`
3. **Your server's name**: `gestionale-vm-test`
4. **Username**: `mauri`
5. **Password**: `solita`
6. **SSH**: "Install OpenSSH server"
7. **Ubuntu Pro**: "No, thanks"

### 2.5 Primo login VM
```bash
# Dopo il riavvio
Username: mauri
Password: solita

# Verifica configurazione
hostname
whoami
ip addr show
```

---

## 3. Configurazione di rete VM

### 3.1 Verifica configurazione di rete
```bash
# Verifica IP
ip addr show

# Verifica connettività
ping -c 3 10.10.10.1
ping -c 3 8.8.8.8

# Verifica accesso da PC-MAURI
# Dal PC-MAURI esegui:
ssh mauri@10.10.10.43
```

### 3.2 Se la rete non funziona
```bash
# Modifica configurazione di rete
sudo nano /etc/netplan/00-installer-config.yaml
```

### Contenuto del file per VM:
```yaml
network:
  version: 2
  ethernets:
    enp0s3:  # Adatta al nome della tua interfaccia
      addresses:
        - 10.10.10.43/24
      gateway4: 10.10.10.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

### Applica configurazione:
```bash
sudo netplan apply
sudo systemctl restart systemd-networkd
```

### 3.3 Test connettività completa
```bash
# Test locale
ping -c 3 10.10.10.1
ping -c 3 8.8.8.8

# Test da PC-MAURI
# Dal PC-MAURI esegui:
ping -c 3 10.10.10.43
ssh mauri@10.10.10.43
```

---

## 4. Ottenere il progetto sulla VM

### 4.1 Metodo principale: Git + Token
```bash
# Dalla VM (10.10.10.43)
cd /home/mauri

# Crea token GitHub se non esiste:
# https://github.com/settings/tokens
# Seleziona: "repo" (tutti i repository)

# Clone del progetto
git clone https://ghp_YOUR_TOKEN@github.com/MauriFerrariF76/gestionale-fullstack.git
cd gestionale-fullstack

# Verifica versione
git status
git log --oneline -5
```

### 4.2 Metodo alternativo: SCP da PC-MAURI
```bash
# Dal PC-MAURI (10.10.10.33)
cd /home/mauri/gestionale-fullstack
tar -czf gestionale-fullstack.tar.gz .

# Copia su VM
scp gestionale-fullstack.tar.gz mauri@10.10.10.43:/home/mauri/

# Dalla VM
cd /home/mauri
tar -xzf gestionale-fullstack.tar.gz
cd gestionale-fullstack
```

### 4.3 Verifica integrità progetto
```bash
# Verifica file essenziali
ls -la
test -f docker-compose.yml && echo "✅ docker-compose.yml presente"
test -f scripts/setup_docker.sh && echo "✅ Script setup presente"
test -f scripts/install_docker.sh && echo "✅ Script install Docker presente"

# Verifica struttura
ls -la scripts/
ls -la backend/
ls -la frontend/
```

---

## 5. Installazione Docker sulla VM

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

# Verifica permessi
sudo usermod -aG docker mauri
# Riloggati per applicare i permessi
exit
ssh mauri@10.10.10.43
```

### 5.4 Setup automatico Docker
```bash
# Setup completo Docker e applicazione
./scripts/setup_docker.sh
```

### 5.5 Verifica funzionamento base
```bash
# Stato servizi
docker-compose ps

# Test backend
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000

# Log servizi
docker-compose logs --tail=20
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

### 6.3 Backup segreti per sicurezza
```bash
# Backup segreti
./scripts/backup_secrets.sh

# Verifica backup
ls -la backup/
```

---

## 7. Deploy applicazione

### 7.1 Avvio completo
```bash
# Avvia tutti i servizi
docker-compose up -d

# Verifica stato
docker-compose ps

# Verifica log
docker-compose logs --tail=50
```

### 7.2 Test funzionalità base
```bash
# Test backend API
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000

# Test database
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT version();"

# Test connettività tra servizi
docker-compose exec backend ping -c 3 postgres
docker-compose exec frontend ping -c 3 backend
```

### 7.3 Configurazione Nginx (opzionale per test)
```bash
# Se vuoi testare anche Nginx
sudo apt update
sudo apt install nginx

# Copia configurazioni Nginx
sudo cp nginx/nginx.conf /etc/nginx/sites-available/gestionale
sudo ln -s /etc/nginx/sites-available/gestionale /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Test Nginx
curl http://10.10.10.43
```

---

## 8. Test post-deploy

### 8.1 Test funzionalità critiche
```bash
# Test connettività
ping -c 3 8.8.8.8

# Test servizi Docker
docker-compose ps

# Test API
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000

# Test accesso esterno
# Dal PC-MAURI esegui:
curl http://10.10.10.43:3000
curl http://10.10.10.43:3001/health
```

### 8.2 Test sicurezza
```bash
# Verifica permessi segreti
ls -la secrets/

# Verifica firewall
sudo ufw status

# Verifica log
docker-compose logs --tail=50

# Verifica porte aperte
sudo netstat -tlnp
```

### 8.3 Test performance
```bash
# Monitora risorse
htop

# Verifica spazio disco
df -h

# Verifica memoria
free -h

# Verifica uso Docker
docker system df
```

### 8.4 Test funzionalità applicative
```bash
# Test login utente
# Apri browser e vai su: http://10.10.10.43:3000

# Test API endpoints
curl http://10.10.10.43:3001/api/health
curl http://10.10.10.43:3001/api/version

# Test database
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT COUNT(*) FROM information_schema.tables;"
```

---

## 9. Validazione e documentazione

### 9.1 Checklist di validazione
- ✅ VM accessibile da PC-MAURI
- ✅ Docker installato e funzionante
- ✅ Progetto clonato correttamente
- ✅ Segreti configurati
- ✅ Servizi avviati senza errori
- ✅ API risponde correttamente
- ✅ Frontend accessibile
- ✅ Database funzionante
- ✅ Log senza errori critici

### 9.2 Documentazione risultati
```bash
# Crea report del test
cat > /home/mauri/test-vm-report.txt << EOF
=== TEST VM DEPLOY REPORT ===
Data: $(date)
VM: 10.10.10.43
PC Sorgente: 10.10.10.33

STATO SERVIZI:
$(docker-compose ps)

LOG ERRORI:
$(docker-compose logs --tail=20 | grep -i error || echo "Nessun errore trovato")

RISORSE SISTEMA:
$(free -h)
$(df -h)

CONNETTIVITA':
$(ping -c 1 8.8.8.8 | grep "1 packets")
$(ping -c 1 10.10.10.1 | grep "1 packets")

EOF

# Copia report su PC-MAURI
scp /home/mauri/test-vm-report.txt mauri@10.10.10.33:/home/mauri/
```

### 9.3 Aggiornamento documentazione
```bash
# Aggiorna checklist se necessario
# Verifica se la guida di produzione necessita modifiche
# Documenta eventuali problemi riscontrati
```

### 9.4 Pulizia (opzionale)
```bash
# Se vuoi pulire la VM per altri test
docker-compose down -v
docker system prune -a
sudo apt autoremove
```

---

## ⚠️ Note importanti per il test

### Differenze rispetto alla produzione:
- **IP**: `10.10.10.43` invece di `10.10.10.15`
- **Hostname**: `gestionale-vm-test` invece di `gestionale-server`
- **Ambiente**: Test invece di Produzione
- **Risorse**: Limitazioni VM vs Server fisico

### Sicurezza per test:
- **Password**: `solita` (solo per test)
- **Firewall**: Configurazione base
- **Backup**: Non critico per test

### Troubleshooting specifico VM:
- **Se la VM non si avvia**: Verifica risorse VirtualBox/VMware
- **Se la rete non funziona**: Verifica configurazione bridge adapter
- **Se Docker non si avvia**: Verifica permessi e spazio disco VM
- **Se i servizi non rispondono**: Verifica porte e firewall

---

## 🎯 Prossimi passi

1. **Esegui** il test seguendo questa guida
2. **Documenta** eventuali problemi
3. **Aggiorna** la guida di produzione se necessario
4. **Prepara** checklist per il deploy reale
5. **Testa** il rollback se necessario

**Buon test! 🚀** 