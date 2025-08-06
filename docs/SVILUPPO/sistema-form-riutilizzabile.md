# Sistema Form Riutilizzabile - Gestionale Fullstack

## 🎯 Panoramica

Il sistema di form riutilizzabile è stato progettato per eliminare la duplicazione di codice e standardizzare l'esperienza utente in tutta l'applicazione. Il sistema è basato su componenti modulari e un hook personalizzato per la gestione dello stato.

## 🏗️ Architettura del Sistema

### Componenti Principali

#### 1. **Form.tsx** - Componente Orchestratore
```typescript
interface FormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  initialData?: any;
  loading?: boolean;
  children: React.ReactNode;
}
```

**Responsabilità**:
- Gestione del layout generale del form
- Coordinamento tra sezioni e azioni
- Gestione degli stati di loading e errori

#### 2. **FormField.tsx** - Gestione Campi
```typescript
interface FormFieldProps {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
  required?: boolean;
  error?: string;
  helper?: string;
  options?: { value: string; label: string }[];
  icon?: React.ReactNode;
}
```

**Responsabilità**:
- Rendering uniforme dei campi
- Gestione errori e helper text
- Supporto per icone e validazione

#### 3. **FormSection.tsx** - Sezioni Collassabili
```typescript
interface FormSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}
```

**Responsabilità**:
- Organizzazione logica dei form complessi
- Miglioramento UX con sezioni collassabili
- Riduzione della complessità visiva

#### 4. **FormTabs.tsx** - Layout a Tab
```typescript
interface FormTabsProps {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  defaultTab?: string;
}
```

**Responsabilità**:
- Organizzazione di form molto complessi
- Navigazione tra sezioni correlate
- Miglioramento della navigabilità

#### 5. **FormActions.tsx** - Azioni Standard
```typescript
interface FormActionsProps {
  onSave: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  showDelete?: boolean;
}
```

**Responsabilità**:
- Azioni standardizzate (Salva, Annulla, Elimina)
- Stati di loading uniformi
- Comportamento coerente in tutta l'app

## 🎣 Hook Personalizzato - useForm.ts

### Caratteristiche Principali

```typescript
interface UseFormReturn<T> {
  data: T;
  errors: Record<string, string>;
  loading: boolean;
  setData: (data: Partial<T>) => void;
  setError: (field: string, error: string) => void;
  clearErrors: () => void;
  validate: () => boolean;
  submit: () => Promise<void>;
}
```

### Validazione Type-Safe

```typescript
// Validazione automatica per tipo
const { data, errors, validate } = useForm<ClienteFormData>({
  initialData: cliente,
  validators: {
    nome: (value) => value.length > 0 ? null : 'Nome obbligatorio',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Email non valida',
    telefono: (value) => value.length >= 10 ? null : 'Telefono non valido'
  }
});
```

### Gestione Errori Robusta

```typescript
// Gestione errori con feedback immediato
const { setError, clearErrors } = useForm<ClienteFormData>();

// Validazione in tempo reale
const handleFieldChange = (field: string, value: string) => {
  clearErrors();
  setData({ [field]: value });
  
  // Validazione immediata
  const error = validateField(field, value);
  if (error) {
    setError(field, error);
  }
};
```

## 🧪 Pagine di Test

### `/test-sistema-form`
Dimostrazione completa del sistema con:
- Tutti i tipi di campo supportati
- Validazione in tempo reale
- Gestione errori
- Stati di loading
- Sezioni collassabili
- Layout a tab

### `/test-hook-form`
Esempio pratico dell'utilizzo del hook useForm con:
- Form complesso cliente
- Validazione type-safe
- Gestione stato avanzata
- Integrazione con API

## 📚 Best Practice

### 1. **Composizione vs Monoliti**
```typescript
// ✅ CORRETTO - Composizione di componenti piccoli
<Form onSubmit={handleSubmit}>
  <FormSection title="Anagrafica">
    <FormField name="nome" label="Nome" type="text" required />
    <FormField name="cognome" label="Cognome" type="text" required />
  </FormSection>
  <FormSection title="Contatti">
    <FormField name="email" label="Email" type="email" required />
    <FormField name="telefono" label="Telefono" type="text" />
  </FormSection>
  <FormActions onSave={handleSave} onCancel={handleCancel} />
</Form>

// ❌ SBAGLIATO - Componente monolitico
<FormClienteCompleto cliente={cliente} onSubmit={handleSubmit} />
```

### 2. **Validazione Type-Safe**
```typescript
// ✅ CORRETTO - Validazione con TypeScript
interface ClienteFormData {
  nome: string;
  email: string;
  telefono?: string;
}

const { data, errors, validate } = useForm<ClienteFormData>({
  validators: {
    nome: (value) => value.length > 0 ? null : 'Nome obbligatorio',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Email non valida'
  }
});

// ❌ SBAGLIATO - Validazione senza tipi
const [data, setData] = useState({});
const [errors, setErrors] = useState({});
```

