// File: app.ts
// Scopo: Inizializza e configura il server Express, le rotte principali e la sicurezza dell'API
// Percorso: src/app.ts
//
// Questo file avvia il server, gestisce la configurazione CORS, la sicurezza, il logging e le rotte di base.
import express, { Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import prisma from './config/database';
import clientiRoutes from './routes/clienti';
import authRoutes from './routes/auth';
import auditRoutes from './routes/audit';

// Suggerimento: importa e usa un middleware di rate limiting per proteggere le API
// import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const LOCALHOST = 'http://localhost:3000';
const LOCALNET_REGEX = /^http:\/\/10\.10\.10\.[0-9]{1,3}:3000$/;

// Configurazione CORS modulare
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://10.10.10.') ||
      origin.startsWith('https://10.10.10.') ||
      origin.startsWith('https://gestionale.carpenteriaferrari.com')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

// Middleware di sicurezza
app.use(express.json());
app.use(helmet());
app.use(cors(corsOptions));
// Suggerimento: attiva il rate limiting per prevenire abusi
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(morgan('combined'));
// app.use(express.json()); // This line is now redundant as express.json() is moved up
app.use(express.urlencoded({ extended: true }));

// Route di test
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Gestionale Ferrari API Server',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check con test database
app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT NOW() as current_time`;
    res.json({
      status: 'OK',
      database: 'connected',
      time: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'ERROR',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Rotte principali
app.use('/api/clienti', clientiRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/auth', authRoutes);

// TODO: aggiungi autenticazione e autorizzazione per proteggere le API sensibili

// Avvio server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});