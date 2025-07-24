"use client";

import UniversalTableConfigurator from "@/components/UniversalTableConfigurator";
import { useTable, useTableConfig } from "@/contexts/TableConfigContext";
import { registerAllSchemas } from "@/config/tableSchemas";
import AppLayout from "@/components/AppLayout";

import React, { useState } from "react";
import { Settings } from "lucide-react";

// Dati mock basati sulla struttura reale
type Fornitore = {
  id: number;
  codice_fornitore: string;
  ragione_sociale: string;
  referente: string | null;
  telefono: string | null;
  partita_iva: string;
  citta_principale: string;
  provincia_principale: string;
  tipo_fornitura: string;
  attivo: boolean;
  selezionato: boolean;
  certificazione: number;
  storicita: number;
  rispetto_consegne: number;
  qualita_fornitura: number;
  valutazione_complessiva: number;
};
const fornitoriMock: Fornitore[] = [
  {
    id: 1,
    codice_fornitore: "F00.0003",
    ragione_sociale: "Siderurgica Ferro Bulloni S.p.A.",
    referente: "Marchetti Fabio",
    telefono: null,
    partita_iva: "00223970138",
    citta_principale: "Cantù",
    provincia_principale: "CO",
    tipo_fornitura: "Materia Prima",
    attivo: false,
    selezionato: false,
    certificazione: 4,
    storicita: 10,
    rispetto_consegne: 10,
    qualita_fornitura: 10,
    valutazione_complessiva: 0.85,
  },
  {
    id: 2,
    codice_fornitore: "F00.0006",
    ragione_sociale: "Astori S.p.A.",
    referente: null,
    telefono: "030 9661011",
    partita_iva: "00585400989",
    citta_principale: "Montichiari",
    provincia_principale: "BS",
    tipo_fornitura: "Materiali di Consumo/Componenti",
    attivo: true,
    selezionato: false,
    certificazione: 7,
    storicita: 8,
    rispetto_consegne: 10,
    qualita_fornitura: 10,
    valutazione_complessiva: 0.875,
  },
  {
    id: 3,
    codice_fornitore: "F00.0008",
    ragione_sociale:
      "Colorificio Defranceschi di Antonio De Franceschi & C.S.n.c.",
    referente: null,
    telefono: null,
    partita_iva: "01608050207",
    citta_principale: "Bozzolo",
    provincia_principale: "MN",
    tipo_fornitura: "Materiali di Consumo/Componenti",
    attivo: true,
    selezionato: false,
    certificazione: 7,
    storicita: 8,
    rispetto_consegne: 10,
    qualita_fornitura: 10,
    valutazione_complessiva: 0.875,
  },
  {
    id: 4,
    codice_fornitore: "F00.0011",
    ragione_sociale: "Temponi F.lli S.r.l.",
    referente: "Enzo (3351007788)",
    telefono: "0302534261",
    partita_iva: "00564340172",
    citta_principale: "Nave",
    provincia_principale: "BS",
    tipo_fornitura: "Conto Terzisti/Outsourcing",
    attivo: true,
    selezionato: true,
    certificazione: 6,
    storicita: 10,
    rispetto_consegne: 9,
    qualita_fornitura: 10,
    valutazione_complessiva: 0.825,
  },
];

