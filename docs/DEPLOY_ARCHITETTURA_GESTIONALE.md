# 📦 Deploy & Architettura Gestionale Web

## Indice

- [Obiettivo](#obiettivo)
- [Struttura delle cartelle](#struttura-delle-cartelle)
- [Configurazione Nginx (esempio)](#configurazione-nginx-esempio)
- [Variabili d’ambiente](#️-variabili-dambiente)
- [Sicurezza WAN (Mikrotik + Nginx)](#-sicurezza-wan-mikrotik--nginx)
- [Best practice backend](#️-best-practice-backend)
- [Best practice frontend](#️-best-practice-frontend)
- [Checklist operativa](#-checklist-operativa)
- [Contatti e note](#-contatti-e-note)
- [Script SQL per tabelle principali](#-script-sql-per-tabelle-principali)
- [Generazione chiavi JWT RS256](#-generazione-chiavi-jwt-rs256)
- [Prossimi step e feature avanzate (roadmap)](#-prossimi-step-e-feature-avanzate-roadmap)

## Obiettivo

Deploy di frontend (Next.js/React) e backend (Node.js/Express) su Ubuntu Server (es. 10.10.10.15), con accesso LAN e WAN tramite Nginx reverse proxy e sicurezza MikroTik.

---

## 📁 Struttura delle cartelle

```
/home/app/
  ├── frontend/   # Build Next.js/React
  └── backend/    # Node.js/Express
```

---

## 🌐 Configurazione Nginx (esempio)

> **Best practice:** In fase di test e prima dell'esposizione su Internet, configura Nginx per ascoltare solo sull'IP della LAN (es. 10.10.10.15) invece che su tutte le interfacce. In questo modo il gestionale sarà accessibile solo dalla rete locale.

```nginx
server {
    listen 10.10.10.15:80;
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
- **HTTPS:** attiva Let’s Encrypt e forza redirect da HTTP a HTTPS.

---

## ⚙️ Variabili d’ambiente

### Frontend (`frontend/.env.production`)
```
NEXT_PUBLIC_API_BASE_URL=https://gestionale.miaazienda.com/api
```

### Backend (`backend/.env`)
```
PORT=3001
CORS_ORIGIN=https://gestionale.miaazienda.com,http://10.10.10.15
JWT_SECRET=una-chiave-segreta-molto-lunga-e-sicura
DB_USER=gestionale
DB_HOST=localhost
DB_NAME=gestionale_db
DB_PORT=5432
DB_PASSWORD=superpasswordsicura
```

---

## 🔒 Sicurezza WAN (Mikrotik + Nginx)

- Esporre solo porte 80/443 (HTTP/HTTPS) tramite Mikrotik.
- Bloccare tutte le altre porte (3000, 3001, 5432, ecc.) dall’esterno.
- Permettere SSH solo da IP fidati.
- Configurare NAT e port forwarding solo verso Nginx.
- Abilitare HTTPS obbligatorio (redirect da HTTP a HTTPS).
- Configurare firewall Mikrotik per limitare tentativi di brute-force.
- Aggiornare regolarmente firmware Mikrotik e sistema operativo server.
- Non usare utenti di test/admin con password deboli.
- Verificare che il database NON sia accessibile dall’esterno.

---

## 🛡️ Best practice backend

- Helmet + CSP + protezione XSS
- Rate limiting (express-rate-limit)
- Audit log (azione, utente, IP, timestamp)
- MFA (TOTP/WebAuthn) per admin
- Logging strutturato (Winston)
- Backup automatici DB e configurazione
- Monitoring (Prometheus, Grafana, OpenTelemetry)
- Row-Level Security su PostgreSQL (se dati sensibili)
- Gestione sicura variabili ambiente (.env, no git)
- JWT RS256 + Refresh Token Rotation

---

## 🛡️ Best practice frontend

- Gestione sessione robusta (scadenza token, refresh automatico)
- UI e flusso MFA
- Logging azioni utente lato frontend
- Gestione permessi/ruoli utente lato frontend
- PWA solo per dati statici (lookup, listini, ecc.)
- Ottimizzazione paginazione e virtual scroll per grandi dataset

---

## ✅ Checklist operativa

> Consulta anche **docs/checklist_sicurezza.md** per la checklist dettagliata di sicurezza prima di esporre il gestionale su Internet.

- [x] Build frontend (`npm run build`)
- [x] Build backend (`npm run build`)
- [x] Deploy file statici in `/home/app/frontend`
- [x] Deploy backend in `/home/app/backend`
- [x] Aggiornamento variabili d’ambiente
- [x] Avvio backend con PM2 o systemd
- [x] Configurazione Nginx aggiornata e testata
- [x] Certificato HTTPS attivo
- [x] Firewall MikroTik: solo porte 80/443 aperte verso il server
- [x] UFW su Ubuntu: regole attive
- [x] Accesso frontend da LAN e WAN testato
- [x] Chiamate API funzionanti da frontend
- [x] Login/logout e gestione token funzionanti
- [x] Backup database eseguito prima del deploy

---

## 📞 Contatti e note

- **Responsabile deploy:** [Nome, email/contatto]
- **Note:** Aggiornare questa checklist durante il deploy e segnalare eventuali problemi.

---

## 📌 Script SQL per tabelle principali

```sql
-- Tabella utenti
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(100) NOT NULL,
  cognome VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  roles TEXT[] NOT NULL DEFAULT ARRAY['user'],
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tabella refresh token
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(512) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tabella audit log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  details TEXT
);
```

---

## 🔑 Generazione chiavi JWT RS256

```bash
openssl genpkey -algorithm RSA -out jwtRS256.key -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in jwtRS256.key -out jwtRS256.key.pub
```
- **jwtRS256.key** → chiave privata (NON condividerla)
- **jwtRS256.key.pub** → chiave pubblica (può essere distribuita per la verifica)
- Metti questi file in una cartella sicura, ad esempio `config/keys/`.

---

**Aggiorna questo file ogni volta che completi un nuovo step o aggiungi una nuova best practice!** 

---

## 🚀 Prossimi step e feature avanzate (roadmap)

> Per la sicurezza, segui la checklist aggiornata in **docs/checklist_sicurezza.md**.

### Sicurezza e resilienza
- [ ] Row-Level Security su PostgreSQL per dati sensibili
- [ ] MFA (TOTP/WebAuthn) obbligatoria per admin e utenti critici
- [ ] Rate limiting differenziato LAN/WAN (es. express-rate-limit)
- [ ] Audit log completo (azione, utente, IP, timestamp, fallback)
- [ ] Logging strutturato e centralizzato (Winston, Sentry, Graylog)
- [ ] Health check periodico e alert automatici (uptime, errori 5xx, tentativi sospetti)

### Performance e architettura
- [ ] API client intelligente con fallback LAN/WAN, retry, logging
- [ ] Ottimizzazione query e caching multilivello (in-memory, Redis, Service Worker)
- [ ] Virtual scroll/virtualizzazione tabelle (es. react-window)
- [ ] Paginazione server-side avanzata e ricerca ottimizzata
- [ ] Pre-caricamento dati critici al login

### AI e moduli predittivi
- [ ] API AI modulari (`/predict`, `/suggest`)
- [ ] Feature store su PostgreSQL
- [ ] A/B testing modelli AI
- [ ] Tracciamento feedback utente per modelli
- [ ] Modelli leggeri (ONNX o servizi remoti)

### Monitoring, backup e CI/CD
- [ ] Monitoring avanzato (Prometheus, Grafana, OpenTelemetry)
- [ ] Backup full giornalieri + incrementali orari, snapshot e rollback
- [ ] Deploy automatizzato (PM2, git hooks, blue/green opzionale)

### Frontend
- [ ] Logging azioni utente lato frontend
- [ ] Gestione permessi/ruoli utente lato frontend
- [ ] PWA solo per dati statici (lookup, listini, ecc.)
- [ ] UI e flusso MFA

---

**Aggiorna questa sezione man mano che implementi nuove feature o cambi le priorità!** 
