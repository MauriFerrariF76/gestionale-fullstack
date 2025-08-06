# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fullstack business management system (gestionale aziendale) for Ferrari Pietro SNC carpentry company. The application manages clients, suppliers, work orders, employees, and documents with both LAN and remote HTTPS access.

## Tech Stack

- **Backend**: Node.js 18+ with Express.js, TypeScript, PostgreSQL 15+
- **Frontend**: Next.js 15.4+ with React 19+, TypeScript, Tailwind CSS 4
- **Database**: PostgreSQL with comprehensive schema for business entities
- **Authentication**: JWT with refresh tokens, MFA support (in development)
- **Development**: Native environment preferred (Docker available but deprecated for dev)

## Development Commands

### Environment Setup
```bash
# Start native development environment (preferred)
./scripts/start-sviluppo.sh

# Alternative manual startup
cd backend && npm run dev &
cd frontend && npm run dev &
```

### Backend Commands
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Development server with nodemon (port 3001)
npm run build        # TypeScript compilation to dist/
npm start            # Production server (runs dist/app.js)
```

### Frontend Commands
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Development server with Turbopack (port 3000)
npm run build        # Production build
npm start            # Production server
npm run lint         # ESLint checking
```

### Database Commands
```bash
# Database initialization (PostgreSQL must be running)
psql -U gestionale_user -d gestionale -f postgres/init/01-init-database.sql

# Check database connection
curl http://localhost:3001/health
```

## Architecture

### Backend Structure
- **Entry Point**: `backend/src/app.ts` - Express server with CORS, security, routing
- **Database**: `backend/src/config/database.ts` - PostgreSQL connection pool
- **Routes**: `backend/src/routes/` - RESTful API endpoints
  - `auth.ts` - Authentication (JWT, refresh tokens)
  - `clienti/index.ts` - Client management CRUD operations
- **Models**: `backend/src/models/` - TypeORM-style models for entities
- **Types**: `backend/src/types/` - TypeScript interfaces
- **Middleware**: `backend/src/middleware/` - Auth, validation, audit logging
- **Utils**: `backend/src/utils/` - JWT, MFA, password utilities

### Frontend Structure
- **App Router**: `frontend/app/` - Next.js 13+ app directory structure
- **Components**: `frontend/components/` - Reusable React components
  - `ui/` - Base UI components (Button, Input, etc.)
  - `clienti/` - Client-specific components
- **Contexts**: `frontend/contexts/` - React contexts for auth, table config
- **Lib**: `frontend/lib/` - API clients and utilities
- **Types**: `frontend/types/` - TypeScript interfaces

### Database Schema
Key tables include:
- `users` - User authentication with UUID, roles, MFA support
- `clienti` - Comprehensive client data with 60+ fields
- `fornitori` - Supplier management
- `commesse` - Work orders/projects
- `dipendenti` - Employee records
- `audit_logs` - System audit trail
- `refresh_tokens` - JWT refresh token management

## Development Guidelines

### Component Architecture
- **Prioritize reusable components** over large monolithic ones
- Use composition pattern with small, specialized components
- All UI components should be in `components/ui/` with TypeScript interfaces
- Follow established patterns from existing components like `Button.tsx`
- Avoid duplicating functionality across components

### API Design
- RESTful endpoints following `/api/{resource}` pattern
- Comprehensive error handling with try/catch blocks
- Input validation using custom validation functions
- Consistent response format with proper HTTP status codes
- All database operations use parameterized queries for security

### Code Style
- **TypeScript required** for all new code
- Follow existing naming conventions (camelCase for variables, PascalCase for components)
- Use proper error handling - never ignore TypeScript warnings
- Database field names maintain legacy format (e.g., "IdCliente", "RagioneSocialeC")
- Use Docker Compose v2 syntax: `docker compose` (not `docker-compose`)

### Security
- JWT authentication with RS256 algorithm using key pairs
- Password hashing with bcrypt (12 rounds)
- CORS configured for localhost and production domains
- Helmet.js security headers enabled
- Audit logging for all user actions

## Key Files

### Configuration
- `backend/nodemon.json` - Development server config
- `backend/tsconfig.json` - TypeScript compiler options
- `frontend/next.config.js` - Next.js configuration
- `postgres/init/01-init-database.sql` - Database schema and initial data

### Authentication
- `backend/src/utils/jwt.ts` - JWT utilities
- `backend/src/middleware/authMiddleware.ts` - Auth middleware
- `frontend/contexts/AuthContext.tsx` - Client-side auth state

### Core Business Logic
- `backend/src/routes/clienti/index.ts` - Client management API (335 lines)
- `backend/src/types/clienti/cliente.ts` - Client TypeScript interface
- `frontend/components/clienti/FormClienteCompleto.tsx` - Client form component

## Network Configuration

- **Development**: Frontend (3000), Backend (3001), PostgreSQL (5432)
- **Production**: Nginx reverse proxy, HTTPS with Let's Encrypt
- **Network**: 10.10.10.x subnet for LAN access
- **CORS**: Configured for localhost and production domain

## Important Notes

- **Native development preferred** over Docker for better performance
- **No test framework configured** - manual testing required
- **Documentation located in** `docs/` directory with operational checklists
- **Cursor rules enforced** - see `.cursorrules` for project conventions
- **Component reusability is mandatory** - avoid creating duplicate UI elements
- **Always handle TypeScript warnings** - never ignore compilation errors

## Authentication Details

Default users created by database init:
- Admin: `admin@gestionale.local` / `admin123`
- Developer: `mauriferrari76@gmail.com` / `gigi`

JWT tokens use RS256 with public/private key pairs stored in `backend/src/config/keys/`.