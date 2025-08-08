# Gestione Errori e Audit Log - Standard Operativi

## Scopo
Questo documento definisce gli standard per la gestione degli errori, logging e audit trail nel sistema gestionale.

## Gestione Errori Backend

### Struttura Standard Controller
```typescript
async methodName(req: Request, res: Response) {
  try {
    // Logica business
    const data = await repository.method();
    
    // Log audit per operazioni critiche
    await createAuditLog({
      userId: authUser?.id,
      action: 'ACTION_NAME',
      ip: (req.ip || '') as string,
      details: `Dettagli operazione`
    });
    
    // Risposta successo standardizzata
    res.json({
      success: true,
      data: data,
      message: 'Operazione completata con successo'
    });
  } catch (error) {
    // Log errore con dettagli
    console.error('❌ Errore specifico:', error);
    
    // Risposta errore standardizzata
    res.status(500).json({
      success: false,
      message: 'Messaggio utente-friendly',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
```

### Tipi di Errori

#### 1. Errori di Validazione (400)
```typescript
return res.status(400).json({
  success: false,
  message: 'Campo obbligatorio mancante'
});
```

#### 2. Errori di Autenticazione (401)
```typescript
return res.status(401).json({
  success: false,
  message: 'Token mancante o non valido'
});
```

#### 3. Errori di Autorizzazione (403)
```typescript
return res.status(403).json({
  success: false,
  message: 'Accesso negato'
});
```

#### 4. Errori di Risorsa Non Trovata (404)
```typescript
return res.status(404).json({
  success: false,
  message: 'Cliente non trovato'
});
```

#### 5. Errori di Conflitto (409)
```typescript
return res.status(409).json({
  success: false,
  message: 'Codice MT già esistente'
});
```

#### 6. Errori di Server (500)
```typescript
res.status(500).json({
  success: false,
  message: 'Errore interno del server',
  error: process.env.NODE_ENV === 'development' ? error : undefined
});
```

## Audit Log

### Configurazione Audit Logger
```typescript
// File: backend/src/utils/auditLogger.ts

export interface AuditLogData {
  userId?: string;
  action: string;
  ip: string;
  details?: string;
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId || null,
        action: data.action,
        ip: data.ip || 'unknown', // Fallback per IP mancante
        details: data.details,
        timestamp: new Date()
      }
    });
  } catch (error) {
    // Non bloccare l'applicazione se l'audit log fallisce
    console.error('❌ Errore nella creazione audit log:', error);
  }
}
```

### Azioni da Loggare

#### Operazioni CRUD
- `CREATE_CLIENTE` - Creazione nuovo cliente
- `UPDATE_CLIENTE` - Modifica cliente esistente
- `DELETE_CLIENTE` - Eliminazione cliente
- `GET_CLIENTE` - Visualizzazione cliente specifico
- `GET_CLIENTI` - Lista clienti

#### Operazioni di Sistema
- `LOGIN` - Accesso utente
- `LOGOUT` - Disconnessione utente
- `PASSWORD_CHANGE` - Cambio password
- `USER_CREATE` - Creazione nuovo utente
- `USER_UPDATE` - Modifica utente

#### Operazioni di Ricerca
- `SEARCH_CLIENTI` - Ricerca clienti
- `GET_CLIENTI_STATS` - Statistiche clienti
- `GET_MAX_ID_CLIENTE` - Recupero massimo ID

### Esempi di Utilizzo

#### Creazione Cliente
```typescript
const nuovoCliente = await clienteRepository.create(mappedData);

await createAuditLog({
  userId: authUser?.id,
  action: 'CREATE_CLIENTE',
  ip: (req.ip || '') as string,
  details: `Nuovo cliente: ${nuovoCliente.ragioneSocialeC}`
});
```

#### Modifica Cliente
```typescript
const clienteAggiornato = await clienteRepository.update(id, mappedUpdateData);

await createAuditLog({
  userId: authUser?.id,
  action: 'UPDATE_CLIENTE',
  ip: (req.ip || '') as string,
  details: `Cliente aggiornato: ${clienteAggiornato.ragioneSocialeC}`
});
```

#### Eliminazione Cliente
```typescript
await clienteRepository.delete(id);

await createAuditLog({
  userId: authUser?.id,
  action: 'DELETE_CLIENTE',
  ip: (req.ip || '') as string,
  details: `Cliente eliminato: ${existingCliente.ragioneSocialeC}`
});
```

