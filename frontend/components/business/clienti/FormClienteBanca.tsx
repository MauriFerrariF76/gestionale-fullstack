import React from "react";
import { Cliente } from "../../../types/clienti/cliente";
import FormField from "../../forms/FormField";

interface FormClienteBancaProps {
  data: Cliente;
  onChange: (field: keyof Cliente, value: string | number | boolean) => void;
  errors: Record<string, string>;
}

const FormClienteBanca: React.FC<FormClienteBancaProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleFieldChange = (field: keyof Cliente, value: string | number | boolean) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="CIN"
          error={errors.CIN}
          
        >
          <input
            type="text"
            value={data.CIN || ""}
            onChange={(e) => handleFieldChange("CIN", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="CIN"
            maxLength={1}
          />
        </FormField>

        <FormField
          label="ABI"
          error={errors.ABI}
          
        >
          <input
            type="text"
            value={data.ABI || ""}
            onChange={(e) => handleFieldChange("ABI", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="ABI"
            maxLength={5}
          />
        </FormField>

        <FormField
          label="CAB"
          error={errors.CAB}
          
        >
          <input
            type="text"
            value={data.CAB || ""}
            onChange={(e) => handleFieldChange("CAB", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="CAB"
            maxLength={5}
          />
        </FormField>

        <FormField
          label="Conto Corrente"
          error={errors.CC}
          
        >
          <input
            type="text"
            value={data.CC || ""}
            onChange={(e) => handleFieldChange("CC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Numero conto corrente"
            maxLength={12}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Codice IBAN"
          error={errors.CodiceIBAN}
          
        >
          <input
            type="text"
            value={data.CodiceIBAN || ""}
            onChange={(e) => handleFieldChange("CodiceIBAN", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="IT60 X054 2811 1010 0000 0123 456"
            maxLength={27}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Nostra Banca Appoggio"
          error={errors.NostraBancaAppoggioC}
          
        >
          <input
            type="text"
            value={data.NostraBancaAppoggioC || ""}
            onChange={(e) => handleFieldChange("NostraBancaAppoggioC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Banca di appoggio"
          />
        </FormField>

        <FormField
          label="IBAN Nostra Banca"
          error={errors.IBANnostraBancaC}
          
        >
          <input
            type="text"
            value={data.IBANnostraBancaC || ""}
            onChange={(e) => handleFieldChange("IBANnostraBancaC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="IBAN nostra banca"
            maxLength={27}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Spese Bancarie"
          error={errors.SpeseBancarie}
          
        >
          <input
            type="number"
            value={data.SpeseBancarie || ""}
            onChange={(e) => handleFieldChange("SpeseBancarie", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Spese bancarie"
            min="0"
            step="0.01"
          />
        </FormField>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          Informazioni IBAN
        </h4>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Il codice IBAN è composto da: 2 lettere per il paese (IT), 2 cifre di controllo, 
          1 lettera CIN, 5 cifre ABI, 5 cifre CAB, 12 cifre del conto corrente.
        </p>
      </div>
    </div>
  );
};

export default FormClienteBanca; 