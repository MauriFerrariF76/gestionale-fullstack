import React from "react";
import { Cliente } from "../../../types/clienti/cliente";
import FormField from "../../forms/FormField";

interface FormClienteContattiProps {
  data: Cliente;
  onChange: (field: keyof Cliente, value: string | number | boolean) => void;
  errors: Record<string, string>;
}

const FormClienteContatti: React.FC<FormClienteContattiProps> = ({
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
          label="Telefono"
          error={errors.Telefono}
        >
          <input
            type="tel"
            value={data.Telefono || ""}
            onChange={(e) => handleFieldChange("Telefono", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Numero di telefono"
          />
        </FormField>

        <FormField
          label="Fax"
          error={errors.Fax}
        >
          <input
            type="tel"
            value={data.Fax || ""}
            onChange={(e) => handleFieldChange("Fax", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Numero fax"
          />
        </FormField>

        <FormField
          label="Modem"
          error={errors.Modem}
        >
          <input
            type="tel"
            value={data.Modem || ""}
            onChange={(e) => handleFieldChange("Modem", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Numero modem"
          />
        </FormField>

        <FormField
          label="Email Fatturazione"
          error={errors.EmailFatturazione}
        >
          <input
            type="email"
            value={data.EmailFatturazione || ""}
            onChange={(e) => handleFieldChange("EmailFatturazione", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Email per fatturazione"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Sito Internet"
          error={errors.SitoInternet}
        >
          <input
            type="url"
            value={data.SitoInternet || ""}
            onChange={(e) => handleFieldChange("SitoInternet", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="https://www.example.com"
          />
        </FormField>

        <FormField
          label="PEC Cliente"
          error={errors.PECcliente}
        >
          <input
            type="email"
            value={data.PECcliente || ""}
            onChange={(e) => handleFieldChange("PECcliente", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="PEC del cliente"
          />
        </FormField>

        <FormField
          label="Email Certificati"
          error={errors.EmailCertificati}
        >
          <input
            type="email"
            value={data.EmailCertificati || ""}
            onChange={(e) => handleFieldChange("EmailCertificati", e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
            placeholder="Email per certificati"
          />
        </FormField>
      </div>
    </div>
  );
};

export default FormClienteContatti; 