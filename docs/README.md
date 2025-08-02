# 📚 Documentazione Gestionale Fullstack

Questa cartella contiene tutta la documentazione del progetto, organizzata in due sezioni principali per facilitare la navigazione e l'utilizzo.

## 📁 Struttura della Documentazione

### 📖 [MANUALE/](MANUALE/) - Guide Operative e Manuale Utente
**Per operatori, utenti finali e amministratori di sistema**

Contiene:
- **Manuale Utente** - Come usare il gestionale
- **Guide Operative** - Backup, ripristino, Docker, log e monitoring
- **Procedure Standard** - Step-by-step per operazioni comuni
- **Deploy Automatico** - Guida completa per deploy automatico

**👥 Destinatari**: Operatori, utenti finali, amministratori di sistema

### 🛠️ [SVILUPPO/](SVILUPPO/) - Documentazione Tecnica e Checklist
**Per sviluppatori, DevOps e amministratori tecnici**

Contiene:
- **Checklist e Sicurezza** - Procedure di sicurezza e deploy
- **Architettura e Docker** - Containerizzazione e strategie
- **Configurazioni Server** - Setup, script, servizi Docker
- **Convenzioni** - Standard di nomenclatura e sviluppo
- **Analisi e Troubleshooting** - Report specifici e risoluzioni
- **Credenziali di Emergenza** - Accesso critico ai sistemi

**👥 Destinatari**: Sviluppatori, DevOps, amministratori tecnici

### 🖥️ [server/](server/) - Script e Configurazioni Operative
**Script attivi, configurazioni e log per il server Ubuntu**

Contiene:
- **Script di Backup Docker** - Script automatici per backup database, configurazioni e segreti Docker
- **Script di Test Restore** - Script per testare l'integrità dei backup
- **Script di Report** - Script per report settimanali e monitoring
- **Configurazioni Nginx** - Configurazioni operative del web server
- **Servizi Docker** - File di configurazione per i container backend e frontend
- **Log e Configurazioni** - Log operativi e configurazioni del sistema

**👥 Destinatari**: Amministratori di sistema, operatori tecnici

---

## 🚀 Come Iniziare

### Se sei un **Operatore/Utente Finale**:
1. Vai in **[MANUALE/](MANUALE/)** 
2. Inizia dal **[Manuale Utente](MANUALE/manuale-utente.md)**
3. Consulta le guide operative quando necessario

### Se sei un **Amministratore di Sistema**:
1. Vai in **[MANUALE/](MANUALE/)** per le guide operative
2. Vai in **[SVILUPPO/](SVILUPPO/)** per le configurazioni tecniche
3. Vai in **[server/](server/)** per script e configurazioni operative
4. Segui sempre le checklist di sicurezza
5. **CRITICO**: Consulta **`sudo cat /root/emergenza-passwords.md`** per credenziali di emergenza (file protetto)

### Se sei un **Sviluppatore/DevOps**:
1. Vai in **[SVILUPPO/](SVILUPPO/)**
2. Inizia dalle **[Convenzioni Nomenclatura](SVILUPPO/convenzioni-nomenclatura.md)**
3. Consulta **[Architettura e Docker](SVILUPPO/architettura-e-docker.md)**

---

## 📋 File Speciali

### 🔐 File Emergenza Protetto
**Accesso**: `sudo cat /root/emergenza-passwords.md`  
**Posizione**: `/root/emergenza-passwords.md` (solo root)  
**Backup**: Automatico incluso nei backup esistenti
**CRITICO** - Credenziali di emergenza per accesso al sistema
- Mantieni sempre aggiornato
- Conserva una copia cartacea sicura
- Aggiorna dopo ogni cambio password

### 🖥️ [server/](server/) - Script Operativi
**Script attivi e configurazioni per il server Ubuntu**:
- **backup_docker_automatic.sh** - Script backup automatico Docker completo
- **backup_config_server.sh** - Script backup configurazioni server
- **test_restore_docker_backup.sh** - Script test restore Docker
- **backup_weekly_report_docker.sh** - Script report settimanali Docker
- **nginx_gestionale.conf** - Configurazione Nginx
- **gestionale-backend.service** - Servizio systemd backend
- **gestionale-frontend.service** - Servizio systemd frontend

### 📁 [archivio/](archivio/) - Documenti Storici
- **backup-router.txt** - Configurazioni router storiche
- **Gest-GPT5.txt** - Documento di progetto originale
- **STATO_BACKEND_AUTENTICAZIONE_v2.txt** - Stato sviluppo precedente
- **data-1753102894027.csv** - Dati temporanei
- **chat claude 1.txt** - Chat di sviluppo
- **riorganizzazione-processo-2025.md** - Documentazione del processo di riorganizzazione

---

## 🔗 Collegamenti Rapidi

