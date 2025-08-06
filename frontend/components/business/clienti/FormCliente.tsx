import React, { useState, useEffect } from "react";
import { Cliente } from "../../../types/clienti/cliente";
import {
  creaCliente,
  modificaCliente,
  checkIdClienteUnivoco,
  getMaxIdCliente,
} from "../../../lib/clienti/api";
import {
  User2,
  MapPin,
  Phone,
  FileText,
  Banknote,
  Folder,
} from "lucide-react";
import FormField from "../../forms/FormField";
import FormActions from "../../forms/FormActions";
import FormClienteAnagrafica from "./FormClienteAnagrafica";
import FormClienteContatti from "./FormClienteContatti";
import FormClienteIndirizzi from "./FormClienteIndirizzi";
import FormClienteFatturazione from "./FormClienteFatturazione";
import FormClienteBanca from "./FormClienteBanca";
import FormClienteAltro from "./FormClienteAltro";

interface FormClienteProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cliente: Cliente) => void;
  clienteEdit?: Cliente | null;
}

const initialCliente: Cliente = {
  RagioneSocialeC: "",
  Telefono: "",
  IndirizzoC: "",
  CAPc: null,
  CITTAc: "",
  PROVc: "",
  NAZc: "Italia",
  CodiceFiscale: "",
  PartitaIva: "",
  NoteSpedFat: "",
  IVA: null,
  SpeseBancarie: null,
  Articolo15: null,
  AnnoUltimoVendita: null,
};

// Funzione per normalizzare i campi numerici prima di inviare i dati
const normalizzaNumerici = (cliente: Cliente): Cliente => ({
  ...cliente,
  IVA:
    cliente.IVA === "" || cliente.IVA === undefined || cliente.IVA === null
      ? null
      : isNaN(Number(cliente.IVA))
      ? null
      : String(Number(cliente.IVA)),
  Articolo15:
    cliente.Articolo15 === "" ||
    cliente.Articolo15 === undefined ||
    cliente.Articolo15 === null
      ? null
      : isNaN(Number(cliente.Articolo15))
      ? null
      : String(Number(cliente.Articolo15)),
  SpeseBancarie:
    cliente.SpeseBancarie === "" ||
    cliente.SpeseBancarie === undefined ||
    cliente.SpeseBancarie === null
      ? null
      : isNaN(Number(cliente.SpeseBancarie))
      ? null
      : String(Number(cliente.SpeseBancarie)),
  AnnoUltimoVendita:
    cliente.AnnoUltimoVendita === "" ||
    cliente.AnnoUltimoVendita === undefined ||
    cliente.AnnoUltimoVendita === null
      ? null
      : isNaN(Number(cliente.AnnoUltimoVendita))
      ? null
      : String(Number(cliente.AnnoUltimoVendita)),
  CAPc:
    cliente.CAPc === "" || cliente.CAPc === undefined || cliente.CAPc === null
      ? null
      : isNaN(Number(cliente.CAPc))
      ? null
      : String(Number(cliente.CAPc)),
  CAPc2:
    cliente.CAPc2 === "" ||
    cliente.CAPc2 === undefined ||
    cliente.CAPc2 === null
      ? null
      : isNaN(Number(cliente.CAPc2))
      ? null
      : String(Number(cliente.CAPc2)),
  CAPc3:
    cliente.CAPc3 === "" ||
    cliente.CAPc3 === undefined ||
    cliente.CAPc3 === null
      ? null
      : isNaN(Number(cliente.CAPc3))
      ? null
      : String(Number(cliente.CAPc3)),
  CAPc4:
    cliente.CAPc4 === "" ||
    cliente.CAPc4 === undefined ||
    cliente.CAPc4 === null
      ? null
      : isNaN(Number(cliente.CAPc4))
      ? null
      : String(Number(cliente.CAPc4)),
});

function generaProssimoIdCliente(
  maxIdCliente: string | null | undefined
): string {
  if (!maxIdCliente) return "1";
  const numId = parseInt(maxIdCliente, 10);
  if (isNaN(numId)) return "1";
  return (numId + 1).toString();
}

