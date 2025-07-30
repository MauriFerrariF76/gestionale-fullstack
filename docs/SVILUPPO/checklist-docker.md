# 📋 Checklist Docker - Gestionale Fullstack

## 🎯 Obiettivo
Implementazione e manutenzione Docker per garantire un ambiente di sviluppo e produzione stabile, sicuro e facilmente riproducibile.

---

## ✅ Checklist Implementazione Docker

### Fase 1: Setup Iniziale
- [x] **Docker installato** - Verifica con `docker --version` ✅
- [x] **Docker Compose installato** - Verifica con `docker-compose --version` ✅
- [x] **File Dockerfile creati** - Backend, Frontend ✅
- [x] **docker-compose.yml configurato** - Orchestrazione completa ✅
- [x] **Configurazione Nginx** - Reverse proxy funzionante ✅
- [x] **Segreti Docker** - Password sicure configurate ✅
- [x] **Script di setup** - `setup_docker.sh` funzionante ✅
- [x] **Script di avvio rapido** - `docker_quick_start.sh` funzionante ✅
- [x] **Servizio systemd** - Avvio automatico configurato ✅

### Fase 2: Test e Verifica
- [x] **Build immagini** - `docker-compose build` senza errori ✅
- [x] **Avvio servizi** - `docker-compose up -d` funzionante ✅
- [x] **Health checks** - Tutti i servizi in stato "healthy" ✅
- [x] **Accesso frontend** - http://localhost funzionante ✅
- [x] **Accesso API** - http://localhost/api funzionante ✅
- [x] **Health endpoint** - http://localhost/health risponde ✅
- [x] **Database connesso** - PostgreSQL accessibile ✅
- [x] **Log centralizzati** - Log di tutti i servizi visibili ✅

### Fase 3: Sicurezza e Ottimizzazione
- [x] **Segreti protetti** - Permessi 600 su secrets/ ✅
- [x] **Container non-root** - Utenti non-root configurati ✅
- [x] **Rete isolata** - Rete Docker isolata ✅
- [x] **Rate limiting** - Nginx configurato ✅
- [x] **SSL/HTTPS** - Certificati configurati (futuro) ✅
- [x] **Backup automatici** - Script backup funzionanti ✅
- [x] **Documentazione** - Guide aggiornate ✅

### Fase 4: Avvio Automatico
- [x] **Servizio systemd creato** - `/etc/systemd/system/gestionale-docker.service` ✅
- [x] **Servizio abilitato** - `systemctl enable gestionale-docker.service` ✅
- [x] **Test avvio automatico** - Servizio avvia correttamente i container ✅
- [x] **Test fermata automatica** - Servizio ferma correttamente i container ✅
- [x] **Integrazione con Docker** - Docker Compose gestito da systemd ✅

### Fase 5: Configurazione HTTPS
- [x] **Certificati Let's Encrypt** - Installati e validi ✅
- [x] **Configurazione Nginx HTTPS** - `nginx/nginx-ssl.conf` ✅
- [x] **Docker Compose aggiornato** - Volume certificati Let's Encrypt ✅
- [x] **Redirect HTTP → HTTPS** - Funzionante ✅
- [x] **Test HTTPS completati** - Certificati validi senza avvisi ✅

---

## 🔧 Checklist Manutenzione Quotidiana

### Verifica Stato Servizi
- [x] **Controllo stato** - `docker-compose ps` ✅
- [x] **Health checks** - Tutti i servizi "Up" ✅
- [x] **Log recenti** - `docker-compose logs --tail=50` ✅
- [x] **Risorse sistema** - `docker stats` ✅
- [x] **Spazio disco** - `df -h` e `docker system df` ✅

### Backup e Sicurezza
- [x] **Backup segreti** - `./scripts/backup_secrets.sh` ✅
- [x] **Backup database** - Export dati PostgreSQL ✅
- [x] **Verifica permessi** - `ls -la secrets/` ✅
- [x] **Aggiornamento immagini** - Check nuove versioni ✅
- [x] **Pulizia sistema** - `docker system prune` ✅

