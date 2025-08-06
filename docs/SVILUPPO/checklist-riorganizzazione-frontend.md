# Checklist Riorganizzazione Frontend - Componenti Riutilizzabili

## 🎯 **OBIETTIVO PRINCIPALE**
Eliminare il componente monolitico `FormClienteCompleto.tsx` (75KB, 1829 righe) e creare componenti riutilizzabili seguendo le regole del progetto.

## 📊 **SITUAZIONE ATTUALE**

### ❌ **Problemi Critici**
- **Componente gigante**: `FormClienteCompleto.tsx` (75KB, 1829 righe) - VIETATO dalle regole
- **Mancanza componenti UI**: Solo Button e Input, mancano Modal, Table, Form, LoadingSpinner, ecc.
- **Organizzazione caotica**: Componenti specifici mescolati con layout
- **Duplicazione probabile**: Tra clienti e fornitori

### ✅ **Cosa Funziona**
- Componenti UI base: `Button.tsx`, `Input.tsx` ben strutturati
- Layout components: `AppLayout.tsx`, `ClientLayout.tsx`, `ProtectedRoute.tsx`
- Struttura Next.js corretta

---

## 🏗️ **STRUTTURA CARTELLE TARGET**

```
frontend/components/
├── ui/                    # Componenti UI di base riutilizzabili
│   ├── Button.tsx        ✅ (esistente)
│   ├── Input.tsx         ✅ (esistente)
│   ├── Modal.tsx         ❌ (da creare)
│   ├── Table.tsx         ❌ (da creare)
│   ├── Form.tsx          ❌ (da creare)
│   ├── LoadingSpinner.tsx ❌ (da creare)
│   ├── ErrorMessage.tsx  ❌ (da creare)
│   ├── EmptyState.tsx    ❌ (da creare)
│   ├── Select.tsx        ❌ (da creare)
│   ├── Checkbox.tsx      ❌ (da creare)
│   ├── Radio.tsx         ❌ (da creare)
│   ├── TextArea.tsx      ✅ (esistente in Input.tsx)
│   └── index.ts          ❌ (da creare - export centralizzato)
├── layout/               # Componenti di layout
│   ├── AppLayout.tsx     ✅ (esistente)
│   ├── ClientLayout.tsx  ✅ (esistente)
│   ├── ProtectedRoute.tsx ✅ (esistente)
│   ├── Header.tsx        ❌ (da creare)
│   ├── Sidebar.tsx       ✅ (esistente - da spostare)
│   ├── Footer.tsx        ❌ (da creare)
│   └── index.ts          ❌ (da creare)
├── forms/                # Componenti specifici per form riutilizzabili
│   ├── FormSection.tsx   ❌ (da creare)
│   ├── FormField.tsx     ❌ (da creare)
│   ├── FormActions.tsx   ❌ (da creare)
│   ├── FormTabs.tsx      ❌ (da creare)
│   └── index.ts          ❌ (da creare)
├── tables/               # Componenti per tabelle e data display
│   ├── DataTable.tsx     ❌ (da creare)
│   ├── TableFilters.tsx  ❌ (da creare)
│   ├── TablePagination.tsx ❌ (da creare)
│   └── index.ts          ❌ (da creare)
├── modals/               # Componenti modali e dialog
│   ├── ConfirmDialog.tsx ❌ (da creare)
│   ├── FormModal.tsx     ❌ (da creare)
│   ├── InfoModal.tsx     ❌ (da creare)
│   └── index.ts          ❌ (da creare)
└── business/             # Componenti specifici del business
    ├── clienti/          # Componenti specifici clienti
    │   ├── FormClienteAnagrafica.tsx ❌ (da creare)
    │   ├── FormClienteContatti.tsx   ❌ (da creare)
    │   ├── FormClienteIndirizzi.tsx  ❌ (da creare)
    │   ├── FormClienteFatturazione.tsx ❌ (da creare)
    │   ├── FormClienteBanca.tsx      ❌ (da creare)
    │   ├── FormClienteAltro.tsx      ❌ (da creare)
    │   └── index.ts                  ❌ (da creare)
    ├── fornitori/        # Componenti specifici fornitori
    │   ├── FormFornitoreAnagrafica.tsx ❌ (da creare)
    │   ├── FormFornitoreContatti.tsx   ❌ (da creare)
    │   └── index.ts                    ❌ (da creare)
    └── shared/           # Componenti condivisi tra business
        ├── FormAnagrafica.tsx         ❌ (da creare)
        ├── FormContatti.tsx           ❌ (da creare)
        ├── FormIndirizzi.tsx          ❌ (da creare)
        └── index.ts                   ❌ (da creare)
```

