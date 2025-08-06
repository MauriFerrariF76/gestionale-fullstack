# Convenzioni di Nomenclatura - Gestionale Fullstack

## 🎯 Panoramica

Questo documento definisce le convenzioni di nomenclatura standardizzate per tutto il progetto, garantendo consistenza, leggibilità e manutenibilità del codice.

## 📁 Convenzioni File e Cartelle

### Nomi File
- **Sempre minuscolo**: Utilizzare esclusivamente lettere minuscole
- **Separatori con trattini**: Utilizzare trattini (`-`) per separare le parole
- **Nessuna maiuscola**: Evitare completamente l'uso di maiuscole

#### ✅ **Esempi Corretti**
```
✅ automazione.md
✅ checklist-automazione.md
✅ guida-backup-e-ripristino.md
✅ sistema-form-riutilizzabile.md
✅ convenzioni-nomenclatura-aggiornate.md
```

#### ❌ **Esempi Sbagliati**
```
❌ AUTOMAZIONE.md
❌ CHECKLIST-AUTOMAZIONE.md
❌ GuidaBackup.md
❌ sistemaForm.md
❌ convenzioni_nomenclatura.md
```

### Struttura Cartelle
```
docs/
├── SVILUPPO/           # Materiale di sviluppo
├── MANUALE/            # Guide e manuali utente
├── server/             # Configurazioni server
└── archivio/           # Materiale storico
```

## 🏗️ Convenzioni Codice

### Componenti React

#### Nomi Componenti
- **PascalCase**: Per i nomi dei componenti
- **Descrittivi**: Nomi che descrivono chiaramente la funzione

```typescript
// ✅ CORRETTO
export const FormClienteAnagrafica = () => { ... }
export const DataTable = () => { ... }
export const LoadingSpinner = () => { ... }

// ❌ SBAGLIATO
export const Form = () => { ... }
export const Table = () => { ... }
export const Spinner = () => { ... }
```

#### File Componenti
- **PascalCase**: Nome file uguale al nome del componente
- **Estensione .tsx**: Per componenti con JSX

```
✅ FormClienteAnagrafica.tsx
✅ DataTable.tsx
✅ LoadingSpinner.tsx
❌ form-cliente-anagrafica.tsx
❌ data-table.tsx
```

### Hook Personalizzati

#### Nomi Hook
- **use + PascalCase**: Prefisso "use" seguito da nome descrittivo

```typescript
// ✅ CORRETTO
export const useForm = () => { ... }
export const useCliente = () => { ... }
export const useFornitore = () => { ... }

// ❌ SBAGLIATO
export const formHook = () => { ... }
export const clienteHook = () => { ... }
```

#### File Hook
- **camelCase**: Nome file in camelCase
- **Estensione .ts**: Per hook senza JSX

```
✅ useForm.ts
✅ useCliente.ts
✅ useFornitore.ts
❌ use-form.ts
❌ use_cliente.ts
```

### Funzioni e Variabili

#### Funzioni
- **camelCase**: Per nomi di funzioni
- **Verbi**: Iniziare con verbi che descrivono l'azione

```typescript
// ✅ CORRETTO
const handleSubmit = () => { ... }
const validateEmail = (email: string) => { ... }
const formatCurrency = (amount: number) => { ... }

// ❌ SBAGLIATO
const submit = () => { ... }
const email = (email: string) => { ... }
const currency = (amount: number) => { ... }
```

#### Variabili
- **camelCase**: Per nomi di variabili
- **Descrittivi**: Nomi che descrivono chiaramente il contenuto

```typescript
// ✅ CORRETTO
const clienteData = { ... }
const isLoading = false
const errorMessage = "Errore di validazione"

// ❌ SBAGLIATO
const data = { ... }
const loading = false
const error = "Errore di validazione"
```

### Interfacce e Tipi

#### Interfacce
- **PascalCase**: Per nomi di interfacce
- **Prefisso I**: Per interfacce (opzionale)

```typescript
// ✅ CORRETTO
interface ClienteFormData {
  nome: string;
  email: string;
  telefono?: string;
}

interface IFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

// ❌ SBAGLIATO
interface clienteFormData {
  nome: string;
}

interface formProps {
  onSubmit: (data: any) => void;
}
```

#### Tipi
- **PascalCase**: Per nomi di tipi
- **Suffisso Type**: Per tipi complessi

```typescript
// ✅ CORRETTO
type FormFieldType = 'text' | 'email' | 'password';
type ValidationResultType = {
  isValid: boolean;
  errors: string[];
};

// ❌ SBAGLIATO
type formFieldType = 'text' | 'email';
type validationResult = {
  isValid: boolean;
};
```

## 🐳 Convenzioni Docker

### Comandi Docker Compose
- **Sempre `docker compose`**: Utilizzare la sintassi corretta senza trattino
- **Nessun `docker-compose`**: Evitare la sintassi deprecata

