# 🔐 Emergenza Passwords - Gestionale Fullstack

**Data creazione:** 2 Agosto 2025
**Versione:** 2.1
**Ultimo aggiornamento:** 2 Agosto 2025  
**Posizione sicura:** `/root/emergenza-passwords.md` (solo root)

## 📋 Accesso Sicuro

### **Procedura di Accesso in Emergenza**
```bash
# Accesso al file protetto (solo root)
sudo cat /root/emergenza-passwords.md

# Verifica permessi
ls -la /root/emergenza-passwords.md
# Risultato: -rw------- 1 root root [dimensione] [data] /root/emergenza-passwords.md
```

### **Spostamento in Posizione Sicura**
```bash
# Sposta il file in posizione protetta
sudo cp docs/SVILUPPO/emergenza-passwords.md /root/
sudo chmod 600 /root/emergenza-passwords.md
sudo chown root:root /root/emergenza-passwords.md

# Verifica sicurezza
ls -la /root/emergenza-passwords.md
```

---

## 🔑 MASTER PASSWORD

**Password principale per accesso a tutti i sistemi:**

```
"La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"
```

**Usa questa password per:**
- Accesso a Bitwarden (se configurato)
- Decifratura backup GPG
- Accesso di emergenza ai sistemi

---

## 🐳 DOCKER SECRETS

**Credenziali per il ripristino del gestionale Docker:**

| Servizio | Password | Descrizione |
|----------|----------|-------------|
| **Database** | `gestionale2025` | Password PostgreSQL |
| **JWT** | `GestionaleFerrari2025JWT_UltraSecure_v1!` | Chiave JWT Backend |

---

## 🔐 CHIAVI JWT (CRITICHE)

**Chiavi per autenticazione JWT del backend:**

| File | Posizione | Permessi | Backup |
|------|-----------|----------|--------|
| **Chiave Privata** | `backend/config/keys/jwtRS256.key` | `600` (solo proprietario) | Cifrato in NAS |
| **Chiave Pubblica** | `backend/config/keys/jwtRS256.key.pub` | `644` (lettura) | Cifrato in NAS |

**Backup automatico:** Ogni notte alle 02:15 con `backup_docker_automatic.sh`
**Formato backup:** `emergency_passwords_backup_YYYY-MM-DD_HHMMSS.md.backup` (non cifrato) o `.gpg` (cifrato)
**Posizione NAS:** `/mnt/backup_gestionale/emergency_passwords_backup_*.md.backup`

**Ripristino file di emergenza:**
```bash
# Copia backup da NAS
cp /mnt/backup_gestionale/emergency_passwords_backup_*.md.backup /root/emergenza-passwords.md

# Imposta permessi sicuri
sudo chmod 600 /root/emergenza-passwords.md
sudo chown root:root /root/emergenza-passwords.md

# Verifica accesso
sudo cat /root/emergenza-passwords.md
```

---

## 🚀 COMANDI EMERGENZA

### Ripristino Completo Gestionale
```bash
# 1. Accedi alle credenziali protette
sudo cat /root/emergenza-passwords.md

# 2. Ripristina segreti Docker
./scripts/restore_secrets.sh backup_file.tar.gz.gpg

# 3. Avvia servizi Docker
docker compose up -d

# 4. Verifica servizi
docker compose ps
```

### Reset Completo (Ultima Risorsa)
```bash
# 1. Ferma tutti i servizi
docker compose down -v

# 2. Ricrea segreti
./scripts/setup_secrets.sh

# 3. Avvia servizi
docker compose up -d
```

### Verifica Stato Servizi
```bash
# Controlla container attivi
docker compose ps

# Controlla log
docker compose logs -f

# Controlla database
docker compose exec postgres psql -U gestionale_user -d gestionale
```

---

## 📞 CONTATTI EMERGENZA

| Ruolo | Nome | Telefono | Email |
|-------|------|----------|-------|
| **Amministratore** | [NOME] | [TELEFONO] | [EMAIL] |
| **Backup Admin** | [NOME] | [TELEFONO] | [EMAIL] |
| **Supporto Tecnico** | [NOME] | [TELEFONO] | [EMAIL] |

---

## 🔧 PROCEDURE EMERGENZA

### 1. Server Non Risponde
```bash
# Controlla stato server
ssh root@IP_SERVER

# Verifica servizi Docker
docker compose ps

# Riavvia se necessario
docker compose restart
```

### 2. Database Corrotto
```bash
# Accedi alle credenziali protette
sudo cat /root/emergenza-passwords.md

# Ripristina da backup
docker compose exec postgres pg_restore -U gestionale_user -d gestionale backup_file.sql

# Verifica integrità
docker compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT COUNT(*) FROM users;"
```

### 3. Password Dimenticate
```bash
# Accedi alle credenziali protette
sudo cat /root/emergenza-passwords.md

# Se non funzionano, reset completo:
./scripts/setup_secrets.sh
docker compose up -d
```

### 4. Backup Non Funziona
```bash
# Crea nuovo backup
./scripts/backup_secrets.sh

# Verifica backup
./scripts/restore_secrets.sh secrets_backup_*.tar.gz.gpg
```

---

## 📍 POSIZIONE BACKUP

### Backup Digitali
- **NAS Aziendale:** `/mnt/backup_gestionale/`
- **Server Locale:** `/home/mauri/gestionale-fullstack/backup/docker/`
- **File Protetto:** `/root/emergenza-passwords.md` (incluso nei backup automatici)
- **Backup Automatico:** Ogni notte alle 02:15 con `backup_docker_automatic.sh`
- **Cloud:** [Specificare se configurato]

### Backup Cartaceo
- **Cassaforte Aziendale:** [Specificare posizione]
- **Documento Emergenza:** Questo file stampato

---

## ⚠️ AVVERTIMENTI IMPORTANTI

1. **NON condividere** questo documento con persone non autorizzate
2. **Aggiorna regolarmente** questo documento quando cambi password
3. **Testa periodicamente** le procedure di ripristino
4. **Mantieni aggiornato** il backup dei segreti
5. **Verifica sempre** che l'applicazione funzioni dopo il ripristino
6. **Usa sempre** `sudo cat /root/emergenza-passwords.md` per accesso sicuro

---

## 📝 NOTE OPERATIVE

### Aggiornamenti Documento
- Aggiorna la data di "Ultimo aggiornamento" quando modifichi questo documento
- Verifica che tutte le password siano corrette
- Testa le procedure di ripristino dopo ogni aggiornamento

### Backup Regolari
- **Settimanale:** Backup segreti Docker
- **Mensile:** Test ripristino completo
- **Trimestrale:** Aggiornamento documento emergenza

### Sicurezza
- Conserva questo documento in luogo sicuro
- Non committare mai questo file su Git
- Usa solo per emergenze reali
- **Accesso sicuro:** `sudo cat /root/emergenza-passwords.md`

---

**🔐 Questo documento contiene informazioni critiche per la sicurezza aziendale. Mantienilo al sicuro!**

**🚨 ACCESSO SICURO:** `sudo cat /root/emergenza-passwords.md`