## Gestione Errori Frontend

### Struttura Standard API Call
```typescript
try {
  const response = await apiFetch<ResponseType>('/endpoint');
  return response.data;
} catch (error) {
  console.error('Errore API:', error);
  
  // Gestione errori specifici
  if (error.message.includes('Token')) {
    // Reindirizza al login
    router.push('/login');
  } else {
    // Mostra messaggio errore utente
    setError('Errore durante l\'operazione');
  }
  
  throw error;
}
```

### Gestione Stati di Loading
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleOperation = async () => {
  setLoading(true);
  setError(null);
  
  try {
    await apiCall();
    // Successo
  } catch (error) {
    setError('Errore durante l\'operazione');
  } finally {
    setLoading(false);
  }
};
```

### Componenti di Gestione Errori

#### ErrorMessage Component
```typescript
interface ErrorMessageProps {
  error: string | null;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-800">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-600 hover:text-red-500"
            >
              Riprova
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### LoadingSpinner Component
```typescript
interface LoadingSpinnerProps {
  loading: boolean;
  children: React.ReactNode;
}

export function LoadingSpinner({ loading, children }: LoadingSpinnerProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return <>{children}</>;
}
```

## Logging e Debugging

### Console Logging
```typescript
// ✅ Log informativi
console.log('✅ Operazione completata:', data);

// ✅ Log di debug
console.log('DEBUG - Dati ricevuti:', response);

// ❌ Log di errore
console.error('❌ Errore specifico:', error);

// ✅ Log di warning
console.warn('⚠️ Attenzione:', warning);
```

### Logging Strutturato
```typescript
// Per operazioni complesse
console.log('🔍 Ricerca clienti:', {
  searchTerm,
  page,
  limit,
  filters
});

// Per risultati
console.log('📊 Risultati ricerca:', {
  total: result.total,
  page: result.page,
  items: result.data.length
});
```

## Gestione Errori di Rete

### Retry Automatico
```typescript
async function apiCallWithRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Attendi prima del retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw new Error('Tentativi esauriti');
}
```

### Gestione Timeout
```typescript
async function apiCallWithTimeout<T>(
  apiCall: () => Promise<T>,
  timeout: number = 10000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const result = await apiCall();
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Timeout della richiesta');
    }
    throw error;
  }
}
```

## Monitoraggio e Alerting

### Metriche da Monitorare
- **Error Rate**: Percentuale di errori per endpoint
- **Response Time**: Tempo di risposta medio
- **Audit Log Volume**: Numero di log generati
- **Failed Logins**: Tentativi di accesso falliti
- **Database Errors**: Errori di connessione DB

### Alerting
```typescript
// Esempio di alerting per errori critici
if (error.code === 'DATABASE_CONNECTION_ERROR') {
  // Invia alert al team
  sendAlert({
    level: 'CRITICAL',
    message: 'Database connection failed',
    details: error
  });
}
```

## Checklist Implementazione

### Backend
- [ ] Tutti i controller usano struttura try/catch standard
- [ ] Audit log implementato per operazioni critiche
- [ ] Errori restituiscono formato standardizzato
- [ ] Logging strutturato implementato
- [ ] Gestione IP mancante nell'audit log

### Frontend
- [ ] Gestione stati loading/error implementata
- [ ] Componenti ErrorMessage e LoadingSpinner creati
- [ ] Retry automatico per errori di rete
- [ ] Timeout per chiamate API
- [ ] Reindirizzamento login per token scaduti

### Monitoraggio
- [ ] Metriche implementate
- [ ] Alerting configurato
- [ ] Dashboard monitoring creata
- [ ] Log rotation configurata

## Best Practices

### 1. Sicurezza
- **Non esporre** dettagli tecnici in produzione
- **Loggare** tentativi di accesso non autorizzati
- **Sanitizzare** input utente

### 2. Performance
- **Non bloccare** l'applicazione per errori di logging
- **Implementare** retry intelligente
- **Ottimizzare** query di audit log

### 3. Manutenibilità
- **Standardizzare** messaggi di errore
- **Documentare** codici di errore
- **Testare** scenari di errore

### 4. User Experience
- **Messaggi** utente-friendly
- **Stati** di loading chiari
- **Opzioni** di retry quando appropriato
