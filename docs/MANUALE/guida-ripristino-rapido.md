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
./scripts/restore_all.sh
```

**Fine!** Il gestionale è operativo. 🎉

---

## 🔄 Cosa Fa lo Script Automaticamente

### **✅ Installazione e Configurazione**
- ✅ Installa Docker e Docker Compose
- ✅ Configura Nginx e SSL
- ✅ Configura firewall
- ✅ Monta NAS automaticamente

### **✅ Ripristino Dati**
- ✅ Trova backup segreti (NAS o locale)
- ✅ Ripristina database PostgreSQL
- ✅ Configura credenziali sicure
- ✅ Avvia tutti i servizi

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

### **Problema: "NAS non montato"**
```bash
# Monta manualmente
sudo mount -t cifs //10.10.10.21/backup_gestionale /mnt/backup_gestionale -o credentials=/root/.nas_gestionale_creds,iocharset=utf8,vers=2.0
```

### **Problema: "Backup non trovato"**
```bash
# Lo script ti guida per inserire manualmente le credenziali
# Inserisci solo la Master Password quando richiesto
```

### **Problema: "Servizi non si avviano"**
```bash
# Controlla log
docker-compose logs

# Riavvia servizi
docker-compose restart
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
- [ ] Sito web accessibile: http://localhost
- [ ] Login admin funzionante
- [ ] Database con dati
- [ ] SSL attivo (se configurato)

### **Configurazione Finale**
- [ ] Aggiorna contatti in `EMERGENZA_PASSWORDS.md`
- [ ] Testa backup automatici
- [ ] Configura monitoring
- [ ] Documenta modifiche

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
- `scripts/restore_all.sh` - Script principale
- `scripts/install_docker.sh` - Installazione Docker
- `config/restore_config.conf.gpg` - Config cifrata

### **Nel NAS (Backup)**
- `restore_all.sh` - Copia script
- `restore_config.conf.gpg` - Config cifrata
- `secrets_backup_*.tar.gz.gpg` - Backup segreti
- `gestionale_db_*.backup` - Backup database

### **Documentazione**
- `EMERGENZA_PASSWORDS.md` - Credenziali critiche
- `guida-ripristino-completo.md` - Guida dettagliata
- `README_ripristino.md` - Istruzioni NAS

---

**🎉 Con questo sistema, anche un principiante può ripristinare il gestionale in pochi minuti!**

**⚠️ IMPORTANTE:**
- Mantieni sempre aggiornati i backup
- Testa il ripristino periodicamente
- Conserva al sicuro la Master Password
- Aggiorna i contatti di emergenza