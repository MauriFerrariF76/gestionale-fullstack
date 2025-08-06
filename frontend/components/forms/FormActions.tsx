import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

export interface FormActionsProps {
  onSave?: (e?: React.FormEvent) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  disabled?: boolean;
  saveText?: string;
  cancelText?: string;
  deleteText?: string;
  showDelete?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const FormActions: React.FC<FormActionsProps> = ({
  onSave,
  onCancel,
  onDelete,
  loading = false,
  disabled = false,
  saveText = "Salva",
  cancelText = "Annulla",
  deleteText = "Elimina",
  showDelete = false,
  className = '',
  children,
}) => {
  return (
    <div className={cn(
      "flex items-center justify-between pt-6 border-t border-neutral-700/60",
      className
    )}>
      {/* Left side - Delete action */}
      <div className="flex items-center space-x-3">
        {showDelete && onDelete && (
          <Button
            variant="danger"
            onClick={onDelete}
            disabled={disabled || loading}
          >
            {deleteText}
          </Button>
        )}
      </div>

      {/* Right side - Save/Cancel actions */}
      <div className="flex items-center space-x-3">
        {children}
        
        {onCancel && (
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={disabled || loading}
          >
            {cancelText}
          </Button>
        )}
        
        {onSave && (
          <Button
            onClick={() => onSave()}
            isLoading={loading}
            disabled={disabled}
          >
            {saveText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormActions; 