# 🚀 Script di Automazione Gestionale

## �� Descrizione
Script per il deploy automatico del gestionale aziendale.

## 📁 Script Disponibili

### 🎯 Script Principale
- **`install-gestionale-completo.sh`** - Deploy automatico completo (Docker-based)

## 🚀 Utilizzo Rapido

### Deploy Automatico Completo
```bash
# Clonazione repository
git clone https://github.com/MauriFerrariF76/gestionale-fullstack.git
cd gestionale-fullstack
chmod +x public-scripts/install-gestionale-completo.sh
sudo ./public-scripts/install-gestionale-completo.sh
```

## 📋 Prerequisiti
- Ubuntu Server 24.04.2 LTS
- Minimo 2GB RAM
- Minimo 3GB spazio disco (per VM di test)
- Connessione internet stabile

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
12. ✅ **Generazione report**

## 🔒 Sicurezza

- **File sensibili protetti**: `.env`, `secrets/`, `backup/` esclusi dal repository
- **SSH su porta 27**: Configurazione sicura
- **Firewall UFW**: Configurato automaticamente
- **Container isolati**: Architettura Docker sicura

---
**Versione**: v2.0.0  
**Autore**: Mauri Ferrari 