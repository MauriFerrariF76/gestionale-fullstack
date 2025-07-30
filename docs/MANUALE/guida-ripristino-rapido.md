# 🚀 Guida Rapida Ripristino Automatico

**Per utenti non esperti** - Ripristino completo in 3 passi

---

## 📋 Prerequisiti

### **Cosa ti serve:**
- Server Ubuntu 22.04 LTS (nuovo o esistente)
- Accesso root al server
- Backup segreti e database (sul NAS)
- Master Password: `"La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"`

### **Cosa NON ti serve:**
- Conoscenze tecniche avanzate
- Configurazioni manuali
- Ricordare password complesse

---

## 🎯 Ripristino in 3 Passi

### **Passo 1: Clona Repository**
```bash
# Su un server Ubuntu pulito
git clone https://github.com/MauriFerrariF76/gestionale-fullstack.git
cd gestionale-fullstack
```

### **Passo 2: Installa Docker (se necessario)**
```bash
# Se Docker non è installato
sudo ./scripts/install_docker.sh

# Riavvia la sessione
newgrp docker
```

### **Passo 3: Lancia Ripristino Automatico**
```bash
# Il sistema fa tutto da solo
./scripts/ripristino_docker_emergenza.sh
```

**Fine!** Il gestionale è operativo. 🎉

---

## 🔄 Cosa Fa lo Script Automaticamente

### **✅ Installazione e Configurazione**
- ✅ Installa Docker e Docker Compose
- ✅ Configura segreti Docker sicuri
- ✅ Crea cartelle necessarie
- ✅ Setup ambiente completo

### **✅ Ripristino Dati**
- ✅ Trova backup segreti (NAS o locale)
- ✅ Ripristina database PostgreSQL
- ✅ Configura credenziali sicure
- ✅ Avvia tutti i servizi Docker

### **✅ Verifica e Test**
- ✅ Controlla che tutto funzioni
- ✅ Testa accesso web
- ✅ Verifica database
- ✅ Mostra log di errore

---

## 🚨 Se Qualcosa Non Funziona

### **Problema: "Docker non installato"**
```bash
# Soluzione automatica
sudo ./scripts/install_docker.sh
```

### **Problema: "Segreti non trovati"**
```bash
# Lo script crea automaticamente i segreti
# Oppure ripristina manualmente:
./scripts/restore_secrets.sh backup_file.tar.gz.gpg
```

### **Problema: "Servizi non si avviano"**
```bash
# Controlla log
docker-compose logs

# Riavvia servizi
docker-compose restart
```

### **Problema: "Porte occupate"**
```bash
# Verifica porte in uso
sudo netstat -tlnp | grep :80

# Ferma servizi esistenti
sudo systemctl stop nginx apache2
```

---

## 🐳 Comandi Docker Utili

### **Gestione Servizi**
```bash
# Stato servizi
docker-compose ps

# Log in tempo reale
docker-compose logs -f

# Ferma servizi
docker-compose down

# Riavvia servizi
docker-compose restart
```

### **Accesso Applicazione**
- **🌐 Frontend**: http://localhost
- **🔧 API**: http://localhost/api
- **💚 Health**: http://localhost/health

### **Backup e Ripristino**
```bash
# Backup segreti
./scripts/backup_secrets.sh

# Backup database
docker-compose exec postgres pg_dump -U gestionale_user gestionale > backup.sql

# Ripristino segreti
./scripts/restore_secrets.sh backup_file.tar.gz.gpg
```

---

## 📞 Contatti Emergenza

### **Se tutto fallisce:**
- **Amministratore**: [NOME] - [TELEFONO]
- **Backup Admin**: [NOME] - [TELEFONO]
- **Supporto Tecnico**: [NOME] - [TELEFONO]

### **Credenziali Critiche:**
- **Master Password**: `"La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"`
- **Accesso SSH**: [CREDENZIALI]
- **Documento Emergenza**: `EMERGENZA_PASSWORDS.md`

---

## ✅ Checklist Post-Ripristino

### **Verifica Funzionamento**
- [ ] Container attivi: `docker-compose ps`
- [ ] Health check OK: `curl http://localhost/health`
- [ ] Frontend accessibile: http://localhost
- [ ] API funzionante: http://localhost/api
- [ ] Database connesso: Test query PostgreSQL

### **Configurazione Finale**
- [ ] Backup segreti: `./scripts/backup_secrets.sh`
- [ ] Test backup database
- [ ] Configura monitoring
- [ ] Aggiorna documentazione

---

## 🎯 Vantaggi del Sistema Automatico

### **Per Utenti Non Esperti**
- ✅ **Nessuna conoscenza tecnica richiesta**
- ✅ **Comandi copia-incolla**
- ✅ **Guida passo-passo a video**
- ✅ **Gestione errori automatica**

### **Per Sicurezza**
- ✅ **Password cifrate con GPG**
- ✅ **Backup sicuri sul NAS**
- ✅ **Configurazione protetta**
- ✅ **Log di sicurezza**

### **Per Manutenzione**
- ✅ **Ripristino in 10 minuti**
- ✅ **Test automatici**
- ✅ **Rollback semplice**
- ✅ **Documentazione integrata**

---

## 📋 File Importanti

### **Nel Repository (Git)**
- `scripts/ripristino_docker_emergenza.sh` - Script principale
- `scripts/install_docker.sh` - Installazione Docker
- `scripts/setup_docker.sh` - Setup completo Docker
- `docker-compose.yml` - Configurazione servizi

### **Nel NAS (Backup)**
- `secrets_backup_*.tar.gz.gpg` - Backup segreti Docker
- `gestionale_db_*.backup` - Backup database
- `config_backup_*.tar.gz` - Backup configurazioni

### **Documentazione**
- `EMERGENZA_PASSWORDS.md` - Credenziali critiche
- `guida-ripristino-docker.md` - Guida Docker dettagliata
- `README_ripristino.md` - Istruzioni NAS

---

**🎉 Con Docker, il ripristino è ancora più semplice e affidabile!**

**⚠️ IMPORTANTE:**
- Mantieni sempre aggiornati i backup
- Testa il ripristino periodicamente
- Conserva al sicuro la Master Password
- Aggiorna i contatti di emergenza
- Usa sempre gli script automatici