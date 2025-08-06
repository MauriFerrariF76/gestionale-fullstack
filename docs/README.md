# Documentazione Gestionale Fullstack

## Panoramica

Questo gestionale web aziendale gestisce clienti, fornitori, commesse, dipendenti e documenti, accessibile sia da LAN che da remoto tramite dominio pubblico e HTTPS.

## Struttura Documentazione

### 📁 `/docs/SVILUPPO/` - Materiale di Sviluppo
- **Checklist operativa unificata**: `checklist-operativa-unificata.md` ⭐ **PRINCIPALE**
- **Riorganizzazione frontend**: `checklist-riorganizzazione-frontend.md` 🎨 **FRONTEND**
- **Architettura completa**: `architettura-completa.md` 🏗️ **ARCHITETTURA**
- **Docker e best practice**: `docker-sintassi-e-best-practice.md` 🐳 **DOCKER**
- **Aggiornamenti e manutenzione**: `aggiornamenti-e-manutenzione.md` 🔄 **AGGIORNAMENTI**
- **Sistema form riutilizzabile**: `sistema-form-riutilizzabile.md` 📝 **SISTEMA FORM**
- **Convenzioni nomenclatura**: `convenzioni-nomenclatura-aggiornate.md` 📋 **CONVENZIONI**
- **Aggiornamento documentazione**: `aggiornamento-documentazione-completo.md` 📚 **AGGIORNAMENTI DOC**
- **Configurazioni**: `configurazione-*.md`
- **Emergenza**: `emergenza-passwords.md` 🚨 **CRITICO**
- **Sviluppo**: `convenzioni-nomenclatura.md`
- **Organizzazione**: `README.md` (guida alla cartella)

### 📁 `/docs/MANUALE/` - Guide e Manuali
- **Manuale utente**: `manuale-utente.md`
- **Guide operative**: `guida-*.md`
- **Procedure backup**: `guida-backup-e-ripristino.md`
- **Deploy**: `guida-deploy-automatico-produzione.md`
- **Docker**: `guida-docker.md`
- **Gestione log**: `guida-gestione-log.md`
- **Aggiornamenti sicuri**: `guida-aggiornamento-sicuro.md`
- **Basi solide**: `basi-solide-e-robuste.md`
- **Guida definitiva**: `guida-definitiva-gestionale-fullstack.md`

### 📁 `/docs/server/` - Configurazioni Server
- **Script di backup**: `backup_*.sh`
- **Configurazioni nginx**: `nginx_production.conf`
- **Log e report**: `*.log`
- **Test restore**: `test_restore_docker_backup.sh`

### 📁 `/docs/archivio/` - Materiale Storico
- **File obsoleti**: Configurazioni e script sostituiti
- **Analisi storiche**: Report e analisi completate
- **Versioni precedenti**: Documentazione superata

## Tecnologie Utilizzate

- **Backend**: Node.js/Express con autenticazione JWT
- **Frontend**: Next.js/React con gestione ruoli
- **Database**: PostgreSQL
- **Reverse Proxy**: Nginx con HTTPS
- **Infrastruttura**: Docker, MikroTik, Let's Encrypt

## Sistema di Form Riutilizzabile

### 🎯 **Componenti Principali**
- **`Form.tsx`**: Componente principale orchestratore
- **`FormField.tsx`**: Gestione campi con errori e helper
- **`FormSection.tsx`**: Sezioni collassabili
- **`FormTabs.tsx`**: Layout a tab
- **`FormActions.tsx`**: Azioni standard (Salva, Annulla, Elimina)

### 🎣 **Hook Personalizzato**
- **`useForm.ts`**: Gestione stato avanzata con validazione
- **Validazione type-safe** per stringhe, numeri, booleani
- **Validazione in tempo reale** con feedback immediato
- **Gestione errori** robusta e flessibile

### 🧪 **Pagine di Test**
- **`/test-sistema-form`**: Dimostrazione completa del sistema
- **`/test-hook-form`**: Esempio con hook useForm

### 📚 **Documentazione**
- **`sistema-form-riutilizzabile.md`**: Guida completa con esempi e best practice

## Automazione e Sicurezza

### 🔒 Automazione Essenziale
- **Dependabot**: Monitoraggio vulnerabilità automatico
- **Backup integrati**: NAS + locale di emergenza
- **Monitoraggio continuo**: Server, database, SSL
- **Manutenzione quasi zero**: Sistema automatizzato

**Documentazione**: `/docs/SVILUPPO/checklist-operativa-unificata.md`

### 📋 Checklist Operativa
- **Checklist unificata**: `/docs/SVILUPPO/checklist-operativa-unificata.md`
  - Sicurezza e deploy
  - Backup e disaster recovery
  - Monitoraggio e automazione
  - Server e infrastruttura
  - Deploy e manutenzione

## Accesso e Deploy

