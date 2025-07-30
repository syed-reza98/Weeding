# Wedding Website Platform - Multi-Platform Deployment Guide

This guide provides instructions for deploying the Wedding Website Platform to multiple cloud platforms.

## 🚀 Deployment Options

### 1. GitHub Container Registry (GHCR) + Docker
**Best for**: Self-hosted deployments, custom infrastructure

#### Prerequisites
- GitHub repository with packages write permission
- Docker-compatible hosting platform

#### Setup
1. Ensure `GITHUB_TOKEN` has `write:packages` permission
2. Push to `main` branch triggers automatic build
3. Images available at:
   - `ghcr.io/syed-reza98/weeding-backend:latest`
   - `ghcr.io/syed-reza98/weeding-frontend:latest`

#### Deployment
```bash
# Pull and run the containers
docker pull ghcr.io/syed-reza98/weeding-backend:latest
docker pull ghcr.io/syed-reza98/weeding-frontend:latest

# Use the provided docker-compose.yml
docker-compose --profile production up -d
```

---

### 2. Docker Hub Registry
**Best for**: Public repositories, easy distribution

#### Prerequisites
- Docker Hub account
- Repository secrets configured

#### Required Secrets
```
DOCKER_HUB_USERNAME=your_dockerhub_username
DOCKER_HUB_ACCESS_TOKEN=your_access_token
```

#### Features
- Multi-architecture builds (AMD64, ARM64)
- Automatic tagging strategy
- Public availability

---

### 3. Heroku (Backend)
**Best for**: Managed hosting, PostgreSQL integration

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Required Secrets
```
HEROKU_API_KEY=your_heroku_api_key
HEROKU_APP_NAME_BACKEND=your_backend_app_name
HEROKU_EMAIL=your_email@example.com
```

#### Setup Steps
1. Create Heroku app: `heroku create your-app-name`
2. Add PostgreSQL addon: `heroku addons:create heroku-postgresql:mini`
3. Add Redis addon: `heroku addons:create heroku-redis:mini`
4. Configure environment variables in Heroku dashboard
5. Push to `main` branch triggers deployment

#### Features
- Automatic PostgreSQL database
- Redis caching support
- Zero-downtime deployments
- Automatic SSL certificates

---

### 4. Vercel (Frontend)
**Best for**: Static site hosting, global CDN

#### Prerequisites
- Vercel account
- Vercel CLI installed

#### Required Secrets
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

#### Setup Steps
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/.next`
   - Install Command: `cd frontend && npm ci`
3. Set environment variables in Vercel dashboard

#### Features
- Global edge deployment
- Automatic preview deployments for PRs
- Built-in analytics
- Automatic HTTPS

---

### 5. Railway (Backend)
**Best for**: Modern cloud platform, automatic PostgreSQL

#### Prerequisites
- Railway account
- Railway CLI installed

#### Required Secrets
```
RAILWAY_TOKEN=your_railway_token
```

#### Setup Steps
1. Connect GitHub repository to Railway
2. Railway auto-detects Dockerfile
3. PostgreSQL database automatically provisioned
4. Environment variables auto-configured

#### Features
- Automatic PostgreSQL database
- Zero-config deployments
- Built-in monitoring
- Automatic HTTPS

---

## 🔧 Environment Configuration

### Backend Environment Variables

#### Required for All Platforms
```env
APP_NAME="Wedding Website"
APP_ENV=production
APP_KEY=base64:your_32_character_key
APP_DEBUG=false
APP_URL=https://your-domain.com
```

#### Database (Platform-specific)
```env
# For Heroku/Railway (PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=your_db_host
DB_PORT=5432
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# For Docker/Self-hosted (SQLite/MySQL)
DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite
```

#### Caching & Sessions
```env
CACHE_DRIVER=redis
SESSION_DRIVER=database
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

## 🏥 Health Checks

All deployments include health check endpoints:

- **Backend**: `GET /api/health`
- **Frontend**: `GET /` (homepage availability)

## 🔒 Security Features

- CORS configuration for production
- Security headers (X-Frame-Options, CSP, etc.)
- HTTPS enforcement
- Environment-specific debug settings

## 📊 Monitoring & Logging

Each platform provides different monitoring capabilities:

- **Heroku**: Built-in metrics, log drains
- **Vercel**: Analytics, Web Vitals
- **Railway**: Built-in metrics and logs
- **Docker**: Custom monitoring stack

## 🚨 Troubleshooting

### Common Issues

1. **GHCR Permission Errors**
   - Ensure `GITHUB_TOKEN` has `write:packages` permission
   - Verify repository package settings

2. **Database Migration Failures**
   - Check database connection parameters
   - Ensure database exists and is accessible
   - Review migration logs

3. **Frontend Build Failures**
   - Check Node.js version compatibility
   - Verify environment variables are set
   - Review build logs for missing dependencies

### Debug Commands

```bash
# Check backend health
curl https://your-backend-url.com/api/health

# Check frontend health  
curl https://your-frontend-url.com

# View Heroku logs
heroku logs --tail --app your-app-name

# View Railway logs
railway logs

# Test local Docker build
docker build -t test-backend ./backend
docker build -t test-frontend ./frontend
```

## 📝 Deployment Checklist

- [ ] Repository secrets configured
- [ ] Environment variables set
- [ ] Database provisioned
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backup strategy implemented

## 📞 Support

For deployment issues:
1. Check the GitHub Actions logs
2. Review platform-specific documentation
3. Verify environment variables
4. Test health check endpoints
5. Review application logs

---

*This deployment guide supports Laravel 11 + Next.js 14 applications with PostgreSQL/SQLite databases.*