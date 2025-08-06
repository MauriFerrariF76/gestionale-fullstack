"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Form, ValidationRule } from '@/components/forms';
import { Button } from '@/components/ui';

export default function TestSistemaForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | number | boolean> | null>(null);

  // Schema di validazione
  const validationSchema: Record<string, ValidationRule> = {
    nome: { required: true, minLength: 2 },
    email: { 
      required: true, 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value) => {
        if (typeof value === 'string' && value && !value.includes('@')) {
          return 'Email deve contenere @';
        }
        return null;
      }
    },
    telefono: { 
      pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/,
      custom: (value) => {
        if (typeof value === 'string' && value && value.length < 10) {
          return 'Telefono deve avere almeno 10 cifre';
        }
        return null;
      }
    },
    eta: { 
      custom: (value) => {
        if (typeof value === 'number' && (value < 18 || value > 100)) {
          return 'Età deve essere tra 18 e 100 anni';
        }
        return null;
      }
    }
  };

  // Configurazione form con sezioni
  const formSections = [
    {
      id: 'anagrafica',
      title: 'Dati Anagrafici',
      description: 'Informazioni personali del cliente',
      fields: [
        {
          name: 'nome',
          label: 'Nome',
          type: 'text' as const,
          required: true,
          placeholder: 'Inserisci il nome',
          helper: 'Nome completo del cliente'
        },
        {
          name: 'cognome',
          label: 'Cognome',
          type: 'text' as const,
          required: true,
          placeholder: 'Inserisci il cognome'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email' as const,
          required: true,
          placeholder: 'esempio@email.com'
        },
        {
          name: 'telefono',
          label: 'Telefono',
          type: 'text' as const,
          placeholder: '+39 123 456 7890',
          helper: 'Formato internazionale'
        }
      ]
    },
    {
      id: 'indirizzo',
      title: 'Indirizzo',
      description: 'Indirizzo di residenza',
      collapsible: true,
      defaultCollapsed: true,
      fields: [
        {
          name: 'via',
          label: 'Via',
          type: 'text' as const,
          placeholder: 'Via Roma 123'
        },
        {
          name: 'citta',
          label: 'Città',
          type: 'text' as const,
          placeholder: 'Milano'
        },
        {
          name: 'cap',
          label: 'CAP',
          type: 'text' as const,
          placeholder: '20100'
        },
        {
          name: 'provincia',
          label: 'Provincia',
          type: 'select' as const,
          options: [
            { value: 'MI', label: 'Milano' },
            { value: 'TO', label: 'Torino' },
            { value: 'RM', label: 'Roma' },
            { value: 'NA', label: 'Napoli' }
          ]
        }
      ]
    },
    {
      id: 'preferenze',
      title: 'Preferenze',
      description: 'Preferenze e configurazioni',
      fields: [
        {
          name: 'newsletter',
          label: 'Iscrizione Newsletter',
          type: 'checkbox' as const,
          defaultValue: false
        },
        {
          name: 'notifiche',
          label: 'Tipo Notifiche',
          type: 'radio' as const,
          options: [
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' },
            { value: 'push', label: 'Push' }
          ]
        },
        {
          name: 'note',
          label: 'Note',
          type: 'textarea' as const,
          placeholder: 'Note aggiuntive...',
          helper: 'Informazioni aggiuntive sul cliente'
        }
      ]
    }
  ];

  // Configurazione form con tabs
  const formTabs = [
    {
      id: 'personali',
      label: 'Dati Personali',
      sections: [
        {
          name: 'nome',
          label: 'Nome',
          type: 'text' as const,
          required: true
        },
        {
          name: 'cognome',
          label: 'Cognome',
          type: 'text' as const,
          required: true
        },
        {
          name: 'eta',
          label: 'Età',
          type: 'number' as const,
          placeholder: '25'
        }
      ]
    },
    {
      id: 'contatti',
      label: 'Contatti',
      sections: [
        {
          name: 'email',
          label: 'Email',
          type: 'email' as const,
          required: true
        },
        {
          name: 'telefono',
          label: 'Telefono',
          type: 'text' as const
        }
      ]
    },
    {
      id: 'azienda',
      label: 'Dati Azienda',
      sections: [
        {
          name: 'ragioneSociale',
          label: 'Ragione Sociale',
          type: 'text' as const,
          required: true
        },
        {
          name: 'partitaIva',
          label: 'Partita IVA',
          type: 'text' as const
        },
        {
          name: 'codiceFiscale',
          label: 'Codice Fiscale',
          type: 'text' as const
        }
      ]
    }
  ];

  // Handler per il submit
  const handleSubmit = async (data: Record<string, string | number | boolean>) => {
    setLoading(true);
    
    // Simula una chiamata API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setFormData(data);
    setLoading(false);
    
    console.log('Dati del form:', data);
    alert('Form inviato con successo!');
  };

  const handleCancel = () => {
    alert('Form annullato');
  };

  const handleDelete = () => {
    if (confirm('Sei sicuro di voler eliminare?')) {
      alert('Elemento eliminato');
    }
  };

  return (
    <AppLayout
      pageTitle="Test Sistema Form"
      pageDescription="Dimostrazione del sistema di form riutilizzabile"
      headerActions={
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm">
            Esporta
          </Button>
          <Button variant="outline" size="sm">
            Importa
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Form con Sezioni */}
        <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Form con Sezioni
          </h2>
          <Form
            sections={formSections}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onDelete={handleDelete}
            title="Nuovo Cliente"
            description="Inserisci i dati del nuovo cliente"
            loading={loading}
            showDelete={true}
            submitText="Crea Cliente"
            cancelText="Annulla"
            deleteText="Elimina"
          />
        </div>

        {/* Form con Tabs */}
        <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Form con Tabs
          </h2>
          <Form
            tabs={formTabs}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            layout="tabs"
            title="Cliente con Tabs"
            description="Form organizzato in tab per una migliore UX"
            loading={loading}
            submitText="Salva Cliente"
          />
        </div>

        {/* Form Semplice */}
        <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Form Semplice
          </h2>
          <Form
            sections={[
              {
                id: 'semplice',
                title: 'Dati Base',
                fields: [
                  {
                    name: 'nome',
                    label: 'Nome',
                    type: 'text' as const,
                    required: true
                  },
                  {
                    name: 'email',
                    label: 'Email',
                    type: 'email' as const,
                    required: true
                  }
                ]
              }
            ]}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            title="Form Semplice"
            loading={loading}
          />
        </div>

        {/* Risultati */}
        {formData && (
          <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Dati Inseriti
            </h2>
            <pre className="bg-neutral-800 p-4 rounded-lg overflow-auto text-sm text-neutral-300">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </AppLayout>
  );
} 