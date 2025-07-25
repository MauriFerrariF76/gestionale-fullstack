#!/bin/bash
# Backup automatico delle configurazioni server gestionale su NAS Synology
# Autore: AI + Mauri
# Ultima modifica: $(date +%Y-%m-%d)

SRC="/home/mauri/gestionale-fullstack/docs/server/"
DEST="/mnt/backup_gestionale/"
LOG="/home/mauri/gestionale-fullstack/docs/server/backup_config_server.log"
MOUNTPOINT="/mnt/backup_gestionale"
NAS_SHARE="//10.10.10.21/backup_gestionale"
CREDENTIALS="/root/.nas_gestionale_creds"

# Monta la cartella NAS se non già montata
if ! mountpoint -q "$MOUNTPOINT"; then
  echo "[$(date)] Mount NAS..." | tee -a "$LOG"
  sudo mount -t cifs "$NAS_SHARE" "$MOUNTPOINT" -o credentials="$CREDENTIALS",iocharset=utf8,vers=2.0
  if [ $? -ne 0 ]; then
    echo "[$(date)] ERRORE: mount NAS fallito!" | tee -a "$LOG"
    exit 1
  fi
fi

# Sincronizza le configurazioni
rsync -av --delete --exclude='#recycle' "$SRC" "$DEST" | tee -a "$LOG"

# (Opzionale) Smonta dopo il backup
# sudo umount "$MOUNTPOINT"

echo "[$(date)] Backup completato con successo." | tee -a "$LOG" 