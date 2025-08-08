// File: auditController.ts
// Scopo: Controller per interrogare gli audit log
// Percorso: src/controllers/auditController.ts

import { Request, Response } from 'express';
import { getAuditLogs, getAuditLogsByUser, getAuditLogsByAction, getAuditStats } from '../utils/auditLogger';

class AuditController {
  async list(req: Request, res: Response) {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '50', 10);
      const data = await getAuditLogs(page, limit);
      res.json({ success: true, ...data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Errore interno' });
    }
  }

  async byUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '50', 10);
      const data = await getAuditLogsByUser(userId, page, limit);
      res.json({ success: true, ...data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Errore interno' });
    }
  }

  async byAction(req: Request, res: Response) {
    try {
      const { action } = req.params;
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '50', 10);
      const data = await getAuditLogsByAction(action, page, limit);
      res.json({ success: true, ...data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Errore interno' });
    }
  }

  async stats(req: Request, res: Response) {
    try {
      const stats = await getAuditStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Errore interno' });
    }
  }
}

export default new AuditController();
