import React from "react";
import { Cliente } from "../../../types/clienti/cliente";
import FormField from "../../forms/FormField";

interface FormClienteAltroProps {
  data: Cliente;
  onChange: (field: keyof Cliente, value: string | number | boolean) => void;
  errors: Record<string, string>;
}

const FormClienteAltro: React.FC<FormClienteAltroProps> = ({
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
          label="Anno Ultimo Vendita"
          error={errors.AnnoUltimoVendita}
          
        >
          <input
            type="number"
            value={data.AnnoUltimoVendita || ""}
            onChange={(e) => handleFieldChange("AnnoUltimoVendita", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Anno ultima vendita"
            min="1900"
            max="2100"
          />
        </FormField>

        <FormField
          label="Codice Fornitore"
          error={errors.CodiceFornitore}
          
        >
          <input
            type="text"
            value={data.CodiceFornitore || ""}
            onChange={(e) => handleFieldChange("CodiceFornitore", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Codice fornitore"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Percorso Cliente"
          error={errors.PercorsoCliente}
          
        >
          <input
            type="text"
            value={data.PercorsoCliente || ""}
            onChange={(e) => handleFieldChange("PercorsoCliente", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="/percorso/cliente"
          />
        </FormField>

        <FormField
          label="Percorso PDF Cliente"
          error={errors.PercorsoPDFClienteC}
          
        >
          <input
            type="text"
            value={data.PercorsoPDFClienteC || ""}
            onChange={(e) => handleFieldChange("PercorsoPDFClienteC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="/percorso/pdf/cliente"
          />
        </FormField>

        <FormField
          label="Percorso DXF Cliente"
          error={errors.PercorsoDXFClienteC}
          
        >
          <input
            type="text"
            value={data.PercorsoDXFClienteC || ""}
            onChange={(e) => handleFieldChange("PercorsoDXFClienteC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="/percorso/dxf/cliente"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Richieste Cliente"
          error={errors.RichiesteCliente}
          
        >
          <textarea
            value={data.RichiesteCliente || ""}
            onChange={(e) => handleFieldChange("RichiesteCliente", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Richieste specifiche del cliente"
          />
        </FormField>

        <FormField
          label="Note"
          error={errors.Note}
          
        >
          <textarea
            value={data.Note || ""}
            onChange={(e) => handleFieldChange("Note", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Note generali sul cliente"
          />
        </FormField>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          Informazioni sui Percorsi
        </h4>
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          I percorsi vengono utilizzati per organizzare i file del cliente. 
          Assicurati che i percorsi siano corretti e accessibili dal sistema.
        </p>
      </div>
    </div>
  );
};

export default FormClienteAltro; 