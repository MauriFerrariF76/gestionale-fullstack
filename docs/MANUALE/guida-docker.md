# 🐳 Guida Docker - Gestionale Fullstack

## 📋 Panoramica

Questa guida ti spiega come usare Docker con il gestionale in modo **semplice e sicuro**. Docker permette di avviare l'intera applicazione con un solo comando!

---

## 🚀 Avvio Rapido

### Primo Avvio (Setup Completo)
```bash
# 1. Installa Docker (se non già fatto)
./scripts/install_docker.sh

# 2. Setup completo automatico
./scripts/setup_docker.sh
```

### Avvio Veloce (Dopo il primo setup)
```bash
# Avvio rapido
./scripts/docker_quick_start.sh
```

### Avvio Manuale
```bash
# Avvia tutti i servizi
docker compose up -d

# Visualizza i log
docker compose logs -f
```

---

## 🌐 Accesso all'Applicazione

Dopo l'avvio, accedi a:

- **🌐 Frontend**: http://localhost
- **🔧 API Backend**: http://localhost/api  
- **💚 Health Check**: http://localhost/health

---

## 🔧 Comandi Utili

### Gestione Servizi
```bash
# Avvia servizi
docker compose up -d

# Ferma servizi
docker compose down

# Riavvia servizi
docker compose restart

# Ricostruisci (dopo modifiche al codice)
docker compose up -d --build
```

### Monitoraggio
```bash
# Stato servizi
docker compose ps

# Log di tutti i servizi
docker compose logs -f

# Log di un servizio specifico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
docker compose logs -f nginx

# Ultimi 50 log di un servizio
docker compose logs --tail=50 backend

# Monitora risorse dei container
docker compose top
```

### Accesso ai Container
```bash
# Entra nel container backend
docker compose exec backend sh

# Entra nel database
docker compose exec postgres psql -U gestionale_user -d gestionale

# Verifica database
docker compose exec postgres pg_isready -U gestionale_user -d gestionale
```

---

## 🔐 Gestione Sicura delle Password

### Backup Segreti
```bash
# Backup cifrato dei segreti
./scripts/backup_secrets.sh

# I backup vengono salvati in: backup/docker/
```

### Ripristino Segreti
```bash
# Ripristina da backup
./scripts/restore_secrets.sh backup_file.tar.gz.gpg
```

### Password Memorizzate
- **Database**: `gestionale2025`
- **JWT**: `GestionaleFerrari2025JWT_UltraSecure_v1!`
- **Master**: `"La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"`

---

## 🛠️ Risoluzione Problemi

### Servizi Non Partono
```bash
# 1. Verifica stato
docker compose ps

# 2. Controlla log
docker compose logs

# 3. Ricostruisci tutto
docker compose down
docker compose up -d --build
```

### Database Non Connette
```bash
# 1. Verifica database
docker compose exec postgres pg_isready -U gestionale_user -d gestionale

# 2. Controlla segreti
ls -la secrets/

# 3. Riavvia solo database
docker compose restart postgres
```

### Frontend Non Carica
```bash
# 1. Verifica frontend
curl http://localhost

# 2. Controlla log frontend
docker compose logs -f frontend

# 3. Ricostruisci frontend
docker compose up -d --build frontend
```

### Porte Occupate
```bash
# Verifica porte in uso
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Se occupate, ferma servizi esistenti
sudo systemctl stop nginx
```

---

## 📊 Backup e Ripristino

### Backup Completo
```bash
# 1. Backup segreti
./scripts/backup_secrets.sh

# 2. Backup database
docker compose exec postgres pg_dump -U gestionale_user gestionale > backup_db.sql

# 3. Backup configurazioni
tar czf config_backup.tar.gz docker-compose.yml nginx/ postgres/
```

### Ripristino Completo
```bash
# 1. Ripristina segreti
./scripts/restore_secrets.sh backup_file.tar.gz.gpg

# 2. Ripristina database
docker compose exec -T postgres psql -U gestionale_user -d gestionale < backup_db.sql

# 3. Riavvia servizi
docker compose restart
```

---

