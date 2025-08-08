# 🔐 GESTIONE CREDENZIALI SICURA (Unificato)

**Data creazione**: 8 Agosto 2025  
**Versione**: 2.0  
**Sistema**: Gestionale Fullstack  
**Ambiente**: Sviluppo + Produzione  

---

## 🎯 **OBBIETTIVI**

- ✅ **Nessuna password hardcoded** nel codice
- ✅ **Variabili d'ambiente** per configurazione
- ✅ **Docker secrets** per produzione
- ✅ **Repository pubblico** sicuro
- ✅ **Best practices** implementate

---

## 📋 **STRUTTURA CONFIGURAZIONE**

### **File di Configurazione**
```
scripts/
├── config.sh              # Configurazione centralizzata
├── database-setup.sh      # Setup database (usa config.sh)
├── database-setup-dev.sh  # Setup sviluppo (usa config.sh)
└── setup_secrets.sh       # Setup secrets (usa config.sh)

config/
├── env.example            # Esempio configurazione
└── .env                   # Configurazione reale (privata)
```

### **Variabili d'Ambiente**
```bash
# Database Produzione
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestionale
DB_USER=gestionale_user
DB_PASSWORD=your_production_password

# Database Sviluppo
DB_DEV_HOST=localhost
DB_DEV_PORT=5432
DB_DEV_NAME=gestionale_dev
DB_DEV_USER=gestionale_dev_user
DB_DEV_PASSWORD=your_dev_password

# JWT Secret
JWT_SECRET=your_jwt_secret
```

---

## 🔧 **CONFIGURAZIONE INIZIALE**

### **Step 1: Crea file .env**
```bash
# Copia il file di esempio
cp config/env.example .env

# Modifica con le tue credenziali
nano .env
```

### **Step 2: Configura credenziali**
```bash
# Esempio .env
DB_PASSWORD=your_production_password
DB_DEV_PASSWORD=your_dev_password
JWT_SECRET=your_jwt_secret
```

### **Step 3: Verifica configurazione**
```bash
# Test configurazione
source ./scripts/config.sh
show_config
```

---

## 🔐 **EMERGENZA PASSWORDS**

### **Accesso Sicuro**
```bash
# Accesso al file protetto (solo root)
sudo cat /root/emergenza-passwords.md

# Verifica permessi
ls -la /root/emergenza-passwords.md
```

### **MASTER PASSWORD**
```
"La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"
```

**Usa questa password per:**
- Accesso a Bitwarden (se configurato)
- Decifratura backup GPG
- Accesso di emergenza ai sistemi

### **DOCKER SECRETS**
| Servizio | Password | Descrizione |
|----------|----------|-------------|
| **Database** | `[VEDERE FILE sec.md]` | Password PostgreSQL |
| **JWT** | `[VEDERE FILE sec.md]` | Chiave JWT Backend |

### **CHIAVI JWT (CRITICHE)**
| File | Posizione | Permessi | Backup |
|------|-----------|----------|--------|
| **Chiave Privata** | `backend/config/keys/jwtRS256.key` | `600` | Cifrato in NAS |
| **Chiave Pubblica** | `backend/config/keys/jwtRS256.key.pub` | `644` | Cifrato in NAS |

---

## 🚀 **USO DEGLI SCRIPT**

### **Setup Database Produzione**
```bash
# Usa credenziali da .env
./scripts/database-setup.sh
```

### **Setup Database Sviluppo**
```bash
# Usa credenziali da .env
./scripts/database-setup-dev.sh
```

### **Setup Secrets**
```bash
# Genera file secrets da .env
./scripts/setup_secrets.sh
```

### **Backup Sviluppo**
```bash
# Backup con credenziali sicure
./scripts/backup-sviluppo.sh
```

---

## 🔒 **SICUREZZA IMPLEMENTATA**

### **Validazione Configurazione**
- ✅ **Controllo password** definite
- ✅ **Messaggi di errore** chiari
- ✅ **Guida configurazione** inclusa

### **Best Practices**
- ✅ **Nessuna password** nel codice
- ✅ **Variabili d'ambiente** per configurazione
- ✅ **File .env** escluso da Git
- ✅ **Documentazione** senza credenziali

### **Ambiente Sviluppo**
```bash
# Configurazione locale
export DB_PASSWORD=your_password
export DB_DEV_PASSWORD=your_dev_password
export JWT_SECRET=your_jwt_secret
```

### **Ambiente Produzione**
```bash
# Docker secrets
DB_PASSWORD=$(cat /run/secrets/db_password)
JWT_SECRET=$(cat /run/secrets/jwt_secret)
```

---

## 📝 **ESEMPI DI USO**

### **Test Connessione Database**
```bash
# Carica configurazione
source ./scripts/config.sh

# Test produzione
test_production_db

# Test sviluppo
test_development_db
```

### **Mostra Configurazione**
```bash
# Mostra configurazione (senza password)
source ./scripts/config.sh
show_config
```

### **Validazione**
```bash
# Valida configurazione
source ./scripts/config.sh
validate_config
```

---

## ⚠️ **IMPORTANTE**

### **Regole di Sicurezza**
1. **Non committare** mai il file `.env`
2. **Non condividere** le credenziali
3. **Usa password** diverse per ogni ambiente
4. **Rotazione** periodica delle password
5. **Backup sicuro** delle configurazioni

### **File da Non Committare**
```
.env                    # Configurazione reale
secrets/                # File secrets
*.key                   # Chiavi private
*.pem                   # Certificati
```

### **File Pubblici**
```
config/env.example      # Esempio configurazione
scripts/config.sh       # Script configurazione
docs/                   # Documentazione
```

---

## 🔧 **TROUBLESHOOTING**

### **Errore: Password non definita**
```bash
❌ ERRORE: DB_PASSWORD non definita
💡 Definisci DB_PASSWORD nel file .env o come variabile d'ambiente
```

**Soluzione:**
1. Crea file `.env` con le credenziali
2. Oppure definisci variabili d'ambiente
3. Verifica che il file `.env` sia presente

### **Errore: Connessione database**
```bash
❌ Database produzione: ERRORE CONNESSIONE
```

**Soluzione:**
1. Verifica che PostgreSQL sia in esecuzione
2. Controlla le credenziali nel file `.env`
3. Verifica che l'utente esista nel database

### **Errore: File config.sh non trovato**
```bash
❌ File config.sh non trovato
```

**Soluzione:**
1. Verifica che il file `scripts/config.sh` esista
2. Controlla i permessi del file
3. Assicurati di essere nella directory corretta

---

## 📚 **RIFERIMENTI**

### **Best Practices**
- [12 Factor App - Config](https://12factor.net/config)
- [Docker Secrets](https://docs.docker.com/engine/swarm/secrets/)
- [Environment Variables](https://en.wikipedia.org/wiki/Environment_variable)

### **Documentazione Correlata**
- [Separazione Ambienti Database](../SVILUPPO/separazione-ambienti-database.md)
- [Ambiente Sviluppo Nativo](../SVILUPPO/ambiente-sviluppo-nativo.md)
- [Docker Sintassi e Best Practice](../SVILUPPO/docker-sintassi-e-best-practice.md)

---

**✅ CONFIGURAZIONE SICURA IMPLEMENTATA**
