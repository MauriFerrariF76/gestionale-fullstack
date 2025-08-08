// File: audit.ts
// Scopo: Route per audit log
// Percorso: src/routes/audit.ts

import { Router } from 'express';
import auditController from '../controllers/auditController';
import { authMiddleware } from '../middleware/authMiddleware';
import rateLimiter from '../middleware/rateLimiter';

const router = Router();

router.use(authMiddleware);
router.use(rateLimiter);

router.get('/', auditController.list);
router.get('/stats', auditController.stats);
router.get('/user/:userId', auditController.byUser);
router.get('/action/:action', auditController.byAction);

export default router;
