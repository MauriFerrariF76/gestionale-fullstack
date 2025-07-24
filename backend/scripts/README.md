# scripts

Questa cartella contiene script di utilità per lo sviluppo e la manutenzione del progetto.

## generate-bcrypt.js

Script Node.js per generare hash bcrypt da password in chiaro, utile per inserire utenti di test direttamente nel database.

### Utilizzo

1. Assicurati di aver installato bcrypt:
   ```bash
   npm install bcrypt
   ```
2. Esegui lo script passando la password da hashare:
   ```bash
   node scripts/generate-bcrypt.js tuaPassword123
   ```
3. Copia l'hash stampato e usalo nelle query SQL per inserire utenti di test.

---

**Nota:**
Questi script sono pensati solo per uso di sviluppo/manuale. La logica di hashing delle password in produzione sarà gestita direttamente dal backend. 