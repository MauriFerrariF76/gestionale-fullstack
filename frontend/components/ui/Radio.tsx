import React from 'react';

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface RadioProps {
  options: RadioOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  name: string;
  label?: string;
  error?: string;
  helper?: string;
  disabled?: boolean;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

const Radio: React.FC<RadioProps> = ({
  options,
  value,
  onChange,
  name,
  label,
  error,
  helper,
  disabled = false,
  layout = 'vertical',
  className = '',
}) => {
  const handleChange = (optionValue: string | number) => {
    if (!disabled) {
      onChange(optionValue);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className={`${layout === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'}`}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              disabled={disabled || option.disabled}
              className={`
                h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300
                ${disabled || option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${error ? 'border-red-300 focus:ring-red-500' : ''}
              `}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className={`
                ml-2 text-sm font-medium text-gray-700
                ${disabled || option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
};

export default Radio; 