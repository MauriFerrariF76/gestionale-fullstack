// config/tableSchemas.tsx
import React from "react";
import { TableSchema } from "../contexts/TableConfigContext";

// Schema Clienti
export const clientiSchema: TableSchema = {
  id: "clienti",
  columns: [
    {
      key: "IdCliente",
      label: "ID Cliente",
      width: 120,
      sortable: true,
      format: (value: any) => (
        <span className="font-medium text-neutral-100">{value}</span>
      ),
    },
    {
      key: "CodiceMT",
      label: "Codice MT",
      width: 100,
      sortable: true,
      format: (value: any) => <span className="text-neutral-200">{value}</span>,
    },
    {
      key: "RagioneSocialeC",
      label: "Ragione Sociale",
      width: 200,
      sortable: true,
      format: (value: any) => <span className="text-neutral-200">{value}</span>,
    },
    {
      key: "ReferenteC",
      label: "Referente",
      width: 150,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300 text-sm">{value || "-"}</span>
      ),
    },
    {
      key: "CITTAc",
      label: "Città",
      width: 120,
      sortable: true,
      format: (value: any, row: any) => (
        <span className="text-neutral-300">{value || "-"}</span>
      ),
    },
    {
      key: "PROVc",
      label: "Provincia",
      width: 80,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300">{value || "-"}</span>
      ),
    },
    {
      key: "Telefono",
      label: "Telefono",
      width: 120,
      sortable: false,
      format: (value: any) => (
        <span className="text-neutral-300">{value || "-"}</span>
      ),
    },
    {
      key: "PartitaIva",
      label: "P.IVA",
      width: 130,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300 font-mono text-sm">
          {value || "-"}
        </span>
      ),
    },
    {
      key: "CodiceFiscale",
      label: "Codice Fiscale",
      width: 140,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300 font-mono text-sm">
          {value || "-"}
        </span>
      ),
    },
    {
      key: "CategoriaMerceologica",
      label: "Categoria",
      width: 150,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300 text-sm">{value || "-"}</span>
      ),
    },
    {
      key: "EffettivoPotenziale",
      label: "Status Commerciale",
      width: 130,
      sortable: true,
      format: (value: any) => {
        if (!value) return <span className="text-neutral-500">-</span>;
        const colors = {
          Effettivo: "bg-green-400/20 text-green-400",
          Potenziale: "bg-amber-400/20 text-amber-400",
          "Ex cliente": "bg-red-400/20 text-red-400",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              colors[value as keyof typeof colors] ||
              "bg-neutral-400/20 text-neutral-400"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: "AttivoC",
      label: "Status",
      width: 100,
      sortable: true,
      format: (value: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? "bg-green-400/20 text-green-400"
              : "bg-red-400/20 text-red-400"
          }`}
        >
          {value ? "Attivo" : "Non Attivo"}
        </span>
      ),
    },
    {
      key: "AttivoDalC",
      label: "Attivo Dal",
      width: 110,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300 text-sm">
          {value ? new Date(value).toLocaleDateString("it-IT") : "-"}
        </span>
      ),
    },
    {
      key: "CondizioniPagamentoC",
      label: "Condizioni Pagamento",
      width: 150,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300 text-sm">{value || "-"}</span>
      ),
    },
    {
      key: "BancaAppoggio",
      label: "Banca",
      width: 140,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300 text-sm">{value || "-"}</span>
      ),
    },
    {
      key: "EmailFatturazione",
      label: "Email Fatturazione",
      width: 180,
      sortable: false,
      format: (value: any) => (
        <span className="text-neutral-300 text-sm">{value || "-"}</span>
      ),
    },
    // ...aggiungi qui altre colonne che vuoi visualizzare...
  ],
  defaultVisibleColumns: [
    "IdCliente",
    "RagioneSocialeC",
    "CITTAc",
    "Telefono",
    "PartitaIva",
    "EffettivoPotenziale",
    "AttivoC",
  ],
};

// Schema Fornitori
export const fornitoriSchema: TableSchema = {
  id: "fornitori",
  columns: [
    {
      key: "codice_fornitore",
      label: "Codice",
      width: 120,
      sortable: true,
      format: (value: any) => (
        <div className="font-medium text-neutral-100">{value}</div>
      ),
    },
    {
      key: "ragione_sociale",
      label: "Ragione Sociale",
      width: 250,
      sortable: true,
      format: (value: any, row: any) => (
        <div>
          <div className="text-neutral-200">{value}</div>
          {row.referente && (
            <div className="text-xs text-neutral-400">{row.referente}</div>
          )}
        </div>
      ),
    },
    {
      key: "localita",
      label: "Località",
      width: 150,
      sortable: true,
      format: (value: any, row: any) => (
        <span className="text-neutral-300">
          {row.citta_principale
            ? `${row.citta_principale} (${row.provincia_principale})`
            : "-"}
        </span>
      ),
    },
    {
      key: "telefono",
      label: "Telefono",
      width: 120,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300">{value || "-"}</span>
      ),
    },
    {
      key: "partita_iva",
      label: "P.IVA",
      width: 130,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300 font-mono text-sm">
          {value || "-"}
        </span>
      ),
    },
    {
      key: "tipo_fornitura",
      label: "Tipo Fornitura",
      width: 150,
      sortable: true,
      format: (value: any) => {
        const getTipoColor = (tipo: string) => {
          if (tipo === "Conto Terzisti/Outsourcing")
            return "bg-purple-400/20 text-purple-400";
          if (tipo === "Materia Prima") return "bg-blue-400/20 text-blue-400";
          return "bg-green-400/20 text-green-400";
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(
              value
            )}`}
          >
            {value?.replace("Materiali di Consumo/Componenti", "Materiali") ||
              "-"}
          </span>
        );
      },
    },
    {
      key: "valutazione_complessiva",
      label: "Valutazione",
      width: 120,
      sortable: true,
      format: (value: any, row: any) => {
        const getValutazioneColor = (val: number) => {
          if (val >= 0.9) return "text-green-400";
          if (val >= 0.8) return "text-green-300";
          if (val >= 0.7) return "text-yellow-400";
          if (val >= 0.6) return "text-orange-400";
          return "text-red-400";
        };

        return (
          <div>
            <div className={`font-medium ${getValutazioneColor(value)}`}>
              {(value * 10).toFixed(1)}/10
            </div>
            <div className="text-xs text-neutral-400">
              C:{row.certificazione} S:{row.storicita} R:{row.rispetto_consegne}{" "}
              Q:{row.qualita_fornitura}
            </div>
          </div>
        );
      },
    },
    {
      key: "attivo",
      label: "Status",
      width: 120,
      sortable: true,
      format: (value: any, row: any) => (
        <div className="flex flex-col space-y-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              value
                ? "bg-green-400/20 text-green-400"
                : "bg-red-400/20 text-red-400"
            }`}
          >
            {value ? "Attivo" : "Non Attivo"}
          </span>
          {row.selezionato && (
            <span className="px-2 py-1 bg-[#3B82F6]/20 text-[#3B82F6] rounded-full text-xs font-medium">
              Selezionato
            </span>
          )}
        </div>
      ),
    },
    {
      key: "certificazione",
      label: "Certificazione",
      width: 110,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300">{value}/10</span>
      ),
    },
    {
      key: "storicita",
      label: "Storicità",
      width: 100,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300">{value}/10</span>
      ),
    },
    {
      key: "rispetto_consegne",
      label: "Rispetto Consegne",
      width: 140,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300">{value}/10</span>
      ),
    },
    {
      key: "qualita_fornitura",
      label: "Qualità Fornitura",
      width: 140,
      sortable: true,
      format: (value: any) => (
        <span className="text-neutral-300">{value}/10</span>
      ),
    },
  ],
  defaultVisibleColumns: [
    "codice_fornitore",
    "ragione_sociale",
    "localita",
    "tipo_fornitura",
    "valutazione_complessiva",
    "attivo",
  ],
};

// Utility per registrare tutti gli schemi
export const registerAllSchemas = (
  registerSchema: (schema: TableSchema) => void
) => {
  registerSchema(clientiSchema);
  registerSchema(fornitoriSchema);

  // Qui aggiungerai gli altri schemi in futuro:
  // registerSchema(commesseSchema);
  // registerSchema(dipendentiSchema);
  // registerSchema(documentiSchema);
  // ecc...
};
