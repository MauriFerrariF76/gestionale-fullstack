import pool from '../config/database';
import { User } from '../models/User';

export async function findUserByEmail(email: string): Promise<User | null> {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    email: row.email,
    nome: row.nome,
    cognome: row.cognome,
    passwordHash: row.password_hash,
    roles: row.roles,
    mfaEnabled: row.mfa_enabled,
  };
}

export async function findUserById(id: string): Promise<User | null> {
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    email: row.email,
    nome: row.nome,
    cognome: row.cognome,
    passwordHash: row.password_hash,
    roles: row.roles,
    mfaEnabled: row.mfa_enabled,
  };
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const res = await pool.query(
    `INSERT INTO users (email, nome, cognome, password_hash, roles, mfa_enabled)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [user.email, user.nome, user.cognome, user.passwordHash, user.roles, user.mfaEnabled]
  );
  const row = res.rows[0];
  return {
    id: row.id,
    email: row.email,
    nome: row.nome,
    cognome: row.cognome,
    passwordHash: row.password_hash,
    roles: row.roles,
    mfaEnabled: row.mfa_enabled,
  };
} 