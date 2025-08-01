# 📝 Convenzioni di Nomenclatura - Gestionale Fullstack

**Data:** $(date +%F)  
**Versione:** 1.0  
**Stato:** ✅ Implementate  

---

## 🎯 Obiettivo

Definire convenzioni standard per la nomenclatura di file e cartelle, garantendo coerenza, leggibilità e manutenibilità del progetto.

---

## 📋 Convenzioni Implementate

### **📄 File Markdown (.md)**

#### **Kebab-Case (Raccomandato)**
```bash
# ✅ Corretto - Leggibile e SEO-friendly
guida-backup.md
checklist-sicurezza.md
strategia-docker-active-passive.md
deploy-architettura-gestionale.md
manuale-utente.md
guida-gestione-log.md
guida-monitoring.md
guida-documentazione.md
riorganizzazione-completata.md
```

#### **UPPERCASE (Solo per file speciali)**
```bash
# ✅ Corretto - File speciali e importanti
README.md
LICENSE.md
```

### **🔧 Script e Configurazioni**

#### **Snake_Case (Script .sh)**
```bash
# ✅ Corretto - Convenzione Unix/Linux
setup_secrets.sh
backup_secrets.sh
restore_secrets.sh
backup_config_server.sh
backup_database_adaptive.sh
test_restore_backup_dynamic.sh
backup_weekly_report.sh
```

#### **Kebab-Case (Configurazioni .conf)**
```bash
# ✅ Corretto - Configurazioni servizi
nginx_gestionale.conf
gestionale-backend.service
gestionale-frontend.service
```

### **📁 Cartelle**

#### **Kebab-Case (Cartelle principali)**
```bash
# ✅ Corretto - Struttura principale
docs/
├── server/
├── archivio/
└── config/
```

#### **Snake_Case (Sottocartelle tecniche)**
```bash
# ✅ Corretto - Sottocartelle tecniche
docs/server/
├── config/
├── logs/
└── scripts/
```

---

## 🚫 Convenzioni NON Permesse

### **❌ PascalCase per file markdown**
```bash
# ❌ Sbagliato
GuidaBackup.md
ChecklistSicurezza.md
StrategiaDocker.md
```

### **❌ UPPERCASE per file normali**
```bash
# ❌ Sbagliato
GUIDA_BACKUP.md
CHECKLIST_SICUREZZA.md
STRATEGIA_DOCKER.md
```

### **❌ Mixed case**
```bash
# ❌ Sbagliato
guidaBackup.md
checklistSicurezza.md
strategiaDocker.md
```

---

## 📊 Struttura Finale Standardizzata

```
gestionale-fullstack/
├── README.md                           # 📋 Panoramica progetto
├── docs/
│   ├── guida-documentazione.md         # 📋 Panoramica documentazione
│   ├── 🚀 Guide Operative
│   │   ├── deploy-architettura-gestionale.md
│   │   ├── guida-backup.md
│   │   ├── guida-gestione-log.md
│   │   └── guida-monitoring.md
│   ├── 🔐 Sicurezza e Resilienza
│   │   ├── checklist-sicurezza.md
│   │   ├── strategia-docker-active-passive.md
│   │   ├── strategia-backup-disaster-recovery.md
│   │   └── emergenza-passwords.md
│   ├── 👥 Manuale Utente
│   │   └── manuale-utente.md
│   ├── 🖥️ Configurazione Server
│   │   └── server/
│   │       ├── checklist-server-ubuntu.md
│   │       ├── guida-installazione-server.md
│   │       ├── backup_config_server.sh
│   │       ├── backup_database_adaptive.sh
│   │       ├── nginx_gestionale.conf
│   │       ├── gestionale-backend.service
│   │       ├── gestionale-frontend.service
│   │       ├── config/
│   │       └── logs/
│   ├── 🗂️ Archivio Storico
│   │   └── archivio/
│   └── 📝 Convenzioni
│       └── convenzioni-nomenclatura.md
└── scripts/
    ├── setup_secrets.sh
    ├── backup_secrets.sh
    └── restore_secrets.sh
```

---

## 🔄 Workflow di Aggiornamento

### **Prima di Creare Nuovi File**
1. **Verifica convenzioni**: Consulta questo documento
2. **Scegli nomenclatura**: Kebab-case per markdown, snake_case per script
3. **Aggiorna riferimenti**: Aggiorna tutti i link nei file esistenti

### **Durante la Riorganizzazione**
1. **Rinomina file**: Usa comandi `mv` con nomi corretti
2. **Aggiorna link**: Trova e sostituisci tutti i riferimenti
3. **Testa navigazione**: Verifica che tutti i link funzionino

### **Dopo le Modifiche**
1. **Commit separato**: Fai commit delle rinominazioni
2. **Aggiorna documentazione**: Mantieni questo file aggiornato
3. **Verifica coerenza**: Controlla che tutto sia uniforme

---

## 📝 Note Operative

### **Vantaggi Kebab-Case**
- ✅ **Leggibilità**: Facile da leggere e capire
- ✅ **SEO-friendly**: Ottimizzato per motori di ricerca
- ✅ **URL-friendly**: Compatibile con URL web
- ✅ **Cross-platform**: Funziona su tutti i sistemi

### **Vantaggi Snake_Case**
- ✅ **Convenzione Unix**: Standard per script e configurazioni
- ✅ **Compatibilità**: Funziona con shell e sistemi Unix
- ✅ **Chiarezza**: Separazione chiara tra parole

### **Vantaggi UPPERCASE**
- ✅ **Visibilità**: File importanti immediatamente riconoscibili
- ✅ **Convenzione**: Standard per README, LICENSE, ecc.
- ✅ **Gerarchia**: Evidenzia file di primo livello

---

## ⚠️ Regole Importanti

### **Sempre Applicare**
- **Consistenza**: Usa sempre la stessa convenzione per lo stesso tipo di file
- **Leggibilità**: Priorità alla chiarezza e comprensibilità
- **Manutenibilità**: Scegli convenzioni che facilitino la manutenzione

### **Mai Fare**
- **Mixing**: Non mescolare convenzioni diverse nello stesso contesto
- **Uppercase casuale**: Non usare maiuscole per file normali
- **Caratteri speciali**: Evita spazi, caratteri speciali, accenti

---

**📝 Queste convenzioni garantiscono coerenza e professionalità nel progetto. Rispettale sempre!**