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
    adduser -D -u 1001 -G deployer deployer

# Копируем только необходимое из этапа сборки
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Устанавливаем только продакшен-зависимости (на всякий случай)
RUN pnpm install --prod --frozen-lockfile

Создаём uploads и даём права deployer ===
RUN mkdir -p /app/uploads && chown -R deployer:deployer /app/uploads

EXPOSE 3000

CMD ["pnpm", "start"]