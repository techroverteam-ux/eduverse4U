# 🚀 EduVerse ERP Deployment Guide

## Production Deployment

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for development)
- PostgreSQL 15+
- Redis 7+
- Nginx (optional, for reverse proxy)

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd eduverse-erp

# Start with Docker Compose
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Manual Setup

#### 1. Database Setup
```bash
# Create PostgreSQL database
createdb eduverse
psql eduverse < docs/database-schema.sql
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run build
npm run start:prod
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with API URL
npm run build
npm start
```

### Environment Variables

#### Backend (.env)
```
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=eduverse
JWT_SECRET=your_jwt_secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Security Configuration

#### 1. JWT Secret
Generate a strong JWT secret:
```bash
openssl rand -base64 32
```

#### 2. Database Security
- Use strong passwords
- Enable SSL connections
- Restrict database access by IP

#### 3. Nginx Security
- Enable HTTPS with SSL certificates
- Configure rate limiting
- Set security headers

### Monitoring & Health Checks

#### Health Endpoints
- `GET /health` - Application health
- `GET /health/db` - Database connectivity

#### Logging
- Application logs: `logs/app.log`
- Error logs: `logs/error.log`
- Access logs: Nginx access logs

### Backup Strategy

#### Automated Backups
```bash
# Setup daily backups
chmod +x scripts/backup.sh
crontab -e
# Add: 0 2 * * * /path/to/eduverse-erp/scripts/backup.sh
```

#### Manual Backup
```bash
./scripts/backup.sh
```

### Performance Optimization

#### Database
- Enable connection pooling
- Add database indexes
- Regular VACUUM operations

#### Frontend
- Enable Nginx gzip compression
- Configure CDN for static assets
- Implement caching strategies

#### Backend
- Enable Redis caching
- Configure rate limiting
- Optimize database queries

### Scaling Considerations

#### Horizontal Scaling
- Load balancer configuration
- Database read replicas
- Redis clustering

#### Vertical Scaling
- Increase server resources
- Optimize memory usage
- Database performance tuning

### Troubleshooting

#### Common Issues
1. **Database Connection Failed**
   - Check database credentials
   - Verify network connectivity
   - Check firewall settings

2. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

3. **API Errors**
   - Check backend logs
   - Verify JWT configuration
   - Test database connectivity

#### Log Locations
- Backend: `backend/logs/`
- Frontend: Browser console
- Database: PostgreSQL logs
- Nginx: `/var/log/nginx/`

### Support & Maintenance

#### Regular Tasks
- Daily database backups
- Weekly security updates
- Monthly performance reviews
- Quarterly dependency updates

#### Monitoring Alerts
- Database connection failures
- High memory usage
- API response time degradation
- Failed authentication attempts

### Production Checklist

- [ ] Environment variables configured
- [ ] Database secured and backed up
- [ ] SSL certificates installed
- [ ] Monitoring and alerting setup
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Performance optimization applied
- [ ] Health checks working
- [ ] Documentation updated
- [ ] Team training completed