---

## 📝 **PIANO D'AZIONE - FASI**

### **FASE 1: Struttura e Componenti UI Base** (2-3 giorni)
1. ✅ Creare struttura cartelle
2. ✅ Creare componenti UI mancanti (Modal, LoadingSpinner, ErrorMessage, EmptyState)
3. ✅ Creare file index.ts per export centralizzati

### **FASE 2: Layout e Forms** (1-2 giorni)
1. ✅ Spostare Sidebar in layout/
2. ✅ Creare componenti form riutilizzabili (FormSection, FormField, FormActions)

### **FASE 3: Refactoring Componente Gigante** (3-4 giorni)
1. ✅ Analizzare FormClienteCompleto.tsx (1829 righe)
2. ✅ Estrarre logica comune in utils/ e hooks/
3. ✅ Creare componenti specifici per sezioni
4. ✅ Creare FormCliente.tsx (coordinatore)

### **FASE 4: Componenti Shared** (1-2 giorni)
1. ✅ Creare componenti condivisi tra clienti/fornitori
2. ✅ Creare componenti specifici fornitori

### **FASE 5: Tables e Modals** (1-2 giorni)
1. ✅ Creare DataTable.tsx
2. ✅ Creare componenti modali (ConfirmDialog, FormModal)

### **FASE 6: Testing e Documentazione** (1-2 giorni)
1. ✅ Testare tutti i componenti
2. ✅ Documentare con esempi
3. ✅ Aggiornare import

### **FASE 7: Pulizia e Ottimizzazione** (1 giorno)
1. ✅ Rimuovere codice duplicato
2. ✅ Ottimizzare performance
3. ✅ Verificare zero warning

---

## ✅ **CRITERI DI SUCCESSO**

### **Obiettivi Quantitativi**
- [ ] Ridurre dimensione componenti da 75KB a <10KB ciascuno
- [ ] Aumentare riutilizzo componenti del 80%
- [ ] Ridurre duplicazione codice del 70%
- [ ] Zero warning nel terminale

### **Obiettivi Qualitativi**
- [ ] Componenti piccoli e specializzati (principio DRY)
- [ ] Separazione chiara delle responsabilità
- [ ] Documentazione completa e aggiornata
- [ ] Facilità di manutenzione e collaborazione

---

## 🚨 **REGOLE OBBLIGATORIE**

1. **Commit solo versioni funzionanti**: Testare ogni componente prima del commit
2. **Documentazione sempre aggiornata**: Aggiornare questa checklist ad ogni passo
3. **Principio DRY**: Evitare duplicazione di codice
4. **Componenti riutilizzabili**: Priorità ai componenti che possono essere usati in più contesti
5. **Testing continuo**: Verificare che tutto funzioni dopo ogni modifica

---

## 📝 **CHECKLIST DETTAGLIATA FASE 1: CREAZIONE STRUTTURA E COMPONENTI UI**

### **1.1 Preparazione Struttura Cartelle**
- [ ] Creare cartella `components/layout/`
- [ ] Creare cartella `components/forms/`
- [ ] Creare cartella `components/tables/`
- [ ] Creare cartella `components/modals/`
- [ ] Creare cartella `components/business/`
- [ ] Creare cartella `components/business/clienti/`
- [ ] Creare cartella `components/business/fornitori/`
- [ ] Creare cartella `components/business/shared/`
- [ ] Spostare `Sidebar.tsx` in `components/layout/`
- [ ] Creare file `index.ts` in ogni cartella per export centralizzato

