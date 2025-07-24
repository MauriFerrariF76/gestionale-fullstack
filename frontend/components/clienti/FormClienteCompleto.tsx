import React, { useState, useEffect, useRef } from "react";
import { Cliente } from "../../types/clienti/cliente";
import {
  creaCliente,
  modificaCliente,
  checkIdClienteUnivoco,
  getMaxIdCliente, // <--- IMPORTA QUI
} from "../../lib/clienti/api";
import {
  User2,
  MapPin,
  Phone,
  FileText,
  Banknote,
  Folder,
  Pencil,
} from "lucide-react";

interface FormClienteCompletoProps {
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
  ABI:
    cliente.ABI === "" || cliente.ABI === undefined || cliente.ABI === null
      ? null
      : isNaN(Number(cliente.ABI))
      ? null
      : String(Number(cliente.ABI)),
  CAB:
    cliente.CAB === "" || cliente.CAB === undefined || cliente.CAB === null
      ? null
      : isNaN(Number(cliente.CAB))
      ? null
      : String(Number(cliente.CAB)),
  CC:
    cliente.CC === "" || cliente.CC === undefined || cliente.CC === null
      ? null
      : isNaN(Number(cliente.CC))
      ? null
      : String(Number(cliente.CC)),
  CodicePagamento:
    cliente.CodicePagamento === "" ||
    cliente.CodicePagamento === undefined ||
    cliente.CodicePagamento === null
      ? null
      : isNaN(Number(cliente.CodicePagamento))
      ? null
      : String(Number(cliente.CodicePagamento)),
  CIN:
    cliente.CIN === "" || cliente.CIN === undefined || cliente.CIN === null
      ? null
      : isNaN(Number(cliente.CIN))
      ? null
      : String(Number(cliente.CIN)),
  // Date: se stringa vuota o undefined/null, metti null
  AttivoDalC:
    cliente.AttivoDalC === "" || cliente.AttivoDalC === undefined
      ? null
      : cliente.AttivoDalC,
  NonAttivoDalC:
    cliente.NonAttivoDalC === "" || cliente.NonAttivoDalC === undefined
      ? null
      : cliente.NonAttivoDalC,
});

// Funzione per generare il prossimo IdCliente dato il massimo attuale
function generaProssimoIdCliente(
  maxIdCliente: string | null | undefined
): string {
  if (typeof maxIdCliente === "string" && maxIdCliente.includes(".")) {
    const [prefix, numStr] = maxIdCliente.split(".");
    const numero = parseInt(numStr, 10) + 1;
    return `${prefix}.${numero.toString().padStart(4, "0")}`;
  }
  return "C00.0001";
}

const SECTIONS = [
  {
    key: "anagrafica",
    label: "Dati Anagrafici",
    icon: <User2 className="w-5 h-5" />,
  },
  {
    key: "contatti",
    label: "Contatti",
    icon: <Phone className="w-5 h-5" />,
  },
  {
    key: "indirizzi",
    label: "Indirizzi",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    key: "fatturazione",
    label: "Fatturazione",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    key: "banca",
    label: "Banca",
    icon: <Banknote className="w-5 h-5" />,
  },
  {
    key: "altro",
    label: "Altri Dati",
    icon: <Folder className="w-5 h-5" />,
  },
];

const obbligatori = ["IdCliente", "RagioneSocialeC"];

// Definizione tipo per le chiavi delle sezioni
type SectionKey = "anagrafica" | "contatti" | "indirizzi" | "fatturazione" | "banca" | "altro";

