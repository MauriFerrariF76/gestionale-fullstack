# ✅ Checklist Sicurezza Deploy Gestionale

## Obiettivo
Garantire che il gestionale sia esposto su Internet in modo sicuro, riducendo al minimo i rischi.

---

## Step da seguire prima di esporre il gestionale

- [x] Nginx configurato e testato solo su LAN (verificato il 24/07/2025, pagina di test visualizzata correttamente)
- [x] HTTPS attivo e funzionante (Let’s Encrypt, verificato il 24/07/2025, test esterno SSL Labs: A)
- [x] Firewall MikroTik: solo porte 80/443 aperte verso il server (verificato il 24/07/2025, regole NAT e firewall testate, hairpin NAT attivo)
- [x] SSH accessibile solo da IP fidati (verificato: accesso solo da reti interne, porta 65, anti-bruteforce attivo)
- [x] Nessuna porta di backend/database esposta (verificato: nessuna regola di port forwarding attiva, database non accessibile dall'esterno)
- [ ] Rate limiting attivo su backend (vedi osservazioni)
- [ ] MFA attivo almeno per admin
- [ ] Audit log funzionante
- [ ] Backup automatici attivi e testati
- [ ] Aggiornamento e patch di sicurezza applicati

---

## Cosa puoi migliorare (opzionale, per massima sicurezza)

- [x] **HSTS (Strict Transport Security):**
  Attivato e testato il 24/07/2025, header presente nelle risposte HTTPS.
- [x] **OCSP Stapling:**
  Attivato e testato il 24/07/2025, configurazione Nginx aggiornata.

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

- Il rate limit a livello di firewall MikroTik, anche con valori molto alti (es. 1000/sec, burst 4000), può bloccare l’accesso e causare problemi soprattutto su dispositivi mobili (iPhone, Android) e browser moderni, che aprono molte connessioni contemporanee.
- È consigliato **disattivare il rate limit a livello di firewall** per il gestionale e applicarlo solo a livello di backend (Express.js/Nginx) e solo sulle API sensibili (es. login).
- La configurazione HTTPS con Let’s Encrypt e Nginx funziona correttamente sia da LAN che da WAN, con redirect automatico da HTTP a HTTPS e HSTS attivo.
- La configurazione NAT/firewall MikroTik deve essere aggiornata per girare correttamente la porta 443 verso il server gestionale.
- Dopo la disabilitazione del sito di default di Nginx, il gestionale è accessibile correttamente dal dominio pubblico.
- Tutte le modifiche e i progressi sono stati documentati e testati sia da interno che da remoto.

---

## Note operative
- Aggiorna questa checklist ad ogni modifica della configurazione.
- Segnala eventuali problemi o eccezioni.
- Consulta anche docs/DEPLOY_ARCHITETTURA_GESTIONALE.md per la checklist generale di deploy.
- **Per attivare HSTS e OCSP Stapling, copia la configurazione sopra nel blocco server HTTPS di Nginx. Riavvia Nginx dopo le modifiche.** 