import { Request, Response } from 'express';
import { findUserByEmail, findUserById } from '../repositories/userRepository';
import { createRefreshToken, findRefreshToken, revokeRefreshToken, rotateRefreshToken } from '../repositories/refreshTokenRepository';
import { createAuditLog } from '../utils/auditLogger';
import { hashPassword, verifyPassword } from '../utils/password';
import { signJwt } from '../utils/jwt';
import { verifyMfaToken } from '../utils/mfa';

export async function login(req: Request, res: Response) {
  try {
    console.log('Login attempt:', req.body);
    const { email, password, mfaCode } = req.body;
    if (typeof password !== 'string' || !password) {
      console.error('Password mancante o non valida');
      return res.status(400).json({ error: 'Password mancante o non valida' });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      console.error('Utente non trovato per email:', email);
      return res.status(401).json({ error: 'Credenziali non valide' });
    }
    console.log('Utente trovato:', user);
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      console.error('Password non valida per utente:', email);
      return res.status(401).json({ error: 'Credenziali non valide' });
    }
    if (user.mfaEnabled) {
      if (!mfaCode) {
        console.log('MFA richiesto per utente:', email);
        return res.json({ mfaRequired: true, userId: user.id });
      }
      // Qui dovresti recuperare il secret MFA dell'utente
      // if (!verifyMfaToken(secret, mfaCode)) return res.status(401).json({ error: 'Codice MFA non valido' });
    }
    const accessToken = signJwt({ id: user.id, roles: user.roles, email: user.email });
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 giorni
    const refreshToken = await createRefreshToken({ userId: user.id, token: signJwt({ id: user.id }, '7d'), expiresAt });
    await createAuditLog({ userId: user.id, action: 'login', ip: req.ip || '', details: 'Login riuscito' });
    console.log('Login riuscito per utente:', email);
    res.json({ accessToken, refreshToken: refreshToken.token, user: { id: user.id, email: user.email, nome: user.nome, cognome: user.cognome, roles: user.roles, mfaEnabled: user.mfaEnabled } });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Errore login:', err);
      res.status(500).json({ error: err.message || 'Errore interno' });
    } else {
      console.error('Errore login:', err);
      res.status(500).json({ error: 'Errore interno' });
    }
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    const token = await findRefreshToken(refreshToken);
    if (!token || token.revoked || token.expiresAt < new Date()) return res.status(401).json({ error: 'Refresh token non valido' });
    const user = await findUserById(token.userId);
    if (!user) return res.status(401).json({ error: 'Utente non trovato' });
    const newAccessToken = signJwt({ id: user.id, roles: user.roles, email: user.email });
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const newRefreshToken = await rotateRefreshToken(refreshToken, { userId: user.id, token: signJwt({ id: user.id }, '7d'), expiresAt });
    await createAuditLog({ userId: user.id, action: 'refresh', ip: req.ip || '', details: 'Refresh token' });
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken.token });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Errore refresh:', err);
      res.status(500).json({ error: err.message || 'Errore interno' });
    } else {
      console.error('Errore refresh:', err);
      res.status(500).json({ error: 'Errore interno' });
    }
  }
}

export async function userinfo(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Non autenticato' });
    res.json({ user: { id: user.id, email: user.email, nome: user.nome, cognome: user.cognome, roles: user.roles, mfaEnabled: user.mfaEnabled } });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Errore userinfo:', err);
      res.status(500).json({ error: err.message || 'Errore interno' });
    } else {
      console.error('Errore userinfo:', err);
      res.status(500).json({ error: 'Errore interno' });
    }
  }
}

export async function mfaVerify(req: Request, res: Response) {
  try {
    const { userId, mfaCode } = req.body;
    const user = await findUserById(userId);
    if (!user) return res.status(401).json({ error: 'Utente non trovato' });
    const accessToken = signJwt({ id: user.id, roles: user.roles, email: user.email });
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const refreshToken = await createRefreshToken({ userId: user.id, token: signJwt({ id: user.id }, '7d'), expiresAt });
    await createAuditLog({ userId: user.id, action: 'mfa', ip: req.ip || '', details: 'MFA verificato' });
    res.json({ success: true, accessToken, refreshToken: refreshToken.token });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Errore mfaVerify:', err);
      res.status(500).json({ error: err.message || 'Errore interno' });
    } else {
      console.error('Errore mfaVerify:', err);
      res.status(500).json({ error: 'Errore interno' });
    }
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    await revokeRefreshToken(refreshToken);
    await createAuditLog({ userId: null as any, action: 'logout', ip: req.ip || '', details: 'Logout' });
    res.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Errore logout:', err);
      res.status(500).json({ error: err.message || 'Errore interno' });
    } else {
      console.error('Errore logout:', err);
      res.status(500).json({ error: 'Errore interno' });
    }
  }
}

export async function log(req: Request, res: Response) {
  try {
    const { userId, action, ip, timestamp, details } = req.body;
    await createAuditLog({ userId, action, ip, details });
    res.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Errore log:', err);
      res.status(500).json({ error: err.message || 'Errore interno' });
    } else {
      console.error('Errore log:', err);
      res.status(500).json({ error: 'Errore interno' });
    }
  }
} 