# Documentazione Sviluppo - Gestionale Fullstack

## 📁 Struttura della Cartella

### 🟢 FILE ATTIVI (In Uso)

#### 📋 Checklist Operativa
- **`checklist-operativa-unificata.md`** ⭐ **PRINCIPALE**
  - Checklist unificata che sostituisce tutte le altre
  - Contiene: Sicurezza, Backup, Monitoraggio, Server, Deploy
  - **Stato**: ✅ ATTIVA - Usa questa per tutte le operazioni

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

- **`todo-prossimi-interventi.md`**
  - Prossimi interventi da fare
  - **Stato**: ✅ ATTIVA

- **`verifica-tecnologie-completa.md`**
  - Verifica tecnologie utilizzate
  - **Stato**: ✅ ATTIVA

---

### 🟡 FILE OBSOLETI (Sostituiti dalla Checklist Unificata)

> **⚠️ ATTENZIONE**: Questi file sono stati consolidati in `checklist-operativa-unificata.md`

#### ❌ Checklist Obsolete
- **`checklist-sicurezza.md`** → Integrata in "Sicurezza e Deploy"
- **`checklist-server-ubuntu.md`** → Integrata in "Server e Infrastruttura"
- **`checklist-problemi-critici.md`** → Integrata in "Sicurezza e Deploy"
- **`checklist-automazione.md`** → Integrata in "Monitoraggio e Automazione"

#### ❌ File Storici
- **`pulizia-documentazione-completata.md`** → Storico, completato
- **`situazione-deploy-vm.md`** → Storico, completato
- **`analisi-server-prova.md`** → Storico, completato
- **`risoluzione-avvio-automatico.md`** → Storico, completato
- **`correzioni-comandi-docker-completate.md`** → Storico, completato

---

## 🎯 Come Usare Questa Cartella

### Per Operazioni Quotidiane
1. **Usa sempre**: `checklist-operativa-unificata.md`
2. **Consulta**: `automazione.md` per automazione
3. **Riferimento**: `architettura-e-docker.md` per architettura

### Per Emergenze
1. **Credenziali**: `sudo cat /root/emergenza-passwords.md`
2. **Checklist**: Sezione "Interventi Solo Se" in `checklist-operativa-unificata.md`

### Per Sviluppo
1. **Convenzioni**: `convenzioni-nomenclatura.md`
2. **TODO**: `todo-prossimi-interventi.md`
3. **Verifica**: `verifica-tecnologie-completa.md`

---

## 📊 Mappa di Integrazione

### Checklist Unificata Integra:

```
checklist-operativa-unificata.md
├── 🔒 SICUREZZA E DEPLOY
│   ├── checklist-sicurezza.md (sicurezza base)
│   └── checklist-problemi-critici.md (problemi risolti)
├── 💾 BACKUP E DISASTER RECOVERY
│   ├── checklist-server-ubuntu.md (backup)
│   └── checklist-automazione.md (backup emergenza)
├── 📊 MONITORAGGIO E AUTOMAZIONE
│   └── checklist-automazione.md (monitoraggio)
├── 🖥️ SERVER E INFRASTRUTTURA
│   └── checklist-server-ubuntu.md (configurazione)
└── 🚀 DEPLOY E MANUTENZIONE
    └── checklist-server-ubuntu.md (manutenzione)
```

---

## 🧹 Pulizia Consigliata

### Opzioni per File Obsoleti:

1. **Mantenere per storia** (raccomandato)
2. **Spostare in archivio**: `docs/archivio/checklist-obsolete/`
3. **Eliminare**: Se sicuri che tutto sia migrato

### Comando per Spostare in Archivio:
```bash
# Crea directory archivio
mkdir -p docs/archivio/checklist-obsolete

# Sposta file obsoleti
mv docs/SVILUPPO/checklist-sicurezza.md docs/archivio/checklist-obsolete/
mv docs/SVILUPPO/checklist-server-ubuntu.md docs/archivio/checklist-obsolete/
mv docs/SVILUPPO/checklist-problemi-critici.md docs/archivio/checklist-obsolete/
mv docs/SVILUPPO/checklist-automazione.md docs/archivio/checklist-obsolete/

# Sposta file storici
mv docs/SVILUPPO/pulizia-documentazione-completata.md docs/archivio/
mv docs/SVILUPPO/situazione-deploy-vm.md docs/archivio/
mv docs/SVILUPPO/analisi-server-prova.md docs/archivio/
mv docs/SVILUPPO/risoluzione-avvio-automatico.md docs/archivio/
mv docs/SVILUPPO/correzioni-comandi-docker-completate.md docs/archivio/
```

---

## 📋 Quick Reference

### File Principali (Usa Questi):
- ⭐ **`checklist-operativa-unificata.md`** - Checklist principale
- **`automazione.md`** - Automazione essenziale
- **`architettura-e-docker.md`** - Architettura sistema
- **`emergenza-passwords.md`** - Credenziali critiche

### File di Supporto:
- **`convenzioni-nomenclatura.md`** - Standard progetto
- **`todo-prossimi-interventi.md`** - Prossimi interventi
- **`verifica-tecnologie-completa.md`** - Verifica tecnologie

### File di Configurazione:
- **`configurazione-https-lets-encrypt.md`** - SSL/HTTPS
- **`configurazione-nas.md`** - Backup NAS

---

**Nota**: La checklist unificata sostituisce completamente le 4 checklist obsolete. Usa sempre quella per tutte le operazioni. 