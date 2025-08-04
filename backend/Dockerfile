# Dockerfile per Backend Gestionale
# Versione: 1.0
# Descrizione: Container per API Node.js/Express con TypeScript

# Immagine base Node.js 20 Alpine (leggera e sicura)
FROM node:20-alpine

# Imposta utente non-root per sicurezza
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Installa curl per health checks
RUN apk add --no-cache curl

# Imposta directory di lavoro
WORKDIR /app

# Copia file di dipendenze
COPY package*.json ./

# Installa tutte le dipendenze (inclusi devDependencies per il build)
RUN npm ci && npm cache clean --force

# Copia tutto il codice sorgente
COPY . .

# Compila TypeScript
RUN npm run build

# Rimuovi file di sviluppo non necessari
RUN rm -rf src/ node_modules/@types

# Imposta proprietario corretto
RUN chown -R nodejs:nodejs /app

# Passa all'utente non-root
USER nodejs

# Esponi porta 3001
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Comando di avvio
CMD ["npm", "start"] 