// File: prisma/seed.ts
// Scopo: Popola il database di sviluppo con dati minimi
// Esecuzione: npx prisma db seed

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database di sviluppo...');

  // Password di test: "password123"
  const testPasswordHash = await hashPassword('password123');

  // Utente admin di sviluppo
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dev.local' },
    update: {},
    create: {
      email: 'admin@dev.local',
      nome: 'Admin',
      cognome: 'Dev',
      passwordHash: testPasswordHash,
      roles: ['admin'],
      mfaEnabled: false
    }
  });

  // Utente di test per sviluppo
  const testUser = await prisma.user.upsert({
    where: { email: 'test@dev.local' },
    update: {},
    create: {
      email: 'test@dev.local',
      nome: 'Test',
      cognome: 'User',
      passwordHash: testPasswordHash,
      roles: ['user'],
      mfaEnabled: false
    }
  });

  // Clienti di esempio
  await prisma.cliente.createMany({
    data: [
      { ragioneSocialeC: 'Cliente Alfa Srl', cittac: 'Modena', provc: 'MO', attivoC: true },
      { ragioneSocialeC: 'Cliente Beta Spa', cittac: 'Reggio Emilia', provc: 'RE', attivoC: true }
    ],
    skipDuplicates: true
  });

  // Audit log iniziale
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SEED_INIT',
      ip: '127.0.0.1',
      details: 'Database seed di sviluppo completato'
    }
  });

  console.log('✅ Seed completato.');
  console.log('👤 Utenti creati:');
  console.log(`   - admin@dev.local (password: password123)`);
  console.log(`   - test@dev.local (password: password123)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
