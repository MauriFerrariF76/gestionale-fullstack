#!/bin/bash
# Backup automatico database PostgreSQL gestionale - Versione adattiva
# Autore: AI + Mauri
# Ultima modifica: $(date +%Y-%m-%d)
# Questo script si adatta automaticamente alla dimensione del database

# Configurazione
DB_NAME="gestionale_ferrari"
DB_USER="gestionale_user"
BACKUP_DIR="/mnt/backup_gestionale/database"
LOG="/home/mauri/gestionale-fullstack/docs/server/backup_database_adaptive.log"
MOUNTPOINT="/mnt/backup_gestionale"
NAS_SHARE="//10.10.10.21/backup_gestionale"
CREDENTIALS="/root/.nas_gestionale_creds"
MAILTO="ferraripietrosnc.mauri@outlook.it,mauriferrari76@gmail.com"

# Imposta variabile per password file (sicuro)
export PGPASSFILE=~/.pgpass

echo "[$(date)] Inizio backup adattivo database $DB_NAME" | tee -a "$LOG"

# Monta la cartella NAS se non già montata
if ! mountpoint -q "$MOUNTPOINT"; then
  echo "[$(date)] Mount NAS..." | tee -a "$LOG"
  sudo mount -t cifs "$NAS_SHARE" "$MOUNTPOINT" -o credentials="$CREDENTIALS",iocharset=utf8,vers=2.0
  if [ $? -ne 0 ]; then
    echo "[$(date)] ERRORE: mount NAS fallito!" | tee -a "$LOG"
    mail -s "[ERRORE] Backup Database Gestionale: mount NAS fallito" "$MAILTO" < "$LOG"
    exit 1
  fi
fi

# Crea directory backup se non esiste
mkdir -p "$BACKUP_DIR"

# Calcola dimensione database
echo "[$(date)] Calcolo dimensione database..." | tee -a "$LOG"
DB_SIZE=$(psql -U "$DB_USER" -h localhost -d "$DB_NAME" -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" | xargs)
DB_SIZE_BYTES=$(psql -U "$DB_USER" -h localhost -d "$DB_NAME" -t -c "SELECT pg_database_size('$DB_NAME');" | xargs)

echo "[$(date)] Dimensione database: $DB_SIZE ($DB_SIZE_BYTES bytes)" | tee -a "$LOG"

# Determina strategia di backup in base alla dimensione
if [ "$DB_SIZE_BYTES" -gt 1073741824 ]; then
  # Database > 1GB: backup parallelo con compressione
  echo "[$(date)] Database grande (>1GB): backup parallelo con compressione" | tee -a "$LOG"
  BACKUP_OPTIONS="-F c -b -v -Z 9 -j 4"
  BACKUP_TYPE="parallelo_compresso"
elif [ "$DB_SIZE_BYTES" -gt 104857600 ]; then
  # Database > 100MB: backup con compressione
  echo "[$(date)] Database medio (100MB-1GB): backup con compressione" | tee -a "$LOG"
  BACKUP_OPTIONS="-F c -b -v -Z 6"
  BACKUP_TYPE="compresso"
else
  # Database piccolo: backup standard
  echo "[$(date)] Database piccolo (<100MB): backup standard" | tee -a "$LOG"
  BACKUP_OPTIONS="-F c -b -v"
  BACKUP_TYPE="standard"
fi

# Nome file backup con timestamp e tipo
BACKUP_FILE="$BACKUP_DIR/gestionale_db_$(date +%Y%m%d_%H%M%S)_${BACKUP_TYPE}.backup"

# Esegui backup PostgreSQL con opzioni adattive
echo "[$(date)] Esecuzione backup con opzioni: $BACKUP_OPTIONS" | tee -a "$LOG"
pg_dump -U "$DB_USER" -h localhost $BACKUP_OPTIONS -f "$BACKUP_FILE" "$DB_NAME" 2>&1 | tee -a "$LOG"
PGDUMP_EXIT_CODE=${PIPESTATUS[0]}

if [ $PGDUMP_EXIT_CODE -ne 0 ]; then
  echo "[$(date)] ERRORE: pg_dump fallito! Codice: $PGDUMP_EXIT_CODE" | tee -a "$LOG"
  mail -s "[ERRORE] Backup Database Gestionale: pg_dump fallito (codice $PGDUMP_EXIT_CODE)" "$MAILTO" < "$LOG"
  exit 2
fi

# Verifica dimensione file backup
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
BACKUP_SIZE_BYTES=$(du -b "$BACKUP_FILE" | cut -f1)
COMPRESSION_RATIO=$(echo "scale=2; $BACKUP_SIZE_BYTES * 100 / $DB_SIZE_BYTES" | bc -l 2>/dev/null || echo "N/A")

echo "[$(date)] Backup completato: $BACKUP_FILE" | tee -a "$LOG"
echo "[$(date)] Dimensione backup: $BACKUP_SIZE (compressione: ${COMPRESSION_RATIO}%)" | tee -a "$LOG"

# Pulisci backup vecchi (mantieni ultimi 7 giorni)
echo "[$(date)] Pulizia backup vecchi..." | tee -a "$LOG"
find "$BACKUP_DIR" -name "gestionale_db_*.backup" -mtime +7 -delete 2>&1 | tee -a "$LOG"

# Conta file backup rimanenti
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "gestionale_db_*.backup" | wc -l)
TOTAL_BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

echo "[$(date)] Backup rimanenti: $BACKUP_COUNT (spazio totale: $TOTAL_BACKUP_SIZE)" | tee -a "$LOG"

# Alert se lo spazio backup supera 10GB
BACKUP_SIZE_GB=$(echo "scale=2; $TOTAL_BACKUP_SIZE_BYTES / 1073741824" | bc -l 2>/dev/null || echo "0")
if [ "$(echo "$BACKUP_SIZE_GB > 10" | bc -l 2>/dev/null || echo "0")" = "1" ]; then
  echo "[$(date)] ATTENZIONE: Spazio backup > 10GB ($BACKUP_SIZE_GB GB)" | tee -a "$LOG"
  mail -s "[ATTENZIONE] Backup Database: Spazio eccessivo ($BACKUP_SIZE_GB GB)" "$MAILTO" <<< "Lo spazio occupato dai backup ha superato 10GB. Considera di ridurre la retention o aumentare lo spazio disponibile."
fi

echo "[$(date)] Backup adattivo completato con successo." | tee -a "$LOG"