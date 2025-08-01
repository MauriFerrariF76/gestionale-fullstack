# 🎯 Riassunto Test Deploy VM - Gestionale Fullstack

## 📋 Scenario
- **VM Target**: `10.10.10.43` (VM di test)
- **PC Sorgente**: `10.10.10.33` (PC-MAURI)
- **Obiettivo**: Testare il deploy completo seguendo la guida di produzione

## 🚀 Procedura Rapida

### 1. Preparazione PC-MAURI
```bash
# Backup progetto
cd /home/mauri/gestionale-fullstack
git add .
git commit -m "Backup pre-test VM deploy"
git push

# Test connettività VM
ping -c 3 10.10.10.43
```

### 2. Installazione Ubuntu Server sulla VM
1. **Crea VM** con Ubuntu Server 22.04.3 LTS
2. **Configura rete**: IP `10.10.10.43`, Gateway `10.10.10.1`
3. **Configura sistema**: Hostname `gestionale-vm-test`, User `mauri`, Password `solita`
4. **Installa SSH** durante l'installazione

### 3. Configurazione rete VM
```bash
# Verifica configurazione
hostname  # deve essere: gestionale-vm-test
whoami    # deve essere: mauri
ip addr show  # deve mostrare: 10.10.10.43

# Test connettività
ping -c 3 10.10.10.1
ping -c 3 8.8.8.8

# Test da PC-MAURI
# Dal PC-MAURI esegui:
ssh mauri@10.10.10.43
```

### 4. Ottenere progetto sulla VM
```bash
# Metodo Git (preferito)
cd /home/mauri
git clone https://ghp_YOUR_TOKEN@github.com/MauriFerrariF76/gestionale-fullstack.git
cd gestionale-fullstack

# Metodo SCP (fallback)
# Dal PC-MAURI:
cd /home/mauri/gestionale-fullstack
tar -czf gestionale-fullstack.tar.gz .
scp gestionale-fullstack.tar.gz mauri@10.10.10.43:/home/mauri/

# Dalla VM:
cd /home/mauri
tar -xzf gestionale-fullstack.tar.gz
cd gestionale-fullstack
```

### 5. Installazione Docker
```bash
# Installa Docker
./scripts/install_docker.sh

# Verifica installazione
docker --version
docker-compose --version
docker run hello-world

# Setup Docker
./scripts/setup_docker.sh
```

### 6. Deploy applicazione
```bash
# Avvia servizi
docker-compose up -d

# Verifica stato
docker-compose ps

# Test funzionalità
curl http://localhost:3001/health
curl http://localhost:3000
```

### 7. Test completo
```bash
# Usa script di test
./scripts/test_vm_deploy.sh --full

# Oppure menu interattivo
./scripts/test_vm_deploy.sh
```

## 📋 Checklist Rapida

### ✅ Prerequisiti
- [ ] VM creata con Ubuntu Server 22.04.3 LTS
- [ ] IP configurato: `10.10.10.43`
- [ ] SSH accessibile da PC-MAURI
- [ ] Progetto clonato su VM

### ✅ Installazione
- [ ] Docker installato e funzionante
- [ ] Docker Compose installato
- [ ] Segreti configurati
- [ ] Servizi avviati

### ✅ Test
- [ ] Backend API risponde
- [ ] Frontend accessibile
- [ ] Database funzionante
- [ ] Accesso esterno funziona

## 🛠️ Script di Supporto

### Script principale
```bash
# Test completo automatico
./scripts/test_vm_deploy.sh --full

# Menu interattivo
./scripts/test_vm_deploy.sh
```

### Script di installazione
```bash
# Installa Docker
./scripts/install_docker.sh

# Setup completo
./scripts/setup_docker.sh

# Setup segreti
./scripts/setup_secrets.sh
```

## 📊 Verifiche Rapide

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

### Accesso esterno
```bash
# Dal PC-MAURI:
curl http://10.10.10.43:3000      # Frontend
curl http://10.10.10.43:3001/health  # Backend
```

## ⚠️ Troubleshooting

### Se la rete non funziona
```bash
# Verifica configurazione
sudo nano /etc/netplan/00-installer-config.yaml

# Applica configurazione
sudo netplan apply
```

### Se Docker non si avvia
```bash
# Verifica permessi
sudo usermod -aG docker mauri
# Riloggati
exit
ssh mauri@10.10.10.43
```

### Se i servizi non rispondono
```bash
# Verifica log
docker-compose logs

# Riavvia servizi
docker-compose down
docker-compose up -d
```

## 📝 Documentazione

### File di riferimento
- **Guida completa**: `docs/MANUALE/guida-test-vm-deploy.md`
- **Checklist**: `docs/MANUALE/checklist-test-vm-deploy.md`
- **Script test**: `scripts/test_vm_deploy.sh`

### Report automatico
```bash
# Genera report
./scripts/test_vm_deploy.sh --full

# Report salvato in: /home/mauri/test-vm-report-YYYYMMDD_HHMMSS.txt
```

## 🎯 Risultato Atteso

Dopo il test completo, dovresti avere:
- ✅ VM `10.10.10.43` accessibile
- ✅ Gestionale funzionante su porte 3000 e 3001
- ✅ Accesso da PC-MAURI via browser
- ✅ Tutti i servizi Docker attivi
- ✅ Report di test generato

## 📅 Prossimi Passi

1. **Esegui** il test seguendo questa procedura
2. **Documenta** eventuali problemi
3. **Aggiorna** la guida di produzione se necessario
4. **Prepara** il deploy reale

**Buon test! 🚀** 