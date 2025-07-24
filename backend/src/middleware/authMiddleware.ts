import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import { findUserById } from '../repositories/userRepository';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token mancante' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyJwt(token);
    const user = await findUserById(payload.id);
    if (!user) return res.status(401).json({ error: 'Utente non trovato' });
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token non valido' });
  }
} 