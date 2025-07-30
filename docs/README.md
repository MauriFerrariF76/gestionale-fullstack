# 📚 Documentazione Gestionale Fullstack

Questa cartella contiene tutta la documentazione del progetto, organizzata in due sezioni principali per facilitare la navigazione e l'utilizzo.

## 📁 Struttura della Documentazione

### 📖 [MANUALE/](MANUALE/) - Guide Operative e Manuale Utente
**Per operatori, utenti finali e amministratori di sistema**

Contiene:
- **Manuale Utente** - Come usare il gestionale
- **Guide Operative** - Backup, ripristino, monitoring
- **Procedure Standard** - Step-by-step per operazioni comuni
- **Guida Documentazione** - Come organizzare la documentazione

**👥 Destinatari**: Operatori, utenti finali, amministratori di sistema

### 🛠️ [SVILUPPO/](SVILUPPO/) - Documentazione Tecnica e Checklist
**Per sviluppatori, DevOps e amministratori tecnici**

Contiene:
- **Checklist e Sicurezza** - Procedure di sicurezza e deploy
- **Strategie e Architettura** - Containerizzazione, Active-Passive, Disaster Recovery
- **Configurazioni Server** - Setup, script, servizi Docker
- **Convenzioni** - Standard di nomenclatura e sviluppo
- **Credenziali di Emergenza** - Accesso critico ai sistemi

**👥 Destinatari**: Sviluppatori, DevOps, amministratori tecnici

### 🖥️ [server/](server/) - Script e Configurazioni Operative
**Script attivi, configurazioni e log per il server Ubuntu**

Contiene:
- **Script di Backup** - Script automatici per backup database e configurazioni
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
5. **CRITICO**: Consulta **[SVILUPPO/EMERGENZA_PASSWORDS.md](SVILUPPO/EMERGENZA_PASSWORDS.md)** per credenziali di emergenza

### Se sei un **Sviluppatore/DevOps**:
1. Vai in **[SVILUPPO/](SVILUPPO/)**
2. Inizia dalle **[Convenzioni Nomenclatura](SVILUPPO/convenzioni-nomenclatura.md)**
3. Consulta **[Deploy e Architettura](SVILUPPO/deploy-architettura-gestionale.md)**

---

## 📋 File Speciali

### 🔐 [SVILUPPO/EMERGENZA_PASSWORDS.md](SVILUPPO/EMERGENZA_PASSWORDS.md)
**CRITICO** - Credenziali di emergenza per accesso al sistema
- Mantieni sempre aggiornato
- Conserva una copia cartacea sicura
- Aggiorna dopo ogni cambio password

### 🖥️ [server/](server/) - Script Operativi
**Script attivi e configurazioni per il server Ubuntu**:
- **backup_database_adaptive.sh** - Script backup database adattivo
- **backup_config_server.sh** - Script backup configurazioni server
- **backup_weekly_report.sh** - Script report settimanali
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
- **[💾 Guida Backup](MANUALE/guida-backup.md)** - Come fare backup
- **[🔄 Guida Ripristino](MANUALE/guida-ripristino-completo.md)** - Come ripristinare tutto
- **[📊 Guida Monitoring](MANUALE/guida-monitoring.md)** - Come monitorare il sistema
- **[📝 Guida Documentazione](MANUALE/guida-documentazione.md)** - Come organizzare la documentazione

### 🛠️ SVILUPPO (Tecnico)
- **[🔒 Checklist Sicurezza](SVILUPPO/checklist-sicurezza.md)** - Checklist sicurezza completa
- **[🚀 Deploy e Architettura](SVILUPPO/deploy-architettura-gestionale.md)** - Guida deploy completa
- **[🐳 Strategia Docker](SVILUPPO/strategia-docker-active-passive.md)** - Containerizzazione
- **[📋 Checklist Server](SVILUPPO/checklist-server-ubuntu.md)** - Setup server
- **[🛠️ Guida Installazione](SVILUPPO/guida-installazione-server.md)** - Installazione server
- **[🚨 EMERGENZA_PASSWORDS](SVILUPPO/EMERGENZA_PASSWORDS.md)** - **CRITICO** - Credenziali di emergenza

### 🖥️ SERVER (Operativo)
- **[💾 backup_database_adaptive.sh](server/backup_database_adaptive.sh)** - Script backup database
- **[⚙️ backup_config_server.sh](server/backup_config_server.sh)** - Script backup configurazioni
- **[📊 backup_weekly_report.sh](server/backup_weekly_report.sh)** - Script report settimanali
- **[🌐 nginx_gestionale.conf](server/nginx_gestionale.conf)** - Configurazione Nginx
- **[🐳 docker-compose.yml](docker-compose.yml)** - Orchestrazione Docker
- **[🔧 backend/Dockerfile](backend/Dockerfile)** - Container backend

---

## 📝 Note Importanti

### Aggiornamento Documentazione
- **Aggiorna sempre** la documentazione quando modifichi funzionalità o procedure
- **Segui le checklist** per ogni operazione critica
- **Testa sempre** le procedure prima di documentarle

### Sicurezza
- **Mantieni aggiornato** [SVILUPPO/EMERGENZA_PASSWORDS.md](SVILUPPO/EMERGENZA_PASSWORDS.md)
- **Segui sempre** le checklist di sicurezza
- **Documenta** ogni modifica alle configurazioni di sicurezza

### Collaborazione
- **Leggi sempre** la documentazione prima di iniziare a lavorare
- **Aggiorna** la documentazione dopo ogni modifica significativa
- **Segui** le convenzioni di nomenclatura

---

**💡 Suggerimento**: Questa organizzazione rende più facile trovare la documentazione giusta per il tuo ruolo e le tue esigenze!