### 🖥️ Ambiente Sviluppo (pc-mauri-vaio)
- **Frontend**: http://localhost:3000 | http://10.10.10.15:3000
- **Backend**: http://localhost:3001 | http://10.10.10.15:3001
- **Database**: PostgreSQL (porta 5432)
- **Stato**: ✅ Attivo e funzionante
- **Accesso rete**: ✅ Configurato per IP 10.10.10.15

### 🌐 Accesso Produzione
- **URL**: https://gestionale.carpenteriaferrari.com
- **HTTPS**: Certificati Let's Encrypt automatici
- **Firewall**: MikroTik con regole specifiche

### 🚀 Deploy
- **Automatico**: Docker Compose
- **Backup**: NAS Synology + locale
- **Monitoraggio**: Script automatici

## Manutenzione

### Controlli Periodici
1. **Sicurezza**: Verifica vulnerabilità Dependabot
2. **Backup**: Controllo log backup NAS e locale
3. **Monitoraggio**: Verifica alert automatici
4. **Spazio disco**: Controllo utilizzo

### Interventi Solo Se
- 🔴 Vulnerabilità critica
- 🔴 Server down
- 🔴 Database offline
- 🔴 SSL scaduto
- 🔴 Spazio disco pieno

## Documentazione Principale

### 🛠️ Sviluppo
- **Architettura**: `/docs/SVILUPPO/architettura-completa.md`
- **Docker**: `/docs/SVILUPPO/docker-sintassi-e-best-practice.md`
- **Checklist operativa**: `/docs/SVILUPPO/checklist-operativa-unificata.md`
- **Riorganizzazione frontend**: `/docs/SVILUPPO/checklist-riorganizzazione-frontend.md`
- **Script database**: `/docs/SVILUPPO/script-database-inizializzazione.md`
- **Aggiornamenti**: `/docs/SVILUPPO/aggiornamenti-e-manutenzione.md`

### 📖 Manuali
- **Utente**: `/docs/MANUALE/manuale-utente.md`
- **Backup**: `/docs/MANUALE/guida-backup-e-ripristino.md`
- **Deploy**: `/docs/MANUALE/guida-deploy-automatico-produzione.md`
- **Docker**: `/docs/MANUALE/guida-docker.md`
- **Aggiornamenti**: `/docs/MANUALE/guida-aggiornamento-sicuro.md`
- **Basi solide**: `/docs/MANUALE/basi-solide-e-robuste.md`
- **Guida definitiva**: `/docs/MANUALE/guida-definitiva-gestionale-fullstack.md`

### ⚙️ Server
- **Backup**: `/docs/server/backup_*.sh`
- **Configurazioni**: `/docs/server/nginx_production.conf`
- **Test restore**: `/docs/server/test_restore_docker_backup.sh`

## Stato Riorganizzazione Frontend

### ✅ **Completato (FASI 1-2)**
- ✅ **Struttura cartelle**: Tutte le cartelle create correttamente
- ✅ **Componenti UI di base**: Modal, LoadingSpinner, ErrorMessage, EmptyState, Select, Checkbox, Radio, Table
- ✅ **Componenti Layout**: Header, Footer, SimpleLayout, AuthLayout
- ✅ **Componenti Forms**: FormSection, FormField, FormActions, FormTabs
- ✅ **Sistema Form Riutilizzabile**: Creato e funzionante con validazione
- ✅ **Hook useForm**: Implementato con gestione stato avanzata
- ✅ **Pagine di test**: `/test-sistema-form` e `/test-hook-form` funzionanti

### 🚧 **In Corso (FASE 3)**
- ✅ **Analisi completata**: FormClienteCompleto.tsx (1829 righe) analizzato
- ✅ **Sistema form riutilizzabile**: Creato e funzionante
- ❌ **Componenti specifici cliente**: Da creare (FormClienteAnagrafica, FormClienteContatti, ecc.)
- ❌ **Estrazione logica comune**: Utils e hooks da creare
- ❌ **Refactoring completo**: Da completare

### ❌ **Da Fare (FASI 4-7)**
- ❌ **Componenti shared**: FormAnagrafica, FormContatti, FormIndirizzi
- ❌ **Tables e modals**: DataTable, ConfirmDialog, FormModal
- ❌ **Testing e documentazione**: Verifica funzionamento e guide
- ❌ **Pulizia e ottimizzazione**: Performance e bundle size

## Sintassi Docker Corretta

### ✅ **Comandi Corretti**
- `docker compose up -d`
- `docker compose down`
- `docker compose ps`
- `docker compose logs -f`

### ❌ **Comandi Deprecati**
- `docker-compose up -d` (DEPRECATO)
- `docker-compose down` (DEPRECATO)
- `docker-compose ps` (DEPRECATO)

**Nota**: Tutta la documentazione è stata aggiornata per utilizzare la sintassi corretta di Docker Compose v2.

---

**Nota**: Tutta la documentazione segue le convenzioni del progetto. Il materiale di sviluppo è in `/docs/SVILUPPO/`, le guide in `/docs/MANUALE/`. I file obsoleti sono stati spostati in `/docs/archivio/`.