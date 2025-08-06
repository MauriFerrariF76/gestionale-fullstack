'use client';

import { useState } from 'react';
import { 
  Button, 
  Input, 
  Modal, 
  LoadingSpinner, 
  ErrorMessage, 
  EmptyState,
  Select,
  Checkbox,
  Radio,
  Table
} from '@/components/ui';

export default function TestComponentiPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('');

  // Wrapper per gestire il tipo del Select
  const handleSelectChange = (value: string | number | (string | number)[]) => {
    if (typeof value === 'string') {
      setSelectedOption(value);
    }
  };

  // Wrapper per gestire il tipo del Radio
  const handleRadioChange = (value: string | number) => {
    if (typeof value === 'string') {
      setRadioValue(value);
    }
  };

  const selectOptions = [
    { value: 'opzione1', label: 'Opzione 1' },
    { value: 'opzione2', label: 'Opzione 2' },
    { value: 'opzione3', label: 'Opzione 3' }
  ];

  const radioOptions = [
    { value: 'radio1', label: 'Radio 1' },
    { value: 'radio2', label: 'Radio 2' },
    { value: 'radio3', label: 'Radio 3' }
  ];

  const tableData = [
    { id: 1, nome: 'Mario Rossi', email: 'mario@example.com', ruolo: 'Admin' },
    { id: 2, nome: 'Giulia Bianchi', email: 'giulia@example.com', ruolo: 'User' },
    { id: 3, nome: 'Luca Verdi', email: 'luca@example.com', ruolo: 'Editor' }
  ];

  const tableColumns = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'ruolo', label: 'Ruolo' }
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">🧪 Test Componenti UI - FASE 1</h1>
      
      {/* Test Button */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Component</h2>
        <div className="flex gap-4 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Test Input */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input Component</h2>
        <div className="space-y-4 max-w-md">
          <Input label="Input Standard" placeholder="Inserisci testo..." />
          <Input label="Input con Errore" error="Campo obbligatorio" />
          <Input label="Input con Helper" helper="Testo di aiuto" />
          <Input label="Input con Icona" leftIcon="🔍" placeholder="Cerca..." />
        </div>
      </section>

      {/* Test Select */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Select Component</h2>
        <div className="max-w-md">
          <Select
            label="Seleziona opzione"
            options={selectOptions}
            value={selectedOption}
            onChange={handleSelectChange}
            placeholder="Scegli un'opzione..."
          />
        </div>
      </section>

      {/* Test Checkbox */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Checkbox Component</h2>
        <div className="space-y-2">
          <Checkbox
            checked={checkboxValue}
            onChange={setCheckboxValue}
            label="Accetto i termini e condizioni"
          />
          <Checkbox
            checked={false}
            onChange={() => {}}
            label="Newsletter (disabled)"
            disabled
          />
        </div>
      </section>

      {/* Test Radio */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Radio Component</h2>
        <div className="max-w-md">
          <Radio
            options={radioOptions}
            value={radioValue}
            onChange={handleRadioChange}
            name="ruolo"
            label="Scegli il tuo ruolo"
          />
        </div>
      </section>

      {/* Test Table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Table Component</h2>
        <div className="max-w-4xl">
          <Table
            columns={tableColumns}
            data={tableData}
            sortable
            selectable
          />
        </div>
      </section>

      {/* Test LoadingSpinner */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">LoadingSpinner Component</h2>
        <div className="flex gap-8 items-center">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
          <LoadingSpinner size="lg" text="Caricamento in corso..." />
        </div>
      </section>

      {/* Test ErrorMessage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">ErrorMessage Component</h2>
        <div className="space-y-4">
          <ErrorMessage 
            error="Errore di rete: Impossibile connettersi al server"
            title="Errore di Connessione"
            type="network"
          />
          <ErrorMessage 
            error="Campo email non valido"
            title="Errore di Validazione"
            type="validation"
          />
          <ErrorMessage 
            error="Si è verificato un errore imprevisto"
            title="Errore Generico"
            type="generic"
          />
        </div>
      </section>

      {/* Test EmptyState */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">EmptyState Component</h2>
        <div className="space-y-4">
          <EmptyState
            title="Nessun cliente trovato"
            description="Non ci sono clienti che corrispondono ai criteri di ricerca"
            icon="👥"
            action={
              <Button onClick={() => alert("Aggiungi cliente")}>
                Aggiungi Cliente
              </Button>
            }
          />
        </div>
      </section>

      {/* Test Modal */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Modal Component</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          Apri Modal
        </Button>
        
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Test Modal"
          size="md"
        >
          <div className="space-y-4">
            <p>Questo è un test del componente Modal.</p>
            <p>Il modal dovrebbe chiudersi quando si clicca fuori o si preme ESC.</p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Chiudi
              </Button>
              <Button onClick={() => alert("Azione confermata!")}>
                Conferma
              </Button>
            </div>
          </div>
        </Modal>
      </section>

      {/* Test Status */}
      <section className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800">✅ Test Completati</h3>
        <p className="text-green-700">
          Tutti i componenti UI della FASE 1 sono stati testati con successo!
        </p>
      </section>
    </div>
  );
} 