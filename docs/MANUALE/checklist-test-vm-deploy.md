# 📋 Checklist Test Deploy VM - Gestionale Fullstack

## 🎯 Obiettivo
Testare il deploy completo del gestionale sulla VM `10.10.10.43` seguendo la guida di produzione.

## 📊 Stato Test
- **Data inizio**: _______________
- **Data fine**: _______________
- **Tester**: Mauri
- **VM**: 10.10.10.43
- **PC Sorgente**: 10.10.10.33

---

## ✅ FASE 1: Preparazione Ambiente

### 1.1 Prerequisiti PC-MAURI
- [ ] Backup completo del progetto
- [ ] Commit e push delle modifiche correnti
- [ ] Verifica connettività con VM: `ping 10.10.10.43`
- [ ] Documentazione aggiornata

### 1.2 Preparazione VM
- [ ] VM creata con Ubuntu Server 22.04.3 LTS
- [ ] Configurazione risorse: 4GB RAM, 2 CPU, 50GB disco
- [ ] Rete configurata come bridge adapter
- [ ] IP statico configurato: `10.10.10.43`

### 1.3 Materiale necessario
- [ ] ISO Ubuntu Server 22.04.3 LTS
- [ ] Guida test VM deploy
- [ ] Checklist di sicurezza
- [ ] Credenziali di accesso

---

## ✅ FASE 2: Installazione Ubuntu Server

### 2.1 Installazione base
- [ ] Lingua: Italiano
- [ ] Layout tastiera: Italiano
- [ ] Configurazione rete: Manuale
- [ ] IP: `10.10.10.43`
- [ ] Netmask: `255.255.255.0`
- [ ] Gateway: `10.10.10.1`
- [ ] DNS: `8.8.8.8, 8.8.4.4`

### 2.2 Configurazione sistema
- [ ] Layout disco: "Use entire disk"
- [ ] Nome: Mauri
- [ ] Hostname: `gestionale-vm-test`
- [ ] Username: `mauri`
- [ ] Password: `solita`
- [ ] SSH: Installato
- [ ] Ubuntu Pro: Non installato

### 2.3 Primo login
- [ ] Login con credenziali
- [ ] Verifica hostname: `gestionale-vm-test`
- [ ] Verifica IP: `10.10.10.43`
- [ ] Verifica connettività: `ping 8.8.8.8`

---

## ✅ FASE 3: Configurazione Rete

### 3.1 Verifica configurazione
- [ ] `hostname` = `gestionale-vm-test`
- [ ] `whoami` = `mauri`
- [ ] `ip addr show` mostra IP corretto
- [ ] `ping 10.10.10.1` funziona
- [ ] `ping 8.8.8.8` funziona

### 3.2 Test accesso esterno
- [ ] Da PC-MAURI: `ping 10.10.10.43` funziona
- [ ] Da PC-MAURI: `ssh mauri@10.10.10.43` funziona
- [ ] Accesso SSH senza errori

### 3.3 Configurazione firewall (opzionale)
- [ ] UFW installato
- [ ] Porte 22, 3000, 3001 aperte
- [ ] Firewall attivo

---

## ✅ FASE 4: Ottenere Progetto

### 4.1 Metodo Git (preferito)
- [ ] Token GitHub creato
- [ ] `git clone` eseguito con successo
- [ ] Progetto scaricato in `/home/mauri/gestionale-fullstack`
- [ ] `git status` mostra stato corretto

### 4.2 Metodo SCP (fallback)
- [ ] Backup creato su PC-MAURI
- [ ] File trasferito su VM
- [ ] File estratto correttamente
- [ ] Struttura progetto verificata

### 4.3 Verifica integrità
- [ ] `docker-compose.yml` presente
- [ ] `scripts/setup_docker.sh` presente
- [ ] `scripts/install_docker.sh` presente
- [ ] `backend/` e `frontend/` presenti
- [ ] `secrets/` directory presente

---

## ✅ FASE 5: Installazione Docker

### 5.1 Verifica prerequisiti
- [ ] Progetto presente in `/home/mauri/gestionale-fullstack`
- [ ] Script install_docker.sh eseguibile
- [ ] Privilegi sudo disponibili

### 5.2 Installazione Docker
- [ ] `./scripts/install_docker.sh` eseguito
- [ ] `docker --version` mostra versione
- [ ] `docker-compose --version` mostra versione
- [ ] `docker run hello-world` funziona
- [ ] Utente `mauri` aggiunto al gruppo `docker`

### 5.3 Setup Docker
- [ ] `./scripts/setup_docker.sh` eseguito
- [ ] Segreti creati in `secrets/`
- [ ] Permessi segreti impostati (600)
- [ ] Docker Compose configurato

