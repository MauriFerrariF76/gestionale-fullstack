#!/bin/bash

# Script per fermare ambiente sviluppo NATIVO
echo "🛑 Fermando ambiente sviluppo NATIVO..."

# Ferma processi Node.js
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "ts-node" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Ferma PostgreSQL (opzionale)
read -p "Fermare PostgreSQL? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo systemctl stop postgresql
    echo "📊 PostgreSQL fermato"
fi

echo "✅ Ambiente sviluppo NATIVO fermato"
