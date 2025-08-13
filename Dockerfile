# ---- Build stage ----
FROM node:18-alpine3.19 AS builder
WORKDIR /app

# Copy workspace manifests (adjust if you use workspaces)
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install deps (frontend needs dev deps to build, backend needs dev for Next build)
RUN npm install
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy sources
COPY backend ./backend
COPY frontend ./frontend

# Build frontend (Vite)
RUN cd frontend && npm run build

# Merge frontend build into backend public
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

# Build backend (Next.js)
RUN cd backend && npm run build

# ---- Runtime stage ----
FROM node:18-alpine3.19 AS runner
WORKDIR /app

# Optional: add non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy only the standalone output & public assets & package manifest
# server + needed node_modules
COPY --from=builder /app/backend/package.json ./package.json
COPY --from=builder /app/backend/.next/standalone ./
# static assets
COPY --from=builder /app/backend/.next/static ./.next/static
# public folder with frontend
COPY --from=builder /app/backend/public ./public

ENV NODE_ENV=production
ENV PORT=8080

USER nextjs

EXPOSE 8080
CMD ["sh", "-c", "node server.js -p ${PORT}"]