---

## ✅ FASE 6: Importazione Segreti

### 6.1 Verifica segreti
- [ ] `secrets/db_password.txt` presente
- [ ] `secrets/jwt_secret.txt` presente
- [ ] Permessi segreti corretti (600)
- [ ] Contenuto segreti verificato

### 6.2 Setup segreti (se necessario)
- [ ] `./scripts/setup_secrets.sh` eseguito
- [ ] Segreti creati automaticamente
- [ ] Backup segreti eseguito

### 6.3 Backup sicurezza
- [ ] `./scripts/backup_secrets.sh` eseguito
- [ ] Backup presente in `backup/`
- [ ] Backup accessibile

---

## ✅ FASE 7: Deploy Applicazione

### 7.1 Avvio servizi
- [ ] `docker-compose up -d` eseguito
- [ ] `docker-compose ps` mostra tutti i servizi UP
- [ ] Nessun errore nei log
- [ ] Porte 3000 e 3001 in ascolto

### 7.2 Test funzionalità base
- [ ] `curl http://localhost:3001/health` risponde
- [ ] `curl http://localhost:3000` risponde
- [ ] Database PostgreSQL accessibile
- [ ] Connettività tra servizi verificata

### 7.3 Test accesso esterno
- [ ] `curl http://10.10.10.43:3000` funziona
- [ ] `curl http://10.10.10.43:3001/health` funziona
- [ ] Browser accessibile da PC-MAURI

---

## ✅ FASE 8: Test Post-Deploy

### 8.1 Test funzionalità critiche
- [ ] Connettività internet: `ping 8.8.8.8`
- [ ] Tutti i servizi Docker attivi
- [ ] API backend risponde correttamente
- [ ] Frontend accessibile via browser
- [ ] Database funzionante

### 8.2 Test sicurezza
- [ ] Permessi segreti corretti
- [ ] Firewall configurato (se attivo)
- [ ] Log senza errori critici
- [ ] Porte necessarie aperte

### 8.3 Test performance
- [ ] Risorse sistema adeguate
- [ ] Spazio disco sufficiente
- [ ] Memoria disponibile
- [ ] Docker non sovraccarico

### 8.4 Test funzionalità applicative
- [ ] Login utente funzionante
- [ ] API endpoints rispondono
- [ ] Database contiene tabelle
- [ ] Frontend navigabile

---

## ✅ FASE 9: Validazione e Documentazione

### 9.1 Checklist di validazione
- [ ] VM accessibile da PC-MAURI
- [ ] Docker installato e funzionante
- [ ] Progetto clonato correttamente
- [ ] Segreti configurati
- [ ] Servizi avviati senza errori
- [ ] API risponde correttamente
- [ ] Frontend accessibile
- [ ] Database funzionante
- [ ] Log senza errori critici

### 9.2 Documentazione risultati
- [ ] Report test creato
- [ ] Report copiato su PC-MAURI
- [ ] Problemi documentati
- [ ] Soluzioni implementate

### 9.3 Aggiornamento documentazione
- [ ] Guida produzione aggiornata (se necessario)
- [ ] Checklist aggiornata
- [ ] Note operative aggiunte
- [ ] Problemi risolti documentati

---

## ❌ PROBLEMI RISCONTRATI

### Problema 1:
- **Descrizione**: _______________
- **Soluzione**: _______________
- **Prevenzione**: _______________

### Problema 2:
- **Descrizione**: _______________
- **Soluzione**: _______________
- **Prevenzione**: _______________

### Problema 3:
- **Descrizione**: _______________
- **Soluzione**: _______________
- **Prevenzione**: _______________

---

## 📝 NOTE OPERATIVE

### Decisioni tecniche:
- _______________
- _______________
- _______________

### Modifiche alla guida produzione:
- _______________
- _______________
- _______________

### Miglioramenti identificati:
- _______________
- _______________
- _______________

---

## 🎯 RISULTATO FINALE

- [ ] **TEST COMPLETATO CON SUCCESSO**
- [ ] **TEST COMPLETATO CON PROBLEMI MINORI**
- [ ] **TEST FALLITO - NECESSARIO ROLLBACK**

### Punteggio test (1-10): _____

### Raccomandazioni per produzione:
- _______________
- _______________
- _______________

---

## 📅 PROSSIMI PASSI

1. [ ] Aggiornare guida produzione se necessario
2. [ ] Preparare checklist per deploy reale
3. [ ] Testare procedure di rollback
4. [ ] Documentare lezioni apprese
5. [ ] Pianificare deploy produzione

---

**Test completato il: _______________**
**Tester: Mauri**
**Stato: _______________** 