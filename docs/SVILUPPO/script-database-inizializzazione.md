# Script Database Inizializzazione - Gestionale Fullstack

## Panoramica
Documento di riferimento per gli script di inizializzazione del database PostgreSQL del gestionale.

**Versione**: 1.1 (2025-08-05)  
**Stato**: ✅ AGGIORNATI E FUNZIONANTI  
**Cartella**: `/postgres/init/`

---

## 📁 Script Disponibili

### 1. `01-init-database.sql` - Script Principale
**Descrizione**: Crea tutte le tabelle del sistema e inserisce gli utenti di default.

**Tabelle create**:
- ✅ `users` - Utenti del sistema (con UUID, email, nome, cognome, password_hash, roles)
- ✅ `clienti` - Anagrafica clienti (con tutti i campi necessari)
- ✅ `fornitori` - Anagrafica fornitori
- ✅ `commesse` - Gestione commesse
- ✅ `dipendenti` - Anagrafica dipendenti
- ✅ `audit_logs` - Log delle azioni (con colonne ip, details)
- ✅ `refresh_tokens` - Token JWT per autenticazione (token VARCHAR(500))

**Utenti di default**:
- **Admin**: `admin@gestionale.local` / `admin123`
- **Mauri**: `mauriferrari76@gmail.com` / `gigi`

**Permessi**: Configura automaticamente i permessi per `gestionale_user`

### 2. `02-migrate-users-table.sql` - Migrazione Utenti
**Descrizione**: Migra la tabella users dal vecchio schema al nuovo.

**Operazioni**:
- ✅ Aggiunge colonne `nome`, `cognome`, `roles`, `mfa_enabled`
- ✅ Migra dati da `username` a `nome`
- ✅ Espande campo `email` a VARCHAR(255)
- ✅ **Sicuro**: Non rimuove colonne obsolete (commentato)

### 3. `03-fix-tables.sql` - Correzioni Tabelle
**Descrizione**: Corregge problemi specifici nelle tabelle esistenti.

**Correzioni**:
- ✅ Espande `token` in `refresh_tokens` a VARCHAR(500)
- ✅ Rinomina `audit_log` → `audit_logs`
- ✅ Aggiunge colonne `ip` e `details` a `audit_logs`
- ✅ **Rimosso**: Campo `timestamp` ridondante (già presente `created_at`)

---

## 🚀 Come Usare gli Script

### Ambiente Sviluppo (pc-mauri-vaio)
```bash
# 1. Inizializzazione completa (database vuoto)
sudo -u postgres psql -d gestionale -f postgres/init/01-init-database.sql

# 2. Se necessario, migrazione da schema vecchio
sudo -u postgres psql -d gestionale -f postgres/init/02-migrate-users-table.sql

# 3. Se necessario, correzioni tabelle
sudo -u postgres psql -d gestionale -f postgres/init/03-fix-tables.sql
```

### Ambiente Produzione (Docker)
```bash
# Gli script vengono eseguiti automaticamente al primo avvio del container
# Posizionati in: ./postgres/init:/docker-entrypoint-initdb.d:ro
```

---

## 🔧 Problemi Risolti

### ✅ Problemi Corretti (2025-08-05)
- **Campo token troppo corto**: Aumentato a VARCHAR(500)
- **Tabella audit_logs mancante**: Creata con colonne corrette
- **Permessi insufficienti**: Grant automatici per gestionale_user
- **Inserimento utenti errato**: Corretto schema (rimosso username, role)
- **Hash password**: Generati correttamente con bcrypt 12 rounds
- **Campo timestamp ridondante**: Rimosso (già presente created_at)

### ✅ Struttura Database Corretta
```sql
-- Tabella users (corretta)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    roles TEXT[] NOT NULL DEFAULT ARRAY['user'],
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella refresh_tokens (corretta)
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,  -- Aumentato da 255
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_revoked BOOLEAN DEFAULT false
);

-- Tabella audit_logs (corretta)
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip VARCHAR(64),           -- Aggiunto
    details TEXT,             -- Aggiunto
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📋 Checklist Verifica

### ✅ Prima di ogni deploy
- [ ] **Script 01**: Eseguito senza errori
- [ ] **Tabelle**: Tutte create correttamente
- [ ] **Utenti**: Admin e utenti custom inseriti
- [ ] **Permessi**: gestionale_user ha accesso a tutte le tabelle
- [ ] **Login**: Test autenticazione funzionante
- [ ] **Backend**: Connessione database OK

### ✅ Test post-inizializzazione
```bash
# Verifica tabelle
sudo -u postgres psql -d gestionale -c "\dt"

# Verifica utenti
sudo -u postgres psql -d gestionale -c "SELECT email, nome, cognome, roles FROM users;"

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gestionale.local","password":"admin123"}'
```

---

## 🔄 Aggiornamenti Futuri

### Quando modificare gli script:
1. **Nuove tabelle**: Aggiungere in `01-init-database.sql`
2. **Modifiche schema**: Aggiungere migrazione in `02-migrate-users-table.sql`
3. **Correzioni**: Aggiungere in `03-fix-tables.sql`
4. **Nuovi utenti**: Aggiungere in `01-init-database.sql`

### Best practice:
- ✅ **Sempre testare** gli script su database di test
- ✅ **Mantenere compatibilità** con dati esistenti
- ✅ **Documentare** ogni modifica
- ✅ **Aggiornare** questo documento

---

**Nota**: Tutti gli script sono stati testati e funzionano correttamente nell'ambiente di sviluppo nativo. 