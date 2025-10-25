# Multi-stage build for TBVector Web Client

# ---- Base Stage ----
FROM node:18-alpine AS base
WORKDIR /app

# Install pnpm and basic utilities
RUN npm install -g pnpm && \
    apk add --no-cache netcat-openbsd

# Copy package files
COPY package.json pnpm-lock.yaml ./

# ---- Development Stage ----
FROM base AS development
ENV NODE_ENV=development

# Install all dependencies (including devDependencies for TailwindCSS)
RUN pnpm install

# Copy source code
COPY . .

# Build CSS
RUN pnpm build:css

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "dev:server"]

# ---- Production Stage ----
FROM base AS production
ENV NODE_ENV=production

# Install all dependencies (need devDeps for building)
RUN pnpm install

# Copy source code
COPY . .

# Build TypeScript and CSS
RUN pnpm build

# Remove devDependencies to reduce image size
RUN pnpm prune --prod

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "start"]

