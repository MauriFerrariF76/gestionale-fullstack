# 🛠️ 06-DEVELOPMENT - Checklist Dettagliata

## Panoramica
Checklist dettagliata per l'ambiente di sviluppo del gestionale fullstack.

**Versione**: 1.0  
**Data**: 8 Agosto 2025  
**Stato**: ✅ ATTIVA  
**Priorità**: MEDIA

---

## 🛠️ Ambiente Sviluppo Nativo - IMPLEMENTATO E FUNZIONANTE

### Documentazione Completa
- [x] **Documentazione completa**: `docs/SVILUPPO/ambiente-sviluppo-nativo.md`
- [x] **Script setup completo**: `scripts/setup-ambiente-sviluppo.sh` ✅ FUNZIONANTE
- [x] **Script sincronizzazione**: `scripts/sync-dev-to-prod.sh` ✅ FUNZIONANTE
- [x] **Script utilità**: start-sviluppo.sh, stop-sviluppo.sh, backup-sviluppo.sh ✅ CREATI
- [x] **Configurazioni**: PostgreSQL nativo, Backend nativo, Frontend nativo ✅ FUNZIONANTI
- [x] **Workflow sviluppo**: Ambiente ibrido (sviluppo nativo + produzione containerizzata) ✅ ATTIVO
- [x] **Target**: pc-mauri-vaio (10.10.10.15) - TUTTO NATIVO ✅ IMPLEMENTATO
- [x] **Porte**: PostgreSQL 5432, Backend 3001, Frontend 3000 ✅ ATTIVE
- [x] **Database**: gestionale_dev (STESSO per sviluppo e produzione) ✅ CONFIGURATO
- [x] **Architettura**: Sviluppo nativo → Produzione containerizzata ✅ FUNZIONANTE
- [x] **Test completati**: Backend OK, Frontend OK, Database OK ✅ VERIFICATO

### Configurazione Sviluppo
```bash
# Ambiente sviluppo
cd gestionale-fullstack

# Avvio sviluppo
./scripts/start-sviluppo.sh

# Verifica servizi
ps aux | grep -E "(node|postgres)"

# Test connessioni
curl http://localhost:3000  # Frontend
curl http://localhost:3001/health  # Backend
psql -h localhost -U gestionale_dev_user -d gestionale_dev  # Database
```

---

## 🗄️ Editor e Tools Database

### Editor Grafico
- [ ] **Editor grafico**: DBeaver Community (DA INSTALLARE)
- [ ] **Connessione PostgreSQL**: Configurata e testata
- [ ] **Schema designer**: Per progettare tabelle
- [ ] **Query builder**: Per query complesse
- [ ] **Data export/import**: Per future migrazioni

### Installazione DBeaver
```bash
# Download DBeaver Community
wget https://dbeaver.io/files/dbeaver-ce_latest_amd64.deb

# Installazione
sudo dpkg -i dbeaver-ce_latest_amd64.deb
sudo apt-get install -f

# Configurazione connessione
# Host: localhost
# Port: 5432
# Database: gestionale_dev
# Username: gestionale_dev_user
# Password: [configurata]
```

### Database Tools
```bash
# Connessione diretta PostgreSQL
psql -h localhost -U gestionale_dev_user -d gestionale_dev

# Backup database sviluppo
pg_dump -U gestionale_dev_user -d gestionale_dev > backup_dev.sql

# Restore database sviluppo
psql -U gestionale_dev_user -d gestionale_dev < backup_dev.sql

# Lista tabelle
\dt

# Schema tabella
\d nome_tabella
```

---

## 🔧 Sistema Prisma ORM

### Prisma CLI
- [x] **Prisma CLI**: Installato
- [x] **schema.prisma**: Definizione modelli base
- [x] **Migrations**: Sistema automatico
- [x] **Type generation**: TypeScript types
- [x] **Prisma Studio**: GUI integrata
- [x] **Seed data**: Dati di test

### Setup Prisma
```bash
# Installazione Prisma
npm install prisma --save-dev
npm install @prisma/client

# Inizializzazione
npx prisma init

# Configurazione schema.prisma
# datasource db {
#   provider = "postgresql"
#   url      = env("DATABASE_URL")
# }
# 
# generator client {
#   provider = "prisma-client-js"
# }
```

