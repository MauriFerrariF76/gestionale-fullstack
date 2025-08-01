# 🧪 Test Deploy VM - Gestionale Fullstack

## 📋 Panoramica

Hai tutto il necessario per testare il deploy del gestionale sulla VM `10.10.10.43` seguendo la guida di produzione. Questa documentazione ti guiderà attraverso il processo completo.

## 📚 Documentazione Disponibile

### 1. **Guida Completa** - `guida-test-vm-deploy.md`
- Procedura dettagliata passo-passo
- Tutti i comandi necessari
- Spiegazioni approfondite
- Troubleshooting specifico per VM

### 2. **Checklist Dettagliata** - `checklist-test-vm-deploy.md`
- Checklist completa con 9 fasi
- Spazio per documentare problemi
- Sezioni per note operative
- Validazione finale

### 3. **Riassunto Rapido** - `riassunto-test-vm.md`
- Procedura condensata
- Comandi essenziali
- Verifiche rapide
- Troubleshooting comune

### 4. **Script Automatizzato** - `scripts/test_vm_deploy.sh`
- Controlli automatici
- Menu interattivo
- Generazione report
- Test completo con `--full`

## 🚀 Inizia il Test

### Opzione 1: Procedura Rapida
```bash
# Segui il riassunto
docs/MANUALE/riassunto-test-vm.md
```

### Opzione 2: Procedura Completa
```bash
# Segui la guida dettagliata
docs/MANUALE/guida-test-vm-deploy.md
```

### Opzione 3: Checklist Guidata
```bash
# Usa la checklist
docs/MANUALE/checklist-test-vm-deploy.md
```

## 🛠️ Script di Supporto

### Test Automatico
```bash
# Test completo automatico
./scripts/test_vm_deploy.sh --full

# Menu interattivo
./scripts/test_vm_deploy.sh
```

### Installazione
```bash
# Installa Docker
./scripts/install_docker.sh

# Setup completo
./scripts/setup_docker.sh

# Setup segreti
./scripts/setup_secrets.sh
```

## 📊 Verifiche Essenziali

### Connettività
```bash
ping -c 3 10.10.10.1    # Gateway
ping -c 3 8.8.8.8        # Internet
ssh mauri@10.10.10.43    # Accesso VM
```

### Servizi
```bash
docker-compose ps         # Stato servizi
curl http://localhost:3001/health  # Backend
curl http://localhost:3000         # Frontend
```

### Accesso Esterno
```bash
# Dal PC-MAURI:
curl http://10.10.10.43:3000      # Frontend
curl http://10.10.10.43:3001/health  # Backend
```

## 🎯 Risultato Atteso

Dopo il test completo dovresti avere:
- ✅ VM `10.10.10.43` accessibile
- ✅ Gestionale funzionante su porte 3000 e 3001
- ✅ Accesso da PC-MAURI via browser
- ✅ Tutti i servizi Docker attivi
- ✅ Report di test generato

## 📝 Documentazione

### Prima del Test
1. **Leggi** la guida completa
2. **Stampa** la checklist
3. **Prepara** la VM con Ubuntu Server 22.04.3 LTS
4. **Configura** IP statico `10.10.10.43`

### Durante il Test
1. **Segui** la procedura passo-passo
2. **Spunta** i punti della checklist
3. **Documenta** eventuali problemi
4. **Usa** lo script di test per verifiche

### Dopo il Test
1. **Completa** la checklist
2. **Genera** il report finale
3. **Aggiorna** la documentazione se necessario
4. **Prepara** il deploy produzione

## ⚠️ Note Importanti

### Differenze VM vs Produzione
- **IP**: `10.10.10.43` (test) vs `10.10.10.15` (produzione)
- **Hostname**: `gestionale-vm-test` vs `gestionale-server`
- **Password**: `solita` (solo per test)
- **Risorse**: Limitazioni VM vs Server fisico

### Sicurezza per Test
- Password semplificata per facilità
- Firewall configurazione base
- Backup non critico
- Ambiente isolato

## 🔧 Troubleshooting

### Problemi Comuni
1. **Rete non funziona**: Verifica configurazione bridge adapter
2. **Docker non si avvia**: Verifica permessi e spazio disco
3. **Servizi non rispondono**: Controlla log e porte
4. **Accesso esterno fallisce**: Verifica firewall e routing

### Comandi di Emergenza
```bash
# Reset completo
docker-compose down -v
docker system prune -a
./scripts/setup_docker.sh

# Verifica log
docker-compose logs --tail=50

# Test connettività
./scripts/test_vm_deploy.sh --full
```

## 📅 Timeline Suggerita

### Giorno 1: Preparazione
- [ ] Leggi tutta la documentazione
- [ ] Prepara la VM
- [ ] Configura rete
- [ ] Testa connettività

### Giorno 2: Installazione
- [ ] Installa Ubuntu Server
- [ ] Configura sistema
- [ ] Ottieni progetto
- [ ] Installa Docker

### Giorno 3: Deploy e Test
- [ ] Deploy applicazione
- [ ] Test funzionalità
- [ ] Verifica accesso esterno
- [ ] Genera report

### Giorno 4: Documentazione
- [ ] Completa checklist
- [ ] Documenta problemi
- [ ] Aggiorna guide se necessario
- [ ] Prepara deploy produzione

## 🎯 Prossimi Passi

1. **Inizia** con il riassunto per una visione d'insieme
2. **Segui** la guida completa per i dettagli
3. **Usa** la checklist per non perdere nulla
4. **Esegui** lo script di test per verifiche automatiche
5. **Documenta** tutto per il deploy produzione

---

**Hai tutto il necessario per un test completo e professionale! 🚀**

**Buon test!** 