### 3. **Gestione Errori Uniforme**
```typescript
// ✅ CORRETTO - Gestione errori centralizzata
const { setError, clearErrors } = useForm<ClienteFormData>();

const handleSubmit = async () => {
  try {
    clearErrors();
    await api.saveCliente(data);
  } catch (error) {
    if (error.field) {
      setError(error.field, error.message);
    } else {
      setError('general', 'Errore durante il salvataggio');
    }
  }
};

// ❌ SBAGLIATO - Gestione errori inconsistente
const [nomeError, setNomeError] = useState('');
const [emailError, setEmailError] = useState('');
```

## 🔄 Stato Attuale del Refactoring

### ✅ **Completato (FASI 1-2)**
- ✅ **Struttura cartelle**: Tutte le cartelle create correttamente
- ✅ **Componenti UI di base**: Modal, LoadingSpinner, ErrorMessage, EmptyState, Select, Checkbox, Radio, Table
- ✅ **Componenti Layout**: Header, Footer, SimpleLayout, AuthLayout
- ✅ **Componenti Forms**: FormSection, FormField, FormActions, FormTabs
- ✅ **Sistema Form Riutilizzabile**: Creato e funzionante con validazione
- ✅ **Hook useForm**: Implementato con gestione stato avanzata
- ✅ **Pagine di test**: `/test-sistema-form` e `/test-hook-form` funzionanti

### 🚧 **In Corso (FASE 3)**
- ✅ **Analisi completata**: FormClienteCompleto.tsx (1829 righe) analizzato
- ✅ **Sistema form riutilizzabile**: Creato e funzionante
- ❌ **Componenti specifici cliente**: Da creare (FormClienteAnagrafica, FormClienteContatti, ecc.)
- ❌ **Estrazione logica comune**: Utils e hooks da creare
- ❌ **Refactoring completo**: Da completare

### ❌ **Da Fare (FASI 4-7)**
- ❌ **Componenti shared**: FormAnagrafica, FormContatti, FormIndirizzi
- ❌ **Tables e modals**: DataTable, ConfirmDialog, FormModal
- ❌ **Testing e documentazione**: Verifica funzionamento e guide
- ❌ **Pulizia e ottimizzazione**: Performance e bundle size

## 📋 Checklist Refactoring

### Fase 3 - Componenti Specifici
- [ ] **FormClienteAnagrafica**: Componente per dati anagrafici
- [ ] **FormClienteContatti**: Componente per contatti
- [ ] **FormClienteIndirizzi**: Componente per indirizzi
- [ ] **Utils comuni**: Funzioni di validazione e formattazione
- [ ] **Hooks specifici**: useCliente, useFornitore, ecc.

### Fase 4 - Componenti Shared
- [ ] **FormAnagrafica**: Componente generico per anagrafica
- [ ] **FormContatti**: Componente generico per contatti
- [ ] **FormIndirizzi**: Componente generico per indirizzi
- [ ] **FormDocumenti**: Componente per gestione documenti

### Fase 5 - Tables e Modals
- [ ] **DataTable**: Tabella dati con sorting, filtering, pagination
- [ ] **ConfirmDialog**: Dialog di conferma standardizzato
- [ ] **FormModal**: Modal per form con gestione stato

### Fase 6 - Testing e Documentazione
- [ ] **Test unitari**: Per tutti i componenti
- [ ] **Test integrazione**: Per il sistema completo
- [ ] **Documentazione**: Guide per sviluppatori
- [ ] **Esempi**: Codice di esempio per ogni componente

### Fase 7 - Pulizia e Ottimizzazione
- [ ] **Performance**: Ottimizzazione rendering
- [ ] **Bundle size**: Riduzione dimensioni
- [ ] **Code splitting**: Caricamento lazy dei componenti
- [ ] **Tree shaking**: Eliminazione codice non utilizzato

## 🎯 Criteri di Successo

### Metriche Quantitative
- **Riduzione duplicazione**: -80% codice duplicato
- **Performance**: <100ms rendering form complessi
- **Bundle size**: <50KB per il sistema form
- **Test coverage**: >90% per componenti critici

### Metriche Qualitative
- **Manutenibilità**: Modifiche rapide e sicure
- **Consistenza**: UX uniforme in tutta l'app
- **Accessibilità**: Supporto completo per screen reader
- **Responsive**: Funzionamento su tutti i dispositivi

## 📚 Risorse Aggiuntive

### Documentazione
- **Componenti UI**: `/components/ui/README.md`
- **Hook useForm**: `/hooks/useForm.md`
- **Best Practice**: `/docs/SVILUPPO/convenzioni-nomenclatura.md`

### Esempi di Codice
- **Form semplice**: `/examples/form-semplice.tsx`
- **Form complesso**: `/examples/form-complesso.tsx`
- **Validazione custom**: `/examples/validazione-custom.tsx`

### Testing
- **Test unitari**: `/__tests__/components/form/`
- **Test integrazione**: `/__tests__/hooks/useForm.test.ts`
- **Test e2e**: `/cypress/integration/form.spec.ts`

---

**Nota**: Questo sistema è progettato per essere estensibile e manutenibile. Ogni nuovo componente deve seguire le convenzioni stabilite e essere testato prima dell'integrazione. 