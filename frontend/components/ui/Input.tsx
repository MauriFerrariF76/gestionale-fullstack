// components/ui/Input.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, helper, leftIcon, rightIcon, required, className, id, ...props }, ref) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-300"
          >
            {label} {required && <span className="text-red-400">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 z-10">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base styles (identici ai tuoi input esistenti)
              "w-full px-3 py-2 bg-neutral-700/60 border rounded-lg text-white placeholder-neutral-400",
              "focus:outline-none focus:border-[#3B82F6] transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              
              // Error state
              error ? "border-red-500 focus:border-red-500" : "border-neutral-600/60",
              
              // Icon padding
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p className="text-neutral-500 text-sm">{helper}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export default Input;

// Bonus: TextArea component
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, error, helper, required, className, id, ...props }, ref) {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-300"
          >
            {label} {required && <span className="text-red-400">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "w-full px-3 py-2 bg-neutral-700/60 border rounded-lg text-white placeholder-neutral-400",
            "focus:outline-none focus:border-[#3B82F6] transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "resize-vertical min-h-[80px]",
            error ? "border-red-500 focus:border-red-500" : "border-neutral-600/60",
            className
          )}
          {...props}
        />
        
        {error && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p className="text-neutral-500 text-sm">{helper}</p>
        )}
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';