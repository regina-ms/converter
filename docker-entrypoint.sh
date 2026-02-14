#!/bin/sh
set -e

echo "→ Initializing container..."

# Папка уже создана и имеет владельца nextjs из Dockerfile
# Просто проверяем, что она существует
mkdir -p /app/uploads  # На случай если volume пустой (создаст папку от nextjs)

# === 2. ОЧИСТКА ПРИ СТАРТЕ (новое) ===
echo "→ Cleaning uploads directory on startup..."
# Удаляем всё содержимое, но не саму папку
# find с -mindepth 1 не трогает корень (/app/uploads)
find /app/uploads -mindepth 1 -delete 2>/dev/null || true
echo "✓ Uploads directory cleaned"

# === 3. ФОНОВАЯ ОЧИСТКА КАЖДЫЕ 24 ЧАСА (новое) ===
# Запускаем в фоне (через &) бесконечный цикл
(
  while true; do
    sleep 86400  # 24 часа = 86400 секунд
    echo "→ Scheduled cleanup: $(date)"
    find /app/uploads -mindepth 1 -delete 2>/dev/null || true
    echo "✓ Scheduled cleanup completed"
  done
) &
echo "✓ Background cleanup scheduled (every 24h)"

echo "✓ Uploads directory ready:"
ls -la /app | grep uploads

# === 4. ЗАПУСК ПРИЛОЖЕНИЯ ===
exec "$@"