## 🔍 Debug e Diagnostica

### Verifica Configurazione
```bash
# Test configurazione Docker Compose
docker compose config

# Verifica immagini
docker images

# Verifica volumi
docker volume ls
```

### Test Connessioni
```bash
# Test backend
curl http://localhost/health

# Test database
docker compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT NOW();"

# Test frontend
curl -I http://localhost
```

### Pulizia Sistema
```bash
# Rimuovi container non usati
docker container prune

# Rimuovi immagini non usate
docker image prune

# Rimuovi volumi non usati
docker volume prune

# Pulizia completa (ATTENZIONE! Rimuove TUTTO)
docker system prune -a --volumes
```

---

## 📚 Struttura File Docker

```
gestionale-fullstack/
├── docker-compose.yml          # Orchestrazione servizi
├── backend/
│   └── Dockerfile             # Container backend
├── frontend/
│   └── Dockerfile             # Container frontend
├── nginx/
│   └── nginx.conf             # Configurazione proxy
├── secrets/                   # 🔐 Password sicure
│   ├── db_password.txt
│   └── jwt_secret.txt
└── scripts/
    ├── setup_docker.sh        # Setup completo
    ├── docker_quick_start.sh  # Avvio rapido
    ├── backup_secrets.sh      # Backup segreti
    └── restore_secrets.sh     # Ripristino segreti
```

---

## ⚠️ Note Importanti

### Sicurezza
- ✅ I segreti sono protetti con permessi 600
- ✅ Container eseguiti come utente non-root
- ✅ Rete isolata per i container
- ✅ Rate limiting su Nginx

### Performance
- ✅ Build ottimizzato per produzione
- ✅ Compressione Gzip attiva
- ✅ Pool connessioni database ottimizzato
- ✅ Health checks automatici

### Manutenzione
- ✅ Log centralizzati
- ✅ Backup automatici configurabili
- ✅ Rollback semplice
- ✅ Monitoraggio integrato

---

## 🆘 Emergenze

### Ripristino Rapido
```bash
# 1. Ferma tutto
docker compose down

# 2. Ripristina segreti
./scripts/restore_secrets.sh backup_file.tar.gz.gpg

# 3. Riavvia
docker compose up -d

# 4. Verifica
curl http://localhost/health
```

### Reset Completo
```bash
# 1. Ferma e rimuovi tutto
docker compose down -v

# 2. Rimuovi immagini
docker rmi $(docker images -q gestionale-fullstack_*)

# 3. Setup da zero
./scripts/setup_docker.sh
```

---

## 🔄 Compatibilità e Aggiornamenti

### Versione Docker Compose
```bash
# Verifica versione Docker Compose
docker compose version

# Se hai la versione vecchia (docker-compose), aggiorna:
# Ubuntu/Debian
sudo apt update && sudo apt install docker-compose-plugin

# Oppure usa il plugin Docker Compose V2
docker compose --version
```

### Migrazione da docker-compose a docker compose
```bash
# Il comando docker-compose è deprecato, usa sempre:
docker compose up -d    # invece di docker-compose up -d
docker compose down     # invece di docker-compose down
docker compose logs -f  # invece di docker-compose logs -f
```

---

**🎯 Obiettivo: Usa Docker per avere un ambiente sempre funzionante e facilmente riproducibile!** 

---

## Risoluzione problemi Docker (FAQ)

**1. Un container non parte o si blocca**
- Controlla i log: `docker compose logs -f nome_servizio`
- Verifica che le porte non siano già occupate
- Riavvia il servizio: `docker compose restart nome_servizio`

**2. Errore di permessi sui volumi**
- Verifica i permessi delle cartelle condivise
- Usa `sudo chown -R mauri:mauri nome_cartella`

**3. Database non accessibile**
- Controlla che il container postgres sia attivo
- Verifica la password nel file `secrets/db_password.txt`

**4. Aggiornamento immagini fallisce**
- Esegui `docker compose pull` per aggiornare le immagini
- Se serve, rimuovi i container e ricostruisci: `docker compose down && docker compose up -d --build`

--- 