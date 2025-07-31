import pool from '../config/database';
import { User } from '../models/User';

export async function findUserByEmail(email: string): Promise<User | null> {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  
  // Gestisce sia il nuovo schema (nome, cognome, roles) che quello vecchio (username, role)
  const nome = row.nome || row.username || '';
  const cognome = row.cognome || '';
  const roles = row.roles || [row.role] || ['user'];
  const mfaEnabled = row.mfa_enabled || false;
  
  return {
    id: row.id,
    email: row.email,
    nome,
    cognome,
    passwordHash: row.password_hash,
    roles,
    mfaEnabled,
  };
}

export async function findUserById(id: string): Promise<User | null> {
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  
  // Gestisce sia il nuovo schema (nome, cognome, roles) che quello vecchio (username, role)
  const nome = row.nome || row.username || '';
  const cognome = row.cognome || '';
  const roles = row.roles || [row.role] || ['user'];
  const mfaEnabled = row.mfa_enabled || false;
  
  return {
    id: row.id,
    email: row.email,
    nome,
    cognome,
    passwordHash: row.password_hash,
    roles,
    mfaEnabled,
  };
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  // Usa il nuovo schema se disponibile, altrimenti fallback al vecchio
  const res = await pool.query(
    `INSERT INTO users (email, nome, cognome, password_hash, roles)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [user.email, user.nome, user.cognome, user.passwordHash, user.roles]
  );
  const row = res.rows[0];
  
  return {
    id: row.id,
    email: row.email,
    nome: row.nome || row.username || '',
    cognome: row.cognome || '',
    passwordHash: row.password_hash,
    roles: row.roles || [row.role] || ['user'],
    mfaEnabled: row.mfa_enabled || false,
  };
} 