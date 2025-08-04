# 📁 Gestione Script Pubblici - Gestionale Fullstack

## 📋 Descrizione
Sistema di gestione degli script di automazione pubblici per il deploy automatico del gestionale.

## 🏗️ Architettura

### Repository Privato (Sviluppo)
```
gestionale-fullstack (privato)
├── public-scripts/                    ← Sviluppo script pubblici
│   ├── install-gestionale-completo.sh
│   ├── deploy-vm-automatico.sh
│   ├── test-vm-clone.sh
│   ├── monitor-deploy-vm.sh
│   └── README.md
├── scripts/sync-public-scripts.sh     ← Sincronizzazione automatica
└── ... (resto del progetto)
```

### Repository Pubblico (Distribuzione)
```
gestionale-scripts-public (pubblico)
├── install-gestionale-completo.sh    ← Download diretto
├── deploy-vm-automatico.sh
├── test-vm-clone.sh
├── monitor-deploy-vm.sh
└── README.md
```

## 🚀 Utilizzo

### Sulla VM (Deploy Automatico)
```bash
# Download diretto dal repository pubblico
wget https://raw.githubusercontent.com/MauriFerrariF76/gestionale-scripts-public/main/install-gestionale-completo.sh
chmod +x install-gestionale-completo.sh
sudo ./install-gestionale-completo.sh
```

### Sviluppo e Aggiornamento
```bash
# 1. Modifica gli script in public-scripts/
nano public-scripts/install-gestionale-completo.sh

# 2. Sincronizza automaticamente
./scripts/sync-public-scripts.sh

# 3. Gli script sono immediatamente disponibili per download
```

## 📁 Script Disponibili

### 🎯 Script Principali
- **`install-gestionale-completo.sh`** - Deploy automatico completo
- **`deploy-vm-automatico.sh`** - Deploy automatico su VM
- **`test-vm-clone.sh`** - Test automatico su VM
- **`monitor-deploy-vm.sh`** - Monitoraggio avanzato

## 🔄 Workflow di Sviluppo

### 1. Sviluppo
- Modifica gli script nella cartella `public-scripts/`
- Testa localmente
- Committa nel repository privato

### 2. Sincronizzazione
- Esegui: `./scripts/sync-public-scripts.sh`
- Gli script vengono copiati nel repository pubblico
- Disponibili immediatamente per download

### 3. Distribuzione
- Sulla VM: download diretto con `wget`
- Nessuna credenziale richiesta
- Aggiornamenti immediati

## 📋 Comandi Utili

### Sincronizzazione
```bash
# Sincronizza script pubblici
./scripts/sync-public-scripts.sh

# Verifica stato repository pubblico
cd /home/mauri/gestionale-scripts-public
git status
```

### Test Download
```bash
# Test download diretto
curl -I https://raw.githubusercontent.com/MauriFerrariF76/gestionale-scripts-public/main/install-gestionale-completo.sh

# Test completo
wget https://raw.githubusercontent.com/MauriFerrariF76/gestionale-scripts-public/main/install-gestionale-completo.sh
```

### Gestione Repository
```bash
# Repository pubblico
https://github.com/MauriFerrariF76/gestionale-scripts-public

# Repository privato
https://github.com/MauriFerrariF76/gestionale-fullstack
```

## ⚙️ Configurazione

### Script di Sincronizzazione
- **File**: `scripts/sync-public-scripts.sh`
- **Funzione**: Copia file da `public-scripts/` al repository pubblico
- **Esecuzione**: Automatica dopo modifiche

### Cartella Pubblica
- **Percorso**: `public-scripts/`
- **Contenuto**: Solo script necessari per automatismo
- **Sicurezza**: Nessun segreto o configurazione sensibile

## 🔒 Sicurezza

### Repository Privato
- ✅ Codice completo dell'applicazione
- ✅ Configurazioni sensibili
- ✅ Segreti e chiavi
- ✅ Documentazione interna

### Repository Pubblico
- ✅ Solo script di automazione
- ✅ Nessun segreto
- ✅ Nessuna configurazione sensibile
- ✅ Download diretto sicuro

## 📞 Troubleshooting

### Script non sincronizzati
```bash
# Verifica repository pubblico
cd /home/mauri/gestionale-scripts-public
git status

# Forza sincronizzazione
./scripts/sync-public-scripts.sh
```

### Download non funziona
```bash
# Verifica URL
curl -I https://raw.githubusercontent.com/MauriFerrariF76/gestionale-scripts-public/main/install-gestionale-completo.sh

# Verifica repository pubblico
https://github.com/MauriFerrariF76/gestionale-scripts-public
```

### Repository non trovato
- Verifica che il repository sia pubblico
- Verifica che il branch sia `main`
- Verifica che i file siano committati

---

**Versione**: v1.0.0  
**Data**: $(date)  
**Autore**: Mauri Ferrari 