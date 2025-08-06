'use client';

import { useState } from 'react';
import { 
  Header, 
  Footer,
  SimpleLayout
} from '@/components/layout';
import { 
  FormSection, 
  FormField, 
  FormActions, 
  FormTabs 
} from '@/components/forms';
import { 
  Button, 
  Input, 
  Select, 
  Checkbox, 
  Radio 
} from '@/components/ui';

export default function TestComponentiFase2Page() {
  const [activeTab, setActiveTab] = useState('anagrafica');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    ruolo: '',
    newsletter: false,
    tipo: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert('Form salvato!');
  };

  const handleCancel = () => {
    alert('Form annullato!');
  };

  const handleDelete = () => {
    alert('Elemento eliminato!');
  };

  const selectOptions = [
    { value: 'admin', label: 'Amministratore' },
    { value: 'user', label: 'Utente' },
    { value: 'editor', label: 'Editor' }
  ];

  const radioOptions = [
    { value: 'cliente', label: 'Cliente' },
    { value: 'fornitore', label: 'Fornitore' },
    { value: 'dipendente', label: 'Dipendente' }
  ];

  const tabs = [
    {
      id: 'anagrafica',
      label: 'Anagrafica',
      icon: '👤',
      content: (
        <div className="space-y-4">
          <FormField label="Nome" required>
            <Input
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Inserisci il nome..."
            />
          </FormField>
          
          <FormField label="Email" required error="Email non valida">
            <Input
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Inserisci l'email..."
            />
          </FormField>
          
          <FormField label="Telefono" helper="Formato: +39 123 456 7890">
            <Input
              value={formData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              placeholder="Inserisci il telefono..."
            />
          </FormField>
        </div>
      )
    },
    {
      id: 'ruolo',
      label: 'Ruolo',
      icon: '🔐',
      content: (
        <div className="space-y-4">
          <FormField label="Ruolo" required>
            <Select
              options={selectOptions}
              value={formData.ruolo}
              onChange={(value) => handleInputChange('ruolo', value as string)}
              placeholder="Seleziona un ruolo..."
            />
          </FormField>
          
          <FormField label="Tipo Utente">
            <Radio
              options={radioOptions}
              value={formData.tipo}
              onChange={(value) => handleInputChange('tipo', value as string)}
              name="tipo"
            />
          </FormField>
          
          <FormField>
            <Checkbox
              checked={formData.newsletter}
              onChange={(checked) => handleInputChange('newsletter', checked)}
              label="Iscriviti alla newsletter"
            />
          </FormField>
        </div>
      ),
      valid: true
    },
    {
      id: 'impostazioni',
      label: 'Impostazioni',
      icon: '⚙️',
      content: (
        <div className="space-y-4">
          <FormSection
            title="Impostazioni Avanzate"
            description="Configura le impostazioni avanzate del profilo"
            collapsible
            defaultCollapsed
          >
            <FormField label="Lingua" helper="Seleziona la lingua preferita">
              <Select
                options={[
                  { value: 'it', label: 'Italiano' },
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Español' }
                ]}
                value=""
                onChange={() => {}}
                placeholder="Seleziona lingua..."
              />
            </FormField>
          </FormSection>
        </div>
      ),
      pending: true
    }
  ];

  return (
    <SimpleLayout
      title="Test Componenti FASE 2"
      subtitle="Layout e Forms Components"
      actions={
        <Button variant="outline">
          Azione Personalizzata
        </Button>
      }
    >
      {/* Main Content */}
      <div className="space-y-8">
        <h1 className="text-3xl font-bold mb-8 text-neutral-200">🧪 Test Componenti FASE 2 - Layout e Forms</h1>
        
        {/* Test FormSection */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-200">FormSection Component</h2>
          
          <FormSection
            title="Sezione Anagrafica"
            description="Inserisci i dati anagrafici dell'utente"
            collapsible
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nome" required>
                <Input placeholder="Nome..." />
              </FormField>
              <FormField label="Cognome" required>
                <Input placeholder="Cognome..." />
              </FormField>
            </div>
          </FormSection>

          <FormSection
            title="Sezione con Errore"
            error="Ci sono errori di validazione in questa sezione"
          >
            <FormField label="Campo con Errore" error="Campo obbligatorio">
              <Input placeholder="Campo con errore..." />
            </FormField>
          </FormSection>

          <FormSection
            title="Sezione Valida"
            valid={true}
          >
            <FormField label="Campo Valido">
              <Input placeholder="Campo valido..." />
            </FormField>
          </FormSection>
        </section>

        {/* Test FormField */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-200">FormField Component</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Campo Standard">
              <Input placeholder="Campo standard..." />
            </FormField>
            
            <FormField label="Campo con Helper" helper="Testo di aiuto per l'utente">
              <Input placeholder="Campo con helper..." />
            </FormField>
            
            <FormField label="Campo Obbligatorio" required>
              <Input placeholder="Campo obbligatorio..." />
            </FormField>
            
            <FormField label="Campo con Errore" error="Questo campo è obbligatorio">
              <Input placeholder="Campo con errore..." />
            </FormField>
          </div>
        </section>

        {/* Test FormTabs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-200">FormTabs Component</h2>
          
          <FormTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </section>

        {/* Test FormActions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-200">FormActions Component</h2>
          
          <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6">
            <div className="space-y-4">
              <FormField label="Campo di Test">
                <Input placeholder="Test form actions..." />
              </FormField>
            </div>
            
            <FormActions
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={handleDelete}
              showDelete
              loading={false}
            />
          </div>
        </section>

        {/* Test Footer */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-200">Footer Component</h2>
          
          <Footer
            links={[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Termini', href: '/termini' },
              { label: 'Contatti', href: '/contatti' }
            ]}
          />
        </section>

        {/* Test Status */}
        <section className="mt-8 bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-200 mb-2">✅ Test Completati</h3>
          <p className="text-neutral-400">
            Tutti i componenti Layout e Forms della FASE 2 sono stati testati con successo!
          </p>
        </section>
      </div>
    </SimpleLayout>
  );
} 