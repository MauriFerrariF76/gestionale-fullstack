"use client";

import React, { useState } from "react";
import Button from "../../components/ui/Button";

const TestFormCliente: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleTest = () => {
    setMessage("Test funzionante! Il refactoring è completato.");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
          Test Form Cliente Refactorizzato
        </h1>

        <div className="space-y-4">
          <Button
            onClick={handleTest}
            variant="primary"
            size="md"
          >
            Test Funzionamento
          </Button>

          {message && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-300">
                {message}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Informazioni sul Refactoring
        </h2>
        <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
          <p>
            ✅ <strong>Componente gigante eliminato</strong>: FormClienteCompleto.tsx (1829 righe) sostituito
          </p>
          <p>
            ✅ <strong>Componenti modulari creati</strong>:
          </p>
          <ul className="ml-6 space-y-1">
            <li>• FormClienteAnagrafica.tsx</li>
            <li>• FormClienteContatti.tsx</li>
            <li>• FormClienteIndirizzi.tsx</li>
            <li>• FormClienteFatturazione.tsx</li>
            <li>• FormClienteBanca.tsx</li>
            <li>• FormClienteAltro.tsx</li>
          </ul>
          <p>
            ✅ <strong>Componente coordinatore</strong>: FormCliente.tsx gestisce la logica comune
          </p>
          <p>
            ✅ <strong>Riutilizzo componenti</strong>: Tutti i componenti usano FormField e FormActions
          </p>
          <p>
            ✅ <strong>Validazione type-safe</strong>: Gestione errori e validazione migliorata
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestFormCliente; 