import pool from '../config/database';
import { RefreshToken } from '../models/RefreshToken';

export async function findRefreshToken(token: string): Promise<RefreshToken | null> {
  const res = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    userId: row.user_id,
    token: row.token,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    revoked: row.revoked,
  };
}

export async function createRefreshToken(rt: Omit<RefreshToken, 'id' | 'createdAt' | 'revoked'>): Promise<RefreshToken> {
  const res = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3) RETURNING *`,
    [rt.userId, rt.token, rt.expiresAt]
  );
  const row = res.rows[0];
  return {
    id: row.id,
    userId: row.user_id,
    token: row.token,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    revoked: row.revoked,
  };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await pool.query('UPDATE refresh_tokens SET revoked = TRUE WHERE token = $1', [token]);
}

export async function rotateRefreshToken(oldToken: string, newToken: Omit<RefreshToken, 'id' | 'createdAt' | 'revoked'>): Promise<RefreshToken> {
  await revokeRefreshToken(oldToken);
  return createRefreshToken(newToken);
} 