#!/bin/bash

# Script per ottimizzare le prestazioni del gestionale
echo "🚀 Ottimizzazione prestazioni in corso..."

# Funzione per verificare se un comando esiste
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. OTTIMIZZAZIONI SISTEMA
echo "📊 Ottimizzazioni sistema..."

# Ottimizza la memoria swap
if command_exists swapon; then
    echo "🔄 Ottimizzazione swap..."
    sudo swapon --show 2>/dev/null || sudo swapon /swapfile 2>/dev/null || true
fi

# Ottimizza il filesystem
echo "💾 Ottimizzazione filesystem..."
sudo sync
sudo echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || true

# 2. OTTIMIZZAZIONI NODE.JS
echo "⚡ Ottimizzazioni Node.js..."

# Imposta variabili ambiente per ottimizzare Node.js
export NODE_OPTIONS="--max-old-space-size=2048 --optimize-for-size"
export UV_THREADPOOL_SIZE=4

# 3. OTTIMIZZAZIONI POSTGRESQL
echo "🐘 Ottimizzazioni PostgreSQL..."

# Verifica se PostgreSQL è attivo
if sudo systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL è attivo"
    
    # Ottimizza le query PostgreSQL
    sudo -u postgres psql -c "VACUUM ANALYZE;" 2>/dev/null || true
    sudo -u postgres psql -c "REINDEX DATABASE gestionale;" 2>/dev/null || true
else
    echo "⚠️ PostgreSQL non è attivo"
fi

# 4. OTTIMIZZAZIONI NETWORK
echo "🌐 Ottimizzazioni network..."

# Ottimizza le impostazioni TCP
echo "net.core.rmem_max = 16777216" | sudo tee -a /etc/sysctl.conf >/dev/null 2>&1 || true
echo "net.core.wmem_max = 16777216" | sudo tee -a /etc/sysctl.conf >/dev/null 2>&1 || true
echo "net.ipv4.tcp_rmem = 4096 87380 16777216" | sudo tee -a /etc/sysctl.conf >/dev/null 2>&1 || true
echo "net.ipv4.tcp_wmem = 4096 65536 16777216" | sudo tee -a /etc/sysctl.conf >/dev/null 2>&1 || true

# Applica le modifiche
sudo sysctl -p 2>/dev/null || true

# 5. OTTIMIZZAZIONI DISCO
echo "💿 Ottimizzazioni disco..."

# Verifica spazio disco
df -h | grep -E "(/$|/home)"

# Pulisci cache temporanee
echo "🧹 Pulizia cache..."
sudo rm -rf /tmp/* 2>/dev/null || true
sudo rm -rf /var/tmp/* 2>/dev/null || true

# 6. MONITORAGGIO PRESTAZIONI
echo "📈 Monitoraggio prestazioni..."

# Mostra statistiche sistema
echo "=== STATISTICHE SISTEMA ==="
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "Memoria: $(free -m | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"
echo "Disco: $(df -h / | awk 'NR==2{print $5}')"

# 7. RACCOMANDAZIONI
echo ""
echo "🎯 RACCOMANDAZIONI PER PRESTAZIONI OTTIMALI:"
echo "1. Chiudi applicazioni non necessarie"
echo "2. Usa la modalità produzione per il frontend: npm run build && npm start"
echo "3. Considera l'uso di PM2 per gestire i processi Node.js"
echo "4. Monitora regolarmente l'uso di memoria e CPU"
echo "5. Ottimizza le query del database con indici appropriati"

echo ""
echo "✅ Ottimizzazione completata!"
echo "🔄 Riavvia i servizi per applicare tutte le ottimizzazioni" 