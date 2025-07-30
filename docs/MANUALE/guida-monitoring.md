# Guida Operativa Monitoring e Logging

## Indice
- [Monitoring di base](#1-monitoring-di-base)
- [Logging backend](#2-logging-backend)
- [Monitoring avanzato (opzionale)](#3-monitoring-avanzato-opzionale)
- [Audit log](#4-audit-log)

## 1. Monitoring di base

- Controlla che backend e frontend siano attivi:
  - Backend: `curl http://localhost:3001/`
  - Frontend: `curl http://localhost:3000/`
- Usa `pm2` o `systemctl` per monitorare i processi in produzione.

## 2. Logging backend

- I log vengono scritti su stdout (console) o su file se usi PM2/Docker.
- Per logging avanzato, integra [Winston](https://github.com/winstonjs/winston) o [Sentry](https://sentry.io/).
- Controlla i log per errori 5xx, tentativi di login falliti, accessi sospetti.

## 3. Monitoring avanzato (opzionale)

- Installa e configura [Prometheus](https://prometheus.io/) e [Grafana](https://grafana.com/) per metriche e dashboard.
- Integra [OpenTelemetry](https://opentelemetry.io/) per tracing distribuito.
- Configura alert automatici per downtime o errori critici.

## 4. Audit log

- Assicurati che tutte le azioni critiche (login, logout, modifiche dati) vengano loggate in tabella `audit_logs`.
- Prepara query/report periodici per controllare accessi e anomalie.

---

**Aggiorna questa guida se cambi strumenti di monitoring o logging!** 