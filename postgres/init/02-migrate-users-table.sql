-- Script di migrazione per aggiornare la tabella users
-- Versione: 1.0
-- Descrizione: Migra la tabella users dal vecchio schema al nuovo

-- Verifica se la tabella users esiste con il vecchio schema
DO $$
BEGIN
    -- Controlla se esiste la colonna 'username' (vecchio schema)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'username'
    ) THEN
        -- Aggiungi le nuove colonne se non esistono
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'nome'
        ) THEN
            ALTER TABLE users ADD COLUMN nome VARCHAR(100);
            ALTER TABLE users ADD COLUMN cognome VARCHAR(100);
            ALTER TABLE users ADD COLUMN roles TEXT[] DEFAULT ARRAY['user'];
            ALTER TABLE users ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE;
        END IF;

        -- Migra i dati da username a nome
        UPDATE users SET nome = username WHERE nome IS NULL;
        UPDATE users SET cognome = '' WHERE cognome IS NULL;
        UPDATE users SET roles = ARRAY[role] WHERE roles IS NULL;

        -- Espandi il campo email se necessario
        ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(255);

        -- Rimuovi le colonne obsolete (opzionale - commentato per sicurezza)
        -- ALTER TABLE users DROP COLUMN IF EXISTS username;
        -- ALTER TABLE users DROP COLUMN IF EXISTS role;

        RAISE NOTICE 'Migrazione tabella users completata';
    ELSE
        RAISE NOTICE 'Tabella users già aggiornata o non esistente';
    END IF;
END $$; 