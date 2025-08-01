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
    mail -s "[ERRORE] Backup Gestionale: mount NAS fallito" "ferraripietrosnc.mauri@outlook.it,mauriferrari76@gmail.com" < "$LOG"
    exit 1
  fi
fi

# Sincronizza le configurazioni
rsync -av --delete --exclude='#recycle' "$SRC" "$DEST" | tee -a "$LOG"
RSYNC_EXIT_CODE=${PIPESTATUS[0]}
if [ $RSYNC_EXIT_CODE -ne 0 ]; then
  echo "[$(date)] ERRORE: rsync fallito! Codice: $RSYNC_EXIT_CODE" | tee -a "$LOG"
  mail -s "[ERRORE] Backup Gestionale: rsync fallito (codice $RSYNC_EXIT_CODE)" "ferraripietrosnc.mauri@outlook.it,mauriferrari76@gmail.com" < "$LOG"
  exit 2
fi

# Backup chiavi JWT (aggiunto per sicurezza)
echo "[$(date)] Backup chiavi JWT..." | tee -a "$LOG"
JWT_BACKUP="jwt_keys_backup_$(date +%F_%H%M%S).tar.gz"
BACKUP_DIR="/home/mauri/gestionale-fullstack/backup/docker/"
if tar czf "$JWT_BACKUP" backend/config/keys/ 2>/dev/null; then
  if gpg --encrypt --recipient admin@carpenteriaferrari.com "$JWT_BACKUP" 2>/dev/null; then
    rm "$JWT_BACKUP"
    # Sposta backup JWT nella cartella dedicata
    mkdir -p "$BACKUP_DIR"
    mv "$JWT_BACKUP.gpg" "$BACKUP_DIR"/
    cp "$BACKUP_DIR"/"$JWT_BACKUP.gpg" "$DEST"/
    echo "[$(date)] Backup chiavi JWT completato" | tee -a "$LOG"
  else
    echo "[$(date)] ERRORE: cifratura chiavi JWT fallita" | tee -a "$LOG"
    rm -f "$JWT_BACKUP"
  fi
else
  echo "[$(date)] ERRORE: backup chiavi JWT fallito" | tee -a "$LOG"
fi

# (Opzionale) Smonta dopo il backup
# sudo umount "$MOUNTPOINT"

echo "[$(date)] Backup completato con successo." | tee -a "$LOG" 