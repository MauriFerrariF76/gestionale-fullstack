"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { FormField, FormSection, FormActions } from '@/components/forms';
import { useForm } from '@/hooks/useForm';

interface ClienteForm {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  eta: number;
  citta: string;
  newsletter: boolean;
}

export default function TestHookForm() {
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
    initialData: {
      nome: '',
      cognome: '',
      email: '',
      telefono: '',
      eta: 0,
      citta: '',
      newsletter: false,
    },
    validationSchema: {
      nome: { required: true, minLength: 2 },
      cognome: { required: true, minLength: 2 },
      email: { 
        required: true, 
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      telefono: { 
        pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/,
      },
      eta: { 
        custom: (value) => {
          if (typeof value === 'number' && value > 0 && (value < 18 || value > 100)) {
            return 'Età deve essere tra 18 e 100 anni';
          }
          return null;
        }
      }
    },
    onSubmit: async (data) => {
      console.log('Dati del form:', data);
      alert('Form inviato con successo!');
    },
    onCancel: () => {
      alert('Form annullato');
    },
  });

  const handleFieldChange = (field: keyof ClienteForm, value: string | number | boolean) => {
    setFieldValue(field, value);
  };

  const handleFieldBlur = (field: keyof ClienteForm) => {
    setFieldTouched(field, true);
  };

  return (
    <AppLayout
      pageTitle="Test Hook useForm"
      pageDescription="Dimostrazione del hook useForm personalizzato"
    >
      <div className="space-y-6">
        {/* Form con Hook */}
        <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Form con Hook useForm
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sezione Anagrafica */}
            <FormSection
              title="Dati Anagrafici"
              description="Informazioni personali del cliente"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Nome"
                  required
                  error={touched.nome ? errors.nome : undefined}
                >
                  <input
                    type="text"
                    value={data.nome}
                    onChange={(e) => handleFieldChange('nome', e.target.value)}
                    onBlur={() => handleFieldBlur('nome')}
                    placeholder="Inserisci il nome"
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label="Cognome"
                  required
                  error={touched.cognome ? errors.cognome : undefined}
                >
                  <input
                    type="text"
                    value={data.cognome}
                    onChange={(e) => handleFieldChange('cognome', e.target.value)}
                    onBlur={() => handleFieldBlur('cognome')}
                    placeholder="Inserisci il cognome"
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label="Email"
                  required
                  error={touched.email ? errors.email : undefined}
                >
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                    placeholder="esempio@email.com"
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label="Telefono"
                  error={touched.telefono ? errors.telefono : undefined}
                  helper="Formato: +39 123 456 7890"
                >
                  <input
                    type="text"
                    value={data.telefono}
                    onChange={(e) => handleFieldChange('telefono', e.target.value)}
                    onBlur={() => handleFieldBlur('telefono')}
                    placeholder="+39 123 456 7890"
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label="Età"
                  error={touched.eta ? errors.eta : undefined}
                >
                  <input
                    type="number"
                    value={data.eta || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                      handleFieldChange('eta', value);
                    }}
                    onBlur={() => handleFieldBlur('eta')}
                    placeholder="25"
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  />
                </FormField>

                <FormField
                  label="Città"
                >
                  <input
                    type="text"
                    value={data.citta}
                    onChange={(e) => handleFieldChange('citta', e.target.value)}
                    onBlur={() => handleFieldBlur('citta')}
                    placeholder="Milano"
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  />
                </FormField>
              </div>
            </FormSection>

            {/* Sezione Preferenze */}
            <FormSection
              title="Preferenze"
              description="Preferenze e configurazioni"
            >
              <div className="space-y-4">
                <FormField
                  label="Iscrizione Newsletter"
                >
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={data.newsletter}
                      onChange={(e) => handleFieldChange('newsletter', e.target.checked)}
                      className="w-4 h-4 text-[#3B82F6] bg-neutral-800 border-neutral-600 rounded focus:ring-[#3B82F6]"
                    />
                    <span className="text-sm text-neutral-300">
                      Ricevi newsletter e aggiornamenti
                    </span>
                  </label>
                </FormField>
              </div>
            </FormSection>

            {/* Azioni del form */}
            <FormActions
              onSave={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
              disabled={!isValid}
              saveText="Salva Cliente"
              cancelText="Annulla"
            />
          </form>
        </div>

        {/* Stato del form */}
        <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Stato del Form
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-neutral-800 p-3 rounded-lg">
              <div className="text-neutral-400">Valido</div>
              <div className={isValid ? "text-green-400" : "text-red-400"}>
                {isValid ? "✅ Sì" : "❌ No"}
              </div>
            </div>
            <div className="bg-neutral-800 p-3 rounded-lg">
              <div className="text-neutral-400">Campi Toccati</div>
              <div className="text-blue-400">
                {Object.keys(touched).length} campi
              </div>
            </div>
            <div className="bg-neutral-800 p-3 rounded-lg">
              <div className="text-neutral-400">Modificato</div>
              <div className={isDirty ? "text-blue-400" : "text-neutral-400"}>
                {isDirty ? "✏️ Sì" : "📝 No"}
              </div>
            </div>
            <div className="bg-neutral-800 p-3 rounded-lg">
              <div className="text-neutral-400">Caricamento</div>
              <div className={loading ? "text-yellow-400" : "text-neutral-400"}>
                {loading ? "⏳ Sì" : "✅ No"}
              </div>
            </div>
            <div className="bg-neutral-800 p-3 rounded-lg">
              <div className="text-neutral-400">Errori</div>
              <div className={Object.keys(errors).length > 0 ? "text-red-400" : "text-green-400"}>
                {Object.keys(errors).length} errori
              </div>
            </div>
          </div>
        </div>

        {/* Dati del form */}
        <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Dati del Form
          </h3>
          <pre className="bg-neutral-800 p-4 rounded-lg overflow-auto text-sm text-neutral-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        {/* Errori del form */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Errori di Validazione
            </h3>
            <div className="space-y-2">
              {Object.entries(errors).map(([field, error]) => (
                <div key={field} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <div className="text-red-400 font-medium">{field}</div>
                  <div className="text-red-300 text-sm">{error}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
} 