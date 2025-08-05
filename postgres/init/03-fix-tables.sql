-- Script per correggere i problemi delle tabelle
-- Versione: 1.0
-- Descrizione: Corregge i problemi identificati nelle tabelle

-- Espande il campo token in refresh_tokens per supportare JWT lunghi
ALTER TABLE refresh_tokens ALTER COLUMN token TYPE VARCHAR(500);

-- Rinomina audit_log in audit_logs per allinearsi con il codice
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_log') 
    AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
        ALTER TABLE audit_log RENAME TO audit_logs;
        RAISE NOTICE 'Tabella audit_log rinominata in audit_logs';
    ELSE
        RAISE NOTICE 'Tabella audit_logs già esistente o audit_log non trovata';
    END IF;
END $$;

-- Aggiunge il campo ip se mancante in audit_logs
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') 
    AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'ip') THEN
        ALTER TABLE audit_logs ADD COLUMN ip VARCHAR(45);
        RAISE NOTICE 'Campo ip aggiunto a audit_logs';
    ELSE
        RAISE NOTICE 'Campo ip già presente o tabella audit_logs non trovata';
    END IF;
END $$;

-- Aggiunge il campo details se mancante in audit_logs
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') 
    AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'details') THEN
        ALTER TABLE audit_logs ADD COLUMN details TEXT;
        RAISE NOTICE 'Campo details aggiunto a audit_logs';
    ELSE
        RAISE NOTICE 'Campo details già presente o tabella audit_logs non trovata';
    END IF;
END $$;

-- Nota: Il campo created_at è già presente e sufficiente per il timestamp
-- Non serve aggiungere un campo timestamp separato 