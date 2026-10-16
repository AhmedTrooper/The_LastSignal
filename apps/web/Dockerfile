# Stage 1: Dependencies with Bun
FROM oven/bun:1-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
COPY packages/data/package.json ./packages/data/
COPY apps/web/package.json ./apps/web/
RUN bun install --frozen-lockfile

# Stage 2: Builder
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN cd apps/web && bun run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat curl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "apps/web/server.js"]
