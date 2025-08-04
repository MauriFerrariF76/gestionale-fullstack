# 🚀 Guida Deploy Automatico Produzione - Gestionale Fullstack

## 📋 Indice
- [1. Prerequisiti](#1-prerequisiti)
- [2. Installazione Ubuntu Server](#2-installazione-ubuntu-server)
- [3. Deploy Automatico](#3-deploy-automatico)
- [4. Verifiche Post-Deploy](#4-verifiche-post-deploy)
- [5. Troubleshooting](#5-troubleshooting)
- [6. Test Deploy Automatico su VM](#6-test-deploy-automatico-su-vm)

---

## 1. Prerequisiti

> **Nota sicurezza:** Per sicurezza, la porta SSH del server è la **27**. La 22 è usata solo per il primo accesso o per host legacy. Tutti i comandi e le configurazioni fanno riferimento alla porta 27.

### Prima di iniziare il deploy automatico:
- ✅ Backup completo del sistema esistente
- ✅ Test di ripristino completato su VM
- ✅ Accesso fisico al server
- ✅ Connessione internet stabile
- ✅ Credenziali di accesso al server
- ✅ Backup dei segreti e configurazioni (NAS002: `/mnt/backup_gestionale/`)

### Materiale necessario:
- USB con Ubuntu Server 24.04.2 LTS (raccomandato)
- Documentazione del progetto
- Checklist di sicurezza
- Credenziali di accesso

---

## 2. Installazione Ubuntu Server

### 2.1 Preparazione Media
**Per Produzione (Server fisico):**
1. **Scarica** Ubuntu Server 24.04.2 LTS da https://ubuntu.com/download/server
2. **Crea** USB bootabile con Rufus o Balena Etcher
3. **Verifica** che l'USB sia riconosciuto dal server

**Per Test VM (VirtualBox):**
1. **Scarica** Ubuntu Server 24.04.2 LTS da https://ubuntu.com/download/server
2. **Salva** il file ISO in una directory accessibile
3. **Monta** l'ISO nelle impostazioni della VM (Sistema → Archiviazione)

### 2.2 Avvio e installazione
**Per Produzione (Server fisico):**
1. **Inserisci** l'USB nel server
2. **Avvia** il server e premi F12 (o tasto appropriato) per boot menu
3. **Seleziona** l'USB come dispositivo di boot
4. **Aspetta** il caricamento dell'installer

**Per Test VM (VirtualBox):**
1. **Avvia** la VM in VirtualBox
2. **Aspetta** il caricamento dell'installer dall'ISO montato

### 2.3 Configurazione lingua e tastiera
1. **Lingua**: Italiano
2. **Layout tastiera**: Italiano
3. **Premi**: Invio per continuare

### 2.4 Configurazione di rete
1. **Seleziona**: "Edit IPv4"
2. **Metodo**: "Manual" (non DHCP)
3. **Configura**:
   - **Subnet**: `10.10.10.0/24`
   - **Address**: `10.10.10.15` (per produzione) / `10.10.10.43` (per test VM)
   - **Gateway**: `10.10.10.1`
   - **Name servers**: `8.8.8.8, 8.8.4.4`
4. **Search Domains**: Lascia vuoto
5. **Proxy Address**: Lascia vuoto

### 2.5 Mirror Ubuntu
1. **Lascia** il mirror predefinito
2. **Aspetta** che finisca il test dei mirror (può richiedere 2-15 minuti)
3. **Non interrompere** il processo - è normale che ci metta tempo
4. **Se si blocca**: aspetta almeno 10 minuti prima di riavviare
5. **Opzione skip**: Se il processo è troppo lento, puoi skippare senza problemi
6. **Premi**: Invio per continuare quando finisce o per skippare

### 2.6 Layout disco
1. **Seleziona**: "Use entire disk"
2. **⚠️ IMPORTANTE**: **Deseleziona** "Set up this disk as an LVM group" (togli la spunta)
3. **Premi**: Invio per confermare
4. **Aspetta** che finisca il partizionamento

**NOTA**: LVM (Logical Volume Management) può causare problemi con Docker e non è necessario per il nostro setup. È meglio usare partizionamento standard.

#### Se LVM è stato attivato per errore:
```bash
# Verifica se LVM è attivo
sudo lvs
sudo vgs

# Se LVM è presente, riconfigura il disco:
# 1. Backup dati importanti
# 2. Reinstalla Ubuntu Server
# 3. Durante l'installazione, assicurati di deselezionare LVM
```

### 2.7 Configurazione utente
1. **Your name**: `Mauri`
2. **Your server's name**: `gestionale-server` (per produzione) / `gestionale-vm-test` (per test VM)
3. **Pick a username**: `mauri`
4. **Choose a password**: Scegli una password sicura (es: `solita`)
5. **Confirm password**: Ripeti la stessa password

### 2.8 SSH
1. **Seleziona**: "Install OpenSSH server"
2. **Premi**: Invio per continuare

**NOTA**: SSH è essenziale per l'accesso remoto al server

### 2.9 Server Snaps
1. **Seleziona**: "No, thanks"
2. **Premi**: Invio per continuare

### 2.10 Ubuntu Pro
1. **Seleziona**: "No, thanks"
2. **Premi**: Invio per continuare

### 2.11 Fine installazione
**Per Produzione (Server fisico):**
1. **Aspetta** che finisca l'installazione
2. **Premi**: Invio quando chiede di riavviare
3. **Rimuovi** l'USB dopo il riavvio

**Per Test VM (VirtualBox):**
1. **Aspetta** che finisca l'installazione
2. **Premi**: Invio quando chiede di riavviare
3. **Aspetta** che la VM si riavvii completamente
4. **Ferma** la VM (non spegni, solo ferma)
5. **Vai** in Impostazioni → Sistema → Archiviazione
6. **Seleziona** il controller IDE → Disco vuoto
7. **Clicca** l'icona del disco (a destra)
8. **Seleziona** "Rimuovi disco"
9. **Clicca** "OK"
10. **Avvia** la VM

### 2.12 Primo login
1. **Premi**: Invio per vedere il prompt di login
2. **Username**: `mauri`
3. **Password**: `solita` (o quella scelta)

---

## 3. Deploy Automatico

### 3.1 Verifica configurazione iniziale
```bash
hostname          # Dovrebbe mostrare: gestionale-server o gestionale-vm-test
whoami            # Dovrebbe mostrare: mauri
ip addr show      # Dovrebbe mostrare: 10.10.10.15 o 10.10.10.43
```

### 3.2 Download script di automazione
```bash
# Crea directory per il progetto
cd /home/mauri
mkdir gestionale-fullstack
cd gestionale-fullstack

# Download script di automazione (repository pubblico)
wget https://raw.githubusercontent.com/MauriFerrariF76/gestionale-scripts-public/main/install-gestionale-completo.sh

# Rendi eseguibile
chmod +x install-gestionale-completo.sh
```

### 3.3 Esecuzione deploy automatico
```bash
# Esegui lo script di automazione con privilegi di amministratore
sudo ./install-gestionale-completo.sh
```

### 3.4 Cosa fa lo script automatico
Lo script esegue automaticamente:

1. ✅ **Verifica prerequisiti** (sistema, memoria, disco)
2. ✅ **Aggiornamento sistema** (pacchetti essenziali + build tools)
3. ✅ **Installazione Docker** (Docker CE + Docker Compose)
   - **Nota**: Durante l'installazione Docker, il sistema può chiedere conferma per sovrascrivere la chiave GPG: rispondere **Y** (Yes)
4. ✅ **Configurazione rete** (IP statico, DNS)
5. ✅ **Configurazione SSH** (porta 27, sicurezza)
6. ✅ **Configurazione firewall** (UFW)
7. ✅ **Clonazione repository** (Git)
   - **Nota**: Lo script rimuove automaticamente directory esistenti e clona il repository corretto
8. ✅ **Setup applicazione** (variabili, segreti)
   - **Nginx dockerizzato**: Installato automaticamente con Docker Compose
   - **SSL/HTTPS**: Configurato con Let's Encrypt (se dominio configurato)
9. ✅ **Verifiche post-installazione**
10. ✅ **Generazione report**

### 3.5 Personalizzazione IP (se necessario)
Se devi cambiare l'IP del server, modifica lo script prima dell'esecuzione:

```bash
# Modifica l'IP nel file dello script
nano install-gestionale-completo.sh

# Cerca la sezione configure_network() e modifica:
# addresses:
#   - 10.10.10.15/24  # Cambia con il tuo IP
# gateway4: 10.10.10.1  # Cambia con il tuo gateway
```

---

## 4. Verifiche Post-Deploy

### 4.1 Architettura Dockerizzata Completa

Il deploy automatico configura un'architettura **completamente dockerizzata**:

```
Internet → Docker Nginx (80/443) → Container Docker
                    ↓
            ┌─────────────────┐
            │   Frontend      │
            │   (3000)        │
            └─────────────────┘
                    ↓
            ┌─────────────────┐
            │   Backend       │
            │   (3001)        │
            └─────────────────┘
                    ↓
            ┌─────────────────┐
            │   PostgreSQL    │
            │   (5432)        │
            └─────────────────┘
```

**Componenti installati:**
- ✅ **Docker Host**: Solo Docker Engine + Docker Compose
- ✅ **Nginx Container**: Reverse proxy dockerizzato
- ✅ **Frontend Container**: Next.js dockerizzato
- ✅ **Backend Container**: Node.js API dockerizzato
- ✅ **PostgreSQL Container**: Database dockerizzato
- ✅ **SSL/HTTPS**: Let's Encrypt con certificati host

**Vantaggi dell'architettura dockerizzata:**
- ✅ **Isolamento completo**: Ogni servizio nel suo container
- ✅ **Rollback facile**: Versioni specifiche per ogni componente
- ✅ **Scalabilità**: Facile aggiungere repliche
- ✅ **Manutenzione**: Aggiornamenti indipendenti
- ✅ **Sicurezza**: Container isolati e immutabili
- ✅ **Consistenza**: Stesso ambiente ovunque

### 4.2 Test automatici eseguiti dallo script
Lo script verifica automaticamente:
- ✅ **Docker e Docker Compose**: Versioni corrette
- ✅ **Docker daemon**: Attivo e funzionante
- ✅ **Container Docker**: Attivi e healthy (nginx, frontend, backend, postgres)
- ✅ **PostgreSQL client**: Installato per backup
- ✅ **Certbot**: Installato per SSL
- ✅ **Connettività**: Internet funzionante
- ✅ **Porte in ascolto**: 27, 80, 443, 5433

### 4.2 Test manuali aggiuntivi
```bash
# Verifica stato container
docker ps

# Test backend API
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000

# Test database
docker exec gestionale_postgres psql -U gestionale_user -d gestionale -c "SELECT version();"

# Verifica configurazione disco (LVM non dovrebbe essere attivo)
sudo lvs 2>/dev/null || echo "✅ LVM non attivo (corretto)"
df -h  # Verifica partizioni standard

# Verifica firewall
sudo ufw status

# Verifica SSH su porta 27
sudo ss -tuln | grep :27
```

### 4.3 Test accesso esterno
```bash
# Test da PC-MAURI (sostituisci con l'IP del server)

# Test HTTP (porta 80)
curl http://10.10.10.15
curl http://10.10.10.15/api/health

# Test HTTPS (porta 443) - se SSL configurato
curl https://gestionale.carpenteriaferrari.com
curl https://gestionale.carpenteriaferrari.com/api/health

# Test SSH
ssh -p 27 mauri@10.10.10.15

# Test con browser
# HTTP: http://10.10.10.15
# HTTPS: https://gestionale.carpenteriaferrari.com
```

### 4.4 Report generato automaticamente
Lo script genera un report in `/home/mauri/install-report-YYYYMMDD-HHMMSS.txt` con:
- **Informazioni sistema**
- **Configurazione rete**
- **Container attivi**
- **URL di accesso**
- **Comandi utili**

---

## 5. Troubleshooting

### 5.1 Se lo script fallisce
```bash
# Verifica log dello script
tail -f /var/log/syslog

# Verifica spazio disco
df -h

# Verifica memoria
free -h

# Verifica connettività
ping -c 3 8.8.8.8

# Riavvia lo script
sudo ./install-gestionale-completo.sh
```

### 5.2 Se il repository non si clona
```bash
# Verifica connettività GitHub
ping -c 3 github.com

# Prova clone manuale
cd /home/mauri
rm -rf gestionale-fullstack
git clone https://github.com/MauriFerrariF76/gestionale-fullstack.git

# Se funziona, riavvia lo script
sudo ./install-gestionale-completo.sh
```

### 5.2 Se Docker non si avvia
```bash
# Verifica servizio Docker
sudo systemctl status docker

# Riavvia servizio Docker
sudo systemctl restart docker

# Verifica permessi
groups mauri

# Aggiungi utente al gruppo docker
sudo usermod -aG docker mauri

# Logout e login di nuovo
exit
# Fai login di nuovo

# Verifica Docker
docker run hello-world
```

### 5.3 Se la rete non funziona
```bash
# Verifica configurazione rete
ip addr show
ip route show

# Riconfigura rete se necessario
sudo nano /etc/netplan/01-static-ip.yaml
sudo netplan apply
```

### 5.4 Se SSH non funziona
```bash
# Verifica porta SSH
sudo ss -tuln | grep :27

# Riavvia SSH
sudo systemctl restart ssh

# Verifica configurazione
sudo nano /etc/ssh/sshd_config
```

### 5.5 Se i container non si avviano
```bash
# Verifica log container
docker compose logs

# Riavvia servizi
docker compose down
docker compose up -d

# Verifica spazio disco
df -h
```

---

## 6. Test Deploy Automatico su VM

### Prima del Deploy Produzione
**IMPORTANTE**: Testa sempre il deploy automatico su VM prima del deploy produzione!

### Configurazione VM di Test
- **IP VM**: `10.10.10.43` (diverso da produzione `10.10.10.15`)
- **Hostname**: `gestionale-vm-test`
- **Sistema**: Ubuntu Server 24.04.2 LTS
- **Utente**: `mauri`
- **Password**: `solita` (solo per test)

### Procedura Test Rapida Automatico
```bash
# 1. Installa Ubuntu Server sulla VM
# 2. Configura IP statico: 10.10.10.43
# 3. Download e esecuzione script automatico:
cd /home/mauri
mkdir gestionale-fullstack
cd gestionale-fullstack
wget https://raw.githubusercontent.com/MauriFerrariF76/gestionale-fullstack/main/scripts/install-gestionale-completo.sh
chmod +x install-gestionale-completo.sh
sudo ./install-gestionale-completo.sh

# 4. Test automatici (eseguiti dallo script):
# - Verifica container: docker ps
# - Test backend: curl http://localhost:3001/health
# - Test frontend: curl http://localhost:3000

# 5. Test accesso esterno (da PC-MAURI):
curl http://10.10.10.43:3000
curl http://10.10.10.43:3001/health
ssh -p 27 mauri@10.10.10.43
```

### Checklist Test Automatico Essenziale
- [ ] VM accessibile da PC-MAURI: `ssh mauri@10.10.10.43` (porta 22 solo per il primo accesso, poi usare sempre la 27)
- [ ] Script automatico scaricato e eseguibile
- [ ] Deploy automatico completato senza errori
- [ ] SSH configurato su porta 27: `ssh -p 27 mauri@10.10.10.43`
- [ ] Container attivi: `docker ps`
- [ ] Backend risponde: `curl http://localhost:3001/health`
- [ ] Frontend accessibile: `curl http://localhost:3000`
- [ ] Accesso esterno funziona da PC-MAURI
- [ ] Report automatico generato
- [ ] LVM non attivo: `sudo lvs 2>/dev/null || echo "✅ LVM non attivo"`

### Troubleshooting Test VM Automatico
- **Script non scaricato**: Verifica connettività internet
- **Script non eseguibile**: `chmod +x install-gestionale-completo.sh`
- **Deploy fallisce**: Controlla log e spazio disco
- **Container non attivi**: Verifica Docker e permessi
- **Accesso esterno fallisce**: Verifica firewall e routing

### Prima del Deploy Produzione Automatico
1. **Testa sempre** il deploy automatico su VM
2. **Verifica** tutti i punti della checklist
3. **Documenta** eventuali problemi e soluzioni
4. **Aggiorna** questa guida se necessario

---

## ⚠️ Note importanti

### Sicurezza:
- **Cambia password** dopo il primo login
- **Configura SSH** con chiavi
- **Attiva firewall** UFW (configurato automaticamente)
- **Aggiorna** regolarmente il sistema

### Backup:
- **Crea backup** prima di ogni modifica
- **Testa ripristino** su VM
- **Documenta** ogni configurazione

### Vantaggi del Deploy Automatico con Docker:
- **Tempo ridotto**: Deploy completo in ~15 minuti
- **Riproducibilità**: Stessa configurazione ovunque
- **Sicurezza**: Container isolati e immutabili
- **Manutenzione**: Rollback istantaneo e report automatico
- **Troubleshooting**: Log centralizzati e debugging semplificato
- **Scalabilità**: Facile aggiungere servizi e load balancing
- **Zero conflitti**: Ogni servizio ha la sua versione isolata

---

**La procedura automatica è completa. Testa sempre su VM prima del deploy produzione!**

---

## Schema rapido deploy automatico

1. **Prepara la VM/server** (requisiti, IP, credenziali)
2. **Scarica lo script** `install-gestionale-completo.sh`
3. **Esegui lo script** (installazione e configurazione automatica)
4. **Testa il deploy**:
   - Usa `test-vm-clone.sh` per test completo su VM
   - Usa `monitor-deploy-vm.sh` per monitoraggio avanzato
5. **Verifica servizi** (container, backend, frontend, accesso esterno)
6. **Consulta il report generato**

---

**Per test e monitoraggio automatico:**
- Vedi script `scripts/test-vm-clone.sh` (test end-to-end su VM)
- Vedi script `scripts/monitor-deploy-vm.sh` (monitoraggio avanzato)

---

## 7. Configurazione Post-Deploy (Opzionale)

### 7.1 Configurazione SSL/HTTPS
```bash
# Configurazione automatica SSL con Certbot
sudo certbot --nginx -d your-domain.com

# Verifica certificato
sudo certbot certificates
```

### 7.2 Configurazione backup automatico
```bash
# Crea script backup automatico
sudo nano /usr/local/bin/backup_gestionale.sh
```

### Contenuto script backup:
```bash
#!/bin/bash
# backup_gestionale.sh
# Backup automatico del gestionale

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/mnt/backup_gestionale/"

# Backup container
docker compose -f /home/mauri/gestionale-fullstack/docker-compose.yml down
tar -czf /tmp/gestionale_$BACKUP_DATE.tar.gz -C /home/mauri gestionale-fullstack
docker compose -f /home/mauri/gestionale-fullstack/docker-compose.yml up -d

# Copia su NAS
scp /tmp/gestionale_$BACKUP_DATE.tar.gz mauri@10.10.10.21:/backup/gestionale/

# Pulizia
rm /tmp/gestionale_$BACKUP_DATE.tar.gz
```

### Rendi eseguibile e configura cron:
```bash
# Rendi eseguibile
sudo chmod +x /usr/local/bin/backup_gestionale.sh

# Aggiungi a crontab (backup settimanale)
crontab -e
# Aggiungi: 0 2 * * 0 /usr/local/bin/backup_gestionale.sh
```

**NOTA**: Questa sezione è opzionale e va eseguita solo dopo aver completato il deploy e testato tutto il sistema. 