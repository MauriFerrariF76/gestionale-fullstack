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

---

## Note operative
- Aggiorna questa checklist ad ogni modifica della configurazione.
- Segnala eventuali problemi o eccezioni.
- Consulta anche docs/DEPLOY_ARCHITETTURA_GESTIONALE.md per la checklist generale di deploy. 