### **1.2 Componenti UI di Base (Priorità ALTA)**
- [ ] **Modal.tsx** - Componente modale riutilizzabile
  - [ ] Props: `isOpen`, `onClose`, `title`, `children`, `size`
  - [ ] Varianti: `sm`, `md`, `lg`, `xl`
  - [ ] Supporto per header, body, footer
  - [ ] Gestione focus e keyboard navigation
  - [ ] Documentazione con esempi

- [ ] **LoadingSpinner.tsx** - Indicatore di caricamento
  - [ ] Props: `size`, `color`, `text`
  - [ ] Varianti: `sm`, `md`, `lg`
  - [ ] Supporto per testo opzionale
  - [ ] Animazione fluida

- [ ] **ErrorMessage.tsx** - Gestione errori uniforme
  - [ ] Props: `error`, `title`, `onRetry`
  - [ ] Supporto per errori di rete, validazione, generici
  - [ ] Icone appropriate per tipo di errore

- [ ] **EmptyState.tsx** - Stati vuoti per liste
  - [ ] Props: `title`, `description`, `icon`, `action`
  - [ ] Supporto per azioni personalizzate
  - [ ] Icone appropriate per contesto

### **1.3 Componenti UI di Base (Priorità MEDIA)**
- [ ] **Select.tsx** - Componente select
  - [ ] Props: `options`, `value`, `onChange`, `placeholder`
  - [ ] Supporto per ricerca, multi-select
  - [ ] Stile coerente con Input

- [ ] **Checkbox.tsx** - Componente checkbox
  - [ ] Props: `checked`, `onChange`, `label`, `disabled`
  - [ ] Supporto per indeterminate state

- [ ] **Radio.tsx** - Componente radio button
  - [ ] Props: `options`, `value`, `onChange`
  - [ ] Supporto per layout verticale/orizzontale

- [ ] **Table.tsx** - Componente tabella base
  - [ ] Props: `columns`, `data`, `sortable`, `selectable`
  - [ ] Supporto per sorting, filtering, pagination
  - [ ] Stile coerente con design system

### **1.4 File di Export Centralizzati**
- [ ] Creare `components/ui/index.ts`
- [ ] Creare `components/layout/index.ts`
- [ ] Creare `components/forms/index.ts`
- [ ] Creare `components/tables/index.ts`
- [ ] Creare `components/modals/index.ts`

---

## 📝 **CHECKLIST FASE 2: COMPONENTI LAYOUT E FORMS**

### **2.1 Componenti Layout**
- [ ] **Header.tsx** - Header dell'applicazione
  - [ ] Props: `title`, `actions`, `breadcrumbs`
  - [ ] Supporto per azioni personalizzate
  - [ ] Integrazione con sistema di navigazione

- [ ] **Footer.tsx** - Footer dell'applicazione
  - [ ] Props: `copyright`, `links`
  - [ ] Stile coerente con design system

### **2.2 Componenti Forms Riutilizzabili**
- [ ] **FormSection.tsx** - Sezione di form
  - [ ] Props: `title`, `description`, `children`, `collapsible`
  - [ ] Supporto per validazione per sezione
  - [ ] Indicatori di stato (valid, invalid, pending)

- [ ] **FormField.tsx** - Campo di form generico
  - [ ] Props: `label`, `error`, `helper`, `required`
  - [ ] Supporto per diversi tipi di input
  - [ ] Gestione errori e validazione

- [ ] **FormActions.tsx** - Azioni del form
  - [ ] Props: `onSave`, `onCancel`, `onDelete`, `loading`
  - [ ] Supporto per azioni personalizzate
  - [ ] Stile coerente con Button

- [ ] **FormTabs.tsx** - Tabs per form complessi
  - [ ] Props: `tabs`, `activeTab`, `onTabChange`
  - [ ] Supporto per validazione per tab
  - [ ] Indicatori di stato per tab

---

## 📝 **CHECKLIST FASE 3: REFACTORING COMPONENTE GIGANTE**

### **3.1 Analisi e Pianificazione**
- [ ] Analizzare `FormClienteCompleto.tsx` (1829 righe)
- [ ] Identificare sezioni logiche:
  - [ ] Sezione Anagrafica (righe ~200-400)
  - [ ] Sezione Contatti (righe ~400-600)
  - [ ] Sezione Indirizzi (righe ~600-800)
  - [ ] Sezione Fatturazione (righe ~800-1000)
  - [ ] Sezione Banca (righe ~1000-1200)
  - [ ] Sezione Altro (righe ~1200-1400)
  - [ ] Logica comune e utilities (righe ~1400-1829)

