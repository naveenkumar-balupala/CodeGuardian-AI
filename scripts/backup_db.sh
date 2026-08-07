#!/bin/bash
# ==============================================================================
# CodeGuardian AI - Automated PostgreSQL Backup Script
# Retention: 30 Days
# ==============================================================================

set -e

BACKUP_DIR="${BACKUP_DIR:-/var/backups/codeguardian}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_CONTAINER="codeguardian-postgres"
DB_USER="${POSTGRES_USER:-codeguardian}"
DB_NAME="${POSTGRES_DB:-codeguardian_db}"
BACKUP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting PostgreSQL automated backup for database: ${DB_NAME}..."

# Execute pg_dump inside running container & stream to gzip
docker exec -t "$DB_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "$BACKUP_FILE"

echo "[$(date)] Backup completed successfully: ${BACKUP_FILE}"
echo "[$(date)] Backup File Size: $(du -h "$BACKUP_FILE" | cut -f1)"

# Delete backups older than 30 days
echo "[$(date)] Cleaning up backups older than 30 days..."
find "$BACKUP_DIR" -type f -name "backup_${DB_NAME}_*.sql.gz" -mtime +30 -delete

echo "[$(date)] Database backup maintenance cycle finished cleanly."
