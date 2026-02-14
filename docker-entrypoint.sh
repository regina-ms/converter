#!/bin/sh
set -e

echo "→ Initializing container..."

mkdir -p /app/uploads


echo "→ Cleaning uploads directory on startup..."
find /app/uploads -mindepth 1 -delete 2>/dev/null || true
echo "✓ Uploads directory cleaned"

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

exec "$@"