### Prisma Workflow
```bash
# Generare client
npx prisma generate

# Creare migration
npx prisma migrate dev --name "add-feature"

# Applicare migration
npx prisma migrate deploy

# Studio GUI
npx prisma studio

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed
```

### Schema Prisma Base
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Cliente {
  id        Int      @id @default(autoincrement())
  nome      String
  email     String?
  telefono  String?
  indirizzo String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Fornitore {
  id        Int      @id @default(autoincrement())
  nome      String
  email     String?
  telefono  String?
  indirizzo String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🔄 Gestione Ambienti

### Environment Files
- [x] **.env files**: Separati per dev/prod (sviluppo aggiornato)
- [x] **Database config**: Connessioni separate (sviluppo = postgres locale)
- [ ] **Script sync**: Dev → prod ottimizzati
- [x] **Backup strategy**: Per ambiente sviluppo
- [ ] **Rollback procedures**: Testate

### Configurazione Environment
```bash
# .env.development
DATABASE_URL="postgresql://gestionale_dev_user:password@localhost:5432/gestionale_dev"
NODE_ENV=development
PORT=3001

# .env.production
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@postgres:5432/gestionale"
NODE_ENV=production
PORT=3000
```

### Script Sync Ottimizzati
```bash
#!/bin/bash
# scripts/sync-dev-to-prod.sh

echo "🔄 Sincronizzazione sviluppo → produzione"

# Backup sviluppo
./scripts/backup-sviluppo.sh

# Sync codice
git add .
git commit -m "Sync to production"
git push origin main

# Deploy produzione
ssh mauri@10.10.10.16 << 'EOF'
cd /opt/gestionale-fullstack
git pull origin main
docker compose build app --no-cache
docker compose up -d
EOF

echo "✅ Sincronizzazione completata"
```

---

## ⚡ Automazioni Sviluppo

### Makefile Completo
- [ ] **Makefile**: Comandi rapidi completi
- [ ] **Hot reload**: Ottimizzato
- [ ] **Debugging**: Breakpoints e logging
- [ ] **Testing**: Framework base
- [ ] **Documentation**: Auto-generata

### Makefile Development
```makefile
# Development commands
dev:
	npm run dev

dev-backend:
	cd backend && npm run dev

dev-frontend:
	cd frontend && npm run dev

studio:
	npx prisma studio

migrate:
	npx prisma migrate dev

generate:
	npx prisma generate

seed:
	npx prisma db seed

test:
	npm test

build:
	npm run build

clean:
	rm -rf node_modules
	rm -rf .next
	rm -rf dist

install:
	npm install

backup:
	./scripts/backup-sviluppo.sh

sync:
	./scripts/sync-dev-to-prod.sh
```

### Hot Reload Ottimizzato
```json
// package.json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:studio": "npx prisma studio"
  }
}
```

### Debugging Tools
```bash
# Debug Node.js
node --inspect backend/server.js

# Debug con Chrome DevTools
# chrome://inspect

# Log debugging
DEBUG=* npm run dev

# Profiling
node --prof backend/server.js
```

---

## 🧪 Testing Framework

### Testing Base
- [ ] **Jest**: Framework testing
- [ ] **Supertest**: API testing
- [ ] **Testing database**: Test isolati
- [ ] **Coverage**: Report copertura
- [ ] **CI/CD**: Integrazione automatica

### Setup Testing
```bash
# Installazione testing
npm install --save-dev jest supertest @types/jest

# Configurazione Jest
# jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ]
}
```

### Test Esempi
```javascript
// __tests__/api.test.js
const request = require('supertest');
const app = require('../backend/app');

describe('API Tests', () => {
  test('GET /health returns 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });

  test('GET /api/clienti returns array', async () => {
    const response = await request(app).get('/api/clienti');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

---

## 📚 Documentation

### Auto-Generated Docs
- [ ] **API documentation**: Swagger/OpenAPI
- [ ] **Database schema**: Prisma docs
- [ ] **Component docs**: Storybook
- [ ] **README**: Aggiornato automaticamente
- [ ] **Changelog**: Auto-generato

### Swagger Setup
```bash
# Installazione Swagger
npm install swagger-jsdoc swagger-ui-express

# Configurazione
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gestionale API',
      version: '1.0.0',
    },
  },
  apis: ['./backend/routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

---

## 🚨 Problemi Comuni

### Problemi Sviluppo
- **Hot reload non funziona**: Verificare nodemon
- **Database non connesso**: Verificare PostgreSQL
- **Porte occupate**: Verificare servizi attivi
- **Permessi file**: Verificare ownership

### Problemi Prisma
- **Migration fallisce**: Verificare schema e database
- **Client non generato**: Eseguire prisma generate
- **Studio non si avvia**: Verificare porta 5555
- **Seed non funziona**: Verificare script seed

### Problemi Tools
- **DBeaver non connesso**: Verificare credenziali
- **Git sync fallisce**: Verificare SSH keys
- **Build fallisce**: Verificare dipendenze
- **Test falliscono**: Verificare configurazione

---

## 📋 Verifiche Development

### Test Ambiente Completo
```bash
# 1. Verifica servizi
./scripts/start-sviluppo.sh

# 2. Test connessioni
curl http://localhost:3001/health  # atteso: {"status":"OK","database":"connected"}
psql -h localhost -U gestionale_dev_user -d gestionale_dev -c "SELECT 1;"  # atteso: 1

# 3. Test Prisma
npx prisma studio  # atteso: apertura UI

# 4. Test build backend
cd backend && npm run build  # atteso: build senza errori
```

### Verifica API protette (JWT)
```bash
# 1) Recupera ID utente admin seed
export ADMIN_ID=$(node - <<'NODE'
const {PrismaClient}=require('@prisma/client');
(async()=>{const p=new PrismaClient();const u=await p.user.findUnique({where:{email:'admin@dev.local'}});console.log(u&&u.id);await p.$disconnect();})();
NODE
)

# 2) Genera TOKEN firmato RS256 con le chiavi locali
export TOKEN=$(node -e "const jwt=require('jsonwebtoken');const fs=require('fs');const id=process.env.ADMIN_ID;const pk=fs.readFileSync('backend/config/keys/jwtRS256.key');process.stdout.write(jwt.sign({id,roles:['admin'],email:'admin@dev.local'},pk,{algorithm:'RS256',expiresIn:'1h'}))")

# 3) GET clienti (autenticato)
curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:3001/api/clienti?limit=2"  # atteso: success true + array clienti

# 4) SEARCH clienti
curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:3001/api/clienti/search?term=Alfa&limit=5"  # atteso: risultati con 'Cliente Alfa Srl'

# 5) POST creazione cliente
curl -s -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"ragioneSocialeC":"Cliente Gamma SRL","cittac":"Bologna","provc":"BO","attivoC":true}' \
  http://localhost:3001/api/clienti  # atteso: success true + nuovo record

# 6) Audit stats
curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:3001/api/audit/stats"  # atteso: counters > 0
```

### Test Tools
```bash
# Test DBeaver
# Aprire DBeaver e connettersi a localhost:5432

# Test Prisma Studio
npx prisma studio

# Test migrations
npx prisma migrate dev --name "test-migration"

# Test seed
npx prisma db seed
```

---

## 📝 Note Operative

### Configurazioni Critiche
- **Database URL**: `postgresql://gestionale_dev_user:password@localhost:5432/gestionale_dev`
- **Porte**: Frontend 3000, Backend 3001, Database 5432
- **Environment**: development
- **Hot reload**: Nodemon configurato
- **Debugging**: Chrome DevTools

### Credenziali Development
- **Database**: gestionale_dev_user / password
- **SSH**: mauri@10.10.10.15
- **Git**: Configurato con SSH keys
- **DBeaver**: Connessione locale

---

## 📊 Stato Development

### ✅ Implementato (80%)
- **Ambiente sviluppo nativo**: pc-mauri-vaio funzionante
- **PostgreSQL nativo**: Database locale configurato (gestionale_dev)
- **Prisma ORM**: schema, migrations, seed, generate
- **Script utilità**: start, stop, backup funzionanti
- **Workflow sviluppo**: Sviluppo → Produzione
- **Test completati**: Backend (health OK), Database (connessione OK), API protette (GET/SEARCH/POST clienti OK), Audit (stats OK)

### 🔄 Da Implementare (20%)
- **Script sync dev→prod**: rifinitura
- **Rollback procedures**: Testate
- **Makefile & testing framework**

**✅ Development aggiornato e funzionante**
