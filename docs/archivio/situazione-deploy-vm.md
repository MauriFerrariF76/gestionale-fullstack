# Situazione Deploy VM - gestionale-vm-test

## Stato Attuale
- VM: gestionale-vm-test (10.10.10.43)
- Utente: mauri
- Sistema: Ubuntu Server 22.04.3 LTS

## Completato con Successo
1. ✅ Installazione Ubuntu Server
2. ✅ Configurazione IP statico: 10.10.10.43
3. ✅ SSH su porta 27 (sicurezza)
4. ✅ Connettività testata
5. ✅ Git clone progetto
6. ✅ Docker installato (28.3.3)
7. ✅ Docker Compose (2.39.1)
8. ✅ Permessi utente risolti
9. ✅ Warning "version" risolto (rimossa riga obsoleta)

## Problema Attuale
**Errore**: Timeout internet per download immagini Docker
```
postgres interrupted - nginx error "get "https://registry-1.docker.io/v2/": net/http: request canceled (Client.Timeout exceeded while awaiting headers)
```

## Analisi Server Fisico di Riferimento
- **Server**: 10.10.10.15 (hardware fisico)
- **Sistema**: Ubuntu 24.04.2 LTS
- **SSH**: Porta 27
> **Nota sicurezza:** Per sicurezza, la porta SSH del server è la **27**. La 22 è usata solo per il primo accesso o per host legacy.
- **Docker**: 27.5.1 + Docker Compose 1.29.2
- **Stato**: ✅ Perfettamente funzionante
- **Container**: 4 container attivi e healthy

## Script di Automazione Creato
✅ **Script completo**: `scripts/install-gestionale-completo.sh`
- **Basato su**: Configurazione server fisico funzionante
- **SSH**: Porta 27 (configurazione sicura)
- **Installazione automatica**: Tutti i componenti
- **Verifiche post-installazione**: Complete
- **Report automatico**: Generato

## Domanda Utente
"non dovrei essere in locale?"

## Suggerimenti
1. **Risolvere internet VM**: Verifica configurazione VirtualBox
2. **Deploy locale**: Stessa procedura su hardware fisico (10.10.10.15)
3. **Vantaggi locale**: Nessun problema internet, velocità massima
4. **Script automazione**: Usa configurazione server fisico come modello

## Prossimi Passi
- ✅ **Analisi server fisico**: Completata
- ✅ **Script automazione**: Creato
- ✅ **Documentazione**: Aggiornata
- 🔄 **Test script**: Su nuova VM pulita
- 🔄 **Deploy locale**: Considerare hardware fisico come alternativa 