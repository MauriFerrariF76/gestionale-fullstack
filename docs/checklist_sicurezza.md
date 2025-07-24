# ✅ Checklist Sicurezza Deploy Gestionale

## Obiettivo
Garantire che il gestionale sia esposto su Internet in modo sicuro, riducendo al minimo i rischi.

---

## Step da seguire prima di esporre il gestionale

- [x] Nginx configurato e testato solo su LAN (verificato il 24/07/2025, pagina di test visualizzata correttamente)
- [x] HTTPS attivo e funzionante (Let’s Encrypt, verificato il 24/07/2025, test esterno SSL Labs: A)
- [ ] Firewall MikroTik: solo porte 80/443 aperte verso il server
- [ ] SSH accessibile solo da IP fidati
- [ ] Nessuna porta di backend/database esposta
- [ ] Rate limiting attivo su backend
- [ ] MFA attivo almeno per admin
- [ ] Audit log funzionante
- [ ] Backup automatici attivi e testati
- [ ] Aggiornamento e patch di sicurezza applicati

---

## Cosa puoi migliorare (opzionale, per massima sicurezza)

- [ ] **HSTS (Strict Transport Security):**
  Attivando HSTS, i browser forzeranno sempre l’uso di HTTPS anche in caso di tentativi di downgrade. Consigliato per produzione. Vuoi che ti aiuti ad attivare questa opzione?
- [ ] **OCSP Stapling:**
  Non è obbligatorio, ma migliora la velocità di verifica del certificato SSL/TLS. Consigliato per produzione.

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

## Note operative
- Aggiorna questa checklist ad ogni modifica della configurazione.
- Segnala eventuali problemi o eccezioni.
- Consulta anche docs/DEPLOY_ARCHITETTURA_GESTIONALE.md per la checklist generale di deploy.
- **Per attivare HSTS e OCSP Stapling, copia la configurazione sopra nel blocco server HTTPS di Nginx. Riavvia Nginx dopo le modifiche.** 