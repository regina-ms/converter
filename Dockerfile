FROM node:24.12.0-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# === ДОБАВЛЕНО: Создание папки на этапе сборки (fallback) ===
# Папка создаётся здесь на случай, если volume не примонтирован
# Но права будут перезаписаны при старте через entrypoint
RUN mkdir -p /app/uploads

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# === ДОБАВЛЕНО: Копирование entrypoint скрипта ===
# Этот скрипт выполняется при КАЖДОМ старте контейнера
# и гарантирует, что папка uploads создана с правильными правами
COPY --chmod=755 docker-entrypoint.sh /usr/local/bin/

# === МЕНЯЕМ ВЛАДЕЛЬЦА ПАПКИ НА nextjs (пока ещё root) ===
# Это критично: chown работает только от root
RUN chown -R nextjs:nodejs /app/uploads

USER nextjs

# === ИЗМЕНЕНО: Используем entrypoint вместо прямого запуска ===
# ENTRYPOINT выполняется всегда, даже при перезапуске контейнера
# CMD передаётся как аргумент в ENTRYPOINT
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]