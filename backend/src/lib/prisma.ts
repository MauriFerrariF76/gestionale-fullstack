// File: prisma.ts
// Scopo: Configura e esporta il client Prisma per l'accesso al database
// Percorso: src/lib/prisma.ts
//
// Questo file gestisce la connessione al database tramite Prisma Client
// con gestione automatica delle connessioni e pooling.

import { PrismaClient } from '@prisma/client';

// Creazione istanza Prisma Client con configurazioni ottimizzate
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// Gestione graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Gestione errori di connessione
prisma.$on('error', (e) => {
  console.error('❌ Errore Prisma Client:', e);
});

export default prisma;
