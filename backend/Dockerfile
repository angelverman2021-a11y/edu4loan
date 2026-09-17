# Node.js production image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and workspace manifests
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY shared/ ./shared/

# Install dependencies and build backend
RUN npm install
COPY backend/ ./backend/
WORKDIR /app/backend
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm install --omit=dev --workspace=backend

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/src/seeds ./backend/src/seeds

EXPOSE 5000

CMD ["node", "backend/dist/server.js"]
