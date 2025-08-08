# Sistema Mappatura Campi - Frontend ↔ Backend

## Scopo
Questo documento descrive il sistema di mappatura automatica dei nomi dei campi tra frontend (PascalCase) e backend (camelCase) per garantire compatibilità e consistenza.

## Problema Risolto

### Mismatch Naming Convention
- **Frontend**: PascalCase (es. `RagioneSocialeC`, `Telefono`, `IndirizzoC`)
- **Backend/Database**: camelCase (es. `ragioneSocialeC`, `telefono`, `indirizzoC`)

### Conflitti Risolti
- ✅ Validazione campi obbligatori
- ✅ Creazione/modifica entità
- ✅ Visualizzazione dati
- ✅ Ricerca e filtri

## Implementazione

### File: `backend/src/utils/fieldMapper.ts`

```typescript
// Mappa dei campi cliente dal frontend al backend
const clienteFieldMap: Record<string, string> = {
  // Campi anagrafici
  'IdCliente': 'id',
  'CodiceMT': 'codiceMT',
  'RagioneSocialeC': 'ragioneSocialeC',
  'ReferenteC': 'referenteC',
  'IndirizzoC': 'indirizzoC',
  'CAPc': 'capc',
  'CITTAc': 'cittac',
  'PROVc': 'provc',
  'NAZc': 'nazc',
  
  // Contatti
  'Telefono': 'telefono',
  'Fax': 'fax',
  'Modem': 'modem',
  
  // Dati fiscali
  'CodiceFiscale': 'codiceFiscale',
  'PartitaIva': 'partitaIva',
  'IVA': 'iva',
  
  // ... altri campi
};

// Funzioni di mappatura
export function mapClienteFields(clienteData: any): any {
  const mappedData: any = {};
  
  for (const [frontendField, backendField] of Object.entries(clienteFieldMap)) {
    if (clienteData.hasOwnProperty(frontendField)) {
      mappedData[backendField] = clienteData[frontendField];
    }
  }
  
  return mappedData;
}

export function mapClienteFieldsToFrontend(clienteData: any): any {
  const mappedData: any = {};
  
  for (const [frontendField, backendField] of Object.entries(clienteFieldMap)) {
    if (clienteData.hasOwnProperty(backendField)) {
      mappedData[frontendField] = clienteData[backendField];
    }
  }
  
  return mappedData;
}
```

## Utilizzo nei Controller

### Creazione Cliente
```typescript
async createCliente(req: Request, res: Response) {
  try {
    const clienteData = req.body;
    
    // Mappa i campi dal frontend al backend
    const mappedData = mapClienteFields(clienteData);
    
    // Validazione con nomi backend
    if (!mappedData.ragioneSocialeC) {
      return res.status(400).json({
        success: false,
        message: 'Ragione sociale è obbligatoria'
      });
    }
    
    const nuovoCliente = await clienteRepository.create(mappedData);
    
    // Mappa i campi dal backend al frontend per la risposta
    const mappedNuovoCliente = mapClienteFieldsToFrontend(nuovoCliente);
    
    res.status(201).json({
      success: true,
      message: 'Cliente creato con successo',
      data: mappedNuovoCliente
    });
  } catch (error) {
    // Gestione errori
  }
}
```

### Lista Clienti
```typescript
async getClienti(req: Request, res: Response) {
  try {
    const result = await clienteRepository.findAll(page, limit, search);
    
    // Mappa i campi dal backend al frontend
    const mappedClienti = result.clienti.map(cliente => 
      mapClienteFieldsToFrontend(cliente)
    );
    
    res.json({
      success: true,
      data: mappedClienti,
      pagination: result.pagination
    });
  } catch (error) {
    // Gestione errori
  }
}
```

## Regole di Mappatura

### Frontend → Backend
- **Input**: Oggetto con campi PascalCase
- **Output**: Oggetto con campi camelCase
- **Uso**: Prima di salvare nel database

### Backend → Frontend
- **Input**: Oggetto con campi camelCase dal database
- **Output**: Oggetto con campi PascalCase
- **Uso**: Prima di inviare al frontend

## Campi Speciali

### Campi Booleani
```typescript
// Frontend
'AttivoC': true,
'Privato': false,
'SelezioneSpedFat': true

// Backend
'attivoC': true,
'privato': false,
'selezioneSpedFat': true
```

