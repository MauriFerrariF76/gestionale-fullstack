"use client";

import UniversalTableConfigurator from "@/components/UniversalTableConfigurator";
import { useTable, useTableConfig } from "@/contexts/TableConfigContext";
import { registerAllSchemas } from "@/config/tableSchemas";
import AppLayout from "@/components/AppLayout";
import React, { useState, useEffect, useCallback } from "react";
import FormClienteCompleto from "@/components/clienti/FormClienteCompleto";
import { Settings, Pencil } from "lucide-react";
import { getClienti, creaCliente, modificaCliente } from "@/lib/clienti/api";
import { Cliente } from "@/types/clienti/cliente";

export default function ClientiPage() {
  // Hook del nuovo sistema
  const { registerSchema } = useTableConfig();
  const table = useTable("clienti");

  // State del componente
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [clienteEdit, setClienteEdit] = useState<Cliente | null>(null);
  const [showConfigurator, setShowConfigurator] = useState(false);

  // Stato per i clienti reali
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);
  // Nuovi state per i filtri
  const [filtroStato, setFiltroStato] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  // Funzione per caricare i clienti dal backend
  const fetchClienti = () => {
    setLoading(true);
    getClienti()
      .then((data) => {
        // Assicuriamoci che data sia sempre un array
        const clientiArray = Array.isArray(data) ? data : [];
        setClienti(clientiArray);
        setErrore(null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore nel caricamento clienti:", error);
        setClienti([]);
        setErrore("Errore di rete o di backend");
        setLoading(false);
      });
  };

  // Fetch dei clienti dal backend all'avvio
  useEffect(() => {
    fetchClienti();
  }, []);

  // Registra gli schemi una sola volta
  useEffect(() => {
    registerAllSchemas(registerSchema);
  }, [registerSchema]);

  // Filtro clienti
  const clientiFiltrati = (Array.isArray(clienti) ? clienti : []).filter((cliente) => {
    const matchSearch =
      (cliente.RagioneSocialeC &&
        cliente.RagioneSocialeC.toLowerCase().includes(
          searchTerm.toLowerCase()
        )) ||
      (cliente.IdCliente &&
        cliente.IdCliente.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchStato =
      !filtroStato ||
      (filtroStato === "attivo" && cliente.AttivoC === true) ||
      (filtroStato === "non_attivo" && cliente.AttivoC === false);

    const matchCategoria =
      !filtroCategoria || cliente.EffettivoPotenziale === filtroCategoria;

    return matchSearch && matchStato && matchCategoria;
  });

  // Ordinamento usando il nuovo sistema
  const clientiOrdinati = table.sortData<Cliente>(clientiFiltrati);

  // Ottieni colonne visibili configurate
  const visibleColumns = table.getVisibleColumnsWithConfig();

  // Gestione ordinamento con callback per forzare re-render
  const handleSort = useCallback(
    (columnKey: string) => {
      table.handleSort(columnKey);
    },
    [table]
  );

  // Gestione nuovo cliente
  const handleNuovoCliente = () => {
    setClienteEdit(null);
    setShowForm(true);
  };

  // Gestione modifica cliente esistente
  const handleModificaCliente = (cliente: Cliente) => {
    setClienteEdit(cliente);
    setShowForm(true);
  };

  // Gestione salvataggio
  const handleSaveCliente = async (data: Cliente) => {
    try {
      if (clienteEdit) {
        // Modifica cliente esistente
        if (!clienteEdit.IdCliente) {
          alert("Errore: ID cliente mancante!");
          return;
        }
        await modificaCliente(clienteEdit.IdCliente!, data);
        alert(`Cliente \"${data.RagioneSocialeC}\" modificato con successo!`);
      } else {
        // Nuovo cliente
        await creaCliente(data);
        alert(`Cliente \"${data.RagioneSocialeC}\" creato con successo!`);
      }
      setShowForm(false);
      setClienteEdit(null);
      fetchClienti();
    } catch {
      alert("Errore durante il salvataggio");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setClienteEdit(null);
  };

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
        onClick={handleNuovoCliente}
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
        <span>Nuovo Cliente</span>
      </button>
    </>
  );

  // Contatori per le card
  const totaleAttivi = Array.isArray(clienti) ? clienti.filter((c) => c.AttivoC === true).length : 0;
  const totaleEffettivi = Array.isArray(clienti) ? clienti.filter(
    (c) => c.EffettivoPotenziale === "Effettivo"
  ).length : 0;
  const totalePotenziali = Array.isArray(clienti) ? clienti.filter(
    (c) => c.EffettivoPotenziale === "Potenziale"
  ).length : 0;

  if (errore) {
    return (
      <AppLayout
        pageTitle="Gestione Clienti"
        pageDescription="Anagrafica e gestione clienti aziendali"
        headerActions={headerActions}
      >
        <div className="text-center py-10 text-red-400">Errore: {errore}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      pageTitle="Gestione Clienti"
      pageDescription="Anagrafica e gestione clienti aziendali"
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
              placeholder="Cerca per ragione sociale, codice cliente, referente..."
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
            <option value="">Tutti i clienti</option>
            <option value="attivo">Solo attivi</option>
            <option value="non_attivo">Solo non attivi</option>
          </select>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-3 py-2 bg-neutral-700/60 border border-neutral-600/60 rounded-lg text-neutral-100 text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
          >
            <option value="">Tutte le categorie</option>
            <option value="Effettivo">Effettivo</option>
            <option value="Potenziale">Potenziale</option>
            <option value="Ex cliente">Ex cliente</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-4">
          <div className="text-2xl font-light text-neutral-100">
            {Array.isArray(clienti) ? clienti.length : 0}
          </div>
          <div className="text-sm text-neutral-400">Totale Clienti</div>
        </div>
        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-4">
          <div className="text-2xl font-light text-green-400">
            {totaleAttivi}
          </div>
          <div className="text-sm text-neutral-400">Clienti Attivi</div>
        </div>
        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-4">
          <div className="text-2xl font-light text-[#3B82F6]">
            {totaleEffettivi}
          </div>
          <div className="text-sm text-neutral-400">Effettivi</div>
        </div>
        <div className="bg-neutral-700/60 border border-neutral-600/60 rounded-lg p-4">
          <div className="text-2xl font-light text-amber-400">
            {totalePotenziali}
          </div>
          <div className="text-sm text-neutral-400">Potenziali</div>
        </div>
      </div>

      {/* Clients Table con il Nuovo Sistema */}
      {loading ? (
        <div className="text-center py-10 text-neutral-400">
          Caricamento clienti...
        </div>
      ) : (
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
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{column.label}</span>
                        {column.sortable && (
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
                {clientiOrdinati.map((cliente) => (
                  <tr
                    key={cliente.IdCliente}
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
                              cliente[column.key as keyof typeof cliente] as string | number | boolean | null | undefined,
                              cliente
                            )
                          : (cliente[column.key as keyof typeof cliente] as React.ReactNode)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleModificaCliente(cliente)}
                          className="text-neutral-400 hover:text-[#3B82F6] transition-colors"
                          title="Modifica cliente"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          Visualizzati {clientiOrdinati.length} di {Array.isArray(clienti) ? clienti.length : 0} clienti
          {table.isClient && table.sortConfig && (
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

      {/* Form Cliente Completo */}
      <FormClienteCompleto
        isOpen={showForm}
        onClose={handleCloseForm}
        onSave={handleSaveCliente}
        clienteEdit={clienteEdit}
      />

      {/* Nuovo Configuratore */}
      <UniversalTableConfigurator
        isOpen={showConfigurator}
        onClose={() => setShowConfigurator(false)}
        tableId="clienti"
        title="Clienti"
      />
    </AppLayout>
  );
}