```bash
# ✅ CORRETTO
docker compose up -d
docker compose down
docker compose logs -f
docker compose build --no-cache

# ❌ SBAGLIATO (DEPRECATO)
docker-compose up -d
docker-compose down
docker-compose logs -f
docker-compose build --no-cache
```

### File di Configurazione
- **docker-compose.yml**: Nome file di configurazione
- **Dockerfile**: Nome file per build container

```
✅ docker-compose.yml
✅ Dockerfile
✅ .dockerignore
❌ docker-compose.yaml
❌ dockerfile
```

## 📝 Convenzioni Documentazione

### Titoli e Sezioni
- **H1 (#)**: Solo per il titolo principale
- **H2 (##)**: Per sezioni principali
- **H3 (###)**: Per sottosezioni
- **H4 (####)**: Per dettagli specifici

```markdown
# Titolo Principale

## Sezione Principale

### Sottosezione

#### Dettaglio Specifico
```

### Emoji e Icone
- **Consistenza**: Utilizzare emoji per categorizzare sezioni
- **Significato**: Ogni emoji deve avere un significato chiaro

```markdown
## 🎯 Obiettivo
## 🏗️ Architettura
## 🐳 Docker
## 📝 Documentazione
## ✅ Checklist
## ❌ Problemi
## 🚨 Emergenza
```

### Blocchi di Codice
- **Linguaggio specificato**: Sempre specificare il linguaggio
- **Commenti**: Aggiungere commenti per spiegare il codice

```markdown
```typescript
// Esempio di componente React
export const FormField = ({ name, label }: FormFieldProps) => {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} />
    </div>
  );
};
```

```bash
# Comando Docker corretto
docker compose up -d
```
```

## 🔧 Convenzioni Script

### Script Bash
- **camelCase**: Per nomi di script
- **Descrittivi**: Nomi che descrivono la funzione
- **Estensione .sh**: Per script bash

```bash
# ✅ CORRETTO
backupDocker.sh
setupEnvironment.sh
deployProduction.sh

# ❌ SBAGLIATO
backup_docker.sh
setup-environment.sh
deploy_production.sh
```

### Variabili Script
- **MAIUSCOLE**: Per variabili d'ambiente e configurazione
- **camelCase**: Per variabili locali

```bash
# ✅ CORRETTO
export DATABASE_URL="postgresql://..."
export BACKUP_DIR="/opt/backups"
local backupFile="backup_$(date +%Y%m%d).sql"

# ❌ SBAGLIATO
export database_url="postgresql://..."
export backup_dir="/opt/backups"
local BACKUP_FILE="backup_$(date +%Y%m%d).sql"
```

## 📋 Checklist Applicazione

### File da Rinominare
- [ ] **Verificare tutti i file**: Controllare nomi non conformi
- [ ] **Rinominare file**: Applicare convenzioni corrette
- [ ] **Aggiornare riferimenti**: Modificare import e link
- [ ] **Testare funzionamento**: Verificare che tutto funzioni

### Codice da Correggere
- [ ] **Componenti React**: Verificare nomi componenti
- [ ] **Hook personalizzati**: Controllare prefisso "use"
- [ ] **Interfacce e tipi**: Verificare PascalCase
- [ ] **Funzioni e variabili**: Controllare camelCase

### Documentazione da Aggiornare
- [ ] **README**: Aggiornare riferimenti a file
- [ ] **Guide**: Correggere esempi di codice
- [ ] **Script**: Verificare nomi file e variabili
- [ ] **Docker**: Controllare comandi corretti

## 🎯 Best Practice

### 1. **Consistenza**
- Mantenere le stesse convenzioni in tutto il progetto
- Non mescolare stili diversi
- Documentare eventuali eccezioni

### 2. **Leggibilità**
- Preferire nomi descrittivi a nomi brevi
- Evitare abbreviazioni non standard
- Utilizzare commenti per chiarire nomi complessi

### 3. **Manutenibilità**
- Scegliere nomi che resistano al tempo
- Evitare nomi legati a implementazioni specifiche
- Preferire nomi che descrivano l'intento

### 4. **Automazione**
- Utilizzare linter per verificare convenzioni
- Configurare pre-commit hooks
- Automatizzare controlli di qualità

## 📚 Risorse

### Strumenti di Verifica
- **ESLint**: Per verificare convenzioni JavaScript/TypeScript
- **Prettier**: Per formattazione automatica
- **Husky**: Per pre-commit hooks
- **Git hooks**: Per controlli automatici

### Documentazione Riferimento
- **React**: https://react.dev/learn
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Docker**: https://docs.docker.com/compose/
- **Markdown**: https://www.markdownguide.org/

---

**Nota**: Queste convenzioni sono parte integrante del progetto e devono essere rispettate da tutti i collaboratori. Ogni violazione deve essere corretta immediatamente per mantenere la qualità del codice. 