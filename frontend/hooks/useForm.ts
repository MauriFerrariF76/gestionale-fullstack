import { useState, useCallback } from 'react';
import { ValidationRule, ValidationSchema } from '@/components/forms';

export interface UseFormOptions<T> {
  initialData?: T;
  validationSchema?: ValidationSchema;
  onSubmit: (data: T) => void | Promise<void>;
  onCancel?: () => void;
}

export interface UseFormReturn<T> {
  // Dati del form
  data: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isDirty: boolean;
  
  // Azioni
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => string | null;
  validateForm: () => boolean;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  
  // Stato
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export function useForm<T extends Record<string, any>>({
  initialData = {} as T,
  validationSchema = {},
  onSubmit,
  onCancel,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  // Calcola se il form è valido
  const isValid = Object.keys(errors).length === 0;
  
  // Calcola se il form è stato modificato
  const isDirty = JSON.stringify(data) !== JSON.stringify(initialData);

  // Validazione di un singolo campo
  const validateField = useCallback((field: keyof T): string | null => {
    const fieldName = String(field);
    const rules = validationSchema[fieldName];
    if (!rules) return null;

    const value = data[field];

    // Validazione required
    if (rules.required && (!value || value === '')) {
      return 'Campo obbligatorio';
    }

    // Validazione minLength (solo per stringhe)
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `Minimo ${rules.minLength} caratteri`;
    }

    // Validazione maxLength (solo per stringhe)
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `Massimo ${rules.maxLength} caratteri`;
    }

    // Validazione pattern (solo per stringhe)
    if (rules.pattern && typeof value === 'string' && value && !rules.pattern.test(value)) {
      return 'Formato non valido';
    }

    // Validazione custom
    if (rules.custom) {
      return rules.custom(value as string | number | boolean);
    }

    return null;
  }, [data, validationSchema]);

  // Validazione di tutti i campi
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const error = validateField(fieldName as keyof T);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationSchema, validateField]);

  // Imposta il valore di un campo
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    // Validazione in tempo reale se il campo è stato toccato
    if (touched[String(field)]) {
      const error = validateField(field);
      setErrors(prev => ({
        ...prev,
        [String(field)]: error || ''
      }));
    }
  }, [touched, validateField]);

  // Imposta l'errore di un campo
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [String(field)]: error
    }));
  }, []);

  // Imposta se un campo è stato toccato
  const setFieldTouched = useCallback((field: keyof T, touched: boolean) => {
    setTouched(prev => ({ ...prev, [String(field)]: touched }));
    
    if (touched) {
      const error = validateField(field);
      setErrors(prev => ({
        ...prev,
        [String(field)]: error || ''
      }));
    }
  }, [validateField]);

  // Reset del form
  const resetForm = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  // Gestione submit
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Marca tutti i campi come toccati
    const newTouched: Record<string, boolean> = {};
    Object.keys(validationSchema).forEach(fieldName => {
      newTouched[fieldName] = true;
    });
    setTouched(newTouched);

    // Valida il form
    if (!validateForm()) {
      return;
    }

    // Submit
    setLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Errore durante il submit:', error);
    } finally {
      setLoading(false);
    }
  }, [data, validateForm, onSubmit, validationSchema]);

  // Gestione cancel
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      resetForm();
    }
  }, [onCancel, resetForm]);

  return {
    data,
    errors,
    touched,
    isValid,
    isDirty,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateField,
    validateForm,
    handleSubmit,
    handleCancel,
    loading,
    setLoading,
  };
} 