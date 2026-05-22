# Multi-stage Docker build for Netboost Pro

# Stage 1: Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:24-alpine

WORKDIR /app

# Install a simple HTTP server to serve the static build
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy environment example for reference
COPY .env.example ./

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
