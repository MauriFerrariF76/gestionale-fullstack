import React from "react";
import { Cliente } from "../../../types/clienti/cliente";
import FormField from "../../forms/FormField";

interface FormClienteIndirizziProps {
  data: Cliente;
  onChange: (field: keyof Cliente, value: string | number | boolean) => void;
  errors: Record<string, string>;
}

const FormClienteIndirizzi: React.FC<FormClienteIndirizziProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleFieldChange = (field: keyof Cliente, value: string | number | boolean) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-8">
      {/* Indirizzo Principale */}
      <div className="border-b border-neutral-200 dark:border-neutral-600 pb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Indirizzo Principale
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Indirizzo"
            error={errors.IndirizzoC}
            
          >
            <input
              type="text"
              value={data.IndirizzoC || ""}
              onChange={(e) => handleFieldChange("IndirizzoC", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Via/Piazza e numero"
            />
          </FormField>

          <FormField
            label="CAP"
            error={errors.CAPc}
            
          >
            <input
              type="text"
              value={data.CAPc || ""}
              onChange={(e) => handleFieldChange("CAPc", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="CAP"
            />
          </FormField>

          <FormField
            label="Città"
            error={errors.CITTAc}
            
          >
            <input
              type="text"
              value={data.CITTAc || ""}
              onChange={(e) => handleFieldChange("CITTAc", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Città"
            />
          </FormField>

          <FormField
            label="Provincia"
            error={errors.PROVc}
            
          >
            <input
              type="text"
              value={data.PROVc || ""}
              onChange={(e) => handleFieldChange("PROVc", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Provincia"
            />
          </FormField>

          <FormField
            label="Nazione"
            error={errors.NAZc}
            
          >
            <input
              type="text"
              value={data.NAZc || "Italia"}
              onChange={(e) => handleFieldChange("NAZc", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Nazione"
            />
          </FormField>
        </div>
      </div>

      {/* Indirizzo Secondario */}
      <div className="border-b border-neutral-200 dark:border-neutral-600 pb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Indirizzo Secondario
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Indirizzo"
            error={errors.IndirizzoC2}
            
          >
            <input
              type="text"
              value={data.IndirizzoC2 || ""}
              onChange={(e) => handleFieldChange("IndirizzoC2", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Via/Piazza e numero"
            />
          </FormField>

          <FormField
            label="CAP"
            error={errors.CAPc2}
            
          >
            <input
              type="text"
              value={data.CAPc2 || ""}
              onChange={(e) => handleFieldChange("CAPc2", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="CAP"
            />
          </FormField>

          <FormField
            label="Città"
            error={errors.CITTAc2}
            
          >
            <input
              type="text"
              value={data.CITTAc2 || ""}
              onChange={(e) => handleFieldChange("CITTAc2", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Città"
            />
          </FormField>

          <FormField
            label="Provincia"
            error={errors.PROVc2}
            
          >
            <input
              type="text"
              value={data.PROVc2 || ""}
              onChange={(e) => handleFieldChange("PROVc2", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Provincia"
            />
          </FormField>

          <FormField
            label="Nazione"
            error={errors.NAZc2}
            
          >
            <input
              type="text"
              value={data.NAZc2 || ""}
              onChange={(e) => handleFieldChange("NAZc2", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Nazione"
            />
          </FormField>
        </div>
      </div>

      {/* Indirizzo Terziario */}
      <div className="border-b border-neutral-200 dark:border-neutral-600 pb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Indirizzo Terziario
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Indirizzo"
            error={errors.IndirizzoC3}
            
          >
            <input
              type="text"
              value={data.IndirizzoC3 || ""}
              onChange={(e) => handleFieldChange("IndirizzoC3", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Via/Piazza e numero"
            />
          </FormField>

          <FormField
            label="CAP"
            error={errors.CAPc3}
            
          >
            <input
              type="text"
              value={data.CAPc3 || ""}
              onChange={(e) => handleFieldChange("CAPc3", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="CAP"
            />
          </FormField>

          <FormField
            label="Città"
            error={errors.CITTAc3}
            
          >
            <input
              type="text"
              value={data.CITTAc3 || ""}
              onChange={(e) => handleFieldChange("CITTAc3", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Città"
            />
          </FormField>

          <FormField
            label="Provincia"
            error={errors.PROVc3}
            
          >
            <input
              type="text"
              value={data.PROVc3 || ""}
              onChange={(e) => handleFieldChange("PROVc3", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Provincia"
            />
          </FormField>

          <FormField
            label="Nazione"
            error={errors.NAZc3}
            
          >
            <input
              type="text"
              value={data.NAZc3 || ""}
              onChange={(e) => handleFieldChange("NAZc3", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Nazione"
            />
          </FormField>
        </div>
      </div>

      {/* Spedizione e Fatturazione */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Spedizione e Fatturazione
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Intestazione Spedizione/Fatturazione"
            error={errors.IntestazioneSpedFat}
            
          >
            <input
              type="text"
              value={data.IntestazioneSpedFat || ""}
              onChange={(e) => handleFieldChange("IntestazioneSpedFat", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Intestazione per spedizione/fatturazione"
            />
          </FormField>

          <FormField
            label="Indirizzo Spedizione/Fatturazione"
            error={errors.IndirizzoC4}
            
          >
            <input
              type="text"
              value={data.IndirizzoC4 || ""}
              onChange={(e) => handleFieldChange("IndirizzoC4", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Indirizzo per spedizione/fatturazione"
            />
          </FormField>

          <FormField
            label="CAP Spedizione/Fatturazione"
            error={errors.CAPc4}
            
          >
            <input
              type="text"
              value={data.CAPc4 || ""}
              onChange={(e) => handleFieldChange("CAPc4", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="CAP"
            />
          </FormField>

          <FormField
            label="Città Spedizione/Fatturazione"
            error={errors.CITTAc4}
            
          >
            <input
              type="text"
              value={data.CITTAc4 || ""}
              onChange={(e) => handleFieldChange("CITTAc4", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Città"
            />
          </FormField>

          <FormField
            label="Provincia Spedizione/Fatturazione"
            error={errors.PROVc4}
            
          >
            <input
              type="text"
              value={data.PROVc4 || ""}
              onChange={(e) => handleFieldChange("PROVc4", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Provincia"
            />
          </FormField>

          <FormField
            label="Selezione Spedizione/Fatturazione"
            error={errors.SelezioneSpedFat}
            
          >
            <select
              value={data.SelezioneSpedFat || ""}
              onChange={(e) => handleFieldChange("SelezioneSpedFat", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            >
              <option value="">Seleziona...</option>
              <option value="1">Indirizzo Principale</option>
              <option value="2">Indirizzo Secondario</option>
              <option value="3">Indirizzo Terziario</option>
              <option value="4">Indirizzo Spedizione/Fatturazione</option>
            </select>
          </FormField>
        </div>

        <div className="mt-4">
          <FormField
            label="Note Spedizione/Fatturazione"
            error={errors.NoteSpedFat}
            
          >
            <textarea
              value={data.NoteSpedFat || ""}
              onChange={(e) => handleFieldChange("NoteSpedFat", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
              placeholder="Note per spedizione e fatturazione"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
};

export default FormClienteIndirizzi; 