### **3.2 Estrazione Logica Comune**
- [ ] Creare `utils/form-helpers.ts`
  - [ ] Funzione `normalizzaNumerici`
  - [ ] Funzione `generaProssimoIdCliente`
  - [ ] Funzione `getCampiSezione`
  - [ ] Funzione `sezioneHaErrori`

- [ ] Creare `hooks/useFormValidation.ts`
  - [ ] Hook per validazione form
  - [ ] Gestione errori per sezione
  - [ ] Validazione in tempo reale

- [ ] Creare `hooks/useFormData.ts`
  - [ ] Hook per gestione dati form
  - [ ] Normalizzazione automatica
  - [ ] Gestione stato form

### **3.3 Creazione Componenti Specifici Cliente**
- [ ] **FormClienteAnagrafica.tsx**
  - [ ] Props: `data`, `onChange`, `errors`
  - [ ] Campi: RagioneSocialeC, CodiceFiscale, PartitaIva
  - [ ] Validazione specifica per anagrafica

- [ ] **FormClienteContatti.tsx**
  - [ ] Props: `data`, `onChange`, `errors`
  - [ ] Campi: Telefono, email, contatti
  - [ ] Validazione specifica per contatti

- [ ] **FormClienteIndirizzi.tsx**
  - [ ] Props: `data`, `onChange`, `errors`
  - [ ] Campi: IndirizzoC, CAPc, CITTAc, PROVc, NAZc
  - [ ] Supporto per indirizzi multipli

- [ ] **FormClienteFatturazione.tsx**
  - [ ] Props: `data`, `onChange`, `errors`
  - [ ] Campi: IVA, NoteSpedFat, Articolo15
  - [ ] Validazione specifica per fatturazione

- [ ] **FormClienteBanca.tsx**
  - [ ] Props: `data`, `onChange`, `errors`
  - [ ] Campi: SpeseBancarie, dati bancari
  - [ ] Validazione specifica per banca

- [ ] **FormClienteAltro.tsx**
  - [ ] Props: `data`, `onChange`, `errors`
  - [ ] Campi: AnnoUltimoVendita, note varie
  - [ ] Validazione specifica per altri dati

### **3.4 Componente Coordinatore**
- [ ] **FormCliente.tsx** (nuovo componente principale)
  - [ ] Props: `isOpen`, `onClose`, `onSave`, `clienteEdit`
  - [ ] Gestione tabs e navigazione
  - [ ] Coordinamento tra componenti specifici
  - [ ] Gestione submit e validazione globale

---

## 📝 **CHECKLIST FASE 4: COMPONENTI BUSINESS SHARED**

### **4.1 Componenti Condivisi**
- [ ] **FormAnagrafica.tsx** (generico)
  - [ ] Props: `data`, `onChange`, `errors`, `type` (cliente/fornitore)
  - [ ] Campi comuni: ragione sociale, codice fiscale, partita IVA
  - [ ] Validazione adattiva per tipo

- [ ] **FormContatti.tsx** (generico)
  - [ ] Props: `data`, `onChange`, `errors`, `type`
  - [ ] Campi comuni: telefono, email, contatti
  - [ ] Validazione adattiva per tipo

- [ ] **FormIndirizzi.tsx** (generico)
  - [ ] Props: `data`, `onChange`, `errors`, `type`
  - [ ] Campi comuni: indirizzo, CAP, città, provincia, nazione
  - [ ] Supporto per indirizzi multipli

### **4.2 Componenti Specifici Fornitori**
- [ ] **FormFornitoreAnagrafica.tsx**
  - [ ] Estende FormAnagrafica con campi specifici fornitori
  - [ ] Validazione specifica fornitori

- [ ] **FormFornitoreContatti.tsx**
  - [ ] Estende FormContatti con campi specifici fornitori
  - [ ] Validazione specifica fornitori

---

