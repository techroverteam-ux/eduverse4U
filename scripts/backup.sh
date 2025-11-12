#!/bin/bash

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="eduverse_backup_$DATE.sql"

echo "📦 Creating EduVerse database backup..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
docker-compose exec -T postgres pg_dump -U postgres eduverse > "$BACKUP_DIR/$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_DIR/$BACKUP_FILE"

echo "✅ Backup created: $BACKUP_DIR/$BACKUP_FILE.gz"

# Keep only last 7 backups
find $BACKUP_DIR -name "*.gz" -type f -mtime +7 -delete

echo "🧹 Old backups cleaned up"