// File: database.ts
// Scopo: Configura e esporta il pool di connessione a PostgreSQL tramite il modulo pg
// Percorso: src/config/database.ts
//
// Questo file gestisce la connessione sicura al database usando variabili d'ambiente.
import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configurazione del pool di connessione, usa variabili d'ambiente per la sicurezza
const poolConfig: PoolConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  // Suggerimento: puoi aggiungere parametri come max, idleTimeoutMillis, ecc. per ottimizzare le performance
};

const pool = new Pool(poolConfig);

// Test connessione
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err: Error) => {
  console.error('❌ Database connection error:', err);
});

// Debug solo in sviluppo
if (process.env.NODE_ENV !== 'production') {
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'MANCANTE');
}

export default pool;