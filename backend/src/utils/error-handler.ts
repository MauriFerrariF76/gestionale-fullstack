// File: error-handler.ts
// Scopo: Sistema di gestione errori robusto per prevenire crash del backend
// Percorso: src/utils/error-handler.ts

import { Request, Response, NextFunction } from 'express';

// Interfaccia per errori personalizzati
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

// Classe per errori operativi
export class OperationalError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;
  public code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    
    // Mantiene lo stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Funzione per creare errori operativi
export const createError = (message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR'): OperationalError => {
  return new OperationalError(message, statusCode, code);
};

// Middleware per gestire errori non catturati
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log dell'errore
  console.error('❌ Errore gestito:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Gestione errori Prisma
  if (err.code === 'P2002') {
    const message = 'Valore duplicato per campo univoco';
    error = createError(message, 400, 'DUPLICATE_VALUE');
  }

  if (err.code === 'P2025') {
    const message = 'Record non trovato';
    error = createError(message, 404, 'RECORD_NOT_FOUND');
  }

  if (err.code === 'P2003') {
    const message = 'Violazione vincolo di integrità referenziale';
    error = createError(message, 400, 'FOREIGN_KEY_VIOLATION');
  }

  // Gestione errori di validazione
  if (err.name === 'ValidationError') {
    const message = 'Errore di validazione dei dati';
    error = createError(message, 400, 'VALIDATION_ERROR');
  }

  // Gestione errori di autenticazione
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token JWT non valido';
    error = createError(message, 401, 'INVALID_TOKEN');
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token JWT scaduto';
    error = createError(message, 401, 'TOKEN_EXPIRED');
  }

  // Risposta standardizzata
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Errore interno del server',
    code: error.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
};

// Middleware per gestire route non trovate
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trovata`,
    code: 'ROUTE_NOT_FOUND',
    timestamp: new Date().toISOString()
  });
};

// Gestione errori non catturati a livello di processo
export const setupGlobalErrorHandlers = () => {
  // Gestione eccezioni non catturate
  process.on('uncaughtException', (error: Error) => {
    console.error('🚨 ECCEZIONE NON CATTURATA:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Log dell'errore critico
    console.error('❌ CRASH IMMINENTE - Terminazione processo per sicurezza');
    
    // Termina il processo in modo pulito
    process.exit(1);
  });

  // Gestione promise rifiutate non gestite
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('🚨 PROMISE RIFIUTATA NON GESTITA:', {
      reason: reason,
      promise: promise,
      timestamp: new Date().toISOString()
    });

    // Log dell'errore critico
    console.error('❌ PROMISE RIFIUTATA - Potenziale instabilità');
  });

  // Gestione segnali di terminazione
  process.on('SIGTERM', () => {
    console.log('📡 Ricevuto SIGTERM - Chiusura pulita del server');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('📡 Ricevuto SIGINT - Chiusura pulita del server');
    process.exit(0);
  });

  console.log('✅ Gestori errori globali configurati');
};

// Funzione per validazione input
export const validateInput = (data: any, schema: any): boolean => {
  try {
    // Implementa qui la validazione con Joi, Yup o simili
    return true;
  } catch (error) {
    throw createError('Dati di input non validi', 400, 'INVALID_INPUT');
  }
};

// Funzione per sanitizzazione input
export const sanitizeInput = (input: string): string => {
  // Implementa qui la sanitizzazione (es. rimozione script, HTML, ecc.)
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Funzione per logging errori strutturato
export const logError = (error: AppError, context: any = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    message: error.message,
    code: error.code || 'UNKNOWN',
    statusCode: error.statusCode || 500,
    stack: error.stack,
    context: context,
    isOperational: error.isOperational || false
  };

  console.error('📝 LOG ERRORE:', JSON.stringify(errorLog, null, 2));
  
  // Qui potresti inviare a un servizio di logging esterno
  // o salvare in un file di log strutturato
};