### Campi Numerici
```typescript
// Frontend
'CAPc': "12345",
'IVA': "22",
'AnnoUltimoVendita': "2023"

// Backend
'capc': "12345",
'iva': "22",
'annoUltimoVendita': "2023"
```

### Campi Data
```typescript
// Frontend
'AttivoDalC': "2023-01-01",
'NonAttivoDalC': "2023-12-31"

// Backend
'attivoDalC': "2023-01-01",
'nonAttivoDalC': "2023-12-31"
```

## Estensione per Nuove Entità

### 1. Creare Mappa Campi
```typescript
const fornitoreFieldMap: Record<string, string> = {
  'IdFornitore': 'id',
  'RagioneSocialeF': 'ragioneSocialeF',
  'Telefono': 'telefono',
  // ... altri campi
};
```

### 2. Creare Funzioni di Mappatura
```typescript
export function mapFornitoreFields(fornitoreData: any): any {
  const mappedData: any = {};
  
  for (const [frontendField, backendField] of Object.entries(fornitoreFieldMap)) {
    if (fornitoreData.hasOwnProperty(frontendField)) {
      mappedData[backendField] = fornitoreData[frontendField];
    }
  }
  
  return mappedData;
}

export function mapFornitoreFieldsToFrontend(fornitoreData: any): any {
  const mappedData: any = {};
  
  for (const [frontendField, backendField] of Object.entries(fornitoreFieldMap)) {
    if (fornitoreData.hasOwnProperty(backendField)) {
      mappedData[frontendField] = fornitoreData[backendField];
    }
  }
  
  return mappedData;
}
```

### 3. Utilizzare nei Controller
```typescript
// Creazione
const mappedData = mapFornitoreFields(fornitoreData);
const nuovoFornitore = await fornitoreRepository.create(mappedData);

// Lista
const mappedFornitori = result.fornitori.map(fornitore => 
  mapFornitoreFieldsToFrontend(fornitore)
);
```

## Best Practices

### 1. Consistenza
- **SEMPRE** usare le funzioni di mappatura
- **NON** mappare manualmente i campi
- **Mantenere** aggiornata la mappa dei campi

### 2. Performance
- **Evitare** mappature ridondanti
- **Ottimizzare** per grandi dataset
- **Considerare** caching per mappe statiche

### 3. Manutenzione
- **Documentare** nuovi campi aggiunti
- **Testare** mappature dopo modifiche
- **Verificare** compatibilità con frontend

## Troubleshooting

### Problemi Comuni

#### 1. Campo non mappato
```typescript
// ❌ Errore: campo non trovato
if (!clienteData.ragioneSocialeC) { ... }

// ✅ Corretto: usare mappatura
const mappedData = mapClienteFields(clienteData);
if (!mappedData.ragioneSocialeC) { ... }
```

#### 2. Validazione fallisce
```typescript
// ❌ Errore: validazione su campo sbagliato
if (!clienteData.RagioneSocialeC) { ... }

// ✅ Corretto: validare dopo mappatura
const mappedData = mapClienteFields(clienteData);
if (!mappedData.ragioneSocialeC) { ... }
```

#### 3. Frontend non riceve dati
```typescript
// ❌ Errore: inviare dati non mappati
res.json({ success: true, data: cliente });

// ✅ Corretto: mappare prima dell'invio
const mappedCliente = mapClienteFieldsToFrontend(cliente);
res.json({ success: true, data: mappedCliente });
```

## Checklist Implementazione

- [ ] Mappa campi definita per l'entità
- [ ] Funzioni di mappatura implementate
- [ ] Controller aggiornati per usare mappatura
- [ ] Validazioni aggiornate per nomi backend
- [ ] Test di mappatura bidirezionale
- [ ] Documentazione aggiornata
- [ ] Frontend compatibile con nuovi nomi

## Note Importanti

1. **Retrocompatibilità**: Il sistema mantiene compatibilità con dati esistenti
2. **Estensibilità**: Facile aggiungere nuove entità
3. **Manutenibilità**: Centralizzato in un unico file
4. **Performance**: Mappatura efficiente senza overhead significativo
5. **Debugging**: Facile tracciare problemi di mappatura
