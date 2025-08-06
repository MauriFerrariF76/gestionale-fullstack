# Sistema di Form Riutilizzabile

## Panoramica

Il sistema di form riutilizzabile è progettato per fornire un'esperienza di sviluppo consistente e manutenibile per tutti i form dell'applicazione. Segue le best practice del progetto e promuove la riutilizzazione dei componenti.

## Componenti Principali

### 1. Form (Componente Principale)

Il componente `Form` è il cuore del sistema, che orchestri tutti gli altri componenti.

```typescript
import { Form } from '@/components/forms';

// Configurazione base
const formConfig = {
  sections: [
    {
      id: 'anagrafica',
      title: 'Dati Anagrafici',
      fields: [
        {
          name: 'nome',
          label: 'Nome',
          type: 'text',
          required: true,
          placeholder: 'Inserisci il nome'
        }
      ]
    }
  ],
  validationSchema: {
    nome: { required: true, minLength: 2 }
  },
  onSubmit: (data) => console.log(data)
};
```

### 2. FormField

Componente per singoli campi del form con gestione errori e helper text.

```typescript
import { FormField } from '@/components/forms';

<FormField
  label="Email"
  required
  error="Email non valida"
  helper="Inserisci un indirizzo email valido"
>
  <input type="email" />
</FormField>
```

### 3. FormSection

Organizza i campi in sezioni logiche, supporta collapsible e stati di validazione.

```typescript
import { FormSection } from '@/components/forms';

<FormSection
  title="Dati Personali"
  description="Informazioni anagrafiche"
  collapsible={true}
  defaultCollapsed={false}
  error="Errore nella sezione"
  valid={true}
>
  {/* Campi del form */}
</FormSection>
```

### 4. FormTabs

Organizza il form in tab per una migliore UX.

```typescript
import { FormTabs } from '@/components/forms';

const tabs = [
  {
    id: 'personali',
    label: 'Dati Personali',
    content: <div>Contenuto tab</div>
  }
];

<FormTabs tabs={tabs} />
```

### 5. FormActions

Gestisce le azioni standard del form (Salva, Annulla, Elimina).

```typescript
import { FormActions } from '@/components/forms';

<FormActions
  onSave={handleSave}
  onCancel={handleCancel}
  onDelete={handleDelete}
  loading={false}
  disabled={false}
  showDelete={true}
/>
```

## Hook useForm

Il hook `useForm` fornisce una gestione avanzata dello stato del form.

```typescript
import { useForm } from '@/hooks/useForm';

interface ClienteForm {
  nome: string;
  email: string;
}

const {
  data,
  errors,
  touched,
  isValid,
  isDirty,
  setFieldValue,
  setFieldTouched,
  handleSubmit,
  handleCancel,
  loading,
} = useForm<ClienteForm>({
  initialData: { nome: '', email: '' },
  validationSchema: {
    nome: { required: true },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
  },
  onSubmit: async (data) => {
    // Gestione submit
  }
});
```

## Tipi di Validazione

### ValidationRule

```typescript
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}
```

### Esempi di Validazione

```typescript
const validationSchema = {
  // Campo obbligatorio
  nome: { required: true },
  
  // Lunghezza minima e massima
  descrizione: { minLength: 10, maxLength: 500 },
  
  // Pattern regex
  email: { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  
  // Validazione custom
  eta: {
    custom: (value) => {
      if (value && (parseInt(value) < 18 || parseInt(value) > 100)) {
        return 'Età deve essere tra 18 e 100 anni';
      }
      return null;
    }
  }
};
```

## Layout Disponibili

### 1. Layout Single (Default)

Form semplice con sezioni verticali.

```typescript
<Form
  sections={sections}
  layout="single"
  onSubmit={handleSubmit}
/>
```

### 2. Layout Tabs

Form organizzato in tab.

```typescript
<Form
  tabs={tabs}
  layout="tabs"
  onSubmit={handleSubmit}
/>
```

### 3. Layout Sections

Form con sezioni collassabili.

```typescript
<Form
  sections={sections}
  layout="sections"
  onSubmit={handleSubmit}
/>
```

## Tipi di Campi Supportati

### 1. Input Base

```typescript
{
  name: 'nome',
  label: 'Nome',
  type: 'text',
  placeholder: 'Inserisci il nome'
}
```

### 2. Email

```typescript
{
  name: 'email',
  label: 'Email',
  type: 'email',
  required: true
}
```

### 3. Password

```typescript
{
  name: 'password',
  label: 'Password',
  type: 'password',
  required: true
}
```

### 4. Number

```typescript
{
  name: 'eta',
  label: 'Età',
  type: 'number',
  placeholder: '25'
}
```

### 5. Select

```typescript
{
  name: 'citta',
  label: 'Città',
  type: 'select',
  options: [
    { value: 'MI', label: 'Milano' },
    { value: 'TO', label: 'Torino' }
  ]
}
```