## 📝 **CHECKLIST FASE 5: COMPONENTI TABLES E MODALS**

### **5.1 Componenti Tables**
- [ ] **DataTable.tsx** - Tabella dati avanzata
  - [ ] Props: `columns`, `data`, `sortable`, `filterable`, `selectable`
  - [ ] Supporto per sorting, filtering, pagination
  - [ ] Integrazione con UniversalTableConfigurator esistente

- [ ] **TableFilters.tsx** - Filtri per tabella
  - [ ] Props: `filters`, `onFilterChange`, `onClear`
  - [ ] Supporto per filtri multipli
  - [ ] Stile coerente con design system

- [ ] **TablePagination.tsx** - Paginazione tabella
  - [ ] Props: `currentPage`, `totalPages`, `onPageChange`
  - [ ] Supporto per page size selector
  - [ ] Indicatori di stato

### **5.2 Componenti Modals**
- [ ] **ConfirmDialog.tsx** - Dialog di conferma
  - [ ] Props: `isOpen`, `title`, `message`, `onConfirm`, `onCancel`
  - [ ] Supporto per azioni pericolose
  - [ ] Stile coerente con design system

- [ ] **FormModal.tsx** - Modal per form
  - [ ] Props: `isOpen`, `title`, `onClose`, `children`
  - [ ] Integrazione con FormActions
  - [ ] Gestione loading state

- [ ] **InfoModal.tsx** - Modal informativo
  - [ ] Props: `isOpen`, `title`, `content`, `onClose`
  - [ ] Supporto per contenuto HTML
  - [ ] Stile coerente con design system

---

## 📝 **CHECKLIST FASE 6: TESTING E DOCUMENTAZIONE**

### **6.1 Testing Componenti**
- [ ] Testare ogni componente UI di base
- [ ] Testare integrazione tra componenti
- [ ] Testare FormCliente refactorizzato
- [ ] Testare componenti shared tra clienti/fornitori
- [ ] Verificare che tutto funzioni come prima del refactoring

### **6.2 Documentazione Componenti**
- [ ] Documentare ogni componente con esempi
- [ ] Includere tutte le props disponibili con tipi TypeScript
- [ ] Fornire esempi di codice per i casi d'uso più comuni
- [ ] Documentare eventuali limitazioni o requisiti specifici

### **6.3 Aggiornamento Import**
- [ ] Aggiornare tutti gli import nei file esistenti
- [ ] Utilizzare export centralizzati da index.ts
- [ ] Verificare che non ci siano import circolari
- [ ] Testare che tutto compili correttamente

---

## 📝 **CHECKLIST FASE 7: PULIZIA E OTTIMIZZAZIONE**

### **7.1 Pulizia Codice**
- [ ] Rimuovere codice duplicato
- [ ] Eliminare componenti obsoleti
- [ ] Aggiornare nomi file secondo convenzioni (minuscolo, trattini)
- [ ] Verificare che non ci siano warning

### **7.2 Ottimizzazione Performance**
- [ ] Implementare React.memo dove appropriato
- [ ] Ottimizzare re-render con useCallback/useMemo
- [ ] Verificare bundle size
- [ ] Testare performance con React DevTools

### **7.3 Controllo Qualità**
- [ ] Verificare che non ci sia duplicazione di codice
- [ ] Assicurarsi che i componenti esistenti vengano riutilizzati
- [ ] Testare che i componenti funzionino in diversi contesti
- [ ] Verificare accessibilità (aria-labels, keyboard navigation)

---

## 📅 **TIMELINE STIMATA**

- **Fase 1**: 2-3 giorni (struttura + componenti UI base)
- **Fase 2**: 1-2 giorni (layout + forms)
- **Fase 3**: 3-4 giorni (refactoring componente gigante)
- **Fase 4**: 1-2 giorni (componenti shared)
- **Fase 5**: 1-2 giorni (tables + modals)
- **Fase 6**: 1-2 giorni (testing + documentazione)
- **Fase 7**: 1 giorno (pulizia + ottimizzazione)

**TOTALE**: 10-16 giorni di lavoro

---

**Ultimo aggiornamento**: [DATA]
**Stato**: Iniziato
**Responsabile**: [NOME] 