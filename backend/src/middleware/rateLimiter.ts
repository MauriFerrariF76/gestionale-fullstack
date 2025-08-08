// File: rateLimiter.ts
// Scopo: Middleware di rate limiting semplice (solo sviluppo)
// Percorso: src/middleware/rateLimiter.ts

import { Request, Response, NextFunction } from 'express';

type ClientRecord = { count: number; firstRequestAt: number };
const requestsByIp = new Map<string, ClientRecord>();

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 minuti
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 300; // sviluppo: limite alto

export default function rateLimiter(req: Request, res: Response, next: NextFunction) {
  // In sviluppo è disattivato di default, abilitalo solo se ENABLE_RATE_LIMITER=true
  const isDev = process.env.NODE_ENV !== 'production';
  const enabledExplicitly = process.env.ENABLE_RATE_LIMITER === 'true';
  if (isDev && !enabledExplicitly) {
    return next();
  }

  const ip = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = requestsByIp.get(ip);
  if (!record) {
    requestsByIp.set(ip, { count: 1, firstRequestAt: now });
    return next();
  }

  if (now - record.firstRequestAt > WINDOW_MS) {
    requestsByIp.set(ip, { count: 1, firstRequestAt: now });
    return next();
  }

  record.count += 1;
  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({ success: false, message: 'Too many requests' });
  }

  return next();
}
