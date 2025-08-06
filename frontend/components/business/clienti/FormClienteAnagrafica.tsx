import React from "react";
import { Cliente } from "../../../types/clienti/cliente";
import FormField from "../../forms/FormField";

interface FormClienteAnagraficaProps {
  data: Cliente;
  onChange: (field: keyof Cliente, value: string | number | boolean) => void;
  errors: Record<string, string>;
}

const FormClienteAnagrafica: React.FC<FormClienteAnagraficaProps> = ({
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
          label="Ragione Sociale"
          required
          error={errors.RagioneSocialeC}
        >
          <input
            type="text"
            value={data.RagioneSocialeC || ""}
            onChange={(e) => handleFieldChange("RagioneSocialeC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Ragione sociale del cliente"
          />
        </FormField>

        <FormField
          label="Codice MT"
          error={errors.CodiceMT}
        >
          <input
            type="text"
            value={data.CodiceMT || ""}
            onChange={(e) => handleFieldChange("CodiceMT", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Codice MT"
          />
        </FormField>

        <FormField
          label="Codice Fiscale"
          error={errors.CodiceFiscale}
        >
          <input
            type="text"
            value={data.CodiceFiscale || ""}
            onChange={(e) => handleFieldChange("CodiceFiscale", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Codice fiscale"
          />
        </FormField>

        <FormField
          label="Partita IVA"
          error={errors.PartitaIva}
        >
          <input
            type="text"
            value={data.PartitaIva || ""}
            onChange={(e) => handleFieldChange("PartitaIva", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Partita IVA"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Effettivo/Potenziale"
          error={errors.EffettivoPotenziale}
        >
          <select
            value={data.EffettivoPotenziale || ""}
            onChange={(e) => handleFieldChange("EffettivoPotenziale", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
          >
            <option value="">Seleziona...</option>
            <option value="Effettivo">Effettivo</option>
            <option value="Potenziale">Potenziale</option>
          </select>
        </FormField>

        <FormField
          label="Categoria Merceologica"
          error={errors.CategoriaMerceologica}
        >
          <input
            type="text"
            value={data.CategoriaMerceologica || ""}
            onChange={(e) => handleFieldChange("CategoriaMerceologica", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Categoria merceologica"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Attivo"
          error={errors.AttivoC}
        >
          <select
            value={data.AttivoC || ""}
            onChange={(e) => handleFieldChange("AttivoC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
          >
            <option value="">Seleziona...</option>
            <option value="S">Sì</option>
            <option value="N">No</option>
          </select>
        </FormField>

        <FormField
          label="Attivo Dal"
          error={errors.AttivoDalC}
        >
          <input
            type="date"
            value={data.AttivoDalC || ""}
            onChange={(e) => handleFieldChange("AttivoDalC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
          />
        </FormField>

        <FormField
          label="Non Attivo Dal"
          error={errors.NonAttivoDalC}
        >
          <input
            type="date"
            value={data.NonAttivoDalC || ""}
            onChange={(e) => handleFieldChange("NonAttivoDalC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
          />
        </FormField>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="privato"
          checked={data.Privato === "S"}
          onChange={(e) => handleFieldChange("Privato", e.target.checked ? "S" : "N")}
          className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
        />
        <label htmlFor="privato" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Cliente Privato
        </label>
      </div>
    </div>
  );
};

export default FormClienteAnagrafica; 