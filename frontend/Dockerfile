# Dockerfile per Frontend Gestionale
# Versione: 1.0
# Descrizione: Container per Next.js con build ottimizzato

# Fase 1: Build
FROM node:18-alpine AS builder

# Imposta directory di lavoro
WORKDIR /app

# Copia file di dipendenze
COPY package*.json ./

# Installa tutte le dipendenze (incluso devDependencies per build)
RUN npm ci

# Copia tutto il codice sorgente
COPY . .

# Build dell'applicazione Next.js
RUN npm run build

# Fase 2: Runtime
FROM node:18-alpine AS runner

# Imposta utente non-root per sicurezza
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Installa curl per health checks
RUN apk add --no-cache curl

# Imposta directory di lavoro
WORKDIR /app

# Copia file di dipendenze
COPY package*.json ./

# Installa solo dipendenze di produzione
RUN npm ci --only=production && npm cache clean --force

# Copia build da fase precedente
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Imposta proprietario corretto
RUN chown -R nextjs:nodejs /app

# Passa all'utente non-root
USER nextjs

# Esponi porta 3000
EXPOSE 3000

# Imposta variabili ambiente per Next.js
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Comando di avvio
CMD ["npm", "start"] 