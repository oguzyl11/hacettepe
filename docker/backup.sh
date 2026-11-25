#!/bin/sh
set -eu
stamp=$(date +%Y%m%d-%H%M%S)
mkdir -p backups
docker compose exec -T db pg_dump -U hacettepe -d hacettepe > "backups/hacettepe-${stamp}.sql"
echo "Wrote backups/hacettepe-${stamp}.sql"
