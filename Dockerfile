# Multi-stage Dockerfile for Production
# Optimized for Express + Prisma + Node.js

# ============================================================================
# STAGE 1: BUILDER - Build dependencies and Prisma schema
# ============================================================================

FROM node:20-alpine AS builder

# Set working directory
WORKDIR /builder

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# ============================================================================
# STAGE 2: RUNTIME - Lean production image
# ============================================================================

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set environment variables
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production && \
    npm cache clean --force

# Copy generated Prisma client from builder
COPY --from=builder /builder/node_modules/.prisma ./node_modules/.prisma

# Copy Prisma schema for migrations
COPY --from=builder /builder/prisma ./prisma

# Copy application code
COPY . .

# Give nodejs user permission to app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 3000

# Health check - Verify app is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["node", "dev-server.js"]

# ============================================================================
# BUILD STAGES EXPLANATION
# ============================================================================
# 
# STAGE 1 (Builder):
# - Installs ALL npm dependencies
# - Generates Prisma client
# - Creates node_modules with everything needed
# - Result: Large intermediate image (discarded)
#
# STAGE 2 (Runtime):
# - Copies only production dependencies
# - Copies generated Prisma client
# - Much smaller final image (~200MB vs 800MB+)
# - Faster deployment and lower memory usage
# - Non-root user for security (nodejs)
#
# Benefits:
# ✅ Smaller image size (important for fast deployment)
# ✅ No dev dependencies in production (smaller attack surface)
# ✅ Faster startup times
# ✅ Security (non-root user)
# ✅ Proper health checks for Easypanel
# ✅ Clean environment variables separation

# ============================================================================
# DOCKER BEST PRACTICES APPLIED
# ============================================================================
#
# 1. Multi-stage build
#    - Reduces final image size
#    - Removes build-time dependencies
#    - Faster deployments
#
# 2. Alpine base image
#    - Minimal (5MB vs 900MB for ubuntu)
#    - Faster pulling and extraction
#    - Smaller attack surface
#
# 3. Non-root user
#    - Container runs as 'nodejs' user
#    - Security in case of compromise
#    - Prevents root access in container
#
# 4. Health check
#    - Easypanel uses this for monitoring
#    - Auto-restart if unhealthy
#    - Ensures app is actually running
#
# 5. Proper dependencies
#    - npm ci instead of npm install (production-ready)
#    - Clear separation between build and runtime
#    - Cache busting only when package.json changes
#
# ============================================================================
