import prisma from '../config/database';
import { User } from '../models/User';

export async function findUserByEmail(email: string): Promise<User | null> {
  const row = await prisma.user.findUnique({ where: { email } });
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    nome: row.nome,
    cognome: row.cognome,
    passwordHash: row.passwordHash,
    roles: row.roles,
    mfaEnabled: row.mfaEnabled,
  };
}

export async function findUserById(id: string): Promise<User | null> {
  const row = await prisma.user.findUnique({ where: { id } });
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    nome: row.nome,
    cognome: row.cognome,
    passwordHash: row.passwordHash,
    roles: row.roles,
    mfaEnabled: row.mfaEnabled,
  };
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const row = await prisma.user.create({
    data: {
      email: user.email,
      nome: user.nome,
      cognome: user.cognome,
      passwordHash: user.passwordHash,
      roles: user.roles,
      mfaEnabled: user.mfaEnabled,
    },
  });
  return {
    id: row.id,
    email: row.email,
    nome: row.nome,
    cognome: row.cognome,
    passwordHash: row.passwordHash,
    roles: row.roles,
    mfaEnabled: row.mfaEnabled,
  };
} 