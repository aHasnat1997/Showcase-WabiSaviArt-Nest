# ================================================================
# Stage 1: Builder
# ================================================================
FROM oven/bun:1 AS builder

WORKDIR /app

# Node.js + npm are required to build the admin-dashboard (Vite)
RUN apt-get update && apt-get install -y --no-install-recommends nodejs npm \
    && rm -rf /var/lib/apt/lists/*

# ── Backend dependencies ──────────────────────────────────────
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# ── Admin dashboard dependencies ─────────────────────────────
COPY admin-dashboard/package.json admin-dashboard/bun.lock* ./admin-dashboard/
RUN --mount=type=cache,target=/root/.npm \
    cd admin-dashboard && npm install --legacy-peer-deps

# ── Full source tree ──────────────────────────────────────────
COPY . .

# ── Generate Prisma client (reads prisma.config.ts) ──────────
# DATABASE_URL is required by prisma.config.ts at load time but no
# real DB is needed during code generation — a dummy URL is enough.
RUN DATABASE_URL="postgresql://dummy:dummy@localhost/dummy" \
    ./node_modules/.bin/prisma generate

# ── Compile NestJS TypeScript → dist/ ────────────────────────
RUN ./node_modules/.bin/nest build

# ── Build admin dashboard (Vite → admin-dashboard/dist/) ─────
RUN cd admin-dashboard && npm run build

# ================================================================
# Stage 2: Production
# ================================================================
FROM oven/bun:1 AS production

WORKDIR /app

ENV NODE_ENV=production

# ── Non-root user — created BEFORE any COPY so --chown works ─
RUN groupadd --system --gid 1001 appgroup \
    && useradd --system --uid 1001 --gid appgroup --no-create-home appuser

# Each COPY carries its own ownership — no expensive chown -R walk
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/src/view ./src/view
COPY --from=builder --chown=appuser:appgroup /app/admin-dashboard/dist ./admin-dashboard/dist
COPY --from=builder --chown=appuser:appgroup /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma
COPY --from=builder --chown=appuser:appgroup /app/prisma.config.ts ./
COPY --from=builder --chown=appuser:appgroup /app/package.json ./
COPY --chmod=755 --chown=appuser:appgroup entrypoint.sh ./entrypoint.sh

USER appuser

EXPOSE 8080

ENTRYPOINT ["/app/entrypoint.sh"]
