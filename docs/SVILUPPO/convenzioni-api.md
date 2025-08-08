# Convenzioni API - Gestionale Fullstack

## Scopo
Questo documento definisce le convenzioni standard per le API REST e la comunicazione tra frontend e backend nel progetto gestionale.

## Struttura Risposta API Standard

### Formato Risposta Successo
```json
{
  "success": true,
  "data": [...], // Array o oggetto con i dati
  "message": "Messaggio opzionale",
  "pagination": { // Solo per liste paginate
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Formato Risposta Errore
```json
{
  "success": false,
  "message": "Descrizione errore",
  "error": "Dettagli tecnici (solo in development)"
}
```

## Convenzioni Frontend

### Gestione Risposte API
- **SEMPRE** estrarre `response.data` dalle risposte API
- **NON** usare mai direttamente la risposta completa
- **Gestire** sempre gli errori con try/catch

```typescript
// ✅ CORRETTO
const response = await apiFetch<{success: boolean, data: Cliente[]}>(`/clienti`);
return response.data;

// ❌ SBAGLIATO
return await apiFetch<Cliente[]>(`/clienti`);
```

### Autenticazione
- **SEMPRE** usare `apiFetch` per chiamate autenticate
- **MAI** usare `fetch` diretto per endpoint protetti
- **Verificare** che il token sia presente prima delle chiamate

```typescript
// ✅ CORRETTO
const response = await apiFetch<ResponseType>('/endpoint');

// ❌ SBAGLIATO
const response = await fetch('/endpoint');
```

## Convenzioni Backend

### Struttura Controller
```typescript
// ✅ Formato standard controller
async methodName(req: Request, res: Response) {
  try {
    // Logica business
    const data = await repository.method();
    
    // Log audit
    await createAuditLog({...});
    
    // Risposta standardizzata
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('❌ Errore:', error);
    res.status(500).json({
      success: false,
      message: 'Errore interno del server'
    });
  }
}
```

### Audit Log
- **SEMPRE** loggare operazioni critiche
- **Includere** userId, action, ip, details
- **Non bloccare** l'applicazione se l'audit fallisce

```typescript
await createAuditLog({
  userId: authUser?.id,
  action: 'CREATE_CLIENTE',
  ip: (req.ip || '') as string,
  details: `Cliente creato: ${cliente.ragioneSocialeC}`
});
```

## Ordine Routes

### Regola Critica
- **Route specifiche PRIMA** di route con parametri
- **Route con parametri ULTIME** nella definizione

```typescript
// ✅ CORRETTO
router.get('/stats', controller.getStats);
router.get('/max-id', controller.getMaxId);
router.get('/search', controller.search);
router.get('/:id', controller.getById); // ULTIMA

// ❌ SBAGLIATO
router.get('/:id', controller.getById);
router.get('/stats', controller.getStats); // Non raggiungibile!
```

## Gestione Errori

### Frontend
```typescript
try {
  const data = await apiCall();
  // Gestione successo
} catch (error) {
  console.error('Errore API:', error);
  // Gestione errore utente-friendly
}
```

### Backend
```typescript
try {
  // Operazione
} catch (error) {
  console.error('❌ Errore specifico:', error);
  res.status(500).json({
    success: false,
    message: 'Messaggio utente-friendly',
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
}
```

## Validazione Input

### Frontend
- **Validare** sempre i dati prima dell'invio
- **Normalizzare** i dati (es. campi numerici)
- **Gestire** stati di loading e error

### Backend
- **Validare** sempre i dati in ingresso
- **Sanitizzare** i dati prima del database
- **Restituire** errori specifici per validazione

## Performance

### Frontend
- **Implementare** caching quando appropriato
- **Usare** paginazione per liste grandi
- **Ottimizzare** re-render con React.memo

### Backend
- **Implementare** rate limiting
- **Usare** indici database appropriati
- **Ottimizzare** query con JOIN quando necessario

## Sicurezza

### Autenticazione
- **Verificare** sempre il token JWT
- **Controllare** i permessi per operazioni sensibili
- **Loggare** tentativi di accesso non autorizzati

### Input Validation
- **Sanitizzare** sempre gli input utente
- **Validare** formati email, URL, numeri
- **Prevenire** SQL injection e XSS

## Checklist Pre-Commit

- [ ] Tutte le API restituiscono formato standardizzato
- [ ] Frontend estrae sempre `response.data`
- [ ] Audit log implementato per operazioni critiche
- [ ] Route ordinate correttamente (specifiche prima di parametri)
- [ ] Gestione errori implementata
- [ ] Autenticazione verificata per endpoint protetti
- [ ] Input validation implementata
- [ ] Rate limiting configurato
