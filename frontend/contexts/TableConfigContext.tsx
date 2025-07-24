// contexts/TableConfigContext.tsx
"use client";

import React, { createContext, useContext, useCallback, useState } from "react";

// Tipi base
export interface TableColumn {
  key: string;
  label: string;
  width?: number;
  sortable?: boolean;
  format?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface TableConfig {
  visibleColumns: string[];
  sortConfig?: SortConfig | null;
}

export interface TableSchema {
  id: string;
  columns: TableColumn[];
  defaultVisibleColumns: string[];
}

// Context
interface TableConfigContextType {
  // Registrazione schemi
  registerSchema: (schema: TableSchema) => void;
  getSchema: (tableId: string) => TableSchema | undefined;

  // Configurazione per tabella
  getConfig: (tableId: string) => TableConfig;
  updateConfig: (tableId: string, config: Partial<TableConfig>) => void;
  resetConfig: (tableId: string) => void;

  // Ordinamento
  handleSort: (tableId: string, columnKey: string) => void;
  sortData: <T extends Record<string, unknown>>(
    tableId: string,
    data: T[]
  ) => T[];

  // Export/Import globale
  exportConfig: () => void;
  importConfig: (configData: any) => void;

  // Utility
  getVisibleColumnsWithConfig: (tableId: string) => TableColumn[];
}

const TableConfigContext = createContext<TableConfigContextType | undefined>(
  undefined
);

// Provider
export const TableConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [schemas, setSchemas] = useState<Map<string, TableSchema>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateTrigger, setUpdateTrigger] = useState(0); // Trigger per forzare re-render

  // Forza re-render di tutti i componenti che usano useTable
  const triggerUpdate = useCallback(() => {
    setUpdateTrigger((prev) => prev + 1);
  }, []);

  // Registra uno schema di tabella
  const registerSchema = useCallback((schema: TableSchema) => {
    setSchemas((prev) => new Map(prev.set(schema.id, schema)));
  }, []);

  // Ottieni schema
  const getSchema = useCallback(
    (tableId: string): TableSchema | undefined => {
      return schemas.get(tableId);
    },
    [schemas]
  );

  // Carica configurazione da localStorage
  const loadConfigFromStorage = useCallback(
    (tableId: string): TableConfig => {
      if (typeof window === "undefined") return getDefaultConfig(tableId);

      try {
        const stored = localStorage.getItem(`table_config_${tableId}`);
        if (stored) {
          const config = JSON.parse(stored);
          return {
            visibleColumns:
              config.visibleColumns || getDefaultConfig(tableId).visibleColumns,
            sortConfig: config.sortConfig || null,
          };
        }
      } catch (error) {
        console.warn(`Errore caricamento config per ${tableId}:`, error);
      }

      return getDefaultConfig(tableId);
    },
    [schemas]
  );

  // Configurazione di default
  const getDefaultConfig = useCallback(
    (tableId: string): TableConfig => {
      const schema = schemas.get(tableId);
      return {
        visibleColumns: schema?.defaultVisibleColumns || [],
        sortConfig: null,
      };
    },
    [schemas]
  );

  // Salva configurazione in localStorage
  const saveConfigToStorage = useCallback(
    (tableId: string, config: TableConfig) => {
      if (typeof window === "undefined") return;

      try {
        localStorage.setItem(`table_config_${tableId}`, JSON.stringify(config));
      } catch (error) {
        console.warn(`Errore salvataggio config per ${tableId}:`, error);
      }
    },
    []
  );

  // Ottieni configurazione corrente
  const getConfig = useCallback(
    (tableId: string): TableConfig => {
      return loadConfigFromStorage(tableId);
    },
    [loadConfigFromStorage]
  );

  // Aggiorna configurazione
  const updateConfig = useCallback(
    (tableId: string, newConfig: Partial<TableConfig>) => {
      const currentConfig = loadConfigFromStorage(tableId);
      const updatedConfig = { ...currentConfig, ...newConfig };
      saveConfigToStorage(tableId, updatedConfig);
      triggerUpdate(); // Forza re-render
    },
    [loadConfigFromStorage, saveConfigToStorage, triggerUpdate]
  );

  // Reset configurazione
  const resetConfig = useCallback(
    (tableId: string) => {
      const defaultConfig = getDefaultConfig(tableId);
      saveConfigToStorage(tableId, defaultConfig);

      // Forza re-render rimuovendo e re-aggiungendo la configurazione
      if (typeof window !== "undefined") {
        localStorage.removeItem(`table_config_${tableId}`);
      }
      triggerUpdate(); // Forza re-render
    },
    [getDefaultConfig, saveConfigToStorage, triggerUpdate]
  );

  // Gestione ordinamento
  const handleSort = useCallback(
    (tableId: string, columnKey: string) => {
      const schema = schemas.get(tableId);
      const column = schema?.columns.find((col) => col.key === columnKey);

      if (column?.sortable === false) return;

      const currentConfig = loadConfigFromStorage(tableId);
      const currentSort = currentConfig.sortConfig;

      let newSortConfig: SortConfig | null = null;

      if (currentSort?.key === columnKey) {
        // Stesso campo: cicla asc -> desc -> null
        if (currentSort.direction === "asc") {
          newSortConfig = { key: columnKey, direction: "desc" };
        }
        // Se era desc, diventa null (nessun ordinamento)
      } else {
        // Campo diverso: inizia con asc
        newSortConfig = { key: columnKey, direction: "asc" };
      }

      updateConfig(tableId, { sortConfig: newSortConfig });
    },
    [schemas, loadConfigFromStorage, updateConfig]
  );

  // Ordina dati
  const sortData = useCallback(
    <T extends Record<string, unknown>>(tableId: string, data: T[]): T[] => {
      const config = loadConfigFromStorage(tableId);
      const sortConfig = config.sortConfig;

      if (!sortConfig) return data;

      return [...data].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Gestione valori null/undefined
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Confronto valori
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    },
    [loadConfigFromStorage]
  );

  // Ottieni colonne visibili configurate
  const getVisibleColumnsWithConfig = useCallback(
    (tableId: string): TableColumn[] => {
      const schema = schemas.get(tableId);
      const config = loadConfigFromStorage(tableId);

      if (!schema) return [];

      return config.visibleColumns
        .map((key) => {
          const column = schema.columns.find((col) => col.key === key);
          if (!column) return null;

          return column; // Ritorniamo la colonna originale senza modificare la larghezza
        })
        .filter(Boolean) as TableColumn[];
    },
    [schemas, loadConfigFromStorage]
  );

  // Export configurazione globale
  const exportConfig = useCallback(() => {
    if (typeof window === "undefined") return;

    const allConfigs: { [tableId: string]: TableConfig } = {};

    // Raccogli tutte le configurazioni
    schemas.forEach((schema, tableId) => {
      allConfigs[tableId] = loadConfigFromStorage(tableId);
    });

    const exportData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      app: "Ferrari Pietro SNC - Gestionale",
      configs: allConfigs,
    };

    // Crea file e download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const now = new Date();
    const filename = `gestionale-${now
      .getDate()
      .toString()
      .padStart(2, "0")}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getFullYear()}-${now
      .getHours()
      .toString()
      .padStart(2, "0")}-${now.getMinutes().toString().padStart(2, "0")}.json`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [schemas, loadConfigFromStorage]);

  // Import configurazione globale
  const importConfig = useCallback(
    (configData: unknown) => {
      if (
        !configData ||
        typeof configData !== "object" ||
        configData === null ||
        !("configs" in configData)
      ) {
        console.error("Formato file non valido");
        return;
      }

      try {
        const configs = (configData as { configs: Record<string, unknown> }).configs;
        Object.entries(configs).forEach(([tableId, config]) => {
          if (schemas.has(tableId)) {
            saveConfigToStorage(tableId, config as TableConfig);
          }
        });

        // Forza refresh della pagina per applicare le modifiche
        window.location.reload();
      } catch (error) {
        console.error("Errore durante l'import:", error);
      }
    },
    [schemas, saveConfigToStorage]
  );

  const value: TableConfigContextType = {
    registerSchema,
    getSchema,
    getConfig,
    updateConfig,
    resetConfig,
    handleSort,
    sortData,
    exportConfig,
    importConfig,
    getVisibleColumnsWithConfig,
  };

  return (
    <TableConfigContext.Provider value={value}>
      {children}
    </TableConfigContext.Provider>
  );
};