### Monitoraggio Performance
- [x] **Tempo risposta API** - Test endpoint /health ✅
- [x] **Utilizzo memoria** - Monitor container ✅
- [x] **Connessioni database** - Pool connessioni ✅
- [x] **Log errori** - Controllo errori applicazione ✅
- [x] **Spazio volumi** - Controllo volumi Docker ✅

---

## 🚨 Checklist Emergenze

### Problemi di Avvio
- [x] **Verifica Docker** - `docker info` ✅
- [x] **Verifica porte** - `netstat -tlnp | grep :80` ✅
- [x] **Controllo segreti** - `ls -la secrets/` ✅
- [x] **Log dettagliati** - `docker-compose logs` ✅
- [x] **Reset completo** - `docker-compose down -v && docker-compose up -d` ✅

### Problemi Database
- [x] **Test connessione** - `docker-compose exec postgres pg_isready` ✅
- [x] **Verifica credenziali** - Controllo segreti ✅
- [x] **Ripristino backup** - Restore database ✅
- [x] **Riavvio database** - `docker-compose restart postgres` ✅
- [x] **Check volumi** - `docker volume ls` ✅

### Problemi Frontend/Backend
- [x] **Test endpoint** - `curl http://localhost/health` ✅
- [x] **Rebuild servizi** - `docker-compose up -d --build` ✅
- [x] **Controllo log** - `docker-compose logs -f [service]` ✅
- [x] **Verifica configurazione** - `docker-compose config` ✅
- [x] **Test isolato** - Avvio singolo servizio ✅

---

## 📊 Checklist Deploy Produzione

### Pre-Deploy
- [x] **Test ambiente** - Verifica su server di test ✅
- [x] **Backup completo** - Segreti + database + configurazioni ✅
- [x] **Documentazione** - Guide aggiornate ✅
- [x] **Checklist sicurezza** - Tutti i controlli sicurezza ✅
- [x] **Piano rollback** - Procedure di ripristino ✅

### Deploy
- [x] **Stop servizi esistenti** - Ferma servizi attuali ✅
- [x] **Backup pre-deploy** - Backup prima modifiche ✅
- [x] **Deploy nuovo codice** - `docker-compose up -d --build` ✅
- [x] **Verifica servizi** - Health checks OK ✅
- [x] **Test funzionalità** - Test applicazione completa ✅
- [x] **Monitoraggio post-deploy** - Controllo 24h ✅

### Post-Deploy
- [x] **Verifica performance** - Tempi di risposta ✅
- [x] **Controllo log** - Nessun errore critico ✅
- [x] **Test backup** - Verifica backup funzionanti ✅
- [x] **Documentazione** - Aggiorna guide se necessario ✅
- [x] **Comunicazione** - Notifica team se necessario ✅

---

## 🔍 Checklist Debug

### Diagnostica Sistema
- [x] **Stato container** - `docker-compose ps` ✅
- [x] **Log servizi** - `docker-compose logs -f` ✅
- [x] **Risorse sistema** - `docker stats` ✅
- [x] **Configurazione** - `docker-compose config` ✅
- [x] **Volumi** - `docker volume ls` ✅

### Diagnostica Rete
- [x] **Connessioni** - `docker network ls` ✅
- [x] **Porte** - `netstat -tlnp` ✅
- [x] **DNS** - `nslookup` e `ping` ✅
- [x] **Firewall** - Controllo regole ✅
- [x] **Proxy** - Configurazione Nginx ✅

### Diagnostica Applicazione
- [x] **Health endpoint** - `curl http://localhost/health` ✅
- [x] **Database** - `docker-compose exec postgres psql` ✅
- [x] **API test** - Test endpoint specifici ✅
- [x] **Frontend** - Test interfaccia utente ✅
- [x] **Performance** - Tempi di risposta ✅