### 6. Textarea

```typescript
{
  name: 'note',
  label: 'Note',
  type: 'textarea',
  placeholder: 'Inserisci note...'
}
```

### 7. Checkbox

```typescript
{
  name: 'newsletter',
  label: 'Iscrizione Newsletter',
  type: 'checkbox',
  defaultValue: false
}
```

### 8. Radio

```typescript
{
  name: 'tipo',
  label: 'Tipo Utente',
  type: 'radio',
  options: [
    { value: 'privato', label: 'Privato' },
    { value: 'azienda', label: 'Azienda' }
  ]
}
```

## Best Practice

### 1. Organizzazione dei Form

- **Usa sezioni logiche**: Raggruppa campi correlati in sezioni
- **Ordine logico**: Disponi i campi in ordine di importanza
- **Responsive**: Usa grid per layout responsive

### 2. Validazione

- **Validazione in tempo reale**: Mostra errori dopo che l'utente ha interagito
- **Messaggi chiari**: Scrivi messaggi di errore comprensibili
- **Validazione lato client**: Usa validazione custom per logica complessa

### 3. UX/UI

- **Stati di caricamento**: Mostra loading durante il submit
- **Feedback visivo**: Usa colori per indicare stati (valido, errore, pending)
- **Accessibilità**: Usa label e attributi ARIA appropriati

### 4. Performance

- **Validazione ottimizzata**: Evita validazioni non necessarie
- **Memoizzazione**: Usa useCallback per funzioni di validazione
- **Lazy loading**: Carica form complessi solo quando necessario

## Esempi Pratici

### Form Cliente Semplice

```typescript
const clienteForm = {
  sections: [
    {
      id: 'anagrafica',
      title: 'Dati Anagrafici',
      fields: [
        {
          name: 'ragioneSociale',
          label: 'Ragione Sociale',
          type: 'text',
          required: true
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true
        },
        {
          name: 'telefono',
          label: 'Telefono',
          type: 'text'
        }
      ]
    }
  ],
  validationSchema: {
    ragioneSociale: { required: true, minLength: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
  }
};
```

### Form Complesso con Tabs

```typescript
const formComplesso = {
  tabs: [
    {
      id: 'anagrafica',
      label: 'Anagrafica',
      sections: [
        { name: 'nome', label: 'Nome', type: 'text', required: true },
        { name: 'cognome', label: 'Cognome', type: 'text', required: true }
      ]
    },
    {
      id: 'contatti',
      label: 'Contatti',
      sections: [
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'telefono', label: 'Telefono', type: 'text' }
      ]
    }
  ]
};
```

## Migrazione da Form Esistenti

### Passo 1: Identifica i Campi

Analizza il form esistente e identifica:
- Campi e loro tipi
- Validazioni necessarie
- Relazioni tra campi

### Passo 2: Crea la Configurazione

```typescript
// Da FormClienteCompleto.tsx (1828 righe)
// A configurazione dichiarativa
const clienteFormConfig = {
  sections: [
    {
      id: 'anagrafica',
      title: 'Dati Anagrafici',
      fields: [
        { name: 'ragioneSociale', label: 'Ragione Sociale', type: 'text', required: true },
        { name: 'telefono', label: 'Telefono', type: 'text' },
        // ... altri campi
      ]
    }
  ]
};
```

### Passo 3: Sostituisci il Componente

```typescript
// Prima
<FormClienteCompleto isOpen={showForm} onClose={handleClose} />

// Dopo
<Form
  sections={clienteFormConfig.sections}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

## Vantaggi del Sistema

### 1. Riutilizzabilità
- Componenti modulari e riutilizzabili
- Configurazione dichiarativa
- Riduzione duplicazione codice

### 2. Manutenibilità
- Separazione logica e presentazione
- Validazione centralizzata
- Facile aggiunta nuovi campi

### 3. Consistenza
- UI/UX uniforme in tutta l'app
- Comportamento prevedibile
- Accessibilità integrata

### 4. Performance
- Validazione ottimizzata
- Re-render minimi
- Lazy loading supportato

## Troubleshooting

### Problema: Validazione non funziona
**Soluzione**: Verifica che il campo sia nel validationSchema e che le regole siano corrette.

### Problema: Form non si resetta
**Soluzione**: Usa `resetForm()` dal hook useForm o passa `initialData` aggiornato.

### Problema: Errori di TypeScript
**Soluzione**: Definisci interfacce per i dati del form e usa generics appropriati.

## Conclusione

Il sistema di form riutilizzabile fornisce una base solida per tutti i form dell'applicazione, promuovendo:
- **Consistenza** nell'esperienza utente
- **Riutilizzabilità** dei componenti
- **Manutenibilità** del codice
- **Performance** ottimizzate

Segui queste linee guida per implementare form robusti e scalabili. 