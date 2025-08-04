# 🚀 Script di Automazione Gestionale

## �� Descrizione
Script per il deploy automatico del gestionale aziendale.

## 📁 Script Disponibili

### 🎯 Script Principale
- **`install-gestionale-completo.sh`** - Deploy automatico completo (Docker-based)

## 🚀 Utilizzo Rapido

### Deploy Automatico Completo
```bash
# Download script di deploy
cd /home/mauri
wget https://raw.githubusercontent.com/MauriFerrariF76/gestionale-fullstack/main/public-scripts/install-gestionale-completo.sh
chmod +x install-gestionale-completo.sh

# Esegui deploy automatico (lo script clonerà tutto)
sudo ./install-gestionale-completo.sh
```

## 📋 Prerequisiti
- Ubuntu Server 24.04.2 LTS
- **CPU**: Almeno 2 core (1 CPU può causare blocchi durante build Docker)
- **RAM**: Minimo 2GB (per Docker + applicazioni)
- **Disco**: Minimo 10GB (per sistema + container + log)
- Connessione internet stabile

### ⚠️ Requisiti Hardware (CRITICO)
**Per VM di test:**
- **CPU**: **Almeno 2 core** (1 CPU può causare blocchi durante build Docker)
- **RAM**: **Almeno 2GB** (minimo per Docker + applicazioni)
- **Disco**: **Almeno 10GB** (per sistema + container + log)

**Per server di produzione:**
- **CPU**: **Almeno 4 core** (per performance ottimali)
- **RAM**: **Almeno 4GB** (per carico di lavoro)
- **Disco**: **Almeno 20GB** (per sistema + container + log + backup)

## 🔧 Configurazione
- **IP Server Produzione**: 10.10.10.15
- **IP VM Test**: 10.10.10.43
- **Porta SSH**: 27
- **Utente**: mauri

## 🎯 Cosa Fa lo Script

Lo script `install-gestionale-completo.sh` esegue automaticamente:

1. ✅ **Verifica prerequisiti** (sistema, memoria, disco)
2. ✅ **Aggiornamento sistema** (pacchetti essenziali + build tools)
3. ✅ **Installazione Docker** (Docker CE + Docker Compose)
4. ✅ **Configurazione rete** (IP statico, DNS)
5. ✅ **Configurazione SSH** (porta 27, sicurezza)
6. ✅ **Configurazione firewall** (UFW)
7. ✅ **Clonazione repository** (Git)
8. ✅ **Setup applicazione** (variabili, segreti)
9. ✅ **Nginx dockerizzato** (Installato automaticamente con Docker Compose)
10. ✅ **SSL/HTTPS** (Configurato con Let's Encrypt se dominio configurato)
11. ✅ **Verifiche post-installazione**
12. ✅ **Logging completo** (Tutti i dettagli salvati in file)
13. ✅ **Generazione report** (Report completo con log integrati)

## 📄 Sistema di Logging

Lo script include un sistema di logging completo:

- **Log dettagliati**: `/home/mauri/logs/deploy-YYYYMMDD-HHMMSS.log`
- **Log errori**: `/home/mauri/logs/deploy-errors-YYYYMMDD-HHMMSS.log`
- **Report completo**: `/home/mauri/deploy-report-YYYYMMDD-HHMMSS.txt`

Il report finale contiene tutti i log del deploy e può essere copiato facilmente sul PC locale.

## 🔒 Sicurezza

- **File sensibili protetti**: `.env`, `secrets/`, `backup/` esclusi dal repository
- **SSH su porta 27**: Configurazione sicura
- **Firewall UFW**: Configurato automaticamente
- **Container isolati**: Architettura Docker sicura

---
**Versione**: v2.0.0  
**Autore**: Mauri Ferrari 