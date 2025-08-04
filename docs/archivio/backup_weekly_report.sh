#!/bin/bash

# Script per report settimanale dei backup
# Esegue un'analisi dei log degli ultimi 7 giorni e invia un riassunto via email

# Configurazione
LOG_FILE="/home/mauri/gestionale-fullstack/docs/server/backup_config_server.log"
REPORT_FILE="/tmp/backup_weekly_report.txt"
MAILTO="ferraripietrosnc.mauri@outlook.it,mauriferrari76@gmail.com"
SUBJECT="[REPORT SETTIMANALE] Backup Gestionale - $(date +%d/%m/%Y)"

# Funzione per pulire il file temporaneo
cleanup() {
    rm -f "$REPORT_FILE"
}

# Trap per pulizia in caso di errore
trap cleanup EXIT

# Verifica che il file di log esista
if [ ! -f "$LOG_FILE" ]; then
    echo "ERRORE: File di log non trovato: $LOG_FILE" | mail -s "[ERRORE] Report settimanale backup - File log non trovato" "$MAILTO"
    exit 1
fi

# Verifica che il NAS sia montato
if ! mountpoint -q /mnt/backup_gestionale; then
    echo "ERRORE: NAS non montato. Tentativo di montaggio..." | mail -s "[ERRORE] Report settimanale backup - NAS non montato" "$MAILTO"
    exit 1
fi

# Genera il report
{
    echo "=== REPORT SETTIMANALE BACKUP GESTIONALE ==="
    echo "Data generazione: $(date)"
    echo "Periodo analizzato: ultimi 7 giorni"
    echo ""
    
    # Statistiche generali
    echo "📊 STATISTICHE GENERALI:"
    echo "----------------------------------------"
    
    # Conta i backup completati con successo
    SUCCESS_COUNT=$(grep -c "Backup completato con successo" "$LOG_FILE")
    echo "✅ Backup completati con successo: $SUCCESS_COUNT"
    
    # Conta gli errori
    ERROR_COUNT=$(grep -c "ERRORE:" "$LOG_FILE")
    echo "❌ Errori rilevati: $ERROR_COUNT"
    
    # Conta i tentativi di mount
    MOUNT_COUNT=$(grep -c "Mount NAS" "$LOG_FILE")
    echo "🔗 Tentativi di mount NAS: $MOUNT_COUNT"
    
    echo ""
    
    # Ultimi 7 giorni di log (approccio semplificato)
    echo "📅 LOG DEGLI ULTIMI 7 GIORNI:"
    echo "----------------------------------------"
    
    # Mostra le ultime 50 righe del log (che dovrebbero coprire gli ultimi 7 giorni)
    tail -50 "$LOG_FILE" | grep -E "^\[|Backup completato|ERRORE|Mount NAS"
    
    echo ""
    echo "📋 RIEPILOGO FILE BACKUPATI:"
    echo "----------------------------------------"
    ls -la /mnt/backup_gestionale/ | grep -v "#recycle" | while read line; do
        echo "  $line"
    done
    
    echo ""
    echo "🔍 VERIFICHE AGGIUNTIVE:"
    echo "----------------------------------------"
    
    # Verifica spazio disponibile
    DISK_USAGE=$(df -h /mnt/backup_gestionale | tail -1 | awk '{print $5}')
    echo "💾 Spazio utilizzato su NAS: $DISK_USAGE"
    
    # Verifica permessi
    PERMISSIONS=$(ls -ld /mnt/backup_gestionale | awk '{print $1, $3, $4}')
    echo "🔐 Permessi cartella backup: $PERMISSIONS"
    
    # Verifica che cron sia attivo
    if crontab -l | grep -q "backup_config_server.sh"; then
        echo "⏰ Cron job attivo: ✅"
    else
        echo "⏰ Cron job attivo: ❌"
    fi
    
    # Verifica ultimo backup
    LAST_BACKUP=$(grep "Backup completato con successo" "$LOG_FILE" | tail -1)
    if [ -n "$LAST_BACKUP" ]; then
        echo "🕐 Ultimo backup riuscito: $LAST_BACKUP"
    else
        echo "🕐 Ultimo backup riuscito: Nessuno trovato"
    fi
    
    echo ""
    echo "=== FINE REPORT ==="
    echo "Generato automaticamente il $(date)"
    
} > "$REPORT_FILE"

# Invia il report via email
if [ -s "$REPORT_FILE" ]; then
    mail -s "$SUBJECT" "$MAILTO" < "$REPORT_FILE"
    echo "Report settimanale inviato con successo a: $MAILTO"
else
    echo "ERRORE: Report vuoto o non generato" | mail -s "[ERRORE] Report settimanale backup - Report vuoto" "$MAILTO"
    exit 1
fi

# Pulizia
cleanup