# 📄 EMERGENZA PASSWORDS - GESTIONALE CARPENTERIA FERRARI

**Data creazione:** $(date +%F)  
**Versione:** 1.0  
**Ultimo aggiornamento:** $(date +%F)  

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

## 🚀 COMANDI EMERGENZA

### Ripristino Completo Gestionale
```bash
# 1. Ripristina segreti Docker
./scripts/restore_secrets.sh backup_file.tar.gz.gpg

# 2. Avvia servizi Docker
docker-compose up -d

# 3. Verifica servizi
docker-compose ps
```

### Reset Completo (Ultima Risorsa)
```bash
# 1. Ferma tutti i servizi
docker-compose down -v

# 2. Ricrea segreti
./scripts/setup_secrets.sh

# 3. Avvia servizi
docker-compose up -d
```

### Verifica Stato Servizi
```bash
# Controlla container attivi
docker-compose ps

# Controlla log
docker-compose logs -f

# Controlla database
docker-compose exec postgres psql -U gestionale_user -d gestionale
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
docker-compose ps

# Riavvia se necessario
docker-compose restart
```

### 2. Database Corrotto
```bash
# Ripristina da backup
docker-compose exec postgres pg_restore -U gestionale_user -d gestionale backup_file.sql

# Verifica integrità
docker-compose exec postgres psql -U gestionale_user -d gestionale -c "SELECT COUNT(*) FROM users;"
```

### 3. Password Dimenticate
```bash
# Usa le password di emergenza sopra
# Se non funzionano, reset completo:
./scripts/setup_secrets.sh
docker-compose up -d
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
- **NAS Aziendale:** `/mnt/nas/backup_gestionale/`
- **Server Locale:** `/opt/gestionale/backup/`
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

---

**🔐 Questo documento contiene informazioni critiche per la sicurezza aziendale. Mantienilo al sicuro!**