const FormClienteCompleto = ({
  isOpen,
  onClose,
  onSave,
  clienteEdit,
}: FormClienteCompletoProps) => {
  const [cliente, setCliente] = useState<Cliente>(
    clienteEdit || initialCliente
  );
  const [activeSection, setActiveSection] = useState<SectionKey>("anagrafica");
  const [errors, setErrors] = useState<{ [k: string]: boolean }>({});
  const [idEditable, setIdEditable] = useState(false);
  const [idCheckLoading, setIdCheckLoading] = useState(false);
  const [idCheckError, setIdCheckError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const sectionRefs: Record<SectionKey, React.RefObject<HTMLDivElement | null>> = {
    anagrafica: useRef<HTMLDivElement | null>(null),
    contatti: useRef<HTMLDivElement | null>(null),
    indirizzi: useRef<HTMLDivElement | null>(null),
    fatturazione: useRef<HTMLDivElement | null>(null),
    banca: useRef<HTMLDivElement | null>(null),
    altro: useRef<HTMLDivElement | null>(null),
  };

  useEffect(() => {
    if (!clienteEdit && isOpen) {
      setIdEditable(true); // Abilita campo per nuovo cliente
      getMaxIdCliente()
        .then((maxId) => {
          console.log("maxIdCliente dal backend:", maxId);
          const nuovoId = generaProssimoIdCliente(maxId);
          console.log("nuovoId generato:", nuovoId);
          setCliente({ ...initialCliente, IdCliente: nuovoId });
        })
        .catch(() => {
          setCliente({ ...initialCliente, IdCliente: "C00.0001" });
        });
    } else if (clienteEdit) {
      setCliente(clienteEdit);
      setIdEditable(false); // Disabilita campo per modifica
    } else {
      setCliente(initialCliente);
      setIdEditable(true);
    }
    setErrors({});
    setIdCheckError(null);
    setSubmitError(null);
    setIdCheckLoading(false);
    setActiveSection("anagrafica");
  }, [clienteEdit, isOpen]);

  const handleTabClick = (key: SectionKey) => {
    setActiveSection(key);
    sectionRefs[key]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCliente((prevCliente) => ({
      ...prevCliente,
      [name]: value,
    }));
  };

  // Funzione per validare l'unicità dell'ID Cliente
  async function handleIdClienteBlur() {
    if (!cliente.IdCliente) return;
    setIdCheckLoading(true);
    setIdCheckError(null);
    const exists = await checkIdClienteUnivoco(cliente.IdCliente);
    setIdCheckLoading(false);
    if (
      exists &&
      (!clienteEdit || clienteEdit.IdCliente !== cliente.IdCliente)
    ) {
      setErrors((prev) => ({ ...prev, IdCliente: true }));
      setIdCheckError("ID Cliente già esistente. Scegli un altro ID.");
    } else {
      setErrors((prev) => ({ ...prev, IdCliente: false }));
      setIdCheckError(null);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    // Validazione campi obbligatori
    const nuoviErrori: { [k: string]: boolean } = {};
    obbligatori.forEach((campo) => {
      if (
        !cliente[campo] ||
        (typeof cliente[campo] === "string" && cliente[campo].trim() === "")
      ) {
        nuoviErrori[campo] = true;
      }
    });
    setErrors(nuoviErrori);
    if (Object.keys(nuoviErrori).length > 0) {
      // Trova la prima sezione con errore e scrolla lì
      for (const section of SECTIONS) {
        const campiSezione = getCampiSezione(section.key);
        if (campiSezione.some((c) => nuoviErrori[c])) {
          setActiveSection(section.key as SectionKey);
          sectionRefs[section.key as SectionKey]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          break;
        }
      }
      return;
    }
    // Nel submit, blocco il salvataggio se c'è errore di unicità
    if (idCheckError) return;
    try {
      const clienteDaInviare = normalizzaNumerici(cliente);
      if (clienteEdit) {
        if (!clienteEdit.IdCliente) {
          alert("ID cliente mancante!");
          return;
        }
        await modificaCliente(clienteEdit.IdCliente, clienteDaInviare);
      } else {
        await creaCliente(clienteDaInviare);
      }
      onSave(clienteDaInviare);
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "ID Cliente già esistente") {
        setErrors((prev) => ({ ...prev, IdCliente: true }));
        setSubmitError("ID Cliente già esistente. Scegli un altro ID.");
      } else {
        setSubmitError("Errore durante il salvataggio. Riprova.");
      }
    }
  };

  // Funzione di utilità: restituisce i campi di ogni sezione
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
          "NAZc3",
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
          "created_at",
          "updated_at",
        ];
      default:
        return [];
    }
  }

  // Funzione per sapere se una sezione contiene errori
  function sezioneHaErrori(sectionKey: string) {
    const campi = getCampiSezione(sectionKey);
    return campi.some((c) => errors[c]);
  }

  if (!isOpen) return null;

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
        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-y-auto"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-12">
            {/* Campo IdCliente sempre in alto */}
            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="IdCliente"
              >
                ID Cliente <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="IdCliente"
                  id="IdCliente"
                  value={cliente.IdCliente || ""}
                  onChange={handleInputChange}
                  onBlur={handleIdClienteBlur}
                  className={`w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors ${
                    errors.IdCliente ? "border-red-500" : ""
                  }`}
                  required
                  disabled={!idEditable}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="text-neutral-400 hover:text-blue-600"
                  title="Modifica ID Cliente"
                  onClick={() => setIdEditable((v) => !v)}
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              {errors.IdCliente && (
                <div className="text-xs text-red-500 mt-1">
                  Campo obbligatorio e deve essere univoco
                </div>
              )}
              {idCheckLoading && (
                <span className="text-xs text-blue-500 ml-2">Controllo...</span>
              )}
              {idCheckError && (
                <div className="text-xs text-red-500 mt-1">{idCheckError}</div>
              )}
              {submitError && (
                <div className="text-xs text-red-500 mt-1">{submitError}</div>
              )}
            </div>
            {/* Sezione: Dati Anagrafici */}
            <div ref={sectionRefs.anagrafica} id="anagrafica">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User2 className="w-5 h-5" /> Dati Anagrafici
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ragione Sociale */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="RagioneSocialeC"
                  >
                    Ragione Sociale <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="RagioneSocialeC"
                    id="RagioneSocialeC"
                    value={cliente.RagioneSocialeC || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors`}
                    required
                  />
                </div>
                {/* CodiceMT */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CodiceMT"
                  >
                    Codice MT
                  </label>
                  <input
                    type="text"
                    name="CodiceMT"
                    id="CodiceMT"
                    value={cliente.CodiceMT || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Codice Fiscale */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CodiceFiscale"
                  >
                    Codice Fiscale
                  </label>
                  <input
                    type="text"
                    name="CodiceFiscale"
                    id="CodiceFiscale"
                    value={cliente.CodiceFiscale || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors`}
                  />
                </div>
                {/* Partita IVA */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="PartitaIva"
                  >
                    Partita IVA
                  </label>
                  <input
                    type="text"
                    name="PartitaIva"
                    id="PartitaIva"
                    value={cliente.PartitaIva || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors`}
                  />
                </div>
                {/* Effettivo/Potenziale */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="EffettivoPotenziale"
                  >
                    Effettivo/Potenziale
                  </label>
                  <select
                    name="EffettivoPotenziale"
                    id="EffettivoPotenziale"
                    value={cliente.EffettivoPotenziale || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  >
                    <option value="">Seleziona...</option>
                    <option value="Effettivo">Effettivo</option>
                    <option value="Potenziale">Potenziale</option>
                    <option value="Ex cliente">Ex cliente</option>
                  </select>
                </div>
                {/* Categoria Merceologica */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CategoriaMerceologica"
                  >
                    Categoria Merceologica
                  </label>
                  <input
                    type="text"
                    name="CategoriaMerceologica"
                    id="CategoriaMerceologica"
                    value={cliente.CategoriaMerceologica || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Attivo (checkbox) */}
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="AttivoC"
                    id="AttivoC"
                    checked={!!cliente.AttivoC}
                    value="true"
                    onChange={(e) =>
                      setCliente((prev) => ({
                        ...prev,
                        AttivoC: e.target.checked ? "true" : null,
                      }))
                    }
                    className="mr-2"
                  />
                  <label htmlFor="AttivoC" className="text-sm font-medium">
                    Attivo
                  </label>
                </div>
                {/* Attivo dal */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="AttivoDalC"
                  >
                    Attivo dal
                  </label>
                  <input
                    type="date"
                    name="AttivoDalC"
                    id="AttivoDalC"
                    value={cliente.AttivoDalC || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Non attivo dal */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="NonAttivoDalC"
                  >
                    Non attivo dal
                  </label>
                  <input
                    type="date"
                    name="NonAttivoDalC"
                    id="NonAttivoDalC"
                    value={cliente.NonAttivoDalC || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Privato (checkbox) */}
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="Privato"
                    id="Privato"
                    checked={!!cliente.Privato}
                    value="true"
                    onChange={(e) =>
                      setCliente((prev) => ({
                        ...prev,
                        Privato: e.target.checked ? "true" : null,
                      }))
                    }
                    className="mr-2"
                  />
                  <label htmlFor="Privato" className="text-sm font-medium">
                    Privato
                  </label>
                </div>
              </div>
            </div>
            {/* Sezione: Contatti */}
            <div ref={sectionRefs.contatti} id="contatti">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" /> Contatti
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Telefono */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="Telefono"
                  >
                    Telefono
                  </label>
                  <input
                    type="tel"
                    name="Telefono"
                    id="Telefono"
                    value={cliente.Telefono || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Fax */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="Fax"
                  >
                    Fax
                  </label>
                  <input
                    type="text"
                    name="Fax"
                    id="Fax"
                    value={cliente.Fax || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Modem */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="Modem"
                  >
                    Modem
                  </label>
                  <input
                    type="text"
                    name="Modem"
                    id="Modem"
                    value={cliente.Modem || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Email Fatturazione */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="EmailFatturazione"
                  >
                    Email Fatturazione
                  </label>
                  <input
                    type="email"
                    name="EmailFatturazione"
                    id="EmailFatturazione"
                    value={cliente.EmailFatturazione || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Sito Internet */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="SitoInternet"
                  >
                    Sito Internet
                  </label>
                  <input
                    type="url"
                    name="SitoInternet"
                    id="SitoInternet"
                    value={cliente.SitoInternet || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* PEC Cliente */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="PECcliente"
                  >
                    PEC Cliente
                  </label>
                  <input
                    type="email"
                    name="PECcliente"
                    id="PECcliente"
                    value={cliente.PECcliente || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Email Certificati */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="EmailCertificati"
                  >
                    Email Certificati
                  </label>
                  <input
                    type="email"
                    name="EmailCertificati"
                    id="EmailCertificati"
                    value={cliente.EmailCertificati || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>
            </div>
            {/* Sezione: Indirizzi */}
            <div ref={sectionRefs.indirizzi} id="indirizzi">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Indirizzi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Indirizzo */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="IndirizzoC"
                  >
                    Indirizzo
                  </label>
                  <input
                    type="text"
                    name="IndirizzoC"
                    id="IndirizzoC"
                    value={cliente.IndirizzoC || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* CAP */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CAPc"
                  >
                    CAP
                  </label>
                  <input
                    type="text"
                    name="CAPc"
                    id="CAPc"
                    value={
                      cliente.CAPc !== null && cliente.CAPc !== undefined
                        ? cliente.CAPc
                        : ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Città */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CITTAc"
                  >
                    Città
                  </label>
                  <input
                    type="text"
                    name="CITTAc"
                    id="CITTAc"
                    value={cliente.CITTAc ?? ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Provincia */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="PROVc"
                  >
                    Provincia
                  </label>
                  <input
                    type="text"
                    name="PROVc"
                    id="PROVc"
                    value={cliente.PROVc || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Nazione */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="NAZc"
                  >
                    Nazione
                  </label>
                  <input
                    type="text"
                    name="NAZc"
                    id="NAZc"
                    value={cliente.NAZc || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Indirizzo 2 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="IndirizzoC2"
                  >
                    Indirizzo 2
                  </label>
                  <input
                    type="text"
                    name="IndirizzoC2"
                    id="IndirizzoC2"
                    value={cliente.IndirizzoC2 || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* CAP 2 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CAPc2"
                  >
                    CAP 2
                  </label>
                  <input
                    type="text"
                    name="CAPc2"
                    id="CAPc2"
                    value={
                      cliente.CAPc2 !== null && cliente.CAPc2 !== undefined
                        ? cliente.CAPc2
                        : ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Città 2 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CITTAc2"
                  >
                    Città 2
                  </label>
                  <input
                    type="text"
                    name="CITTAc2"
                    id="CITTAc2"
                    value={cliente.CITTAc2 ?? ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Provincia 2 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="PROVc2"
                  >
                    Provincia 2
                  </label>
                  <input
                    type="text"
                    name="PROVc2"
                    id="PROVc2"
                    value={cliente.PROVc2 || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Nazione 2 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="NAZc2"
                  >
                    Nazione 2
                  </label>
                  <input
                    type="text"
                    name="NAZc2"
                    id="NAZc2"
                    value={cliente.NAZc2 || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Indirizzo 3 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="IndirizzoC3"
                  >
                    Indirizzo 3
                  </label>
                  <input
                    type="text"
                    name="IndirizzoC3"
                    id="IndirizzoC3"
                    value={cliente.IndirizzoC3 || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* CAP 3 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CAPc3"
                  >
                    CAP 3
                  </label>
                  <input
                    type="text"
                    name="CAPc3"
                    id="CAPc3"
                    value={
                      cliente.CAPc3 !== null && cliente.CAPc3 !== undefined
                        ? cliente.CAPc3
                        : ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Città 3 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CITTAc3"
                  >
                    Città 3
                  </label>
                  <input
                    type="text"
                    name="CITTAc3"
                    id="CITTAc3"
                    value={cliente.CITTAc3 ?? ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Provincia 3 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="PROVc3"
                  >
                    Provincia 3
                  </label>
                  <input
                    type="text"
                    name="PROVc3"
                    id="PROVc3"
                    value={cliente.PROVc3 || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Nazione 3 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="NAZc3"
                  >
                    Nazione 3
                  </label>
                  <input
                    type="text"
                    name="NAZc3"
                    id="NAZc3"
                    value={cliente.NAZc3 || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Intestazione Spedizione/Fatturazione */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="IntestazioneSpedFat"
                  >
                    Intestazione Spedizione/Fatturazione
                  </label>
                  <input
                    type="text"
                    name="IntestazioneSpedFat"
                    id="IntestazioneSpedFat"
                    value={cliente.IntestazioneSpedFat || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Indirizzo 4 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="IndirizzoC4"
                  >
                    Indirizzo 4
                  </label>
                  <input
                    type="text"
                    name="IndirizzoC4"
                    id="IndirizzoC4"
                    value={cliente.IndirizzoC4 || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* CAP 4 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CAPc4"
                  >
                    CAP 4
                  </label>
                  <input
                    type="text"
                    name="CAPc4"
                    id="CAPc4"
                    value={
                      cliente.CAPc4 !== null && cliente.CAPc4 !== undefined
                        ? cliente.CAPc4
                        : ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Città 4 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CITTAc4"
                  >
                    Città 4
                  </label>
                  <input
                    type="text"
                    name="CITTAc4"
                    id="CITTAc4"
                    value={cliente.CITTAc4 ?? ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Provincia 4 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="PROVc4"
                  >
                    Provincia 4
                  </label>
                  <input
                    type="text"
                    name="PROVc4"
                    id="PROVc4"
                    value={cliente.PROVc4 || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Selezione Spedizione/Fatturazione */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="SelezioneSpedFat"
                  >
                    Selezione Spedizione/Fatturazione
                  </label>
                  <select
                    name="SelezioneSpedFat"
                    id="SelezioneSpedFat"
                    value={typeof cliente.SelezioneSpedFat === "string" ? cliente.SelezioneSpedFat : ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  >
                    <option value="">Seleziona...</option>
                    <option value="Spedizione">Spedizione</option>
                    <option value="Fatturazione">Fatturazione</option>
                  </select>
                </div>
                {/* Note Spedizione/Fatturazione */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="NoteSpedFat"
                  >
                    Note Spedizione/Fatturazione
                  </label>
                  <textarea
                    name="NoteSpedFat"
                    id="NoteSpedFat"
                    value={cliente.NoteSpedFat || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            {/* Sezione: Fatturazione */}
            <div ref={sectionRefs.fatturazione} id="fatturazione">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Fatturazione
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Codice Pagamento */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CodicePagamento"
                  >
                    Codice Pagamento
                  </label>
                  <input
                    type="text"
                    name="CodicePagamento"
                    id="CodicePagamento"
                    value={
                      cliente.CodicePagamento !== null &&
                      cliente.CodicePagamento !== undefined
                        ? cliente.CodicePagamento
                        : ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Descrizione Pagamento */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="DescrizionePagamentoC"
                  >
                    Descrizione Pagamento
                  </label>
                  <input
                    type="text"
                    name="DescrizionePagamentoC"
                    id="DescrizionePagamentoC"
                    value={cliente.DescrizionePagamentoC || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Metodo Pagamento */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="MetodoPagamentoC"
                  >
                    Metodo Pagamento
                  </label>
                  <select
                    name="MetodoPagamentoC"
                    id="MetodoPagamentoC"
                    value={cliente.MetodoPagamentoC || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  >
                    <option value="">Seleziona...</option>
                    <option value="Contanti">Contanti</option>
                    <option value="Bonifico">Bonifico</option>
                    <option value="Assegno">Assegno</option>
                    <option value="Carta di Credito">Carta di Credito</option>
                    <option value="Carta di Debito">Carta di Debito</option>
                    <option value="Prelievo">Prelievo</option>
                    <option value="Bollettino">Bollettino</option>
                    <option value="Fattura">Fattura</option>
                  </select>
                </div>
                {/* Condizioni Pagamento */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CondizioniPagamentoC"
                  >
                    Condizioni Pagamento
                  </label>
                  <select
                    name="CondizioniPagamentoC"
                    id="CondizioniPagamentoC"
                    value={cliente.CondizioniPagamentoC || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                  >
                    <option value="">Seleziona...</option>
                    <option value="Netto">Netto</option>
                    <option value="30 giorni">30 giorni</option>
                    <option value="60 giorni">60 giorni</option>
                    <option value="90 giorni">90 giorni</option>
                    <option value="120 giorni">120 giorni</option>
                    <option value="180 giorni">180 giorni</option>
                    <option value="360 giorni">360 giorni</option>
                  </select>
                </div>
                {/* Resa C */}
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="ResaC"
                    id="ResaC"
                    checked={!!cliente.ResaC}
                    value="true"
                    onChange={(e) =>
                      setCliente((prev) => ({
                        ...prev,
                        ResaC: e.target.checked ? "true" : null,
                      }))
                    }
                    className="mr-2"
                  />
                  <label htmlFor="ResaC" className="text-sm font-medium">
                    Resa C
                  </label>
                </div>
                {/* Trasporto C */}
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="TrasportoC"
                    id="TrasportoC"
                    checked={!!cliente.TrasportoC}
                    value="true"
                    onChange={(e) =>
                      setCliente((prev) => ({
                        ...prev,
                        TrasportoC: e.target.checked ? "true" : null,
                      }))
                    }
                    className="mr-2"
                  />
                  <label htmlFor="TrasportoC" className="text-sm font-medium">
                    Trasporto C
                  </label>
                </div>
                {/* Codice SDI */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CodiceSDI"
                  >
                    Codice SDI
                  </label>
                  <input
                    type="text"
                    name="CodiceSDI"
                    id="CodiceSDI"
                    value={cliente.CodiceSDI || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Esenzione Iva */}
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="EsenzioneIva"
                    id="EsenzioneIva"
                    checked={!!cliente.EsenzioneIva}
                    value="true"
                    onChange={(e) =>
                      setCliente((prev) => ({
                        ...prev,
                        EsenzioneIva: e.target.checked ? "true" : null,
                      }))
                    }
                    className="mr-2"
                  />
                  <label htmlFor="EsenzioneIva" className="text-sm font-medium">
                    Esenzione Iva
                  </label>
                </div>
              </div>
            </div>
            {/* Sezione: Banca */}
            <div ref={sectionRefs.banca} id="banca">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Banknote className="w-5 h-5" /> Banca
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CIN */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CIN"
                  >
                    CIN
                  </label>
                  <input
                    type="text"
                    name="CIN"
                    id="CIN"
                    value={
                      cliente.CIN !== null && cliente.CIN !== undefined
                        ? cliente.CIN
                        : ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* ABI */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="ABI"
                  >
                    ABI
                  </label>
                  <input
                    type="text"
                    name="ABI"
                    id="ABI"
                    value={
                      cliente.ABI !== null && cliente.ABI !== undefined
                        ? cliente.ABI
                        : ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* CAB */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CAB"
                  >
                    CAB
                  </label>
                  <input
                    type="text"
                    name="CAB"
                    id="CAB"
                    value={
                      cliente.CAB !== null && cliente.CAB !== undefined
                        ? cliente.CAB
                        : ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* CC */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CC"
                  >
                    CC
                  </label>
                  <input
                    type="text"
                    name="CC"
                    id="CC"
                    value={
                      cliente.CC !== null && cliente.CC !== undefined
                        ? cliente.CC
                        : ""
                    }
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Codice IBAN */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CodiceIBAN"
                  >
                    Codice IBAN
                  </label>
                  <input
                    type="text"
                    name="CodiceIBAN"
                    id="CodiceIBAN"
                    value={cliente.CodiceIBAN || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Nostra Banca Appoggio */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="NostraBancaAppoggioC"
                  >
                    Nostra Banca Appoggio
                  </label>
                  <input
                    type="text"
                    name="NostraBancaAppoggioC"
                    id="NostraBancaAppoggioC"
                    value={cliente.NostraBancaAppoggioC || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* IBAN Nostra Banca */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="IBANnostraBancaC"
                  >
                    IBAN Nostra Banca
                  </label>
                  <input
                    type="text"
                    name="IBANnostraBancaC"
                    id="IBANnostraBancaC"
                    value={cliente.IBANnostraBancaC || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Spese Bancarie */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="SpeseBancarie"
                  >
                    Spese Bancarie
                  </label>
                  <input
                    type="number"
                    name="SpeseBancarie"
                    id="SpeseBancarie"
                    value={typeof cliente.SpeseBancarie === "string" ? cliente.SpeseBancarie : ""}
                    onChange={(e) =>
                      setCliente((prev) => ({
                        ...prev,
                        SpeseBancarie:
                          e.target.value === "" ? null : String(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>
            </div>
            {/* Sezione: Altro */}
            <div ref={sectionRefs.altro} id="altro">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Folder className="w-5 h-5" /> Altri Dati
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Articolo 15 */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="Articolo15"
                  >
                    Articolo 15
                  </label>
                  <input
                    type="number"
                    name="Articolo15"
                    id="Articolo15"
                    value={typeof cliente.Articolo15 === "string" ? cliente.Articolo15 : ""}
                    onChange={(e) =>
                      setCliente((prev) => ({
                        ...prev,
                        Articolo15:
                          e.target.value === "" ? null : String(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Anno Ultimo Vendita */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="AnnoUltimoVendita"
                  >
                    Anno Ultimo Vendita
                  </label>
                  <input
                    type="number"
                    name="AnnoUltimoVendita"
                    id="AnnoUltimoVendita"
                    value={typeof cliente.AnnoUltimoVendita === "string" ? cliente.AnnoUltimoVendita : ""}
                    onChange={(e) =>
                      setCliente((prev) => ({
                        ...prev,
                        AnnoUltimoVendita:
                          e.target.value === "" ? null : String(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Codice Fornitore */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="CodiceFornitore"
                  >
                    Codice Fornitore
                  </label>
                  <input
                    type="text"
                    name="CodiceFornitore"
                    id="CodiceFornitore"
                    value={cliente.CodiceFornitore || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Percorso Cliente */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="PercorsoCliente"
                  >
                    Percorso Cliente
                  </label>
                  <input
                    type="text"
                    name="PercorsoCliente"
                    id="PercorsoCliente"
                    value={cliente.PercorsoCliente || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Percorso PDF Cliente */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="PercorsoPDFClienteC"
                  >
                    Percorso PDF Cliente
                  </label>
                  <input
                    type="text"
                    name="PercorsoPDFClienteC"
                    id="PercorsoPDFClienteC"
                    value={cliente.PercorsoPDFClienteC || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Percorso DXF Cliente */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="PercorsoDXFClienteC"
                  >
                    Percorso DXF Cliente
                  </label>
                  <input
                    type="text"
                    name="PercorsoDXFClienteC"
                    id="PercorsoDXFClienteC"
                    value={cliente.PercorsoDXFClienteC || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Richieste Cliente */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="RichiesteCliente"
                  >
                    Richieste Cliente
                  </label>
                  <input
                    type="text"
                    name="RichiesteCliente"
                    id="RichiesteCliente"
                    value={cliente.RichiesteCliente || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* Note */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="Note"
                  >
                    Note
                  </label>
                  <textarea
                    name="Note"
                    id="Note"
                    value={typeof cliente.Note === "string" ? cliente.Note : ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                    rows={3}
                  />
                </div>
                {/* created_at */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="created_at"
                  >
                    created_at
                  </label>
                  <input
                    type="text"
                    name="created_at"
                    id="created_at"
                    value={typeof cliente.created_at === "string" ? cliente.created_at : ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
                {/* updated_at */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="updated_at"
                  >
                    updated_at
                  </label>
                  <input
                    type="text"
                    name="updated_at"
                    id="updated_at"
                    value={typeof cliente.updated_at === "string" ? cliente.updated_at : ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors mr-2"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {clienteEdit ? "Salva Modifiche" : "Crea Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormClienteCompleto;
