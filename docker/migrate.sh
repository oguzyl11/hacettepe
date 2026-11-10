#!/bin/sh
set -eu
cd /app
npx prisma generate
npx prisma migrate deploy
node docker/seed-if-empty.cjs
