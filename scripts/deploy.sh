#!/bin/bash

echo "🚀 Starting EduVerse ERP Deployment..."

# Build and start services
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check health
echo "🔍 Checking service health..."
curl -f http://localhost:3001/health || exit 1
curl -f http://localhost:3000 || exit 1

echo "✅ EduVerse ERP deployed successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/health"