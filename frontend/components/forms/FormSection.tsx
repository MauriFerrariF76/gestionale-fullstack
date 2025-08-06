import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
  error?: string;
  valid?: boolean;
  pending?: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  collapsible = false,
  defaultCollapsed = false,
  className = '',
  error,
  valid,
  pending = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleToggle = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const getStatusColor = () => {
    if (error) return 'border-red-500';
    if (valid) return 'border-green-500';
    if (pending) return 'border-yellow-500';
    return 'border-neutral-600/60';
  };

  const getStatusIcon = () => {
    if (error) return '❌';
    if (valid) return '✅';
    if (pending) return '⏳';
    return null;
  };

  return (
    <div className={cn(
      "bg-neutral-700/40 border border-neutral-600/40 rounded-lg p-6",
      getStatusColor(),
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {collapsible && (
            <button
              onClick={handleToggle}
              className="text-neutral-400 hover:text-neutral-300 transition-colors"
            >
              {isCollapsed ? (
                <span className="text-lg">▶</span>
              ) : (
                <span className="text-lg">▼</span>
              )}
            </button>
          )}
          
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-white">
              {title}
            </h3>
            {getStatusIcon() && (
              <span className="text-sm">{getStatusIcon()}</span>
            )}
          </div>
        </div>

        {description && !isCollapsed && (
          <p className="text-sm text-neutral-400 max-w-md">
            {description}
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && !isCollapsed && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Content */}
      {!isCollapsed && (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default FormSection; 