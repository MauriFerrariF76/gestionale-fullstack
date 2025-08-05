-- Script di inizializzazione database Gestionale
-- Versione: 1.1 (2025-08-05)
-- Descrizione: Crea le tabelle principali del sistema e risolve i problemi noti

-- Imposta encoding e locale
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- Crea schema se non esiste
CREATE SCHEMA IF NOT EXISTS public;

-- Tabella utenti (aggiornata per allinearsi con lo schema documentato)
CREATE TABLE IF NOT EXISTS users (
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

-- Tabella clienti
CREATE TABLE IF NOT EXISTS clienti (
    id SERIAL PRIMARY KEY,
    "IdCliente" VARCHAR(20) UNIQUE NOT NULL,
    "CodiceMT" VARCHAR(20),
    "RagioneSocialeC" VARCHAR(200) NOT NULL,
    "ReferenteC" VARCHAR(100),
    "IndirizzoC" TEXT,
    "CAPc" VARCHAR(10),
    "CITTAc" VARCHAR(100),
    "PROVc" VARCHAR(10),
    "NAZc" VARCHAR(50),
    "IndirizzoC2" TEXT,
    "CAPc2" VARCHAR(10),
    "CITTAc2" VARCHAR(100),
    "PROVc2" VARCHAR(10),
    "NAZc2" VARCHAR(50),
    "IndirizzoC3" TEXT,
    "CAPc3" VARCHAR(10),
    "CITTAc3" VARCHAR(100),
    "PROVc3" VARCHAR(10),
    "NAZc3" VARCHAR(50),
    "IntestazioneSpedFat" VARCHAR(200),
    "IndirizzoC4" TEXT,
    "CAPc4" VARCHAR(10),
    "CITTAc4" VARCHAR(100),
    "PROVc4" VARCHAR(10),
    "SelezioneSpedFat" BOOLEAN DEFAULT false,
    "NoteSpedFat" TEXT,
    "DescrizionePagamentoC" VARCHAR(100),
    "MetodoPagamentoC" VARCHAR(20),
    "CondizioniPagamentoC" VARCHAR(20),
    "ResaC" VARCHAR(20),
    "TrasportoC" VARCHAR(50),
    "EffettivoPotenziale" VARCHAR(20),
    "CategoriaMerceologica" VARCHAR(100),
    "AttivoC" BOOLEAN DEFAULT true,
    "AttivoDalC" DATE,
    "NonAttivoDalC" DATE,
    "AnnoUltimoVendita" VARCHAR(4),
    "Telefono" VARCHAR(20),
    "Fax" VARCHAR(20),
    "Modem" VARCHAR(20),
    "CodiceFiscale" VARCHAR(20),
    "PartitaIva" VARCHAR(20),
    "BancaAppoggio" VARCHAR(100),
    "CodicePagamento" VARCHAR(20),
    "SitoInternet" VARCHAR(200),
    "EsenzioneIva" VARCHAR(50),
    "EmailFatturazione" VARCHAR(100),
    "CodiceFornitore" VARCHAR(20),
    "CIN" VARCHAR(1),
    "ABI" VARCHAR(5),
    "CAB" VARCHAR(5),
    "CC" VARCHAR(20),
    "CodiceIBAN" VARCHAR(30),
    "TipoSpedizioneC" VARCHAR(20),
    "Articolo15" VARCHAR(50),
    "NostraBancaAppoggioC" VARCHAR(100),
    "IBANnostraBancaC" VARCHAR(30),
    "PercorsoCliente" VARCHAR(200),
    "PercorsoPDFClienteC" VARCHAR(200),
    "PercorsoDXFClienteC" VARCHAR(200),
    "Privato" BOOLEAN DEFAULT false,
    "IVA" VARCHAR(10),
    "EmailCertificati" VARCHAR(100),
    "CodiceSDI" VARCHAR(20),
    "PECcliente" VARCHAR(100),
    "SpeseBancarie" VARCHAR(10),
    "RichiesteCliente" TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella fornitori
CREATE TABLE IF NOT EXISTS fornitori (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    vat_number VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella commesse
CREATE TABLE IF NOT EXISTS commesse (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    client_id INTEGER REFERENCES clienti(id),
    status VARCHAR(20) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella dipendenti
CREATE TABLE IF NOT EXISTS dipendenti (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    position VARCHAR(50),
    hire_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella audit_logs (nuova, con colonne ip e details)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip VARCHAR(64),
    details TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella refresh_tokens aggiornata (token più lungo)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_revoked BOOLEAN DEFAULT false
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_clienti_idcliente ON clienti("IdCliente");
CREATE INDEX IF NOT EXISTS idx_clienti_ragionesociale ON clienti("RagioneSocialeC");
CREATE INDEX IF NOT EXISTS idx_fornitori_name ON fornitori(name);
CREATE INDEX IF NOT EXISTS idx_commesse_client_id ON commesse(client_id);
CREATE INDEX IF NOT EXISTS idx_commesse_status ON commesse(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- GRANT permessi a gestionale_user su tutte le tabelle e sequenze
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE public.' || quote_ident(r.tablename) || ' TO gestionale_user;';
    END LOOP;
    FOR r IN SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public' LOOP
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE public.' || quote_ident(r.sequence_name) || ' TO gestionale_user;';
    END LOOP;
END $$;

-- Esempio: inserimento utente admin (password: admin123, hash generato con bcrypt 12 rounds)
-- Sostituisci l'hash con quello desiderato se vuoi cambiare la password
INSERT INTO users (email, nome, cognome, password_hash, roles, is_active)
VALUES ('admin@gestionale.local', 'Admin', 'Sistema', '$2b$12$Mmk23P3lmwQo55r0znDLX.TftC/ESJ3mkl7Kg47cH7ZepYPB2lfW6', ARRAY['admin'], true)
ON CONFLICT (email) DO NOTHING;

-- Esempio: inserimento utente custom (password: gigi, hash generato con bcrypt 12 rounds)
INSERT INTO users (email, nome, cognome, password_hash, roles, is_active)
VALUES ('mauriferrari76@gmail.com', 'Mauri', 'Ferrari', '$2b$12$G36z0pT60MGC47K4XGUbfOgk336TIfrbRnwrNahgYIhjJ35upnZiW', ARRAY['admin'], true)
ON CONFLICT (email) DO NOTHING;

-- Messaggio di conferma
DO $$
BEGIN
    RAISE NOTICE 'Database inizializzato con successo!';
    RAISE NOTICE 'Utente admin creato: email=admin@gestionale.local, password=admin123';
    RAISE NOTICE 'Utente Mauri creato: email=mauriferrari76@gmail.com, password=gigi';
END $$; 