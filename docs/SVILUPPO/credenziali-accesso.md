# 🔐 Credenziali Accesso - Gestionale Fullstack

## 📋 Credenziali Utente Admin

### **Accesso Principale**:
- **URL**: `https://gestionale.carpenteriaferrari.com/`
- **Email**: `admin@gestionale.local`
- **Password**: `Admin2025!`
- **Ruolo**: `admin`

### **Test Login API**:
```bash
curl -X POST https://gestionale.carpenteriaferrari.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gestionale.local","password":"Admin2025!"}'
```

### **Risposta Login**:
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@gestionale.local",
    "nome": "Administrator",
    "cognome": "System",
    "roles": ["admin"],
    "mfaEnabled": false
  }
}
```

---

## 🔧 Configurazione Database

### **Utente Admin nel Database**:
```sql
SELECT username, email, nome, cognome, roles, mfa_enabled 
FROM users WHERE username = 'admin';
```

**Risultato**:
- **username**: `admin`
- **email**: `admin@gestionale.local`
- **nome**: `Administrator`
- **cognome**: `System`
- **roles**: `["admin"]`
- **mfa_enabled**: `false`
- **password_hash**: `$2b$10$v6eUJCeaWPHu8ErvkXbn/eSf7bvV.G0yfjzJkOVQrTv.rq0.v3fpq`

---

## 🚨 Sicurezza

### **Note Importanti**:
- ✅ **Password hashata** con bcrypt (12 salt rounds)
- ✅ **JWT tokens** per autenticazione sicura
- ✅ **HTTPS** con certificati Let's Encrypt validi
- ✅ **Headers di sicurezza** configurati
- ✅ **Rate limiting** attivo

### **Cambio Password**:
```bash
# Generare nuovo hash
cd backend && node scripts/generate-bcrypt.js "NuovaPassword123!"

# Aggiornare nel database
docker-compose exec postgres psql -U gestionale_user -d gestionale \
  -c "UPDATE users SET password_hash = 'NUOVO_HASH' WHERE username = 'admin';"
```

---

## 📱 Accesso Frontend

### **Passi per Accedere**:
1. **Apri browser** e vai su `https://gestionale.carpenteriaferrari.com/`
2. **Inserisci credenziali**:
   - Email: `admin@gestionale.local`
   - Password: `Admin2025!`
3. **Clicca Login**
4. **Accedi al gestionale**

### **Funzionalità Disponibili**:
- ✅ **Gestione Clienti** - Aggiungi, modifica, visualizza
- ✅ **Gestione Fornitori** - Aggiungi, modifica, visualizza
- ✅ **Gestione Commesse** - Aggiungi, modifica, visualizza
- ✅ **Gestione Dipendenti** - Aggiungi, modifica, visualizza
- ✅ **Audit Log** - Tracciamento attività

---

## 🔄 Manutenzione

### **Verifica Stato Login**:
```bash
# Test API login
curl -X POST https://gestionale.carpenteriaferrari.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gestionale.local","password":"Admin2025!"}'

# Test health check
curl -I https://gestionale.carpenteriaferrari.com/health
```

### **Reset Password Emergenza**:
```bash
# 1. Genera nuovo hash
cd backend && node scripts/generate-bcrypt.js "NuovaPassword123!"

# 2. Aggiorna database
docker-compose exec postgres psql -U gestionale_user -d gestionale \
  -c "UPDATE users SET password_hash = 'NUOVO_HASH' WHERE username = 'admin';"

# 3. Testa login
curl -X POST https://gestionale.carpenteriaferrari.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gestionale.local","password":"NuovaPassword123!"}'
```

---

**📝 Note**: Le credenziali sono configurate per l'ambiente di produzione. Cambiare la password regolarmente per sicurezza.

**🔄 Aggiornamento**: 31 Luglio 2025 - Login funzionante con credenziali aggiornate 