#!/bin/bash
# Test restore backup database PostgreSQL gestionale - Versione dinamica
# Autore: AI + Mauri
# Ultima modifica: $(date +%Y-%m-%d)
# Questo script testa il restore di un backup in un database temporaneo
# Si adatta automaticamente a tutte le tabelle presenti

# Configurazione
DB_NAME="gestionale_ferrari"
DB_USER="gestionale_user"
BACKUP_DIR="/mnt/backup_gestionale/database"
LOG="/home/mauri/gestionale-fullstack/docs/server/test_restore_backup_dynamic.log"
TEST_DB_NAME="gestionale_test_restore"
MAILTO="ferraripietrosnc.mauri@outlook.it,mauriferrari76@gmail.com"

# Imposta variabile per password file (sicuro)
export PGPASSFILE=~/.pgpass

echo "[$(date)] Inizio test restore dinamico backup database" | tee -a "$LOG"

# Trova l'ultimo backup disponibile
LATEST_BACKUP=$(find "$BACKUP_DIR" -name "gestionale_db_*.backup" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)

if [ -z "$LATEST_BACKUP" ]; then
  echo "[$(date)] ERRORE: Nessun backup trovato in $BACKUP_DIR" | tee -a "$LOG"
  mail -s "[ERRORE] Test Restore: Nessun backup trovato" "$MAILTO" < "$LOG"
  exit 1
fi

echo "[$(date)] Backup da testare: $LATEST_BACKUP" | tee -a "$LOG"

# Crea database temporaneo per il test usando postgres
echo "[$(date)] Creazione database temporaneo $TEST_DB_NAME..." | tee -a "$LOG"

# Elimina il database temporaneo se esiste già
sudo -u postgres dropdb "$TEST_DB_NAME" 2>/dev/null || true

# Crea il nuovo database temporaneo
sudo -u postgres createdb "$TEST_DB_NAME" 2>&1 | tee -a "$LOG"

if [ $? -ne 0 ]; then
  echo "[$(date)] ERRORE: Impossibile creare database temporaneo" | tee -a "$LOG"
  mail -s "[ERRORE] Test Restore: Creazione database temporaneo fallita" "$MAILTO" < "$LOG"
  exit 2
fi

# Dai permessi all'utente gestionale_user nel database temporaneo
echo "[$(date)] Configurazione permessi utente..." | tee -a "$LOG"
sudo -u postgres psql -d "$TEST_DB_NAME" -c "GRANT ALL PRIVILEGES ON DATABASE $TEST_DB_NAME TO $DB_USER;" 2>&1 | tee -a "$LOG"
sudo -u postgres psql -d "$TEST_DB_NAME" -c "GRANT ALL PRIVILEGES ON SCHEMA public TO $DB_USER;" 2>&1 | tee -a "$LOG"
sudo -u postgres psql -d "$TEST_DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;" 2>&1 | tee -a "$LOG"
sudo -u postgres psql -d "$TEST_DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;" 2>&1 | tee -a "$LOG"
sudo -u postgres psql -d "$TEST_DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;" 2>&1 | tee -a "$LOG"
sudo -u postgres psql -d "$TEST_DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;" 2>&1 | tee -a "$LOG"

# Esegui restore nel database temporaneo
echo "[$(date)] Esecuzione restore nel database temporaneo..." | tee -a "$LOG"
pg_restore -U "$DB_USER" -h localhost -d "$TEST_DB_NAME" -v "$LATEST_BACKUP" 2>&1 | tee -a "$LOG"
RESTORE_EXIT_CODE=${PIPESTATUS[0]}

if [ $RESTORE_EXIT_CODE -ne 0 ]; then
  echo "[$(date)] ERRORE: Restore fallito! Codice: $RESTORE_EXIT_CODE" | tee -a "$LOG"
  # Pulisci database temporaneo
  sudo -u postgres dropdb "$TEST_DB_NAME" 2>/dev/null
  mail -s "[ERRORE] Test Restore: Restore fallito (codice $RESTORE_EXIT_CODE)" "$MAILTO" < "$LOG"
  exit 3
fi

# Test di connessione e query base
echo "[$(date)] Test connessione e query base..." | tee -a "$LOG"
psql -U "$DB_USER" -h localhost -d "$TEST_DB_NAME" -c "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';" 2>&1 | tee -a "$LOG"

# Test dinamico su TUTTE le tabelle presenti (non solo quelle specifiche)
echo "[$(date)] Test dinamico su tutte le tabelle..." | tee -a "$LOG"
psql -U "$DB_USER" -h localhost -d "$TEST_DB_NAME" -c "
SELECT 
    t.table_name,
    COALESCE(s.n_tup_ins, 0) as record_count
FROM information_schema.tables t
LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
WHERE t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name;
" 2>&1 | tee -a "$LOG"

# Test funzioni e stored procedures
echo "[$(date)] Test funzioni e stored procedures..." | tee -a "$LOG"
psql -U "$DB_USER" -h localhost -d "$TEST_DB_NAME" -c "
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;
" 2>&1 | tee -a "$LOG"

# Test triggers
echo "[$(date)] Test triggers..." | tee -a "$LOG"
psql -U "$DB_USER" -h localhost -d "$TEST_DB_NAME" -c "
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY trigger_name;
" 2>&1 | tee -a "$LOG"

# Pulisci database temporaneo
echo "[$(date)] Pulizia database temporaneo..." | tee -a "$LOG"
sudo -u postgres dropdb "$TEST_DB_NAME" 2>&1 | tee -a "$LOG"

echo "[$(date)] Test restore dinamico completato con successo!" | tee -a "$LOG"

# Invia email di successo (opzionale)
# mail -s "[SUCCESSO] Test Restore: Backup verificato" "$MAILTO" <<< "Il backup $LATEST_BACKUP è stato testato con successo."