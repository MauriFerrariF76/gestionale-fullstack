// File: clienti.ts
// Scopo: Route per la gestione delle API relative ai clienti
// Percorso: src/routes/clienti.ts
//
// Questo file definisce tutte le route per le operazioni sui clienti
// con middleware di autenticazione e validazione.

import { Router } from 'express';
import clienteController from '../controllers/clienteController';
import { authMiddleware } from '../middleware/authMiddleware';
import rateLimiter from '../middleware/rateLimiter';

const router = Router();

// Middleware di autenticazione per tutte le route
router.use(authMiddleware);

// Rate limiting per le operazioni sensibili
router.use(rateLimiter);

// GET /api/clienti - Ottieni tutti i clienti con paginazione
router.get('/', clienteController.getClienti);

// GET /api/clienti/stats - Ottieni statistiche clienti
router.get('/stats', clienteController.getStats);

// GET /api/clienti/max-id - Ottieni il massimo ID cliente
router.get('/max-id', clienteController.getMaxIdCliente);

// GET /api/clienti/search - Cerca clienti
router.get('/search', clienteController.searchClienti);

// GET /api/clienti/:id - Ottieni cliente specifico (DEVE essere l'ultimo)
router.get('/:id', clienteController.getCliente);

// POST /api/clienti - Crea nuovo cliente
router.post('/', clienteController.createCliente);

// PUT /api/clienti/:id - Aggiorna cliente
router.put('/:id', clienteController.updateCliente);

// DELETE /api/clienti/:id - Elimina cliente
router.delete('/:id', clienteController.deleteCliente);

export default router;
