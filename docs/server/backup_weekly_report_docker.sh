#!/bin/bash

# Script per report settimanale dei backup Docker
# Esegue un'analisi dei log degli ultimi 7 giorni e invia un riassunto via email

# Configurazione
LOG_FILE="/home/mauri/gestionale-fullstack/docs/server/backup_docker.log"
REPORT_FILE="/tmp/backup_weekly_report_docker.txt"
MAILTO="ferraripietrosnc.mauri@outlook.it,mauriferrari76@gmail.com"
SUBJECT="[REPORT SETTIMANALE DOCKER] Backup Gestionale - $(date +%d/%m/%Y)"
CONTAINER_NAME="gestionale_postgres"

# Funzione per pulire il file temporaneo
cleanup() {
    rm -f "$REPORT_FILE"
}

# Trap per pulizia in caso di errore
trap cleanup EXIT

# Verifica che il file di log esista
if [ ! -f "$LOG_FILE" ]; then
    echo "ERRORE: File di log Docker non trovato: $LOG_FILE" | mail -s "[ERRORE] Report settimanale backup Docker - File log non trovato" "$MAILTO"
    exit 1
fi

# Verifica che il NAS sia montato
if ! mountpoint -q /mnt/backup_gestionale; then
    echo "ERRORE: NAS non montato. Tentativo di montaggio..." | mail -s "[ERRORE] Report settimanale backup Docker - NAS non montato" "$MAILTO"
    exit 1
fi

# Genera il report
{
    echo "=== REPORT SETTIMANALE BACKUP DOCKER GESTIONALE ==="
    echo "Data generazione: $(date)"
    echo "Periodo analizzato: ultimi 7 giorni"
    echo "Modalità: Docker"
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
    
    # Conta i test restore
    RESTORE_COUNT=$(grep -c "Test restore Docker completato" "$LOG_FILE")
    echo "🔄 Test restore eseguiti: $RESTORE_COUNT"
    
    echo ""
    
    # Ultimi 7 giorni di log (approccio semplificato)
    echo "📅 LOG DEGLI ULTIMI 7 GIORNI:"
    echo "----------------------------------------"
    
    # Mostra le ultime 50 righe del log (che dovrebbero coprire gli ultimi 7 giorni)
    tail -50 "$LOG_FILE" | grep -E "^\[|Backup completato|ERRORE|Mount NAS|Test restore"
    
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
    if crontab -l | grep -q "backup_docker_automatic.sh"; then
        echo "⏰ Cron job Docker attivo: ✅"
    else
        echo "⏰ Cron job Docker attivo: ❌"
    fi
    
    # Verifica stato container
    CONTAINER_STATUS=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep "$CONTAINER_NAME")
    echo "🐳 Stato container PostgreSQL: $CONTAINER_STATUS"
    
    # Verifica ultimo backup
    LAST_BACKUP=$(grep "Backup completato con successo" "$LOG_FILE" | tail -1)
    if [ -n "$LAST_BACKUP" ]; then
        echo "🕐 Ultimo backup riuscito: $LAST_BACKUP"
    else
        echo "🕐 Ultimo backup riuscito: Nessuno trovato"
    fi
    
    # Verifica ultimo test restore
    LAST_RESTORE=$(grep "Test restore Docker completato" "$LOG_FILE" | tail -1)
    if [ -n "$LAST_RESTORE" ]; then
        echo "🔄 Ultimo test restore: $LAST_RESTORE"
    else
        echo "🔄 Ultimo test restore: Nessuno trovato"
    fi
    
    echo ""
    echo "🔧 STATO SISTEMA DOCKER:"
    echo "----------------------------------------"
    
    # Verifica spazio disco Docker
    DOCKER_DISK=$(docker system df | grep "Total Space")
    echo "💾 Spazio Docker utilizzato: $DOCKER_DISK"
    
    # Verifica container attivi
    ACTIVE_CONTAINERS=$(docker ps --format "{{.Names}}" | wc -l)
    echo "🐳 Container attivi: $ACTIVE_CONTAINERS"
    
    # Verifica immagini Docker
    DOCKER_IMAGES=$(docker images | wc -l)
    echo "📦 Immagini Docker: $((DOCKER_IMAGES - 1))"
    
    echo ""
    echo "=== FINE REPORT DOCKER ==="
    echo "Generato automaticamente il $(date)"
    
} > "$REPORT_FILE"

# Invia il report via email
if [ -s "$REPORT_FILE" ]; then
    mail -s "$SUBJECT" "$MAILTO" < "$REPORT_FILE"
    echo "Report settimanale Docker inviato con successo a: $MAILTO"
else
    echo "ERRORE: Report vuoto o non generato" | mail -s "[ERRORE] Report settimanale backup Docker - Report vuoto" "$MAILTO"
    exit 1
fi

# Pulizia
cleanup