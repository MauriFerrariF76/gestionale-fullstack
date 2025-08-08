// File: auditLogger.ts
// Scopo: Utility per la gestione degli audit log tramite Prisma
// Percorso: src/utils/auditLogger.ts
//
// Questo file gestisce la registrazione di tutte le attività
// per tracciamento e sicurezza.

import prisma from '../config/database';

export interface AuditLogData {
  userId?: string;
  action: string;
  ip: string;
  details?: string;
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId || null,
        action: data.action,
        ip: data.ip || 'unknown',
        details: data.details,
        timestamp: new Date()
      }
    });
  } catch (error) {
    // Non bloccare l'applicazione se l'audit log fallisce
    console.error('❌ Errore nella creazione audit log:', error);
  }
}

export async function getAuditLogs(page: number = 1, limit: number = 50, userId?: string) {
  const skip = (page - 1) * limit;
  
  const where = userId ? { userId } : {};

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nome: true,
            cognome: true
          }
        }
      }
    }),
    prisma.auditLog.count({ where })
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

export async function getAuditLogsByUser(userId: string, page: number = 1, limit: number = 50) {
  return getAuditLogs(page, limit, userId);
}

export async function getAuditLogsByAction(action: string, page: number = 1, limit: number = 50) {
  const skip = (page - 1) * limit;
  
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: { action },
      skip,
      take: limit,
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nome: true,
            cognome: true
          }
        }
      }
    }),
    prisma.auditLog.count({ where: { action } })
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

export async function getAuditStats() {
  const [total, today, thisWeek, thisMonth] = await Promise.all([
    prisma.auditLog.count(),
    prisma.auditLog.count({
      where: {
        timestamp: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    prisma.auditLog.count({
      where: {
        timestamp: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      }
    }),
    prisma.auditLog.count({
      where: {
        timestamp: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })
  ]);

  return {
    total,
    today,
    thisWeek,
    thisMonth
  };
}
