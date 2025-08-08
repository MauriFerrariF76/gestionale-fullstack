# 🏗️ 01-FOUNDATION - Checklist Dettagliata

## Panoramica
Checklist dettagliata per l'architettura foundation del gestionale fullstack.

**Versione**: 1.0  
**Data**: 8 Agosto 2025  
**Stato**: ✅ COMPLETATA  
**Priorità**: CRITICA

---

## 🏗️ Setup Architetturale

### Architettura Ibrida
- [x] **PC-MAURI (10.10.10.33)**: Controller centrale
- [x] **pc-mauri-vaio (10.10.10.15)**: Sviluppo nativo
- [x] **gestionale-server (10.10.10.16)**: Produzione Docker
- [x] **Ambiente ibrido**: Sviluppo nativo → Produzione containerizzata
- [x] **Zero downtime**: Deploy senza interruzioni
- [x] **Healthcheck post-deploy**: Verifica automatica post-deploy

### Configurazione Rete
- [x] **IP statici**: Configurati per tutti i server
- [x] **DNS interno**: Risoluzione nomi locale
- [x] **Firewall MikroTik**: Configurato per sicurezza
- [x] **Porte aperte**: Solo quelle necessarie
- [x] **SSH sicuro**: Porta 27, anti-bruteforce

### Connettività
- [x] **PC-MAURI → pc-mauri-vaio**: SSH funzionante
- [x] **PC-MAURI → gestionale-server**: SSH funzionante
- [x] **pc-mauri-vaio → gestionale-server**: Deploy automatico
- [x] **NAS accessibile**: Da entrambi i server

---

## 🛠️ Stack Tecnologico

### Ambiente Sviluppo (pc-mauri-vaio)
- [x] **Next.js**: Framework frontend
- [x] **TypeScript**: Type safety
- [x] **PostgreSQL nativo**: Database locale
- [x] **Node.js 20.19.4**: Runtime JavaScript
- [x] **npm**: Package manager
- [x] **Hot reload**: Sviluppo veloce

### Ambiente Produzione (gestionale-server)
- [x] **Docker**: Containerizzazione
- [x] **Docker Compose**: Orchestrazione
- [x] **Nginx**: Reverse proxy
- [x] **PostgreSQL container**: Database containerizzato
- [x] **Let's Encrypt**: SSL automatico
- [x] **Health checks**: Monitoraggio automatico

### Database e ORM
- [x] **PostgreSQL 16.9**: Database relazionale
- [x] **Prisma ORM**: Object-relational mapping
- [x] **Migrations automatiche**: Via entrypoint.sh
- [x] **Database separati**: gestionale_dev (sviluppo) vs gestionale (produzione) ✅ CONFIGURATO
- [x] **Type generation**: TypeScript types automatici

### Backup e Sicurezza
- [x] **Backup automatici**: Giornalieri con retention
- [x] **Rollback immediato**: Procedure testate
- [x] **Cifratura**: GPG per backup sensibili
- [x] **Retention policy**: 30 giorni produzione, 7 giorni sviluppo

---

## 📊 Configurazioni Critiche

### Server Configurazioni
- **Ubuntu Server 22.04 LTS**: Sistema operativo
- **Fuso orario**: Europe/Rome (CEST/CET)
- **Utente**: mauri
- **Permessi**: Configurati correttamente
- **Servizi**: systemd per gestione servizi

### Database Configurazioni
- **Sviluppo**: gestionale_dev (PostgreSQL nativo)
- **Produzione**: gestionale (PostgreSQL container)
- **Utenti separati**: gestionale_dev_user vs gestionale_user
- **Password**: Sicure e separate
- **Connessioni**: Limitate e sicure

### Network Configurazioni
- **Subnet**: 10.10.10.0/24
- **Gateway**: 10.10.10.1
- **DNS**: 8.8.8.8, 8.8.4.4
- **Firewall**: UFW configurato
- **SSH**: Porta 27, chiavi sicure

---

## 🔧 Script e Automazioni

### Script Foundation
- [x] **setup-ambiente-sviluppo.sh**: Setup completo sviluppo
- [x] **sync-dev-to-prod.sh**: Sincronizzazione dev → prod
- [x] **backup-sviluppo.sh**: Backup ambiente sviluppo
- [x] **start-sviluppo.sh**: Avvio ambiente sviluppo
- [x] **stop-sviluppo.sh**: Stop ambiente sviluppo

### Automazioni Foundation
- [x] **Cron jobs**: Backup automatici
- [x] **Health checks**: Monitoraggio automatico
- [x] **Log rotation**: Gestione log automatica
- [x] **Cleanup**: Pulizia automatica

### Monitoring Foundation
- [x] **Uptime Kuma**: Monitoring web
- [x] **Log centralizzati**: Tutti i log in `/var/log/`
- [x] **Alert email**: Notifiche automatiche
- [x] **Performance monitoring**: Controllo risorse

---

## 📋 Verifiche Foundation

### Test Connettività
```bash
# Test SSH
ssh -p 27 mauri@10.10.10.15  # Sviluppo
ssh -p 27 mauri@10.10.10.16  # Produzione

# Test Database
psql -h localhost -U gestionale_dev_user -d gestionale_dev  # Sviluppo
docker compose exec postgres psql -U gestionale_user -d gestionale  # Produzione

# Test Applicazione
curl http://localhost:3000  # Frontend sviluppo
curl http://localhost:3001/health  # Backend sviluppo
curl https://gestionale.carpenteriaferrari.com  # Produzione
```

### Test Backup
```bash
# Test backup sviluppo
./scripts/backup-sviluppo.sh

# Test backup produzione
./docs/server/backup_docker_automatic.sh

# Verifica integrità
ls -la backup/sviluppo/
ls -la /mnt/backup_gestionale/
```

### Test Deploy
```bash
# Test deploy sviluppo
./scripts/start-sviluppo.sh

# Test deploy produzione
docker compose up -d

# Verifica health
curl http://localhost:3001/health
docker compose ps
```

---

## 🚨 Problemi Comuni

### Problemi Connettività
- **SSH non funziona**: Verificare porta 27 e firewall
- **Database non raggiungibile**: Verificare servizio PostgreSQL
- **Applicazione non risponde**: Verificare servizi Node.js

### Problemi Backup
- **Backup fallisce**: Verificare spazio disco e permessi
- **NAS non montato**: Verificare credenziali e connettività
- **Cifratura fallisce**: Verificare chiavi GPG

### Problemi Deploy
- **Container non si avvia**: Verificare Docker e risorse
- **Migrations falliscono**: Verificare database e schema
- **Health check fallisce**: Verificare applicazione e dipendenze

---

## 📝 Note Operative

### Configurazioni Critiche
- **Server**: Ubuntu Server 22.04 LTS
- **IP Server**: 10.10.10.16 (gestionale-server)
- **IP Sviluppo**: 10.10.10.15 (pc-mauri-vaio)
- **IP Controller**: 10.10.10.33 (PC-MAURI)
- **NAS**: 10.10.10.21 (Synology)
- **Utente**: mauri
- **Fuso orario**: Europe/Rome (CEST/CET)
- **Documentazione**: `/home/mauri/gestionale-fullstack/docs/`

### Credenziali di Emergenza
- **File protetto**: `sudo cat /root/emergenza-passwords.md`
- **Permessi**: 600 (solo root)
- **Backup**: Incluso nei backup automatici

---

**✅ Foundation implementata con successo!**

**🏗️ Architettura ibrida funzionante e robusta.**

**📊 STATO FINALE: 100% COMPLETATA**
