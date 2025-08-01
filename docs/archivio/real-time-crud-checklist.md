# ✅ Checklist: Implementazione CRUD in tempo reale per Gestionale Ferrari

---

## 📋 INFORMAZIONI PROGETTO

- **Progetto**: Gestionale Ferrari - Sistema web aziendale
- **Dominio**: gestionale.carpenteriaferrari.com
- **Ambiente**: LAN (10.10.10.x) + WAN (dominio pubblico)
- **Sicurezza**: HTTPS, autenticazione JWT, rate limiting
- **Documentazione**: `/docs` con checklist operative e manuale utente

---

## 🧱 Stack Tecnologico Attuale

- **Backend**: Node.js + Express + TypeScript + PostgreSQL
- **Frontend**: Next.js + React + TypeScript (App Router)
- **Database**: PostgreSQL con pool di connessioni
- **Proxy**: NGINX con configurazione Docker
- **Container**: Docker Compose per orchestrazione
- **Sicurezza**: Helmet, CORS, rate limiting, JWT

---

## 📦 BACKEND – Modifiche Necessarie

### 🔌 Setup WebSocket con Socket.IO

- [ ] Installare dipendenze Socket.IO:
  ```bash
  cd backend
  npm install socket.io
  npm install --save-dev @types/socket.io
  ```

