# Этап 1: Сборка
FROM node:24-alpine AS builder

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

WORKDIR /app

# Копируем файлы зависимостей (pnpm использует pnpm-lock.yaml)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Копируем весь код
COPY . .

# Собираем Next.js приложение
RUN pnpm build

# Этап 2: Продакшен-образ
FROM node:24-alpine AS runner

# Устанавливаем pnpm и в продакшене
RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Создаём пользователя deployer ===
RUN addgroup -g 1002 deployer && \
    adduser -D -u 1001 -G deployer deployer \

RUN chown deployer:deployer .

COPY --from=builder --chown=deployer:deployer /app/public ./public
COPY --from=builder --chown=deployer:deployer /app/.next/standalone ./
COPY --from=builder --chown=deployer:deployer /app/.next/static ./.next/static
COPY --from=builder --chown=deployer:deployer /app/node_modules ./node_modules

RUN mkdir -p /app/uploads
RUN chown deployer:deployer /app/uploads

EXPOSE 3000

# Переключаемся на пользователя deployer ===
USER deployer

CMD node server.js