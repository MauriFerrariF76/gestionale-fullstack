#!/bin/bash
# Backup automatico delle configurazioni server gestionale su NAS Synology
# Autore: AI + Mauri
# Ultima modifica: $(date +%Y-%m-%d)
# Notifica email in caso di errore: ferraripietrosnc.mauri@outlook.it (cc: mauriferrari@hotmail.com)

SRC="/home/mauri/gestionale-fullstack/docs/server/"
DEST="/mnt/backup_gestionale/"
LOG="/home/mauri/gestionale-fullstack/docs/server/backup_config_server.log"
MOUNTPOINT="/mnt/backup_gestionale"
NAS_SHARE="//10.10.10.21/backup_gestionale"
CREDENTIALS="/root/.nas_gestionale_creds"
MAILTO="ferraripietrosnc.mauri@outlook.it"
MAILCC="mauriferrari@hotmail.com"

# Monta la cartella NAS se non già montata
if ! mountpoint -q "$MOUNTPOINT"; then
  echo "[$(date)] Mount NAS..." | tee -a "$LOG"
  sudo mount -t cifs "$NAS_SHARE" "$MOUNTPOINT" -o credentials="$CREDENTIALS",iocharset=utf8,vers=2.0
  if [ $? -ne 0 ]; then
    echo "[$(date)] ERRORE: mount NAS fallito!" | tee -a "$LOG"
    mail -s "[ERRORE] Backup Gestionale: mount NAS fallito" -c "$MAILCC" "$MAILTO" < "$LOG"
    exit 1
  fi
fi

# Sincronizza le configurazioni
rsync -av --delete --exclude='#recycle' "$SRC" "$DEST" | tee -a "$LOG"
if [ $? -ne 0 ]; then
  echo "[$(date)] ERRORE: rsync fallito!" | tee -a "$LOG"
  mail -s "[ERRORE] Backup Gestionale: rsync fallito" -c "$MAILCC" "$MAILTO" < "$LOG"
  exit 2
fi

# (Opzionale) Smonta dopo il backup
# sudo umount "$MOUNTPOINT"

echo "[$(date)] Backup completato con successo." | tee -a "$LOG" 