- [ ] Modificare `src/app.ts` per integrare Socket.IO:
  ```ts
  import express, { Request, Response } from 'express';
  import http from 'http';
  import { Server } from 'socket.io';
  import cors, { CorsOptions } from 'cors';
  import helmet from 'helmet';
  import morgan from 'morgan';
  import dotenv from 'dotenv';
  import pool from './config/database';
  import clientiRoutes from './routes/clienti/index';
  import authRoutes from './routes/auth';

  dotenv.config();

  const app = express();
  const server = http.createServer(app);
  const PORT = Number(process.env.PORT) || 3001;

  // Configurazione Socket.IO con CORS esistente
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://10.10.10.15:3000',
        'https://gestionale.carpenteriaferrari.com'
      ],
      credentials: true
    }
  });

  // Configurazione CORS esistente (mantenere)
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

  // Middleware di sicurezza (mantenere configurazione esistente)
  app.use(express.json());
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(morgan('combined'));
  app.use(express.urlencoded({ extended: true }));

  // Gestione connessioni WebSocket
  io.on('connection', (socket) => {
    console.log('🟢 Client WebSocket connesso:', socket.id);
    
    // Gestione autenticazione JWT per WebSocket
    socket.on('authenticate', (token) => {
      // TODO: Implementare verifica JWT per WebSocket
      console.log('🔐 Autenticazione WebSocket per:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Client WebSocket disconnesso:', socket.id);
    });
  });

  // Esportare io per uso nei controllers
  app.set('io', io);

  // Route esistenti (mantenere)
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Gestionale Ferrari API Server',
      status: 'running',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/health', async (req: Request, res: Response) => {
    try {
      const result = await pool.query('SELECT NOW() as current_time');
      res.json({
        status: 'OK',
        database: 'connected',
        time: result.rows[0].current_time
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'ERROR',
        database: 'disconnected',
        error: error.message
      });
    }
  });

  // Rotte esistenti (mantenere)
  app.use('/api/clienti', clientiRoutes);
  app.use('/api/auth', authRoutes);

  // Avvio server condiviso
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server avviato su http://0.0.0.0:${PORT}`);
    console.log(`🌐 WebSocket attivo su ws://0.0.0.0:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
  ```

### 🔁 Emissione eventi nei controllers esistenti

- [ ] Creare utility per emissione eventi in `src/utils/socketEvents.ts`:
  ```ts
  import { Server } from 'socket.io';

  export type CrudAction = 'create' | 'update' | 'delete';
  export type EntityType = 'cliente' | 'fornitore' | 'ordine' | 'fattura' | 'dipendente';

  export interface CrudEvent {
    entity: EntityType;
    action: CrudAction;
    id: string | number;
    data: any;
    timestamp: string;
    userId?: string;
  }

  export function emitCrudEvent(
    io: Server,
    entity: EntityType,
    action: CrudAction,
    id: string | number,
    data: any,
    userId?: string
  ) {
    const event: CrudEvent = {
      entity,
      action,
      id,
      data,
      timestamp: new Date().toISOString(),
      userId
    };

    io.emit('crud-event', event);
    console.log(`📡 Evento CRUD emesso: ${action} ${entity} ${id}`);
  }
  ```

- [ ] Modificare `src/routes/clienti/index.ts` per emettere eventi:
  ```ts
  import { emitCrudEvent } from '../../utils/socketEvents';

  // Dopo ogni operazione CRUD, aggiungere:
  const io = req.app.get('io');
  emitCrudEvent(io, 'cliente', 'create', nuovoCliente.IdCliente, nuovoCliente);
  ```

### 📡 (Opzionale) Integrazione PostgreSQL LISTEN/NOTIFY

- [ ] Creare script SQL per trigger in `postgres/triggers/`:
  ```sql
  -- postgres/triggers/clienti_notify.sql
  CREATE OR REPLACE FUNCTION notify_cliente_change()
  RETURNS trigger AS $$
  BEGIN
    PERFORM pg_notify('cliente_change', json_build_object(
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'id', COALESCE(NEW.IdCliente, OLD.IdCliente),
      'data', row_to_json(COALESCE(NEW, OLD))
    )::text);
    RETURN COALESCE(NEW, OLD);
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER on_cliente_change
  AFTER INSERT OR UPDATE OR DELETE ON clienti
  FOR EACH ROW EXECUTE FUNCTION notify_cliente_change();
  ```

- [ ] Creare listener in `src/config/database.ts`:
  ```ts
  // Aggiungere al file database.ts esistente
  pool.on('notification', (msg) => {
    try {
      const payload = JSON.parse(msg.payload || '{}');
      const io = app.get('io');
      
      if (io && payload.table === 'clienti') {
        emitCrudEvent(
          io,
          'cliente',
          payload.action === 'INSERT' ? 'create' : 
          payload.action === 'UPDATE' ? 'update' : 'delete',
          payload.id,
          payload.data
        );
      }
    } catch (error) {
      console.error('❌ Errore parsing notifica DB:', error);
    }
  });

  // Avviare listener
  pool.query('LISTEN cliente_change');
  ```

---

## 🌐 FRONTEND – Next.js + React

### 📦 Setup Socket.IO Client

- [ ] Installare dipendenze:
  ```bash
  cd frontend
  npm install socket.io-client
  ```

- [ ] Creare hook centralizzato `lib/hooks/useSocket.ts`:
  ```ts
  import { io, Socket } from 'socket.io-client';
  import { useEffect, useRef, useCallback } from 'react';

  // Configurazione per ambiente
  const SOCKET_URL = process.env.NODE_ENV === 'production' 
    ? 'https://gestionale.carpenteriaferrari.com'
    : 'http://localhost:3001';

  let socket: Socket | null = null;

  function getSocket(): Socket {
    if (!socket) {
      socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        withCredentials: true
      });

      socket.on('connect', () => {
        console.log('🟢 Connesso al WebSocket:', socket?.id);
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Errore connessione WebSocket:', error);
      });

      socket.on('disconnect', (reason) => {
        console.log('🔴 Disconnesso WebSocket:', reason);
      });
    }
    return socket;
  }

  export function useSocketListener<T>(
    event: string,
    callback: (payload: T) => void
  ) {
    const savedCallback = useRef(callback);

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      const socket = getSocket();
      
      const handler = (data: T) => {
        savedCallback.current(data);
      };

      socket.on(event, handler);
      
      return () => {
        socket.off(event, handler);
      };
    }, [event]);
  }

  export function useSocketEmit() {
    const socket = getSocket();
    
    return useCallback((event: string, data: any) => {
      socket.emit(event, data);
    }, []);
  }
  ```

### 🔁 Gestione eventi CRUD in componenti esistenti

- [ ] Modificare `app/clienti/page.tsx` per supportare real-time:
  ```ts
  import { useSocketListener } from '@/lib/hooks/useSocket';
  import { CrudEvent } from '@/types/socket';

  export default function ClientiPage() {
    // ... codice esistente ...

    // Gestione eventi real-time
    useSocketListener<CrudEvent>('crud-event', (payload) => {
      if (payload.entity === 'cliente') {
        switch (payload.action) {
          case 'create':
            setClienti(prev => [...prev, payload.data]);
            break;
          case 'update':
            setClienti(prev => 
              prev.map(cliente => 
                cliente.IdCliente === payload.id ? payload.data : cliente
              )
            );
            break;
          case 'delete':
            setClienti(prev => 
              prev.filter(cliente => cliente.IdCliente !== payload.id)
            );
            break;
        }
      }
    });

    // ... resto del codice esistente ...
  }
  ```

- [ ] Creare tipi per eventi in `types/socket.ts`:
  ```ts
  export type CrudAction = 'create' | 'update' | 'delete';
  export type EntityType = 'cliente' | 'fornitore' | 'ordine' | 'fattura' | 'dipendente';

  export interface CrudEvent {
    entity: EntityType;
    action: CrudAction;
    id: string | number;
    data: any;
    timestamp: string;
    userId?: string;
  }
  ```

---

## 🌍 NGINX – Configurazione WebSocket

### 🔧 Modificare `nginx/nginx.conf` per supportare WebSocket

- [ ] Aggiungere location per WebSocket nella configurazione esistente:
  ```nginx
  # Aggiungere dopo la location /api esistente
  location /socket.io/ {
      # Rate limiting per WebSocket
      limit_req zone=api burst=20 nodelay;

      proxy_pass http://backend;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_cache_bypass $http_upgrade;
      
      # Timeout specifici per WebSocket
      proxy_connect_timeout 60s;
      proxy_send_timeout 60s;
      proxy_read_timeout 86400; # Timeout lungo per WebSocket
  }
  ```

---

## 🧪 TESTING & DEBUG

### 📋 Test funzionali

- [ ] Test connessione WebSocket:
  - Aprire browser developer tools
  - Verificare connessione WebSocket in Network tab
  - Controllare log backend per connessioni

- [ ] Test CRUD real-time:
  - Aprire `/clienti` su 2 browser diversi
  - Creare/modificare cliente su un browser
  - Verificare aggiornamento automatico sull'altro browser

- [ ] Test disconnessione/riconnessione:
  - Disconnettere rete temporaneamente
  - Verificare riconnessione automatica
  - Controllare sincronizzazione dati

### 🛠 Best practice

- [ ] Implementare debounce per aggiornamenti frequenti
- [ ] Aggiungere loading states durante sincronizzazione
- [ ] Gestire errori di connessione WebSocket
- [ ] Loggare eventi per debugging

---

## 📁 DOCUMENTAZIONE

### 📄 Aggiornare documentazione esistente

- [ ] Aggiungere sezione real-time in `/docs/MANUALE/`:
  - Spiegare funzionalità real-time agli utenti
  - Documentare comportamento multi-utente
  - Aggiungere troubleshooting

- [ ] Aggiornare `/docs/SVILUPPO/`:
  - Documentare architettura WebSocket
  - Aggiungere guide per nuovi moduli real-time
  - Documentare API eventi

### 📋 Eventi real-time disponibili

| Evento         | Descrizione                         | Payload                                 |
|----------------|-------------------------------------|-----------------------------------------|
| `crud-event`   | Evento generico per tutte le entità | `{ entity, action, id, data, timestamp, userId }` |

---

## 🔒 SICUREZZA E PERFORMANCE

### 🔐 Autenticazione WebSocket

- [ ] Implementare autenticazione JWT per WebSocket
- [ ] Validare token su connessione
- [ ] Gestire scadenza token

### ⚡ Ottimizzazioni

- [ ] Implementare rate limiting per eventi WebSocket
- [ ] Ottimizzare payload eventi (solo dati necessari)
- [ ] Considerare compressione per payload grandi

---

## ✅ DELIVERABLE FINALE

- [ ] Sistema CRUD real-time funzionante per clienti
- [ ] Configurazione WebSocket dietro NGINX
- [ ] Autenticazione JWT per WebSocket
- [ ] Documentazione utente aggiornata
- [ ] Test funzionali completati
- [ ] Checklist aggiornata e spuntata

---

## 📝 NOTE OPERATIVE

- **Priorità**: Implementare prima per clienti, poi estendere ad altre entità
- **Compatibilità**: Mantenere funzionalità esistenti durante implementazione
- **Rollback**: Preparare procedure di rollback in caso di problemi
- **Monitoraggio**: Aggiungere logging per monitoraggio WebSocket