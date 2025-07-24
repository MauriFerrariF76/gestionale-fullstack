// components/UniversalTableConfigurator.tsx
"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Settings,
  Eye,
  EyeOff,
  GripVertical,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Save,
  Download,
  Upload,
} from "lucide-react";
import { useTableConfig, useTable } from "@/contexts/TableConfigContext";

interface UniversalTableConfiguratorProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  title?: string;
}

const UniversalTableConfigurator: React.FC<UniversalTableConfiguratorProps> = ({
  isOpen,
  onClose,
  tableId,
  title,
}) => {
  const globalConfig = useTableConfig();
  const table = useTable(tableId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State locale per le modifiche
  const [localVisibleColumns, setLocalVisibleColumns] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Aggiorna lo state locale quando si apre il modal
  React.useEffect(() => {
    if (isOpen) {
      setLocalVisibleColumns(table.visibleColumns);
    }
  }, [isOpen, table.visibleColumns]); // AGGIUNTO table.visibleColumns

  // Inizializza lo state se è vuoto
  React.useEffect(() => {
    if (localVisibleColumns.length === 0 && table.visibleColumns.length > 0) {
      setLocalVisibleColumns(table.visibleColumns);
    }
  }, [table.visibleColumns, localVisibleColumns.length]);

  if (!isOpen) return null;

  const toggleColumn = (key: string) => {
    setLocalVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    const newColumns = [...localVisibleColumns];
    const [moved] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, moved);
    setLocalVisibleColumns(newColumns);
  };

  const moveColumnUp = (index: number) => {
    if (index > 0) moveColumn(index, index - 1);
  };

  const moveColumnDown = (index: number) => {
    if (index < localVisibleColumns.length - 1) moveColumn(index, index + 1);
  };

  // Drag & Drop handlers - VERSIONE MOLTO SEMPLICE
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));

    if (sourceIndex !== dropIndex && !isNaN(sourceIndex)) {
      moveColumn(sourceIndex, dropIndex);
    }

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Azioni
  const resetConfiguration = () => {
    setLocalVisibleColumns(table.defaultColumns);
  };

  const applyConfiguration = () => {
    table.updateConfig({
      visibleColumns: localVisibleColumns,
    });
    onClose();
  };

  // Export/Import globale
  const handleExportGlobal = () => {
    globalConfig.exportConfig();
  };

  const handleImportGlobal = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const configData = JSON.parse(event.target?.result as string);
        globalConfig.importConfig(configData);
      } catch {
        alert("Errore nel caricamento del file di configurazione");
      }
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = "";
  };

  const tableTitle = title || globalConfig.getSchema(tableId)?.id || tableId;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-800 rounded-lg border border-neutral-600 w-full max-w-5xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-600">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <Settings className="w-6 h-6 text-[#3B82F6]" />
            Configurazione Tabella - {tableTitle}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne Disponibili */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Colonne Disponibili ({table.allColumns.length})
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {table.allColumns.map((column) => (
                  <div
                    key={column.key}
                    className="flex items-center justify-between p-4 bg-neutral-700/40 rounded-lg border border-neutral-600/40 hover:bg-neutral-700/60 transition-colors"
                  >
                    <button
                      onClick={() => toggleColumn(column.key)}
                      className="focus:outline-none"
                      title={
                        localVisibleColumns.includes(column.key)
                          ? "Nascondi colonna"
                          : "Mostra colonna"
                      }
                    >
                      {localVisibleColumns.includes(column.key) ? (
                        <Eye className="w-5 h-5 text-green-400 hover:text-green-300 transition-colors" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-neutral-500 hover:text-neutral-300 transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 ml-3">
                      <span className="text-neutral-200 font-medium">
                        {column.label}
                      </span>
                      <div className="text-xs text-neutral-400 mt-1">
                        {column.key} •{" "}
                        {column.sortable ? "Ordinabile" : "Non ordinabile"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ordine Colonne */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Ordine Colonne ({localVisibleColumns.length})
              </h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {localVisibleColumns.map((key, index) => {
                  const column = table.allColumns.find((c) => c.key === key);
                  if (!column) return null;

                  const isDragging = draggedIndex === index;

                  return (
                    <div
                      key={key}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center space-x-3 p-4 bg-neutral-700/60 rounded-lg border cursor-move transition-all ${
                        isDragging
                          ? "opacity-50 border-[#3B82F6] bg-[#3B82F6]/20"
                          : "border-neutral-600/60 hover:border-[#3B82F6]/50"
                      }`}
                    >
                      <GripVertical className="w-5 h-5 text-neutral-400" />

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-200 font-medium">
                            {column.label}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => moveColumnUp(index)}
                              disabled={index === 0}
                              className="p-1 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Sposta su"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveColumnDown(index)}
                              disabled={
                                index === localVisibleColumns.length - 1
                              }
                              className="p-1 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Sposta giù"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">
                          Posizione #{index + 1}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {localVisibleColumns.length === 0 && (
                  <div className="text-center py-8 text-neutral-500">
                    <div className="text-sm">Nessuna colonna selezionata</div>
                    <div className="text-xs mt-1">
                      Seleziona almeno una colonna dalla lista di sinistra
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-neutral-600 bg-neutral-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={resetConfiguration}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Default
            </button>

            <div className="border-l border-neutral-600 pl-4 flex items-center space-x-2">
              <button
                onClick={handleExportGlobal}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export Globale
              </button>

              <button
                onClick={handleImportGlobal}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <Upload className="w-4 h-4" />
                Import Globale
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="text-sm text-neutral-400">
              {localVisibleColumns.length} colonne selezionate
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-lg transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={applyConfiguration}
              className="flex items-center gap-2 px-6 py-2 bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Applica Configurazione
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalTableConfigurator;
