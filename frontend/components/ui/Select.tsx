import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onChange: (value: string | number | (string | number)[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helper?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Seleziona un\'opzione',
  label,
  error,
  helper,
  disabled = false,
  multiple = false,
  searchable = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);
  const selectRef = useRef<HTMLDivElement>(null);

  // Gestione click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Inizializza selectedOptions dal value
  useEffect(() => {
    if (multiple && Array.isArray(value)) {
      const selected = options.filter(option => value.includes(option.value));
      setSelectedOptions(selected);
    } else if (!multiple && value) {
      const selected = options.find(option => option.value === value);
      setSelectedOptions(selected ? [selected] : []);
    } else {
      setSelectedOptions([]);
    }
  }, [value, options, multiple]);

  // Filtra opzioni per ricerca
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;

    if (multiple) {
      const isSelected = selectedOptions.some(selected => selected.value === option.value);
      let newSelectedOptions: SelectOption[];

      if (isSelected) {
        newSelectedOptions = selectedOptions.filter(selected => selected.value !== option.value);
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }

      setSelectedOptions(newSelectedOptions);
      onChange(newSelectedOptions.map(opt => opt.value));
    } else {
      setSelectedOptions([option]);
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const removeOption = (optionValue: string | number) => {
    const newSelectedOptions = selectedOptions.filter(option => option.value !== optionValue);
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions.map(opt => opt.value));
  };

  const getDisplayValue = () => {
    if (multiple) {
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} opzioni selezionate`;
    }
    return selectedOptions[0]?.label || placeholder;
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full px-3 py-2 text-left border rounded-md shadow-sm
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
            ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
            focus:outline-none focus:ring-1 focus:ring-blue-500
          `}
          disabled={disabled}
        >
          <div className="flex items-center justify-between">
            <span className={`block truncate ${!selectedOptions.length ? 'text-gray-500' : 'text-gray-900'}`}>
              {getDisplayValue()}
            </span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cerca..."
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
            )}

            <div className="max-h-60 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Nessuna opzione trovata
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selectedOptions.some(selected => selected.value === option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      className={`
                        w-full px-3 py-2 text-left text-sm hover:bg-gray-100
                        ${option.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 cursor-pointer'}
                        ${isSelected ? 'bg-blue-50 text-blue-900' : ''}
                      `}
                      disabled={option.disabled}
                    >
                      <div className="flex items-center">
                        {multiple && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        )}
                        {option.label}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {multiple && selectedOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {option.label}
              <button
                type="button"
                onClick={() => removeOption(option.value)}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
};

export default Select; 