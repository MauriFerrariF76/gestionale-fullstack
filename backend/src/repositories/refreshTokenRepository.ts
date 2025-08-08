import prisma from '../config/database';
import { RefreshToken } from '../models/RefreshToken';

export async function findRefreshToken(token: string): Promise<RefreshToken | null> {
  const row = await prisma.refreshToken.findUnique({ where: { token } });
  if (!row) return null;
  return {
    id: row.id,
    userId: row.userId,
    token: row.token,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
    revoked: row.revoked,
  };
}

export async function createRefreshToken(rt: Omit<RefreshToken, 'id' | 'createdAt' | 'revoked'>): Promise<RefreshToken> {
  const row = await prisma.refreshToken.create({
    data: {
      userId: rt.userId,
      token: rt.token,
      expiresAt: rt.expiresAt,
    },
  });
  return {
    id: row.id,
    userId: row.userId,
    token: row.token,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
    revoked: row.revoked,
  };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.update({ where: { token }, data: { revoked: true } });
}

export async function rotateRefreshToken(oldToken: string, newToken: Omit<RefreshToken, 'id' | 'createdAt' | 'revoked'>): Promise<RefreshToken> {
  await revokeRefreshToken(oldToken);
  return createRefreshToken(newToken);
} 