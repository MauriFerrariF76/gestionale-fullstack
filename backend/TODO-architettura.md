# TODO Architettura Gestionale

## Backend

- [x] Connection pooling PostgreSQL (pool centralizzato in tutti i repository)
- [x] Generazione hash bcrypt sicuro per utenti di test (script in scripts/generate-bcrypt.js)
- [x] Creazione utente di test nel database con hash bcrypt
- [x] Verifica funzionamento login e redirect
- [ ] Implementare autenticazione JWT RS256 + Refresh Token Rotation
- [ ] Abilitare MFA (TOTP/WebAuthn)
- [ ] Configurare Row-Level Security su PostgreSQL
- [ ] Implementare Audit Log (azione, utente, IP, timestamp)
- [ ] Rate limiting differenziato LAN/WAN
- [ ] Helmet + CSP + protezione XSS
- [ ] Gestione sicura variabili ambiente
- [ ] Modularizzazione API e fallback LAN/WAN
- [ ] Ottimizzazione query e caching multilivello
- [ ] Logging strutturato (Winston)
- [ ] Monitoring (Prometheus, Grafana, OpenTelemetry)

## Frontend (placeholder)

- [ ] Definire stack e struttura progetto (React multipagina, router modulare)
- [ ] Implementare autenticazione e gestione sessione
- [ ] Gantt dinamici (frappe-gantt, vis.js)
- [ ] Paginazione server-side e ricerca ottimizzata
- [ ] PWA per dati statici (lookup, listini, ecc.) 

---

# **1. Creazione delle tabelle in PostgreSQL**

## **A. Script SQL per le tabelle**

Copia questi script e usali nel tuo client PostgreSQL (ad esempio DBeaver, pgAdmin, o da terminale con `psql`).  
**Se non sai come fare, chiedimi pure!**

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

**Nota:**  
- Se non hai l’estensione `pgcrypto` per `gen_random_uuid()`, puoi usare `uuid-ossp` o chiedimi come attivarla.
- Se vuoi, posso aiutarti a creare uno script `.sql` da eseguire direttamente.

---

# **2. Setup chiavi JWT RS256**

## **A. Generazione chiavi RSA**

Apri il terminale nella root del progetto e lancia questi comandi:

```bash
# Genera la chiave privata
openssl genpkey -algorithm RSA -out jwtRS256.key -pkeyopt rsa_keygen_bits:2048

# Estrai la chiave pubblica
openssl rsa -pubout -in jwtRS256.key -out jwtRS256.key.pub
```

- **jwtRS256.key** → chiave privata (NON condividerla)
- **jwtRS256.key.pub** → chiave pubblica (può essere distribuita per la verifica)

Metti questi file in una cartella sicura, ad esempio `config/keys/`.

---

# **3. Installazione dipendenze Node.js**

Nel terminale, nella root del progetto, esegui:

```bash
npm install express pg bcrypt jsonwebtoken dotenv helmet morgan speakeasy
npm install --save-dev @types/express @types/bcrypt @types/jsonwebtoken @types/node
```

---

# **4. Struttura base dei modelli TypeScript**

Creo i file modello in `src/models/`:

- `User.ts`
- `RefreshToken.ts`
- `AuditLog.ts`

Vuoi che ti mostri subito il contenuto di questi file, oppure preferisci vedere prima la struttura delle cartelle e dei file che andremo a creare?

---

## **Prossimo passo**
Dimmi se:
- Hai bisogno di aiuto per eseguire gli script SQL o generare le chiavi.
- Vuoi vedere subito i modelli TypeScript, oppure la struttura delle cartelle/file.

Procederò con la creazione dei modelli e ti spiegherò ogni campo! 