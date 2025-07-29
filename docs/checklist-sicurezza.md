# ✅ Checklist Sicurezza Deploy Gestionale

## Obiettivo
Garantire che il gestionale sia esposto su Internet in modo sicuro, riducendo al minimo i rischi.

---

## Step da seguire prima di esporre il gestionale

- [x] Nginx configurato e testato solo su LAN (verificato il 24/07/2025, pagina di test visualizzata correttamente)
- [x] HTTPS attivo e funzionante (Let's Encrypt, verificato il 24/07/2025, test esterno SSL Labs: A)
- [x] Firewall MikroTik: solo porte 80/443 aperte verso il server (verificato il 24/07/2025, regole NAT e firewall testate, hairpin NAT attivo)
- [x] SSH accessibile solo da IP fidati (verificato: accesso solo da reti interne, porta 65, anti-bruteforce attivo)
- [x] Nessuna porta di backend/database esposta (verificato: nessuna regola di port forwarding attiva, database non accessibile dall'esterno)
- [x] Rate limiting attivo su backend (implementato solo su API sensibili, disattivato su MikroTik per evitare blocchi su dispositivi mobili)
  > **Nota:** Non applicare rate limit globale a tutte le API. Escludi la LAN e imposta limiti solo su login/reset password. Testa sempre da mobile e con più utenti.
- [ ] MFA attivo almeno per admin
  > **Nota:** Implementa MFA solo per ruoli critici. Prevedi una procedura di recovery semplice e sicura per gli admin.
- [x] Audit log funzionante (corretto bug su campo ip, ora logga correttamente tutte le azioni)
- [x] Backup automatici attivi e testati
  > **Nota:** Backup adattivo implementato il 29/07/2025. Script si adatta automaticamente alla dimensione del database:
  > - Database < 100MB: backup standard
  > - Database 100MB-1GB: backup con compressione
  > - Database > 1GB: backup parallelo con compressione massima
  > - Test restore settimanale automatico
  > - Alert email se spazio backup > 10GB
- [ ] Aggiornamento e patch di sicurezza applicati
- [ ] Impostare il TTL del record DNS di gestionale.carpenteriaferrari.com a 1 ora (3600 secondi) prima del deploy definitivo in produzione, per maggiore resilienza e performance
- [x] Bloccare il metodo HTTP TRACE in Nginx (protezione da attacchi di tipo TRACE/Cross Site Tracing)
- [x] Impostare intestazioni di sicurezza in Nginx (X-Frame-Options, X-Content-Type-Options, CSP soft testata)
- [x] Verificare che Nginx accetti solo TLS 1.2 e superiori (disabilitare SSLv3/TLS 1.0/1.1)
  > **Nota:** Hardening Nginx applicato e testato in produzione il 25/07/2025. Nessun impatto negativo su performance o funzionalità rilevato.
- [x] Logging backend: nessun dato sensibile o stack trace nei log di produzione
  > **Nota:** In produzione logga solo errori critici. In sviluppo mantieni log dettagliati. Prevedi livelli di log e alert per errori gravi.
- [ ] Utenza PostgreSQL dell'app con permessi minimi (no superuser)
  > **Nota:** Dai solo i permessi necessari all'app. Usa un utente separato per operazioni amministrative (migrazioni, backup, ecc.).
- [ ] Password forti e login PostgreSQL via md5 o scram-sha-256
- [x] Certificato Let's Encrypt: rinnovo automatico attivo
  > **Nota:** Prevedi alert/email in caso di errore di rinnovo. Testa periodicamente il rinnovo automatico.

---

## Cosa puoi migliorare (opzionale, per massima sicurezza)

- [x] **HSTS (Strict Transport Security):**
  Attivato e testato il 24/07/2025, header presente nelle risposte HTTPS.
- [x] **OCSP Stapling:**
  Attivato e testato il 24/07/2025, configurazione Nginx aggiornata.

---

## 🐳 Sicurezza Docker

### Checklist Sicurezza Container
- [ ] **Container non-root**: Tutti i container eseguiti con utente non-root
- [ ] **Secrets management**: Password e chiavi in Docker secrets o variabili d'ambiente sicure
- [ ] **Network isolation**: Container isolati in rete Docker dedicata
- [ ] **Volume permissions**: Volumi Docker con permessi corretti (non root)
- [ ] **Image scanning**: Verifica vulnerabilità nelle immagini Docker
- [ ] **Resource limits**: Limiti di CPU e memoria sui container
- [ ] **Health checks**: Health check configurati per tutti i servizi
- [ ] **Logging**: Log centralizzati per tutti i container

### Best Practice Docker Security
```bash
# Container con utente non-root
USER node  # nel Dockerfile

# Resource limits in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

# Health checks
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Sicurezza Volumi Docker
```bash
# Backup sicuro volumi Docker
docker run --rm -v gestionale_postgres_data:/data -v /mnt/backup_gestionale:/backup \
  -e PGPASSWORD=password alpine tar czf /backup/postgres_$(date +%F).tar.gz -C /data .

# Verifica permessi volumi
docker run --rm -v gestionale_postgres_data:/data alpine ls -la /data
```

### Network Security Docker
```yaml
# docker-compose.yml - Network isolata
networks:
  gestionale_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

services:
  backend:
    networks:
      - gestionale_network
  frontend:
    networks:
      - gestionale_network
  postgres:
    networks:
      - gestionale_network
    # Database non esposto all'esterno
```

---

## Esempi di configurazione

### MikroTik (firewall e NAT)
```shell
# Accetta solo traffico in ingresso su 80 e 443 verso il server gestionale
/ip firewall nat add chain=dstnat dst-port=80,443 action=dst-nat to-addresses=IP_SERVER_GESTIONALE

# Blocca tutte le altre porte in ingresso
/ip firewall filter add chain=input protocol=tcp dst-port=!80,!443 action=drop

# SSH solo da IP fidato
/ip firewall filter add chain=input protocol=tcp dst-port=22 src-address=IP_TUO_ADMIN action=accept
/ip firewall filter add chain=input protocol=tcp dst-port=22 action=drop
```

### Nginx (redirect HTTPS)
```nginx
server {
    listen 80;
    server_name gestionale.miaazienda.com;
    return 301 https://$host$request_uri;
}
```

### Nginx (HTTPS con HSTS e OCSP Stapling)
```nginx
server {
    listen 443 ssl;
    server_name gestionale.miaazienda.com;

    # Certificati SSL
    ssl_certificate /etc/letsencrypt/live/gestionale.miaazienda.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gestionale.miaazienda.com/privkey.pem;

    # HSTS: forza HTTPS per 1 anno anche su sottodomini
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # ... altre configurazioni ...
}
```

---

## Osservazioni pratiche e note di deploy (luglio 2025)

- Il rate limit a livello di firewall MikroTik, anche con valori molto alti (es. 1000/sec, burst 4000), può bloccare l'accesso e causare problemi soprattutto su dispositivi mobili (iPhone, Android) e browser moderni, che aprono molte connessioni contemporanee.
- È consigliato **disattivare il rate limit a livello di firewall** per il gestionale e applicarlo solo a livello di backend (Express.js/Nginx) e solo sulle API sensibili (es. login).
- La configurazione HTTPS con Let's Encrypt e Nginx funziona correttamente sia da LAN che da WAN, con redirect automatico da HTTP a HTTPS e HSTS attivo.
- La configurazione NAT/firewall MikroTik deve essere aggiornata per girare correttamente la porta 443 verso il server gestionale.
- Dopo la disabilitazione del sito di default di Nginx, il gestionale è accessibile correttamente dal dominio pubblico.
- Tutti i PC e dispositivi della rete accedono ora tramite il dominio gestionale.carpenteriaferrari.com, sia da interno che da remoto, grazie a regola DNS statica su MikroTik.
- **DNS statico MikroTik:** fondamentale per garantire l'accesso al gestionale anche in caso di assenza di Internet. Tutti i PC devono usare il MikroTik (10.10.10.1) come DNS principale per beneficiare della regola statica.
- Se in futuro si usano altri DNS interni (es. Synology), assicurarsi che inoltrino le richieste al MikroTik o che abbiano la regola statica.
- La gestione del dominio in LAN è ora trasparente: nella barra del browser compare sempre il dominio, mai l'IP, come in tutte le soluzioni professionali.
- Tutte le modifiche e i progressi sono stati documentati e testati sia da interno che da remoto.
- [x] DNS statico MikroTik attivo e MikroTik impostato come DNS principale su tutti i PC della rete (per resilienza anche senza Internet)

---

## Note operative
- Aggiorna questa checklist ad ogni modifica della configurazione.
- Segnala eventuali problemi o eccezioni.
- Consulta anche docs/DEPLOY_ARCHITETTURA_GESTIONALE.md per la checklist generale di deploy.
- **Per attivare HSTS e OCSP Stapling, copia la configurazione sopra nel blocco server HTTPS di Nginx. Riavvia Nginx dopo le modifiche.**
- **IMPORTANTE: Mantieni sempre la regola DNS statica sul MikroTik per il dominio gestionale.carpenteriaferrari.com e assicurati che tutti i PC della rete usino il MikroTik (10.10.10.1) come DNS principale. Solo così il gestionale resterà accessibile anche in caso di assenza di Internet!** 

## Gestione sicura di password e segreti
- [ ] Tutte le password, token e chiavi di accesso sono salvate in file separati e protetti (es: chmod 600, accesso solo a root o utente autorizzato)
- [ ] Nessuna password o segreto è committata su Git o in file pubblici
- [ ] È in uso un password manager aziendale (es: Bitwarden, KeePassXC, 1Password) oppure Vault/Ansible Vault per server
- [ ] I backup delle credenziali sono cifrati e conservati in luogo sicuro
- [ ] Esiste una documentazione interna (NON pubblica) che spiega dove sono salvati i segreti e chi può accedervi

### Backup Sicuro delle Credenziali per Ripristino

#### 1. Password Manager Aziendale (Raccomandato)
- [ ] **Bitwarden** installato e configurato per l'azienda
- [ ] Tutte le credenziali del gestionale salvate in Bitwarden:
  - Password database PostgreSQL
  - JWT secret del backend
  - Password admin del gestionale
  - Credenziali Let's Encrypt
  - Password SSH server
  - Credenziali MikroTik
- [ ] Backup automatico del database Bitwarden incluso nel backup generale
- [ ] Accesso limitato solo agli amministratori

#### 2. File di Backup Cifrato (Alternativa)
```bash
# Creazione file credenziali cifrato
cat > credenziali_gestionale.txt << EOF
# Credenziali Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestionale
DB_USER=gestionale_user
DB_PASSWORD=password_sicura_database

# JWT Secret
JWT_SECRET=chiave_jwt_molto_sicura_e_lunga

# Admin Password
ADMIN_EMAIL=admin@carpenteriaferrari.com
ADMIN_PASSWORD=password_admin_sicura

# SSH Server
SSH_USER=root
SSH_PASSWORD=password_ssh_sicura

# MikroTik
MIKROTIK_IP=10.10.10.1
MIKROTIK_USER=admin
MIKROTIK_PASSWORD=password_mikrotik_sicura
EOF

# Cifra il file con GPG
gpg --encrypt --recipient admin@carpenteriaferrari.com credenziali_gestionale.txt
# Risultato: credenziali_gestionale.txt.gpg

# Rimuovi il file in chiaro
rm credenziali_gestionale.txt
```

#### 3. Script di Ripristino Automatico
```bash
#!/bin/bash
# restore_credentials.sh - Script per ripristino automatico credenziali

echo "🔐 Ripristino credenziali gestionale..."

# Verifica che il file cifrato esista
if [ ! -f "credenziali_gestionale.txt.gpg" ]; then
    echo "❌ File credenziali cifrato non trovato!"
    exit 1
fi

# Decifra il file delle credenziali
echo "📂 Decifratura credenziali..."
gpg --decrypt credenziali_gestionale.txt.gpg > credenziali_temp.txt

if [ $? -ne 0 ]; then
    echo "❌ Errore nella decifratura!"
    exit 1
fi

# Carica le variabili d'ambiente
echo "⚙️ Caricamento variabili d'ambiente..."
source credenziali_temp.txt

# Verifica che le variabili siano caricate
if [ -z "$DB_PASSWORD" ] || [ -z "$JWT_SECRET" ]; then
    echo "❌ Variabili d'ambiente non caricate correttamente!"
    rm credenziali_temp.txt
    exit 1
fi

echo "✅ Credenziali caricate con successo!"

# Rimuovi il file temporaneo
rm credenziali_temp.txt

echo "🚀 Pronto per il ripristino del gestionale!"
```

#### 4. Integrazione nel Backup Generale
```bash
#!/bin/bash
# backup_completo_gestionale.sh

# Backup database
pg_dump -h localhost -U gestionale_user gestionale > backup_db_$(date +%F).sql

# Backup file applicazione
tar czf backup_app_$(date +%F).tar.gz /opt/gestionale/

# Backup credenziali (già cifrate)
cp credenziali_gestionale.txt.gpg backup_credenziali_$(date +%F).gpg

# Crea archivio completo
tar czf backup_completo_gestionale_$(date +%F).tar.gz \
    backup_db_$(date +%F).sql \
    backup_app_$(date +%F).tar.gz \
    backup_credenziali_$(date +%F).gpg

# Pulisci file temporanei
rm backup_db_$(date +%F).sql backup_app_$(date +%F).tar.gz backup_credenziali_$(date +%F).gpg

echo "✅ Backup completo creato: backup_completo_gestionale_$(date +%F).tar.gz"
```

#### 5. Script di Ripristino Completo
```bash
#!/bin/bash
# restore_completo_gestionale.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Specifica il file di backup: ./restore_completo_gestionale.sh backup_file.tar.gz"
    exit 1
fi

echo "🔄 Ripristino completo gestionale da: $BACKUP_FILE"

# Estrai il backup
tar xzf $BACKUP_FILE

# Ripristina credenziali
./restore_credentials.sh

# Ripristina database
psql -h localhost -U gestionale_user gestionale < backup_db_*.sql

# Ripristina applicazione
tar xzf backup_app_*.tar.gz -C /

echo "✅ Ripristino completato!"
```

### Note di Sicurezza
- **Mai committare** file con password su Git
- **Cifra sempre** i file di backup delle credenziali
- **Limita l'accesso** ai file di credenziali solo agli amministratori
- **Testa regolarmente** il processo di ripristino
- **Mantieni aggiornato** il password manager o i file cifrati
- **Documenta** la procedura di ripristino in un posto sicuro 