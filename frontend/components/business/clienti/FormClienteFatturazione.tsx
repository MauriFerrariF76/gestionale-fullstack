import React from "react";
import { Cliente } from "../../../types/clienti/cliente";
import FormField from "../../forms/FormField";

interface FormClienteFatturazioneProps {
  data: Cliente;
  onChange: (field: keyof Cliente, value: string | number | boolean) => void;
  errors: Record<string, string>;
}

const FormClienteFatturazione: React.FC<FormClienteFatturazioneProps> = ({
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
          label="Codice Pagamento"
          error={errors.CodicePagamento}
          
        >
          <input
            type="text"
            value={data.CodicePagamento || ""}
            onChange={(e) => handleFieldChange("CodicePagamento", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Codice pagamento"
          />
        </FormField>

        <FormField
          label="Descrizione Pagamento"
          error={errors.DescrizionePagamentoC}
          
        >
          <input
            type="text"
            value={data.DescrizionePagamentoC || ""}
            onChange={(e) => handleFieldChange("DescrizionePagamentoC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Descrizione pagamento"
          />
        </FormField>

        <FormField
          label="Metodo Pagamento"
          error={errors.MetodoPagamentoC}
          
        >
          <select
            value={data.MetodoPagamentoC || ""}
            onChange={(e) => handleFieldChange("MetodoPagamentoC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
          >
            <option value="">Seleziona...</option>
            <option value="Bonifico">Bonifico</option>
            <option value="Assegno">Assegno</option>
            <option value="Contanti">Contanti</option>
            <option value="Carta di Credito">Carta di Credito</option>
            <option value="Rid">Rid</option>
          </select>
        </FormField>

        <FormField
          label="Condizioni Pagamento"
          error={errors.CondizioniPagamentoC}
          
        >
          <input
            type="text"
            value={data.CondizioniPagamentoC || ""}
            onChange={(e) => handleFieldChange("CondizioniPagamentoC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Condizioni di pagamento"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Resa"
          error={errors.ResaC}
          
        >
          <input
            type="text"
            value={data.ResaC || ""}
            onChange={(e) => handleFieldChange("ResaC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Resa"
          />
        </FormField>

        <FormField
          label="Trasporto"
          error={errors.TrasportoC}
          
        >
          <input
            type="text"
            value={data.TrasportoC || ""}
            onChange={(e) => handleFieldChange("TrasportoC", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Trasporto"
          />
        </FormField>

        <FormField
          label="Codice SDI"
          error={errors.CodiceSDI}
          
        >
          <input
            type="text"
            value={data.CodiceSDI || ""}
            onChange={(e) => handleFieldChange("CodiceSDI", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Codice SDI"
          />
        </FormField>

        <FormField
          label="Esenzione IVA"
          error={errors.EsenzioneIva}
          
        >
          <select
            value={data.EsenzioneIva || ""}
            onChange={(e) => handleFieldChange("EsenzioneIva", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
          >
            <option value="">Seleziona...</option>
            <option value="S">Sì</option>
            <option value="N">No</option>
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="IVA (%)"
          error={errors.IVA}
          
        >
          <input
            type="number"
            value={data.IVA || ""}
            onChange={(e) => handleFieldChange("IVA", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Percentuale IVA"
            min="0"
            max="100"
            step="0.01"
          />
        </FormField>

        <FormField
          label="Articolo 15"
          error={errors.Articolo15}
          
        >
          <input
            type="number"
            value={data.Articolo15 || ""}
            onChange={(e) => handleFieldChange("Articolo15", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Articolo 15"
            min="0"
            step="0.01"
          />
        </FormField>
      </div>
    </div>
  );
};

export default FormClienteFatturazione; 