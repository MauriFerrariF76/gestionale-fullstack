# Archivio Documentazione - Gestionale Fullstack

## 📁 Panoramica

Questa cartella contiene documentazione storica, file obsoleti e analisi completate del progetto gestionale. I file sono stati spostati qui per mantenere la storia del progetto senza intasare la documentazione attiva.

## 📂 Struttura Archivio

### 📋 File Storici (Analisi Completate)
- **`analisi-critica-aggiornamento-nodejs20.md`** - Analisi critica aggiornamento Node.js 20
- **`correzioni-script-aggiornamento.md`** - Correzioni script di aggiornamento
- **`riepilogo-correzioni-completate.md`** - Riepilogo correzioni completate

### 🔧 Script e Configurazioni Obsoleti
- **`backup_weekly_report.sh`** - Script backup settimanale vecchio (sostituito da versione Docker)
- **`gestionale_site.conf`** - Configurazione nginx vecchia (sostituita da nginx_production.conf)

### 📊 Checklist e Procedure Storiche
- **`real-time-crud-checklist.md`** - Checklist CRUD real-time (storica)
- **`verifica-tecnologie-completa.md`** - Verifica tecnologie (completata)
- **`situazione-deploy-vm.md`** - Situazione deploy VM (storica)
- **`risoluzione-avvio-automatico.md`** - Risoluzione avvio automatico (completata)
- **`correzioni-comandi-docker-completate.md`** - Correzioni comandi Docker (completate)
- **`pulizia-documentazione-completata.md`** - Pulizia documentazione (completata)
- **`analisi-server-prova.md`** - Analisi server prova (storica)
- **`todo-prossimi-interventi.md`** - TODO storici (completati)

### 📁 Sottocartelle
- **`checklist-obsolete/`** - Checklist obsolete consolidate nella checklist unificata

## 🎯 Quando Consultare l'Archivio

### Per Storia del Progetto
- **Evoluzione tecnologie**: Come il sistema è cambiato nel tempo
- **Problemi risolti**: Soluzioni a problemi passati
- **Decisioni tecniche**: Motivazioni di scelte architetturali

### Per Troubleshooting
- **Problemi simili**: Se si ripresentano problemi già risolti
- **Procedure storiche**: Come erano gestite le operazioni in passato
- **Configurazioni precedenti**: Per confronto con configurazioni attuali

### Per Apprendimento
- **Best practices**: Evoluzione delle procedure
- **Errori comuni**: Problemi frequenti e loro soluzioni
- **Ottimizzazioni**: Miglioramenti implementati nel tempo

## 📋 File Principali dell'Archivio

### 🔍 Analisi Critiche
- **`analisi-critica-aggiornamento-nodejs20.md`** - Analisi dettagliata aggiornamento Node.js
  - Problemi identificati e risolti
  - Procedure di sicurezza implementate
  - Metriche di performance

### 🔧 Correzioni e Miglioramenti
- **`correzioni-script-aggiornamento.md`** - Correzioni script di aggiornamento
  - Problemi di sintassi risolti
  - Miglioramenti di sicurezza
  - Ottimizzazioni performance

### 📊 Procedure Storiche
- **`real-time-crud-checklist.md`** - Checklist CRUD real-time
  - Procedure di sviluppo precedenti
  - Standard di qualità storici
  - Workflow di sviluppo

## 🚀 Come Usare l'Archivio

### Per Ricerca Storica
```bash
# Cerca file per argomento
find docs/archivio -name "*.md" -exec grep -l "nodejs" {} \;

# Cerca problemi simili
grep -r "ERRORE" docs/archivio/

# Cerca soluzioni
grep -r "SOLUZIONE" docs/archivio/
```

### Per Confronto Configurazioni
```bash
# Confronta configurazioni nginx
diff docs/archivio/gestionale_site.conf docs/server/nginx_production.conf

# Confronta script backup
diff docs/archivio/backup_weekly_report.sh docs/server/backup_weekly_report_docker.sh
```

## 📝 Note Importanti

### ✅ File Completati
I file in archivio sono **completati** e non richiedono ulteriori azioni. Le informazioni sono storiche e di riferimento.

### 🔄 Aggiornamenti
L'archivio viene aggiornato quando:
- File diventano obsoleti
- Procedure vengono sostituite
- Analisi vengono completate

### 📚 Consultazione
L'archivio è per **consultazione storica**. Per operazioni attuali, usa sempre la documentazione in `/docs/SVILUPPO/` e `/docs/MANUALE/`.

---

**Nota**: L'archivio mantiene la storia completa del progetto. I file sono organizzati cronologicamente e per argomento per facilitare la consultazione. 