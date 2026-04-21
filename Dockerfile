# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and lockfile first for caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js app for production
RUN npm run build

# ---------- RUNTIME STAGE ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./

# Expose port Next.js listens on
EXPOSE 3000

# Start the server
ENV NODE_ENV=production
CMD ["npm", "run", "start"]