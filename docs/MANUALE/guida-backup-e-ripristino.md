# 💾 Guida Backup e Ripristino - Gestionale Fullstack

## 📋 Indice
- [1. Introduzione](#1-introduzione)
- [2. Backup manuale e automatico](#2-backup-manuale-e-automatico)
- [3. Ripristino completo](#3-ripristino-completo)
- [4. Ripristino rapido](#4-ripristino-rapido)
- [5. Ripristino tramite Docker](#5-ripristino-tramite-docker)
- [6. Best practice](#6-best-practice)
- [7. Domande frequenti](#7-domande-frequenti)

---

## 1. Introduzione

### Perché è importante fare backup?
- **Sicurezza dei dati**: Proteggere i dati aziendali da perdite accidentali
- **Continuità del servizio**: Ridurre i tempi di fermo in caso di problemi
- **Conformità**: Rispettare le normative sulla protezione dei dati
- **Tranquillità**: Sapere che i dati sono al sicuro

### Cosa viene salvato nei backup?
- **Database**: Tutti i dati dei clienti, fornitori, commesse
- **Configurazioni**: Impostazioni server, script, file di configurazione
- **Segreti**: Password, chiavi di accesso, certificati
- **Codice**: Applicazione web e API

---

## 2. Backup manuale e automatico

### Backup manuale PostgreSQL
```bash
# Esegui dal server
pg_dump -U gestionale_user -h localhost -F c -b -v -f /percorso/backup/gestionale_db_$(date +%F).backup gestionale
```
- Cambia `/percorso/backup/` con la cartella dove vuoi salvare i backup
- Il file sarà nominato con la data del backup

### Restore manuale PostgreSQL
```bash
# Per ripristinare un backup
pg_restore -U gestionale_user -h localhost -d gestionale -v /percorso/backup/gestionale_db_YYYY-MM-DD.backup
```
- Sostituisci `YYYY-MM-DD` con la data del backup da ripristinare

### Backup automatico (cron)
Aggiungi una riga a `crontab -e` per backup giornaliero:
```
0 2 * * * pg_dump -U gestionale_user -h localhost -F c -b -v -f /percorso/backup/gestionale_db_$(date +\%F).backup gestionale
```

### Backup automatico Docker su NAS

#### Descrizione
Il sistema esegue automaticamente il backup completo Docker (database, configurazioni, segreti) su NAS002 (Synology) ogni notte alle 02:15.

#### Script utilizzato
- **File**: `docs/server/backup_docker_automatic.sh`
- **Cron job**: `15 2 * * *` (ogni notte alle 02:15 CEST)
- **Destinazione**: `/mnt/backup_gestionale/` (NAS002)
- **Backup locali**: `backup/docker/` (cartella dedicata)

#### Tipi di backup eseguiti
- **Database PostgreSQL**: Dump completo cifrato
- **Segreti Docker**: Password e chiavi JWT cifrate
- **Configurazioni Docker**: File di configurazione
- **Script Docker**: Script di backup e restore

#### Configurazione NAS
Il NAS è montato con i seguenti parametri in `/etc/fstab`:
```
//10.10.10.11/cartella_backup /mnt/backup_gestionale cifs credentials=/percorso/credenziali,uid=1000,gid=1000,file_mode=0770,dir_mode=0770 0 0
```

#### Notifiche email
In caso di errore, viene inviata una email a:
- `ferraripietrosnc.mauri@outlook.it`
- `mauriferrari76@gmail.com`

#### Report settimanale Docker
Ogni domenica alle 08:30 viene generato e inviato un report settimanale dei backup Docker.

**Script utilizzato**: `docs/server/backup_weekly_report_docker.sh`
**Cron job**: `30 8 * * 0` (ogni domenica alle 08:30 CEST)

#### Contenuto del report
- 📊 Statistiche generali (backup riusciti, errori, tentativi mount)
- 📅 Log degli ultimi 7 giorni
- 📋 Riepilogo file backupati
- 🔍 Verifiche aggiuntive (spazio, permessi, cron attivo)
- 🐳 Stato container Docker
- 🔧 Statistiche sistema Docker

#### Verifica manuale
```bash
# Controllo file backupati
ls -la /mnt/backup_gestionale/

# Controllo backup locali
ls -la /home/mauri/gestionale-fullstack/backup/docker/

# Controllo log
cat /mnt/backup_gestionale/backup_docker.log

# Test manuale backup Docker
sudo /home/mauri/gestionale-fullstack/docs/server/backup_docker_automatic.sh

# Test manuale report Docker
/home/mauri/gestionale-fullstack/docs/server/backup_weekly_report_docker.sh

# Test restore Docker
/home/mauri/gestionale-fullstack/docs/server/test_restore_docker_backup.sh
```

### Backup automatico GitHub → NAS

#### Descrizione
Sistema di backup automatico del repository GitHub su NAS002 per garantire ridondanza e indipendenza da GitHub.

#### Script utilizzato
- **File**: `/usr/local/bin/backup_github_to_nas.sh`
- **Cron job**: `0 2 * * 0` (ogni domenica alle 02:00 CEST)
- **Destinazione**: `/backup/gestionale/` (NAS002 - 10.10.10.21)

#### Contenuto del backup
- **Repository completo**: Mirror del repository GitHub
- **Versioni**: Tutte le versioni e tag
- **Storia**: Intera cronologia dei commit
- **Formato**: Archivio tar.gz con timestamp

#### Configurazione script
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

#### Setup automatico
```bash
# Crea script
sudo nano /usr/local/bin/backup_github_to_nas.sh
# (inserisci contenuto sopra)

# Rendi eseguibile
sudo chmod +x /usr/local/bin/backup_github_to_nas.sh

# Aggiungi a crontab
crontab -e
# Aggiungi: 0 2 * * 0 /usr/local/bin/backup_github_to_nas.sh
```

#### Vantaggi
- ✅ **Ridondanza**: Backup locale indipendente da GitHub
- ✅ **Recovery**: Ripristino rapido se GitHub non è disponibile
- ✅ **Versioning**: Mantiene tutte le versioni
- ✅ **Automazione**: Backup settimanale automatico

#### Verifica manuale
```bash
# Controllo backup GitHub su NAS
ls -la /backup/gestionale/

# Test ripristino da backup NAS
tar -tzf /backup/gestionale/gestionale_YYYYMMDD_HHMMSS.tar.gz
```

---

## 3. Ripristino completo

### Prerequisiti
- **Hardware**: Server Ubuntu 22.04 LTS (minimo 4GB RAM, 50GB disco)
- **Backup**: File `.backup` PostgreSQL, backup segreti, configurazioni
- **Credenziali**: Master Password e accesso SSH

### Fase 1: Preparazione Server

#### Installazione Ubuntu Server
```bash
# Download Ubuntu 22.04 LTS Server
# Installazione con opzioni:
# - SSH server
# - OpenSSH server
# - Standard system utilities
```

#### Configurazione Base
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

#### Installazione Docker
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

### Fase 2: Clonazione Repository
```bash
# Crea directory progetto
mkdir -p /home/mauri/gestionale-fullstack
cd /home/mauri/gestionale-fullstack

# Clona repository (se disponibile)
git clone https://github.com/MauriFerrariF76/gestionale-fullstack.git .

# Oppure copia file da backup
cp -r /mnt/backup_gestionale/gestionale-fullstack/* .
```

### Fase 3: Ripristino Segreti
```bash
# Ripristina segreti da backup
./scripts/restore_secrets.sh backup_file.tar.gz.gpg

# Oppure crea nuovi segreti
./scripts/setup_secrets.sh
```

### Fase 4: Ripristino Database
```bash
# Avvia solo PostgreSQL
docker-compose up -d postgres

# Aspetta che il database sia pronto
sleep 30

# Ripristina backup
docker-compose exec -T postgres pg_restore -U gestionale_user -d gestionale -v < backup_file.backup
```

### Fase 5: Avvio Completo
```bash
# Avvia tutti i servizi
docker-compose up -d

# Verifica stato
docker-compose ps

# Testa accesso
curl http://localhost/health
```

---

## 4. Ripristino rapido

### Ripristino solo database
```bash
# Stop servizi
docker-compose down

# Avvia solo database
docker-compose up -d postgres

# Ripristina backup
docker-compose exec -T postgres pg_restore -U gestionale_user -d gestionale -v < backup_file.backup

# Riavvio servizi
docker-compose up -d
```

### Ripristino configurazioni
```bash
# Copia configurazioni da backup
cp -r /mnt/backup_gestionale/config/* ./config/

# Riavvio servizi per applicare modifiche
docker-compose restart
```

### Ripristino segreti
```bash
# Ripristina segreti da backup cifrato
./scripts/restore_secrets.sh secrets_backup_2025-01-01.tar.gz.gpg

# Verifica permessi
ls -la secrets/
```

---

## 5. Ripristino tramite Docker

### Per utenti non esperti - Ripristino in 5 passi

#### Passo 1: Clona Repository
```bash
# Su un server Ubuntu pulito
git clone https://github.com/MauriFerrariF76/gestionale-fullstack.git
cd gestionale-fullstack
```

#### Passo 2: Installa Docker (se necessario)
```bash
# Se Docker non è installato
sudo ./scripts/install_docker.sh

# Riavvia la sessione per applicare i gruppi
newgrp docker
```

#### Passo 3: Setup Segreti Docker
```bash
# Crea segreti se non esistono
./scripts/setup_secrets.sh

# Oppure ripristina da backup
./scripts/restore_secrets.sh backup_file.tar.gz.gpg
```

#### Passo 4: Avvio Servizi Docker
```bash
# Setup completo automatico
./scripts/setup_docker.sh

# Oppure avvio rapido
./scripts/docker_quick_start.sh
```

#### Passo 5: Verifica Funzionamento
```bash
# Controlla stato servizi
docker-compose ps

# Testa accesso web
curl http://localhost/health
```

**Fine!** Il gestionale Docker è operativo. 🎉

### Cosa fa il sistema automaticamente
- ✅ Installa Docker e Docker Compose
- ✅ Configura utente e gruppi
- ✅ Crea segreti sicuri
- ✅ Build immagini Docker
- ✅ Avvia tutti i servizi
- ✅ Esegue health checks
- ✅ Testa connessioni

---

## 6. Best practice

### Sicurezza
- **Crittografia**: Cifra sempre i backup sensibili
- **Accesso limitato**: Solo utenti autorizzati ai backup
- **Verifica integrità**: Testa periodicamente i restore
- **Backup multipli**: Conserva backup su supporti diversi

### Automazione
- **Script automatici**: Usa cron per backup periodici
- **Notifiche**: Configura alert per errori di backup
- **Logging**: Mantieni log dettagliati delle operazioni
- **Monitoraggio**: Controlla regolarmente lo spazio disponibile

### Test e verifica
- **Test restore**: Esegui test di ripristino almeno mensilmente
- **Verifica integrità**: Controlla che i backup siano completi
- **Documentazione**: Mantieni aggiornate le procedure
- **Training**: Assicurati che il team conosca le procedure

### Conservazione
- **Locale**: Sullo stesso server (rischioso se il server si rompe!)
- **Remoto**: Su un altro server, NAS o cloud (consigliato)
- **Best practice**: Conserva almeno una copia dei backup fuori sede

---

## 7. Domande frequenti

### Q: Come verifico che un backup sia integro?
A: Usa il comando `pg_restore --list backup_file.backup` per vedere il contenuto senza ripristinare.

### Q: Quanto spazio serve per i backup?
A: Dipende dalla dimensione del database. In genere 2-3 volte la dimensione del database.

### Q: Posso ripristinare su una versione diversa di PostgreSQL?
A: È consigliabile usare la stessa versione. Per versioni diverse, testa sempre prima.

### Q: Cosa fare se il restore fallisce?
A: Controlla i log, verifica lo spazio disco, controlla i permessi utente.

### Q: Come testare un backup senza rischiare i dati attuali?
A: Ripristina su un database temporaneo o su un server di test.

### Q: Quanto tempo serve per un ripristino completo?
A: Dipende dalla dimensione del database. In genere 10-30 minuti.

### Q: Posso ripristinare solo alcune tabelle?
A: Sì, usa `pg_restore -t nome_tabella backup_file.backup`.

### Q: Cosa fare se ho perso le password?
A: Contatta l'amministratore o consulta il file protetto: `sudo cat /root/emergenza-passwords.md`

---

## 8. Procedure di Emergenza

### 🔐 Accesso Credenziali di Emergenza
```bash
# Accesso sicuro alle credenziali protette
sudo cat /root/emergenza-passwords.md

# Verifica che il file esista e sia protetto
ls -la /root/emergenza-passwords.md
# Risultato atteso: -rw------- 1 root root [dimensione] [data] /root/emergenza-passwords.md
```

### 🚨 Scenari di Emergenza

#### **Scenario 1: Server non risponde, accesso SSH**
```bash
# 1. Connettiti via SSH
ssh root@IP_SERVER

# 2. Accedi alle credenziali
sudo cat /root/emergenza-passwords.md

# 3. Verifica servizi Docker
docker-compose ps

# 4. Riavvia se necessario
docker-compose restart
```

#### **Scenario 2: Database corrotto, ripristino urgente**
```bash
# 1. Accedi alle credenziali protette
sudo cat /root/emergenza-passwords.md

# 2. Trova il backup più recente
ls -la /mnt/backup_gestionale/database/ | grep backup

# 3. Ripristina database
docker-compose exec postgres pg_restore -U gestionale_user -d gestionale backup_file.sql

# 4. Verifica integrità
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT COUNT(*) FROM users;"
```

#### **Scenario 3: Password admin dimenticata**
```bash
# 1. Accedi alle credenziali protette
sudo cat /root/emergenza-passwords.md

# 2. Usa le credenziali di emergenza per login
# Email: admin@gestionale.local
# Password: Admin2025!

# 3. Se non funzionano, reset completo
./scripts/setup_secrets.sh
docker-compose up -d
```

#### **Scenario 4: Server nuovo, ripristino completo**
```bash
# 1. Installa sistema base (Ubuntu Server)
# 2. Installa Docker e Docker Compose
# 3. Clona repository
git clone [repository_url]

# 4. Ripristina credenziali protette
sudo cp backup/emergenza-passwords.md /root/
sudo chmod 600 /root/emergenza-passwords.md
sudo chown root:root /root/emergenza-passwords.md

# 5. Accedi alle credenziali
sudo cat /root/emergenza-passwords.md

# 6. Ripristina segreti Docker
./scripts/restore_secrets.sh backup_file.tar.gz.gpg

# 7. Avvia servizi
docker-compose up -d
```

### 📋 Checklist Emergenza
- [ ] **Accesso SSH** al server funzionante
- [ ] **File protetto** `/root/emergenza-passwords.md` accessibile
- [ ] **Credenziali** copiate correttamente
- [ ] **Servizi Docker** avviati e funzionanti
- [ ] **Database** connesso e operativo
- [ ] **Frontend** accessibile via browser
- [ ] **Backup** verificati e integri

---

**💡 Nota**: Questa guida è aggiornata alla versione attuale del gestionale. Per modifiche significative alle procedure di backup e ripristino, aggiorna questo documento.