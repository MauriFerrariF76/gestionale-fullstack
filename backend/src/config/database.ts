// File: database.ts
// Scopo: Configura e esporta il pool di connessione a PostgreSQL tramite il modulo pg
// Percorso: src/config/database.ts
//
// Questo file gestisce la connessione sicura al database usando variabili d'ambiente e Docker secrets.
import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

// Funzione per leggere segreti Docker o variabili d'ambiente
const getSecret = (secretName: string): string => {
  try {
    // Prova a leggere da Docker secrets
    return fs.readFileSync(`/run/secrets/${secretName}`, 'utf8').trim();
  } catch (error) {
    // Fallback per sviluppo locale o se Docker secrets non disponibili
    const envVar = process.env[`${secretName.toUpperCase()}`];
    if (!envVar) {
      console.warn(`⚠️  Segreto ${secretName} non trovato in Docker secrets né in variabili d'ambiente`);
    }
    return envVar || '';
  }
};

// Configurazione del pool di connessione, usa Docker secrets o variabili d'ambiente
const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'gestionale',
  user: process.env.DB_USER || 'gestionale_user',
  password: getSecret('db_password'),
  // Parametri ottimizzati per performance
  max: 20, // Connessioni massime nel pool
  idleTimeoutMillis: 30000, // Timeout connessioni inattive
  connectionTimeoutMillis: 2000, // Timeout connessione iniziale
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
  console.log('🔧 Configurazione Database:');
  console.log('   DB_HOST:', process.env.DB_HOST || 'localhost');
  console.log('   DB_PORT:', process.env.DB_PORT || 5432);
  console.log('   DB_NAME:', process.env.DB_NAME || 'gestionale');
  console.log('   DB_USER:', process.env.DB_USER || 'gestionale_user');
  console.log('   DB_PASSWORD:', getSecret('db_password') ? '***' : 'MANCANTE');
  console.log('   Docker Secrets:', fs.existsSync('/run/secrets/db_password') ? '✅ Disponibili' : '❌ Non disponibili');
}

export default pool;