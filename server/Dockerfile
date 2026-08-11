# Production Multi-Stage Dockerfile for Express.js Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy installed dependencies and application code from builder stage
COPY --from=builder /app ./

# Create uploads directory and assign permissions to non-root node user
RUN mkdir -p /app/uploads && chown -R node:node /app

# Switch to non-root node user for security
USER node

# Expose backend port
EXPOSE 5000

# Healthcheck to monitor container status
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

# Start the application
CMD ["node", "index.js"]