### 📖 MANUALE (Operativo)
- **[📖 Manuale Utente](MANUALE/manuale-utente.md)** - Come usare il gestionale
- **[🚀 Guida Deploy Automatico](MANUALE/guida-deploy-automatico-produzione.md)** - Deploy automatico produzione
- **[💾 Guida Backup e Ripristino](MANUALE/guida-backup-e-ripristino.md)** - Backup, ripristino e disaster recovery
- **[🐳 Guida Docker](MANUALE/guida-docker.md)** - Gestione Docker e container
- **[📊 Guida Log e Monitoring](MANUALE/guida-gestione-log.md)** - Gestione log e monitoring

### 🛠️ SVILUPPO (Tecnico)
- **[🐳 Architettura e Docker](SVILUPPO/architettura-e-docker.md)** - Architettura, containerizzazione e resilienza
- **[🔒 Checklist Sicurezza](SVILUPPO/checklist-sicurezza.md)** - Checklist sicurezza completa
- **[📋 Checklist Server](SVILUPPO/checklist-server-ubuntu.md)** - Setup server
- **[📋 Checklist Problemi](SVILUPPO/checklist-problemi-critici.md)** - Problemi critici risolti
- **[🚨 Emergenza Passwords](SVILUPPO/emergenza-passwords.md)** - **CRITICO** - Credenziali di emergenza (accesso: `sudo cat /root/emergenza-passwords.md`)
- **[📝 Convenzioni](SVILUPPO/convenzioni-nomenclatura.md)** - Standard di nomenclatura
- **[📋 TODO Operativo](SVILUPPO/todo-prossimi-interventi.md)** - Prossimi interventi

### 🖥️ SERVER (Operativo)
- **[🐳 backup_docker_automatic.sh](server/backup_docker_automatic.sh)** - Script backup automatico Docker
- **[⚙️ backup_config_server.sh](server/backup_config_server.sh)** - Script backup configurazioni
- **[🧪 test_restore_docker_backup.sh](server/test_restore_docker_backup.sh)** - Script test restore Docker
- **[📊 backup_weekly_report_docker.sh](server/backup_weekly_report_docker.sh)** - Script report settimanali Docker
- **[🌐 nginx_gestionale.conf](server/nginx_gestionale.conf)** - Configurazione Nginx
- **[🐳 docker-compose.yml](docker-compose.yml)** - Orchestrazione Docker
- **[🔧 backend/Dockerfile](backend/Dockerfile)** - Container backend

---

## 🧹 Pulizia Documentazione Completata

**Data**: $(date +%F)  
**Stato**: ✅ COMPLETATA  

### 📊 Risultati Pulizia
- **File eliminati**: 16 file duplicati/inutili
- **Riduzione**: ~35% dei file di documentazione
- **Struttura**: Consolidata e organizzata
- **Script principale**: `scripts/install-gestionale-completo.sh`

### 📋 Dettagli Pulizia
Vedi **[Pulizia Documentazione](SVILUPPO/pulizia-documentazione-completata.md)** per dettagli completi.

---

## 📝 Note Importanti

### Aggiornamento Documentazione
- **Aggiorna sempre** la documentazione quando modifichi funzionalità o procedure
- **Segui le checklist** per ogni operazione critica
- **Testa sempre** le procedure prima di documentarle

### Sicurezza
- **Mantieni aggiornato** il file protetto: `sudo nano /root/emergenza-passwords.md`
- **Segui sempre** le checklist di sicurezza
- **Documenta** ogni modifica alle configurazioni di sicurezza

### Collaborazione
- **Leggi sempre** la documentazione prima di iniziare a lavorare
- **Aggiorna** la documentazione dopo ogni modifica significativa
- **Segui** le convenzioni di nomenclatura

---

**💡 Suggerimento**: Questa organizzazione rende più facile trovare la documentazione giusta per il tuo ruolo e le tue esigenze!

---

## Dove trovo cosa (tabella rapida)

| Cosa vuoi fare?                | Script/Guida principale                        |
|--------------------------------|------------------------------------------------|
| Deploy automatico              | guida-deploy-automatico-produzione.md, install-gestionale-completo.sh |
| Test/monitoraggio deploy       | test-vm-clone.sh, monitor-deploy-vm.sh         |
| Backup segreti                 | backup_secrets.sh, guida-backup-e-ripristino.md|
| Backup completo Docker         | backup_completo_docker.sh, guida-backup-e-ripristino.md |
| Backup automatico su NAS       | backup_docker_automatic.sh, guida-backup-e-ripristino.md |
| Restore segreti                | restore_secrets.sh, guida-backup-e-ripristino.md|
| Restore completo               | restore_unified.sh, guida-backup-e-ripristino.md|
| Ottimizzazione disco           | ottimizza-disco-vm.sh                          |
| Gestione log e monitoring      | guida-gestione-log.md                          |
| Sicurezza/checklist            | checklist-sicurezza.md, checklist-server-ubuntu.md |
| Architettura e Docker          | architettura-e-docker.md, guida-docker.md      |
| Manuale utente                 | manuale-utente.md                              |

---