import React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helper,
  required = false,
  children,
  className = '',
  htmlFor,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={htmlFor}
          className="block text-sm font-medium text-neutral-300"
        >
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      
      {/* Field Content */}
      <div>
        {children}
      </div>
      
      {/* Helper Text */}
      {helper && !error && (
        <p className="text-sm text-neutral-500">{helper}</p>
      )}
      
      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField; 