export default function FornitoriPage() {
  // Hook del nuovo sistema
  const { registerSchema } = useTableConfig();
  const table = useTable("fornitori");

  // State del componente
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroStato, setFiltroStato] = useState("");

  // Registra gli schemi una sola volta
  React.useEffect(() => {
    registerAllSchemas(registerSchema);
  }, [registerSchema]);

  // Filtro fornitori
  const fornitoriFiltrati = fornitoriMock.filter((fornitore) => {
    const matchSearch =
      fornitore.ragione_sociale
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      fornitore.codice_fornitore
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchTipo = !filtroTipo || fornitore.tipo_fornitura === filtroTipo;
    const matchStato =
      !filtroStato ||
      (filtroStato === "attivo" && fornitore.attivo) ||
      (filtroStato === "non_attivo" && !fornitore.attivo) ||
      (filtroStato === "selezionato" && fornitore.selezionato);

    return matchSearch && matchTipo && matchStato;
  });

  // Ordinamento usando il nuovo sistema
  const fornitoriOrdinati = table.sortData(fornitoriFiltrati);

  // Ottieni colonne visibili configurate
  const visibleColumns = table.getVisibleColumnsWithConfig();

  // Gestione ordinamento
  const handleSort = React.useCallback(
    (columnKey: string) => {
      table.handleSort(columnKey);
    },
    [table]
  );

  // Azioni per l'header
  const headerActions = (
    <>
      <button
        onClick={() => setShowConfigurator(true)}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-lg text-sm font-medium transition-colors"
      >
        <Settings className="w-4 h-4" />
        Configura Tabella
      </button>
      <button
        // onClick={() => setShowForm(true)} // TODO: Implement form
        className="bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Nuovo Fornitore</span>
      </button>
    </>
  );

  return (
    <AppLayout
      pageTitle="Gestione Fornitori"
      pageDescription="Anagrafica fornitori e sistema valutazione qualità"
      headerActions={headerActions}
    >
      {/* Search and Filters */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cerca per ragione sociale o codice fornitore..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-700/60 border border-neutral-600/60 rounded-lg text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filtroStato}
            onChange={(e) => setFiltroStato(e.target.value)}
            className="px-3 py-2 bg-neutral-700/60 border border-neutral-600/60 rounded-lg text-neutral-100 text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
          >
            <option value="">Tutti gli stati</option>
            <option value="attivo">Solo attivi</option>
            <option value="non_attivo">Solo non attivi</option>
            <option value="selezionato">Solo selezionati</option>
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 bg-neutral-700/60 border border-neutral-600/60 rounded-lg text-neutral-100 text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
          >
            <option value="">Tutti i tipi</option>
            <option value="Materia Prima">Materia Prima</option>
            <option value="Materiali di Consumo/Componenti">
              Materiali/Componenti
            </option>
            <option value="Conto Terzisti/Outsourcing">Outsourcing</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-4">
          <div className="text-2xl font-light text-neutral-100">907</div>
          <div className="text-sm text-neutral-400">Totale Fornitori</div>
        </div>
        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-4">
          <div className="text-2xl font-light text-green-400">445</div>
          <div className="text-sm text-neutral-400">Attivi</div>
        </div>
        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-4">
          <div className="text-2xl font-light text-purple-400">128</div>
          <div className="text-sm text-neutral-400">Outsourcing</div>
        </div>
        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-4">
          <div className="text-2xl font-light text-[#3B82F6]">76</div>
          <div className="text-sm text-neutral-400">Selezionati</div>
        </div>
        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-4">
          <div className="text-2xl font-light text-amber-400">8.2</div>
          <div className="text-sm text-neutral-400">Valut. Media</div>
        </div>
      </div>

      {/* Suppliers Table con il Nuovo Sistema */}
      <div className="bg-neutral-700/40 border border-neutral-600/40 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-700/60 border-b border-neutral-600/60">
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider cursor-pointer hover:bg-neutral-600/40 transition-colors select-none"
                    style={{ width: column.width }}
                    onClick={() =>
                      column.sortable !== false && handleSort(column.key)
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {column.sortable !== false && (
                        <div className="flex flex-col">
                          <svg
                            className={`w-3 h-3 ${
                              table.sortConfig?.key === column.key &&
                              table.sortConfig.direction === "asc"
                                ? "text-[#3B82F6]"
                                : "text-neutral-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <svg
                            className={`w-3 h-3 -mt-1 ${
                              table.sortConfig?.key === column.key &&
                              table.sortConfig.direction === "desc"
                                ? "text-[#3B82F6]"
                                : "text-neutral-500"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider w-20">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-600/40">
              {fornitoriOrdinati.map((fornitore) => (
                <tr
                  key={fornitore.id}
                  className="hover:bg-neutral-700/30 transition-colors"
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm"
                      style={{ width: column.width }}
                    >
                      {column.format
                        ? column.format(
                            fornitore[column.key as keyof Fornitore],
                            fornitore
                          )
                        : fornitore[column.key as keyof Fornitore]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        // onClick={() => setSelectedFornitore(fornitore)} // TODO: Implement details view
                        className="text-neutral-400 hover:text-[#3B82F6] transition-colors"
                        title="Visualizza dettagli"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        className="text-neutral-400 hover:text-amber-400 transition-colors"
                        title="Modifica fornitore"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          Visualizzati {fornitoriOrdinati.length} di {fornitoriMock.length}{" "}
          fornitori
          {table.sortConfig && (
            <span className="ml-2 text-[#3B82F6]">
              • Ordinato per{" "}
              {
                visibleColumns.find((c) => c.key === table.sortConfig!.key)
                  ?.label
              }{" "}
              (
              {table.sortConfig.direction === "asc"
                ? "crescente"
                : "decrescente"}
              )
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 bg-neutral-700/60 border border-neutral-600/60 rounded text-sm text-neutral-300 hover:bg-neutral-700 transition-colors">
            Precedente
          </button>
          <button className="px-3 py-1 bg-[#3B82F6] text-white rounded text-sm">
            1
          </button>
          <button className="px-3 py-1 bg-neutral-700/60 border border-neutral-600/60 rounded text-sm text-neutral-300 hover:bg-neutral-700 transition-colors">
            2
          </button>
          <button className="px-3 py-1 bg-neutral-700/60 border border-neutral-600/60 rounded text-sm text-neutral-300 hover:bg-neutral-700 transition-colors">
            Successivo
          </button>
        </div>
      </div>

      {/* Nuovo Configuratore */}
      <UniversalTableConfigurator
        isOpen={showConfigurator}
        onClose={() => setShowConfigurator(false)}
        tableId="fornitori"
        title="Fornitori"
      />
    </AppLayout>
  );
}