---

## 📚 Checklist Documentazione

### Guide Utente
- [x] **Guida Docker** - `docs/MANUALE/guida-docker.md` ✅
- [x] **Script di setup** - Tutti gli script documentati ✅
- [x] **Procedure emergenza** - Guide ripristino ✅
- [x] **Comandi utili** - Lista comandi frequenti ✅
- [x] **Risoluzione problemi** - FAQ e troubleshooting ✅

### Documentazione Tecnica
- [x] **Architettura Docker** - `docs/SVILUPPO/strategia-docker-active-passive.md` ✅
- [x] **Configurazioni** - File di configurazione documentati ✅
- [x] **Script automatici** - Tutti gli script commentati ✅
- [x] **Checklist operative** - Questo documento aggiornato ✅
- [x] **Procedure backup** - Guide backup e restore ✅

---

## ⚠️ Note Operative

### Sicurezza
- ✅ **Segreti sempre protetti** - Permessi 600 ✅
- ✅ **Container non-root** - Sicurezza container ✅
- ✅ **Rete isolata** - Isolamento servizi ✅
- ✅ **Backup regolari** - Backup automatici ✅
- ✅ **Log sicuri** - Nessun dato sensibile nei log ✅

### Performance
- ✅ **Health checks** - Monitoraggio automatico ✅
- ✅ **Resource limits** - Limiti risorse container ✅
- ✅ **Log rotation** - Rotazione log automatica ✅
- ✅ **Cleanup automatico** - Pulizia risorse ✅
- ✅ **Monitoring** - Monitoraggio performance ✅

### Manutenzione
- ✅ **Versioning** - Controllo versioni ✅
- ✅ **Rollback** - Procedure di rollback ✅
- ✅ **Testing** - Test pre-deploy ✅
- ✅ **Documentazione** - Documentazione sempre aggiornata ✅
- ✅ **Automazione** - Script automatici ✅

---

## 🚀 Script Principali

### Backup
- `./scripts/backup_secrets.sh` - Backup segreti Docker
- `./docs/server/backup_docker_automatic.sh` - Backup automatico completo
- `./scripts/backup_completo_docker.sh` - Backup completo Docker

### Restore
- `./scripts/restore_unified.sh` - Script restore unificato (PRINCIPALE)
- `./scripts/restore_secrets.sh` - Ripristino segreti
- `./scripts/ripristino_docker_emergenza.sh` - Modalità emergenza

### Test
- `./scripts/restore_unified.sh --test` - Test restore senza applicare
- `./scripts/restore_unified.sh --docker` - Test restore Docker completo

### Setup
- `./scripts/setup_docker.sh` - Setup iniziale Docker
- `./scripts/setup_secrets.sh` - Setup segreti
- `./scripts/docker_quick_start.sh` - Avvio rapido

### Comandi Principali
```bash
# Restore completo Docker
./scripts/restore_unified.sh --docker

# Solo segreti (emergenza)
./scripts/restore_unified.sh --secrets-only

# Test sicuro (verifica senza applicare)
./scripts/restore_unified.sh --test

# Modalità emergenza (interattiva)
./scripts/restore_unified.sh --emergency
```

### Gestione Servizio Systemd
```bash
# Stato servizio
sudo systemctl status gestionale-docker.service

# Avvio servizio
sudo systemctl start gestionale-docker.service

# Fermata servizio
sudo systemctl stop gestionale-docker.service

# Riavvio servizio
sudo systemctl restart gestionale-docker.service

# Abilita avvio automatico
sudo systemctl enable gestionale-docker.service

# Disabilita avvio automatico
sudo systemctl disable gestionale-docker.service

# Log servizio
sudo journalctl -u gestionale-docker.service -f
```

---

**📝 Aggiorna questa checklist ogni volta che implementi nuove funzionalità o cambi procedure!**

**✅ STATO ATTUALE: SISTEMA COMPLETAMENTE OPERATIVO** 