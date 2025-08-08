// File: clienteRepository.ts
// Scopo: Repository per la gestione dei clienti tramite Prisma
// Percorso: src/repositories/clienteRepository.ts
//
// Questo file contiene tutte le operazioni CRUD per i clienti
// utilizzando Prisma Client per l'accesso al database.

import prisma from '../config/database';
import { Cliente } from '@prisma/client';

export class ClienteRepository {
  // Ottieni tutti i clienti con paginazione
  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { ragioneSocialeC: { contains: search, mode: 'insensitive' as const } },
            { referenteC: { contains: search, mode: 'insensitive' as const } },
            { codiceMT: { contains: search, mode: 'insensitive' as const } },
            { cittac: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [clienti, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.cliente.count({ where }),
    ]);

    return {
      clienti,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Ottieni cliente per ID
  async findById(id: string): Promise<Cliente | null> {
    return prisma.cliente.findUnique({
      where: { id },
    });
  }

  // Ottieni cliente per codice MT
  async findByCodiceMT(codiceMT: string): Promise<Cliente | null> {
    return prisma.cliente.findUnique({
      where: { codiceMT },
    });
  }

  // Crea nuovo cliente
  async create(data: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cliente> {
    return prisma.cliente.create({
      data,
    });
  }

  // Aggiorna cliente esistente
  async update(id: string, data: Partial<Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Cliente> {
    return prisma.cliente.update({
      where: { id },
      data,
    });
  }

  // Elimina cliente
  async delete(id: string): Promise<Cliente> {
    return prisma.cliente.delete({
      where: { id },
    });
  }

  // Ottieni clienti attivi
  async findActive(): Promise<Cliente[]> {
    return prisma.cliente.findMany({
      where: { attivoC: true },
      orderBy: { ragioneSocialeC: 'asc' },
    });
  }

  // Ottieni statistiche clienti
  async getStats() {
    const [total, active, inactive] = await Promise.all([
      prisma.cliente.count(),
      prisma.cliente.count({ where: { attivoC: true } }),
      prisma.cliente.count({ where: { attivoC: false } }),
    ]);

    return {
      total,
      active,
      inactive,
      activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
    };
  }

  // Cerca clienti per termine
  async search(term: string, limit: number = 10): Promise<Cliente[]> {
    return prisma.cliente.findMany({
      where: {
        OR: [
          { ragioneSocialeC: { contains: term, mode: 'insensitive' as const } },
          { referenteC: { contains: term, mode: 'insensitive' as const } },
          { codiceMT: { contains: term, mode: 'insensitive' as const } },
          { cittac: { contains: term, mode: 'insensitive' as const } },
          { codiceFiscale: { contains: term, mode: 'insensitive' as const } },
          { partitaIva: { contains: term, mode: 'insensitive' as const } },
        ],
      },
      take: limit,
      orderBy: { ragioneSocialeC: 'asc' },
    });
  }
}

export default new ClienteRepository();
