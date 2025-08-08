# Troubleshooting - Risoluzione Problemi Comuni

## Scopo
Questo documento fornisce soluzioni per i problemi più comuni che possono verificarsi durante lo sviluppo e l'utilizzo del gestionale.

## Problemi API e Comunicazione

### 1. Errore "Token mancante"

**Sintomi:**
- Errore 401 "Token mancante"
- Frontend non riesce ad autenticarsi

**Cause:**
- Token JWT scaduto
- Token non presente nel sessionStorage
- Problemi di autenticazione

**Soluzioni:**
```typescript
// Verifica token nel browser
console.log('Token:', sessionStorage.getItem('accessToken'));

// Reindirizza al login se token mancante
if (!sessionStorage.getItem('accessToken')) {
  router.push('/login');
}
```

### 2. Errore "Errore nel recupero del massimo IdCliente"

**Sintomi:**
- Errore durante creazione nuovo cliente
- Endpoint `/max-id` non raggiungibile

**Cause:**
- Endpoint non implementato nel backend
- Route ordinate incorrettamente
- Autenticazione mancante

**Soluzioni:**
```typescript
// ✅ Verifica ordine routes
router.get('/max-id', controller.getMaxId); // PRIMA
router.get('/:id', controller.getById);      // DOPO

// ✅ Usa apiFetch invece di fetch
const response = await apiFetch<ResponseType>('/clienti/max-id');
```

### 3. Errore "Argument `ip` is missing"

**Sintomi:**
- Errore Prisma nell'audit log
- Campo IP mancante

**Cause:**
- IP non disponibile nella richiesta
- Fallback non implementato

**Soluzioni:**
```typescript
// ✅ Aggiungi fallback per IP mancante
await createAuditLog({
  userId: authUser?.id,
  action: 'ACTION',
  ip: (req.ip || 'unknown') as string, // Fallback
  details: 'Dettagli'
});
```

## Problemi di Mappatura Campi

### 1. Validazione campi obbligatori fallisce

**Sintomi:**
- Errore 400 "Campo obbligatorio mancante"
- Validazione su campo sbagliato

**Cause:**
- Mismatch nomi campi (PascalCase vs camelCase)
- Mappatura non applicata

**Soluzioni:**
```typescript
// ❌ SBAGLIATO
if (!clienteData.RagioneSocialeC) { ... }

// ✅ CORRETTO
const mappedData = mapClienteFields(clienteData);
if (!mappedData.ragioneSocialeC) { ... }
```

### 2. Frontend non visualizza dati

**Sintomi:**
- Lista vuota nel frontend
- Dati presenti nel database ma non visualizzati

**Cause:**
- Mappatura non applicata nella risposta
- Frontend non estrae `response.data`

**Soluzioni:**
```typescript
// ✅ Backend: mappa prima dell'invio
const mappedClienti = result.clienti.map(cliente => 
  mapClienteFieldsToFrontend(cliente)
);

// ✅ Frontend: estrai sempre response.data
const response = await apiFetch<ResponseType>('/clienti');
return response.data;
```

## Problemi di Ordine Routes

### 1. Route specifiche non raggiungibili

**Sintomi:**
- Endpoint `/stats` restituisce 404
- Endpoint `/max-id` non funziona

**Cause:**
- Route con parametri (`/:id`) definita prima di route specifiche
- Express interpreta "stats" come ID

**Soluzioni:**
```typescript
// ✅ CORRETTO - Route specifiche PRIMA
router.get('/stats', controller.getStats);
router.get('/max-id', controller.getMaxId);
router.get('/search', controller.search);
router.get('/:id', controller.getById); // ULTIMA

// ❌ SBAGLIATO
router.get('/:id', controller.getById);
router.get('/stats', controller.getStats); // Non raggiungibile!
```

## Problemi di Autenticazione

### 1. Token scaduto

**Sintomi:**
- Errore 401 dopo periodo di inattività
- Reindirizzamento continuo al login

**Soluzioni:**
```typescript
// Implementa refresh token automatico
const refreshToken = async () => {
  try {
    const response = await apiFetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refreshToken: sessionStorage.getItem('refreshToken')
      })
    });
    
    sessionStorage.setItem('accessToken', response.data.accessToken);
  } catch (error) {
    // Reindirizza al login
    router.push('/login');
  }
};
```

