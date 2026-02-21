# =================================================================================
#                        --- STAGE 1: DEPENDENCIES ---
# =================================================================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package*.json ./

# Configure npm for better network handling
RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retries 5

# Install dependencies with clean install for reproducibility
RUN npm ci --only=production --prefer-online --no-audit && \
    npm cache clean --force

# =================================================================================
#                        --- STAGE 2: BUILDER ---
# =================================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Configure npm for better network handling
RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retries 5

# Install all dependencies (including devDependencies)
# NOTA: Si falla, ejecuta 'npm install' localmente para sincronizar package-lock.json
RUN npm ci --prefer-online --no-audit && \
    npm cache clean --force

# Copy source code
COPY . .

# Build argument for API URL
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build the application
RUN npm run build

# =================================================================================
#                        --- STAGE 3: RUNTIME ---
# =================================================================================
FROM nginx:1.27-alpine AS runtime

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S -D -H -u 1001 -h /usr/share/nginx/html -s /sbin/nologin -G appuser -g appuser appuser

# Copy built assets from builder
COPY --from=builder --chown=appuser:appuser /app/dist/ /usr/share/nginx/html

# Copy nginx configuration
COPY --chown=appuser:appuser ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=appuser:appuser ./nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf

# Create nginx cache directory with correct permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R appuser:appuser /var/cache/nginx /var/log/nginx /var/run /usr/share/nginx/html

# Update nginx.conf to run as non-root (if needed, update the main nginx.conf)
RUN sed -i 's/user  nginx;/user  appuser;/' /etc/nginx/nginx.conf || true

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
