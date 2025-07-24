# 🚀 Deploy Coordinato Frontend + Backend - Gestionale Web

## Obiettivo

Deploy di frontend (Next.js/React statico) e backend (Node.js/Payload) su Ubuntu Server (10.10.10.15), con accesso LAN e remoto tramite Nginx reverse proxy e sicurezza MikroTik.

---

## 📦 Struttura delle cartelle sul server

```
/home/app/
  ├── frontend/   # Build statico Next.js/React
  └── backend/    # Node.js/Payload/Express
```

---

## 🌐 Configurazione Nginx (esempio)

- Servire il frontend statico su `/`
- Proxy delle API su `/api` verso il backend (porta 3001)

```nginx
server {
    listen 80;
    server_name gestionale.miaazienda.com 10.10.10.15;

    location / {
        root /home/app/frontend;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## ⚙️ Variabili d’ambiente (esempio)

### Frontend (`.env.production`)

```
NEXT_PUBLIC_API_URL=https://gestionale.miaazienda.com/api
```

### Backend (`.env`)

```
PORT=3001
CORS_ORIGIN=https://gestionale.miaazienda.com,http://10.10.10.15
JWT_SECRET=...
DATABASE_URL=postgres://user:password@localhost:5432/gestionale
```

---

### Come usarlo

- Compila i campi tra parentesi quadre con i nomi/contatti reali.
- Puoi aggiungere o togliere punti in base alle tue esigenze specifiche.
- Condividi il file con il collega backend: così avrete entrambi una guida chiara e aggiornata.

---

Vuoi che ti prepari il file già pronto con i dati del tuo progetto, oppure vuoi aggiungere qualche dettaglio specifico?  
Dimmi pure se vuoi il file già compilato!

---

## ✅ Checklist operativa

- [ ] **Frontend**
  - [ ] Build del frontend (`npm run build`)
  - [ ] Copia dei file statici in `/home/app/frontend`
  - [ ] Aggiornamento variabili d’ambiente (`NEXT_PUBLIC_API_URL`)
- [ ] **Backend**
  - [ ] Deploy del backend in `/home/app/backend`
  - [ ] Aggiornamento variabili d’ambiente (`PORT`, `CORS_ORIGIN`, `DATABASE_URL`, ecc.)
  - [ ] Avvio backend con PM2 o systemd
- [ ] **Nginx**
  - [ ] Configurazione Nginx aggiornata e testata
  - [ ] Certificato HTTPS con Let’s Encrypt attivo
- [ ] **Firewall**
  - [ ] MikroTik: solo porte 80/443 aperte verso il server
  - [ ] UFW su Ubuntu: regole attive
- [ ] **Test**
  - [ ] Accesso frontend da LAN e WAN
  - [ ] Chiamate API funzionanti da frontend
  - [ ] Login/logout e gestione token funzionanti
  - [ ] Test upload/download file
  - [ ] Test mobile/app expediter
- [ ] **Backup**
  - [ ] Backup database eseguito prima del deploy

---

## 📞 Contatti e note

- **Frontend:** [Nome, email/contatto]
- **Backend:** [Nome, email/contatto]
- **Note:** [Eventuali note particolari]

---

**Aggiornare questa checklist durante il deploy e segnalare eventuali problemi!**