### 2. Problemi di CORS

**Sintomi:**
- Errore CORS nel browser
- Richieste bloccate

**Soluzioni:**
```typescript
// Backend: configura CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## Problemi di Database

### 1. Connessione database fallita

**Sintomi:**
- Errore "Database connection failed"
- Applicazione non avvia

**Soluzioni:**
```bash
# Verifica stato PostgreSQL
sudo systemctl status postgresql

# Riavvia servizio
sudo systemctl restart postgresql

# Verifica connessione
psql -h localhost -U username -d database
```

### 2. Errori Prisma

**Sintomi:**
- Errori di validazione Prisma
- Schema non sincronizzato

**Soluzioni:**
```bash
# Genera client Prisma
npx prisma generate

# Applica migrazioni
npx prisma migrate deploy

# Reset database (solo sviluppo)
npx prisma migrate reset
```

## Problemi di Performance

### 1. Lentezza nelle query

**Sintomi:**
- Tempi di caricamento lunghi
- Timeout delle richieste

**Soluzioni:**
```typescript
// Implementa paginazione
const result = await repository.findAll(page, limit, search);

// Usa indici database
// Aggiungi al schema Prisma:
// @@index([ragioneSocialeC])
// @@index([codiceMT])
```

### 2. Memory leaks

**Sintomi:**
- Consumo memoria crescente
- Applicazione rallenta nel tempo

**Soluzioni:**
```typescript
// Pulisci event listeners
useEffect(() => {
  const handler = () => { /* ... */ };
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
  };
}, []);

// Usa React.memo per componenti pesanti
const HeavyComponent = React.memo(({ data }) => {
  // Component logic
});
```

## Problemi di Build e Deploy

### 1. Errori TypeScript

**Sintomi:**
- Build fallisce per errori TypeScript
- Tipi non definiti

**Soluzioni:**
```typescript
// Aggiungi tipi mancanti
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Usa any temporaneamente per debugging
const data: any = await apiCall();
```

### 2. Errori di dipendenze

**Sintomi:**
- Moduli non trovati
- Versioni incompatibili

**Soluzioni:**
```bash
# Pulisci cache
rm -rf node_modules package-lock.json
npm install

# Aggiorna dipendenze
npm update

# Verifica vulnerabilità
npm audit fix
```

## Debugging Avanzato

### 1. Logging strutturato

```typescript
// Backend
console.log('🔍 Query clienti:', {
  page,
  limit,
  search,
  filters
});

// Frontend
console.log('📊 Risposta API:', {
  status: response.status,
  data: response.data,
  timestamp: new Date().toISOString()
});
```

### 2. Network debugging

```typescript
// Intercetta richieste API
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 API Request:', args);
  return originalFetch.apply(this, args);
};
```

### 3. State debugging

```typescript
// Debug React state
const [state, setState] = useState(initialState);

useEffect(() => {
  console.log('🔄 State changed:', state);
}, [state]);
```

## Checklist Troubleshooting

### Prima di tutto
- [ ] Verifica che tutti i servizi siano avviati
- [ ] Controlla i log del backend
- [ ] Verifica la console del browser
- [ ] Controlla la connessione di rete

### Per problemi API
- [ ] Verifica autenticazione
- [ ] Controlla ordine delle route
- [ ] Verifica mappatura campi
- [ ] Controlla formato risposta

### Per problemi frontend
- [ ] Verifica estrazione `response.data`
- [ ] Controlla gestione stati loading/error
- [ ] Verifica componenti di UI
- [ ] Controlla reindirizzamenti

### Per problemi database
- [ ] Verifica connessione PostgreSQL
- [ ] Controlla migrazioni Prisma
- [ ] Verifica schema database
- [ ] Controlla indici

## Contatti e Supporto

### Log utili da raccogliere
- Log del backend (`npm run dev`)
- Console del browser (F12)
- Log di PostgreSQL (`/var/log/postgresql/`)
- Log di Nginx (se utilizzato)

### Informazioni da fornire
- Versione del software
- Sistema operativo
- Browser utilizzato
- Passi per riprodurre il problema
- Screenshot dell'errore
