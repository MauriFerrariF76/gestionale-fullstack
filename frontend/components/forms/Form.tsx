import React, { useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import FormField from './FormField';
import FormSection from './FormSection';
import FormTabs from './FormTabs';
import FormActions from './FormActions';

// Tipi per la validazione
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string | number | boolean) => string | null;
}

export interface ValidationSchema {
  [fieldName: string]: ValidationRule;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date';
  required?: boolean;
  helper?: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: string | number | boolean;
  validation?: ValidationRule;
  className?: string;
  disabled?: boolean;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface FormProps {
  // Configurazione del form
  sections?: FormSection[];
  tabs?: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    sections: FormField[];
  }>;
  
  // Gestione dati
  initialData?: Record<string, string | number | boolean>;
  onSubmit: (data: Record<string, string | number | boolean>) => void | Promise<void>;
  onCancel?: () => void;
  onDelete?: () => void;
  
  // Validazione
  validationSchema?: ValidationSchema;
  
  // UI
  title?: string;
  description?: string;
  loading?: boolean;
  disabled?: boolean;
  showDelete?: boolean;
  
  // Testi personalizzabili
  submitText?: string;
  cancelText?: string;
  deleteText?: string;
  
  // Styling
  className?: string;
  layout?: 'single' | 'tabs' | 'sections';
}

