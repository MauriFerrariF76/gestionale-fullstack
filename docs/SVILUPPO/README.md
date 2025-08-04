# Documentazione Sviluppo - Gestionale Fullstack

## 📁 Struttura della Cartella

### 🟢 FILE ATTIVI (In Uso)

#### 📋 Checklist Operativa
- **`checklist-operativa-unificata.md`** ⭐ **PRINCIPALE**
  - Checklist unificata che sostituisce tutte le altre
  - Contiene: Sicurezza, Backup, Monitoraggio, Server, Deploy
  - **Stato**: ✅ ATTIVA - Usa questa per tutte le operazioni

- **`checklist-aggiornamento-sicuro.md`**
  - Procedure per aggiornamenti sicuri
  - **Stato**: ✅ ATTIVA - Per aggiornamenti di sistema

#### 🔧 Automazione
- **`automazione.md`**
  - Documentazione completa dell'automazione essenziale
  - Dependabot, backup integrati, monitoraggio
  - **Stato**: ✅ ATTIVA

#### 🐳 Architettura e Configurazioni
- **`architettura-e-docker.md`**
  - Architettura del sistema, containerizzazione
  - **Stato**: ✅ ATTIVA

#### 🔐 Sicurezza e Configurazioni
- **`configurazione-https-lets-encrypt.md`**
  - Configurazione SSL/HTTPS
  - **Stato**: ✅ ATTIVA

- **`configurazione-nas.md`**
  - Configurazione backup NAS
  - **Stato**: ✅ ATTIVA

#### 🚨 Emergenza
- **`emergenza-passwords.md`**
  - Credenziali di emergenza (accesso: `sudo cat /root/emergenza-passwords.md`)
  - **Stato**: ✅ ATTIVA - CRITICO

#### 📝 Sviluppo e Analisi
- **`convenzioni-nomenclatura.md`**
  - Standard di nomenclatura del progetto
  - **Stato**: ✅ ATTIVA

- **`gestione-script-pubblici.md`**
  - Gestione script pubblici e repository
  - **Stato**: ✅ ATTIVA

#### 🔍 Verifica e Monitoraggio
- **`verifica-server-produzione.md`**
  - Procedure di verifica server produzione
  - **Stato**: ✅ ATTIVA

---

### 🟡 FILE IN ARCHIVIO (Storici)

> **📁 Archivio**: I file storici sono stati spostati in `/docs/archivio/`

#### 📋 File Storici Spostati
- **`analisi-critica-aggiornamento-nodejs20.md`** → Archivio (analisi completata)
- **`correzioni-script-aggiornamento.md`** → Archivio (correzioni completate)
- **`riepilogo-correzioni-completate.md`** → Archivio (riepilogo storico)

---

## 🎯 Come Usare Questa Cartella

### Per Operazioni Quotidiane
1. **Usa sempre**: `checklist-operativa-unificata.md`
2. **Consulta**: `automazione.md` per automazione
3. **Riferimento**: `architettura-e-docker.md` per architettura

### Per Aggiornamenti
1. **Procedura sicura**: `checklist-aggiornamento-sicuro.md`
2. **Verifica**: `verifica-server-produzione.md`

### Per Emergenze
1. **Credenziali**: `sudo cat /root/emergenza-passwords.md`
2. **Checklist**: Sezione "Interventi Solo Se" in `checklist-operativa-unificata.md`

### Per Sviluppo
1. **Convenzioni**: `convenzioni-nomenclatura.md`
2. **Script pubblici**: `gestione-script-pubblici.md`

### Per Miglioramenti Futuri
1. **Architettura**: Best practices in `architettura-e-docker.md`
2. **Checklist**: Miglioramenti in `checklist-operativa-unificata.md`
3. **Automazione**: Raccomandazioni avanzate in `automazione.md`

---

## 📊 Mappa di Integrazione

### Checklist Unificata Integra:

```
checklist-operativa-unificata.md
├── 🔒 SICUREZZA E DEPLOY
│   ├── Sicurezza base
│   ├── Best practices implementate ✅
│   └── Miglioramenti futuri 🔄
├── 💾 BACKUP E DISASTER RECOVERY
│   ├── Backup automatici
│   └── Procedure di emergenza
├── 📊 MONITORAGGIO E AUTOMAZIONE
│   └── Monitoraggio continuo
├── 🖥️ SERVER E INFRASTRUTTURA
│   └── Configurazione server
└── 🚀 DEPLOY E MANUTENZIONE
    └── Procedure di manutenzione
```

---

## 📋 Quick Reference

### File Principali (Usa Questi):
- ⭐ **`checklist-operativa-unificata.md`** - Checklist principale
- **`checklist-aggiornamento-sicuro.md`** - Aggiornamenti sicuri
- **`automazione.md`** - Automazione essenziale
- **`architettura-e-docker.md`** - Architettura sistema
- **`emergenza-passwords.md`** - Credenziali critiche

### File di Supporto:
- **`convenzioni-nomenclatura.md`** - Standard progetto
- **`gestione-script-pubblici.md`** - Script pubblici
- **`verifica-server-produzione.md`** - Verifica server

### File di Configurazione:
- **`configurazione-https-lets-encrypt.md`** - SSL/HTTPS
- **`configurazione-nas.md`** - Backup NAS

---

**Nota**: La checklist unificata sostituisce completamente le checklist obsolete. I file storici sono stati spostati in `/docs/archivio/` per mantenere la storia del progetto. 