type SectionKey = "anagrafica" | "contatti" | "indirizzi" | "fatturazione" | "banca" | "altro";

const SECTIONS = [
  { key: "anagrafica", label: "Anagrafica", icon: <User2 size={16} /> },
  { key: "contatti", label: "Contatti", icon: <Phone size={16} /> },
  { key: "indirizzi", label: "Indirizzi", icon: <MapPin size={16} /> },
  { key: "fatturazione", label: "Fatturazione", icon: <FileText size={16} /> },
  { key: "banca", label: "Banca", icon: <Banknote size={16} /> },
  { key: "altro", label: "Altro", icon: <Folder size={16} /> },
];

const FormCliente: React.FC<FormClienteProps> = ({
  isOpen,
  onClose,
  onSave,
  clienteEdit,
}) => {
  const [cliente, setCliente] = useState<Cliente>(initialCliente);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>("anagrafica");

  useEffect(() => {
    if (clienteEdit) {
      setCliente(clienteEdit);
    } else {
      setCliente(initialCliente);
          }
      setErrors({});
      setTouched({});

      setActiveSection("anagrafica");
  }, [clienteEdit, isOpen]);

  const handleTabClick = (key: SectionKey) => {
    setActiveSection(key);
  };

  const handleFieldChange = (
    field: keyof Cliente,
    value: string | number | boolean
  ) => {
    setCliente((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when field is modified
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    
    // Mark field as touched
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  async function handleIdClienteBlur() {
    if (!cliente.CodiceMT || cliente.CodiceMT === clienteEdit?.CodiceMT) return;

    try {
      const isUnivoco = await checkIdClienteUnivoco(cliente.CodiceMT);
      if (!isUnivoco) {
        setErrors((prev) => ({
          ...prev,
          CodiceMT: "Codice cliente già esistente",
        }));
      } else {
        setErrors((prev) => ({ ...prev, CodiceMT: "" }));
      }
    } catch (error) {
      console.error("Errore durante la verifica del codice cliente:", error);
      setErrors((prev) => ({
        ...prev,
        CodiceMT: "Errore durante la verifica",
      }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validazione base
      const newErrors: Record<string, string> = {};
      
      if (!cliente.RagioneSocialeC?.trim()) {
        newErrors.RagioneSocialeC = "Ragione sociale è obbligatoria";
      }
      
      if (!cliente.CodiceMT?.trim()) {
        newErrors.CodiceMT = "Codice cliente è obbligatorio";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      // Normalizza i dati numerici
      const clienteNormalizzato = normalizzaNumerici(cliente);

      let clienteSalvato: Cliente;

      if (clienteEdit) {
        // Modifica cliente esistente
        clienteSalvato = await modificaCliente(clienteEdit.IdCliente!, clienteNormalizzato);
      } else {
        // Crea nuovo cliente
        const maxId = await getMaxIdCliente();
        const nuovoId = generaProssimoIdCliente(maxId);
        clienteSalvato = await creaCliente({
          ...clienteNormalizzato,
          IdCliente: nuovoId,
        });
      }

      onSave(clienteSalvato);
      onClose();
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Errore durante il salvataggio del cliente",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  function getCampiSezione(sectionKey: string): string[] {
    switch (sectionKey) {
      case "anagrafica":
        return [
          "RagioneSocialeC",
          "CodiceMT",
          "CodiceFiscale",
          "PartitaIva",
          "EffettivoPotenziale",
          "CategoriaMerceologica",
          "AttivoC",
          "AttivoDalC",
          "NonAttivoDalC",
          "Privato",
        ];
      case "contatti":
        return [
          "Telefono",
          "Fax",
          "Modem",
          "EmailFatturazione",
          "SitoInternet",
          "PECcliente",
          "EmailCertificati",
        ];
      case "indirizzi":
        return [
          "IndirizzoC",
          "CAPc",
          "CITTAc",
          "PROVc",
          "NAZc",
          "IndirizzoC2",
          "CAPc2",
          "CITTAc2",
          "PROVc2",
          "NAZc2",
          "IndirizzoC3",
          "CAPc3",
          "CITTAc3",
          "PROVc3",
          "IntestazioneSpedFat",
          "IndirizzoC4",
          "CAPc4",
          "CITTAc4",
          "PROVc4",
          "SelezioneSpedFat",
          "NoteSpedFat",
        ];
      case "fatturazione":
        return [
          "CodicePagamento",
          "DescrizionePagamentoC",
          "MetodoPagamentoC",
          "CondizioniPagamentoC",
          "ResaC",
          "TrasportoC",
          "CodiceSDI",
          "EsenzioneIva",
          "IVA",
          "Articolo15",
        ];
      case "banca":
        return [
          "CIN",
          "ABI",
          "CAB",
          "CC",
          "CodiceIBAN",
          "NostraBancaAppoggioC",
          "IBANnostraBancaC",
          "SpeseBancarie",
        ];
      case "altro":
        return [
          "Articolo15",
          "AnnoUltimoVendita",
          "CodiceFornitore",
          "PercorsoCliente",
          "PercorsoPDFClienteC",
          "PercorsoDXFClienteC",
          "RichiesteCliente",
          "Note",
        ];
      default:
        return [];
    }
  }

  function sezioneHaErrori(sectionKey: string) {
    const campi = getCampiSezione(sectionKey);
    return campi.some((c) => errors[c]);
  }

  if (!isOpen) return null;

  const renderSectionContent = () => {
    switch (activeSection) {
      case "anagrafica":
        return (
          <FormClienteAnagrafica
            data={cliente}
            onChange={handleFieldChange}
            errors={errors}
          />
        );
      case "contatti":
        return (
          <FormClienteContatti
            data={cliente}
            onChange={handleFieldChange}
            errors={errors}
          />
        );
      case "indirizzi":
        return (
          <FormClienteIndirizzi
            data={cliente}
            onChange={handleFieldChange}
            errors={errors}
          />
        );
      case "fatturazione":
        return (
          <FormClienteFatturazione
            data={cliente}
            onChange={handleFieldChange}
            errors={errors}
          />
        );
      case "banca":
        return (
          <FormClienteBanca
            data={cliente}
            onChange={handleFieldChange}
            errors={errors}
          />
        );
      case "altro":
        return (
          <FormClienteAltro
            data={cliente}
            onChange={handleFieldChange}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-600 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl">
        {/* Upper Bar a tab */}
        <div className="flex items-center border-b border-neutral-200 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-700 px-4">
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => handleTabClick(section.key as SectionKey)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 focus:outline-none
                ${
                  activeSection === section.key as SectionKey
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-neutral-600 dark:text-neutral-300"
                }
                ${
                  sezioneHaErrori(section.key)
                    ? "bg-red-100 dark:bg-red-900/40 border-red-500"
                    : ""
                }
              `}
            >
              {section.icon}
              <span>{section.label}</span>
              {sezioneHaErrori(section.key) && (
                <span className="ml-1 text-red-500 font-bold">!</span>
              )}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Codice Cliente - sempre visibile */}
            <div className="mb-6">
              <FormField
                label="Codice Cliente"
                required
                error={errors.CodiceMT}
                
              >
                <input
                  type="text"
                  value={cliente.CodiceMT || ""}
                  onChange={(e) => handleFieldChange("CodiceMT", e.target.value)}
                  onBlur={handleIdClienteBlur}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
                  placeholder="Codice cliente"
                  disabled={!!clienteEdit}
                />
              </FormField>
            </div>

            {/* Contenuto della sezione attiva */}
            {renderSectionContent()}

            {/* Errori generali */}
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {errors.general}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Actions */}
        <div className="border-t border-neutral-200 dark:border-neutral-600 p-4">
          <FormActions
            onSave={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            isValid={Object.keys(errors).length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default FormCliente; 