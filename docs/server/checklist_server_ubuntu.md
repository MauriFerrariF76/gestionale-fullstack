# ✅ Checklist Server Ubuntu per Gestionale

## Obiettivo
Garantire che il server Ubuntu sia configurato, sicuro e pronto per ospitare il gestionale web.

---

## Checklist post-installazione
- [x] Aggiornamento sistema (`sudo apt update && sudo apt upgrade`)
- [x] Configurazione utente amministratore non root
- [x] SSH attivo, accesso solo con chiave e da IP fidati
- [x] Firewall attivo (UFW o regole MikroTik)
- [x] Disabilitato login root via SSH
- [x] Sincronizzazione orario (NTP attivo)
- [x] Hostname e /etc/hosts configurati
- [ ] Swap configurata (se necessario)

---

## Checklist installazione servizi
- [x] Nginx installato e configurato
- [x] Certbot/Let’s Encrypt installato e certificato attivo
- [x] Node.js e npm installati
- [x] PM2 o systemd per gestione backend
  > **Nota:** Backend e frontend sono ora gestiti da systemd tramite file di servizio dedicati e testati con successo (luglio 2025).
- [x] PostgreSQL installato e sicuro
- [x] Utente PostgreSQL dedicato all’app
- [x] Backup automatico database attivo
- [x] Script di backup configurazioni server su NAS (permessi corretti, esclusione #recycle, log)
- [x] Repository Git per versionamento configurazioni
  > **Nota:** Le configurazioni server (systemd, Nginx, script, checklist) sono versionate in `/docs/server/` all’interno del progetto gestionale-fullstack. Ogni modifica va riportata qui e committata seguendo le best practice: mai versionare dati sensibili (password, chiavi private), aggiornare sempre la documentazione e mantenere la cronologia delle modifiche.

---

## Checklist sicurezza
- [ ] Aggiornamenti automatici di sicurezza attivi
- [ ] Solo porte necessarie aperte (80, 443, SSH da IP fidati)
- [ ] Nessun servizio inutile in ascolto
- [ ] Permessi minimi ai file di configurazione
- [ ] Log di sistema e applicativi monitorati
- [ ] Test restore backup periodico

---

## Checklist manutenzione periodica
- [ ] Verifica spazio disco
- [ ] Verifica stato servizi (Nginx, backend, PostgreSQL)
- [ ] Aggiornamento sistema e pacchetti
- [ ] Test backup e restore
- [ ] Review log di sicurezza

---

## Note operative
- Aggiorna questa checklist ad ogni modifica della configurazione server.
- Consulta anche la guida dettagliata `/docs/guida_installazione_server.md` per istruzioni passo-passo. 