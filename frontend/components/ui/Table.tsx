import React, { useState } from 'react';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  sortable?: boolean;
  selectable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
  emptyMessage?: string;
}

const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  sortable = false,
  selectable = false,
  onSort,
  onSelectionChange,
  sortKey,
  sortDirection,
  className = '',
  emptyMessage = 'Nessun dato disponibile',
}: TableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSort = (columnKey: string) => {
    if (!sortable || !onSort) return;
    
    const currentDirection = sortKey === columnKey ? sortDirection : 'asc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnKey, newDirection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!selectable || !onSelectionChange) return;
    
    if (checked) {
      const allKeys = new Set(data.map((row, index) => index.toString()));
      setSelectedRows(allKeys);
      onSelectionChange(data);
    } else {
      setSelectedRows(new Set());
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (rowIndex: number, checked: boolean) => {
    if (!selectable || !onSelectionChange) return;
    
    const newSelectedRows = new Set(selectedRows);
    const rowKey = rowIndex.toString();
    
    if (checked) {
      newSelectedRows.add(rowKey);
    } else {
      newSelectedRows.delete(rowKey);
    }
    
    setSelectedRows(newSelectedRows);
    
    const selectedData = data.filter((_, index) => newSelectedRows.has(index.toString()));
    onSelectionChange(selectedData);
  };

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${column.sortable && sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                  ${column.width ? `w-${column.width}` : ''}
                `}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable && sortable && sortKey === column.key && (
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {sortDirection === 'asc' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      )}
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {selectable && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(rowIndex.toString())}
                      onChange={(e) => handleSelectRow(rowIndex, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] || '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 