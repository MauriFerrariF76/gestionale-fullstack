# 📚 Documentazione Gestionale Fullstack

## 🎯 Panoramica

Questa cartella contiene tutta la documentazione del progetto gestionale, organizzata per facilitare la consultazione e la manutenzione.

---

## 📋 Struttura Documentazione

### **🚀 Guide Operative**
Guide pratiche per le operazioni quotidiane:

- **[Deploy e Architettura](deploy-architettura-gestionale.md)** - Guida completa deploy, architettura e checklist operative
- **[Guida Ripristino Completo](guida-ripristino-completo.md)** - Ripristino completo da zero su nuova macchina
- **[Guida Backup](guida-backup.md)** - Procedure backup database e configurazioni
- **[Guida Gestione Log](guida-gestione-log.md)** - Gestione log, rotazione e monitoraggio
- **[Guida Monitoring](guida-monitoring.md)** - Monitoring e alerting per container

### **🔐 Sicurezza e Resilienza**
Documentazione dedicata alla sicurezza e continuità operativa:

- **[Checklist Sicurezza](checklist-sicurezza.md)** - Checklist completa sicurezza deploy e configurazione
- **[Strategia Docker e Active-Passive](strategia-docker-active-passive.md)** - Containerizzazione e architettura resiliente
- **[Strategia Backup e Disaster Recovery](strategia-backup-disaster-recovery.md)** - Strategia completa protezione dati
- **[EMERGENZA_PASSWORDS.md](EMERGENZA_PASSWORDS.md)** - Documento di emergenza con credenziali critiche

### **👥 Manuale Utente**
Documentazione per gli utenti finali:

- **[Manuale Utente](manuale-utente.md)** - Guida pratica per l'utilizzo del gestionale

### **🖥️ Configurazione Server**
File di configurazione e script per il server Ubuntu:

- **[server/](server/)** - Configurazioni server Ubuntu
  - `checklist-server-ubuntu.md` - Checklist post-installazione
  - `guida-installazione-server.md` - Guida installazione server
  - `backup_config_server.sh` - Script backup configurazioni
  - `backup_database_adaptive.sh` - Script backup database adattivo
  - File di configurazione Nginx, systemd, ecc.

### **🗂️ Archivio Storico**
Documenti storici e di progetto (non più attivi):

- **[archivio/](archivio/)** - Documenti storici e versioni precedenti
  - `Gest-GPT5.txt` - Documento di progetto originale
  - `STATO_BACKEND_AUTENTICAZIONE_v2.txt` - Stato sviluppo precedente
  - `chat claude 1.txt` - Chat di sviluppo
  - `data-1753102894027.csv` - Dati temporanei

---

## 🎯 Come Usare Questa Documentazione

### **Per Operazioni Quotidiane**
1. **Deploy**: Consulta `deploy-architettura-gestionale.md` per la checklist completa
2. **Backup**: Usa `guida-backup.md` per procedure backup
3. **Sicurezza**: Verifica `checklist-sicurezza.md` prima di ogni modifica
4. **Emergenza**: Consulta `EMERGENZA_PASSWORDS.md` per ripristino

### **Per Sviluppo e Manutenzione**
1. **Architettura**: `strategia-docker-active-passive.md` per Docker e resilienza
2. **Server**: `server/` per configurazioni Ubuntu
3. **Monitoring**: `guida-monitoring.md` per log e alerting

### **Per Utenti Finali**
1. **Manuale**: `manuale-utente.md` per guide operative

---

## 📝 Convenzioni di Documentazione

### **Struttura File**
- **Guide operative**: Nome descrittivo + `.md` (kebab-case)
- **Checklist**: `checklist-*` + `.md` (kebab-case)
- **Strategie**: `strategia-*` + `.md` (kebab-case)
- **Configurazioni**: Nome servizio + `.conf` o `.sh` (snake_case per script)

### **Contenuto File**
- **Indice** all'inizio per navigazione rapida
- **Esempi pratici** con comandi copia-incolla
- **Checklist** per verifiche complete
- **Note operative** per casi specifici

### **Aggiornamenti**
- Aggiorna sempre la data di modifica
- Spunta le checklist completate
- Aggiungi note operative per eccezioni
- Mantieni esempi sempre funzionanti

---

## 🔄 Workflow di Aggiornamento

### **Prima di Ogni Modifica**
1. Consulta la checklist pertinente
2. Verifica la documentazione esistente
3. Pianifica l'aggiornamento

### **Durante la Modifica**
1. Testa le procedure documentate
2. Aggiorna esempi e comandi
3. Verifica che tutto funzioni

### **Dopo la Modifica**
1. Aggiorna le checklist completate
2. Aggiungi note operative
3. Testa il ripristino se necessario
4. Aggiorna il documento di emergenza

---

## ⚠️ Note Importanti

### **Sicurezza**
- **NON committare** mai password o segreti
- Usa sempre `EMERGENZA_PASSWORDS.md` per credenziali critiche
- Mantieni aggiornato il backup dei segreti

### **Manutenzione**
- **Testa regolarmente** le procedure di ripristino
- **Aggiorna** la documentazione dopo ogni modifica
- **Verifica** che gli esempi siano sempre funzionanti

### **Collaborazione**
- **Leggi** sempre la documentazione prima di modificare
- **Segui** le checklist per evitare errori
- **Aggiorna** la documentazione per il team

---

**📚 Questa documentazione è parte integrante del progetto. Mantienila sempre aggiornata e consultala prima di ogni operazione importante!**