const Form: React.FC<FormProps> = ({
  sections = [],
  tabs = [],
  initialData = {},
  onSubmit,
  onCancel,
  onDelete,
  validationSchema = {},
  title,
  description,
  loading = false,
  disabled = false,
  showDelete = false,
  submitText = "Salva",
  cancelText = "Annulla",
  deleteText = "Elimina",
  className = '',
  layout = 'single',
}) => {
  // Stato del form
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  // Validazione di un singolo campo
  const validateField = useCallback((name: string, value: string | number | boolean): string | null => {
    const rules = validationSchema[name];
    if (!rules) return null;

    // Validazione required
    if (rules.required && (!value || value === '')) {
      return 'Campo obbligatorio';
    }

    // Validazione minLength
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `Minimo ${rules.minLength} caratteri`;
    }

    // Validazione maxLength
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `Massimo ${rules.maxLength} caratteri`;
    }

    // Validazione pattern
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return 'Formato non valido';
    }

    // Validazione custom
    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [validationSchema]);

  // Validazione di tutti i campi
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Raccogli tutti i campi da validare
    const allFields: FormField[] = [];
    
    if (layout === 'tabs') {
      tabs.forEach(tab => {
        allFields.push(...tab.sections);
      });
    } else {
      sections.forEach(section => {
        allFields.push(...section.fields);
      });
    }

    // Valida ogni campo
    allFields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, layout, sections, tabs, validateField]);

  // Gestione cambio valore
  const handleFieldChange = useCallback((name: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validazione in tempo reale se il campo è stato toccato
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
  }, [touched, validateField]);

  // Gestione blur (campo toccato)
  const handleFieldBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  }, [formData, validateField]);

  // Gestione submit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marca tutti i campi come toccati
    const allFields: FormField[] = [];
    if (layout === 'tabs') {
      tabs.forEach(tab => allFields.push(...tab.sections));
    } else {
      sections.forEach(section => allFields.push(...section.fields));
    }
    
    const newTouched: Record<string, boolean> = {};
    allFields.forEach(field => {
      newTouched[field.name] = true;
    });
    setTouched(newTouched);

    // Valida il form
    if (!validateForm()) {
      return;
    }

    // Submit
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Errore durante il submit:', error);
    }
  }, [formData, validateForm, onSubmit, layout, sections, tabs]);

  // Wrapper per FormActions
  const handleSave = useCallback(() => {
    handleSubmit({} as React.FormEvent);
  }, [handleSubmit]);

  // Renderizza un singolo campo
  const renderField = useCallback((field: FormField) => {
    const value = formData[field.name] || field.defaultValue || '';
    const error = errors[field.name];
    const isTouched = touched[field.name];

    const commonProps = {
      value: typeof value === 'string' ? value : String(value),
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let newValue: string | number | boolean = e.target.value;
        
        // Gestione tipi specifici
        if (field.type === 'number') {
          newValue = e.target.value === '' ? 0 : Number(e.target.value);
        } else if (field.type === 'checkbox') {
          newValue = (e.target as HTMLInputElement).checked;
        }
        
        handleFieldChange(field.name, newValue);
      },
      onBlur: () => handleFieldBlur(field.name),
      disabled: disabled || field.disabled,
      placeholder: field.placeholder,
      className: cn(
        "w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-lg",
        "text-neutral-100 placeholder-neutral-500",
        "focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        error && isTouched && "border-red-500",
        field.className
      ),
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
          />
        );

      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Seleziona...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => handleFieldChange(field.name, e.target.checked)}
            onBlur={() => handleFieldBlur(field.name)}
            disabled={disabled || field.disabled}
            className="w-4 h-4 text-[#3B82F6] bg-neutral-800 border-neutral-600 rounded focus:ring-[#3B82F6]"
          />
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  onBlur={() => handleFieldBlur(field.name)}
                  disabled={disabled || field.disabled}
                  className="w-4 h-4 text-[#3B82F6] bg-neutral-800 border-neutral-600 focus:ring-[#3B82F6]"
                />
                <span className="text-sm text-neutral-300">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type={field.type}
            {...commonProps}
          />
        );
    }
  }, [formData, errors, touched, handleFieldChange, handleFieldBlur, disabled]);

  // Renderizza una sezione
  const renderSection = useCallback((section: FormSection) => {
    const sectionErrors = section.fields
      .map(field => errors[field.name])
      .filter(Boolean);
    
    const hasError = sectionErrors.length > 0;
    const isValid = section.fields.every(field => 
      !errors[field.name] && touched[field.name]
    );

    return (
      <FormSection
        key={section.id}
        title={section.title}
        description={section.description}
        collapsible={section.collapsible}
        defaultCollapsed={section.defaultCollapsed}
        error={hasError ? sectionErrors[0] : undefined}
        valid={isValid}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.fields.map(field => (
            <FormField
              key={field.name}
              label={field.label}
              required={field.required}
              helper={field.helper}
              error={touched[field.name] ? errors[field.name] : undefined}
            >
              {renderField(field)}
            </FormField>
          ))}
        </div>
      </FormSection>
    );
  }, [renderField, errors, touched]);

  // Renderizza tabs
  const renderTabs = useCallback(() => {
    const formTabs = tabs.map(tab => ({
      id: tab.id,
      label: tab.label,
      icon: tab.icon,
      content: (
        <div className="space-y-6">
          {tab.sections.map(field => (
            <FormField
              key={field.name}
              label={field.label}
              required={field.required}
              helper={field.helper}
              error={touched[field.name] ? errors[field.name] : undefined}
            >
              {renderField(field)}
            </FormField>
          ))}
        </div>
      ),
      error: tab.sections.some(field => errors[field.name]) ? 'Errore nei dati' : undefined,
      valid: tab.sections.every(field => 
        !errors[field.name] && touched[field.name]
      ),
    }));

    return (
      <FormTabs
        tabs={formTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    );
  }, [tabs, renderField, errors, touched, activeTab]);

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {/* Header del form */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-semibold text-white mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-neutral-400">{description}</p>
          )}
        </div>
      )}

      {/* Contenuto del form */}
      {layout === 'tabs' ? renderTabs() : (
        <div className="space-y-6">
          {sections.map(renderSection)}
        </div>
      )}

      {/* Azioni del form */}
      <FormActions
        onSave={handleSave}
        onCancel={onCancel}
        onDelete={onDelete}
        loading={loading}
        disabled={disabled}
        saveText={submitText}
        cancelText={cancelText}
        deleteText={deleteText}
        showDelete={showDelete}
      />
    </form>
  );
};

export default Form; 