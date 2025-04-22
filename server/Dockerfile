# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig-paths-bootstrap.js ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy package files and install production dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig-paths-bootstrap.js ./
RUN npm install --production && npm install --save-dev tsconfig-paths

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src/prisma ./prisma

# Generate Prisma client in production with explicit schema path
ENV PRISMA_SCHEMA_PATH=/app/prisma/schema.prisma
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# Copy and setup startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the application using the startup script
CMD ["./start.sh"] 