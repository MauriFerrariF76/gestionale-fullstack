import React from 'react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: string;
  helper?: string;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  indeterminate = false,
  error,
  helper,
  className = '',
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Gestione indeterminate state
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={inputRef}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={`
            h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${error ? 'border-red-300 focus:ring-red-500' : ''}
          `}
        />
      </div>
      
      {label && (
        <div className="ml-3 text-sm">
          <label
            className={`
              font-medium text-gray-700
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
            onClick={() => !disabled && onChange(!checked)}
          >
            {label}
          </label>
          
          {helper && !error && (
            <p className="text-gray-500 mt-1">{helper}</p>
          )}
          
          {error && (
            <p className="text-red-600 mt-1">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox; 