// Hook per usare il context
export const useTableConfig = () => {
  const context = useContext(TableConfigContext);
  if (context === undefined) {
    throw new Error(
      "useTableConfig deve essere usato dentro TableConfigProvider"
    );
  }
  return context;
};

// Hook per gestire l'hydration in modo sicuro
const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

// Hook specifico per una singola tabella
export const useTable = (tableId: string) => {
  const context = useTableConfig();
  const isClient = useIsClient();

  // Durante SSR, usa configurazione default per evitare hydration mismatch
  const config = isClient
    ? context.getConfig(tableId)
    : context.getConfig(tableId);
  const schema = context.getSchema(tableId);

  return {
    // Configurazione (sempre aggiornata)
    visibleColumns: config.visibleColumns,
    sortConfig: isClient ? config.sortConfig : null, // Durante SSR non mostrare ordinamento

    // Schema
    allColumns: schema?.columns || [],
    defaultColumns: schema?.defaultVisibleColumns || [],

    // Azioni
    updateConfig: (newConfig: Partial<TableConfig>) =>
      context.updateConfig(tableId, newConfig),
    resetConfig: () => context.resetConfig(tableId),
    handleSort: (columnKey: string) => context.handleSort(tableId, columnKey),
    sortData: <T extends Record<string, unknown>>(data: T[]) =>
      context.sortData(tableId, data),

    // Utility
    getVisibleColumnsWithConfig: () =>
      context.getVisibleColumnsWithConfig(tableId),

    // Flag per sapere se siamo nel client
    isClient,
  };
};
