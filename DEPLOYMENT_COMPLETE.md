# 🚀 Wedding Website - Complete Deployment Guide

This comprehensive guide covers deploying the Wedding Website Platform to multiple cloud platforms with proper configuration, monitoring, and best practices.

## 📋 Prerequisites

Before starting the deployment process:

1. **GitHub Repository**: Ensure you have push access to the repository
2. **Secrets Configuration**: Required secrets must be set in GitHub repository settings
3. **Platform Accounts**: Create accounts on target platforms (Vercel, Heroku, Railway, Docker Hub)
4. **Domain Setup**: Configure custom domains if required

## 🔧 Quick Setup

### 1. Configuration Verification

Run the deployment configuration script to verify your setup:

```bash
# Verify all configurations
./scripts/deployment-config.sh

# Check specific aspects
./scripts/deployment-config.sh --help
```

### 2. Required GitHub Secrets

Navigate to `GitHub Repository > Settings > Secrets and variables > Actions` and add:

#### Core Secrets (Required)
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

#### Optional Platform Secrets
```
# Docker Hub
DOCKER_HUB_USERNAME=your_username
DOCKER_HUB_ACCESS_TOKEN=your_token

# Heroku
HEROKU_API_KEY=your_api_key
HEROKU_APP_NAME_BACKEND=your-app-name
HEROKU_EMAIL=your@email.com

# Railway
RAILWAY_TOKEN=your_token

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
```

## 🌐 Platform-Specific Deployment

### Vercel (Frontend) - Primary
**Recommended for**: Frontend hosting with global CDN

#### Features
- ✅ Automatic deployments from GitHub
- ✅ Edge functions and global CDN
- ✅ Preview deployments for pull requests
- ✅ Custom domain support
- ✅ Automatic HTTPS

#### Setup Steps
1. **Vercel Account**: Create account at [vercel.com](https://vercel.com)
2. **CLI Installation**: `npm install -g vercel`
3. **Login**: `vercel login`
4. **Project Setup**: `vercel link`
5. **Get IDs**: 
   ```bash
   vercel --cwd frontend
   # Note the project ID and org ID from output
   ```

#### Environment Variables
Set in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
```

### GitHub Container Registry (GHCR)
**Recommended for**: Container distribution and private deployments

#### Features
- ✅ Automatic builds with GitHub Actions
- ✅ Multi-architecture support (AMD64, ARM64)
- ✅ Integrated with GitHub permissions
- ✅ Free for public repositories

#### Setup Steps
1. **Enable Packages**: Repository Settings > General > Features > Packages
2. **Permissions**: Ensured in workflow files (already configured)
3. **Access**: Images available at `ghcr.io/syed-reza98/weeding-backend:latest`

#### Usage
```bash
# Pull images
docker pull ghcr.io/syed-reza98/weeding-backend:latest
docker pull ghcr.io/syed-reza98/weeding-frontend:latest

# Run with docker-compose
docker-compose --profile production up -d
```

### Heroku (Backend)
**Recommended for**: Quick backend deployment with managed PostgreSQL

#### Features
- ✅ Managed PostgreSQL database
- ✅ Automatic SSL certificates
- ✅ Easy scaling and monitoring
- ✅ Add-on ecosystem

#### Setup Steps
1. **Create App**: [dashboard.heroku.com](https://dashboard.heroku.com)
2. **Add Database**: Resources > Add-ons > Heroku Postgres
3. **Configure Variables**: Settings > Config Vars
   ```
   APP_KEY=your_generated_key
   APP_ENV=production
   APP_DEBUG=false
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

#### Deployment
Automatic via GitHub Actions when secrets are configured.

### Railway (Backend Alternative)
**Recommended for**: Modern backend hosting with auto-scaling

#### Features
- ✅ Automatic PostgreSQL and Redis
- ✅ Zero-downtime deployments
- ✅ Built-in monitoring
- ✅ Git-based deployments

#### Setup Steps
1. **Create Project**: [railway.app](https://railway.app)
2. **Connect GitHub**: Link repository
3. **Configure Variables**: Environment variables auto-set
4. **Custom Domain**: Add domain in settings

### Docker Hub (Public Distribution)
**Recommended for**: Public container distribution

#### Features
- ✅ Multi-architecture builds
- ✅ Automated builds
- ✅ Public availability
- ✅ Docker official registry

#### Setup Steps
1. **Docker Hub Account**: [hub.docker.com](https://hub.docker.com)
2. **Access Token**: Account Settings > Security > New Access Token
3. **Repository**: Create repositories for backend/frontend

## 🔄 Deployment Workflows

### Automatic Deployments
All platforms support automatic deployments:

- **Push to `main`**: Triggers production deployment
- **Pull Requests**: Creates preview deployments (Vercel)
- **Manual Trigger**: Use GitHub Actions workflow_dispatch

### Manual Deployment
```bash
# Trigger specific platform deployment
gh workflow run deploy-multi-platform.yml -f deploy_target=vercel
gh workflow run deploy-multi-platform.yml -f deploy_target=heroku
gh workflow run deploy-multi-platform.yml -f deploy_target=railway
```

### Rollback Strategy
```bash
# Heroku rollback
heroku rollback --app your-app-name

# Railway rollback
railway rollback

# Vercel automatic rollback on build failure
```

## 📊 Monitoring and Health Checks

### Health Check Endpoints
- **Backend**: `https://your-backend.com/api/health`
- **Frontend**: `https://your-frontend.com/api/health`

### Deployment Dashboard
Access the deployment dashboard at `/admin` (requires login):
- Real-time platform status
- Health check monitoring
- Quick action links
- Deployment history

### Status Monitoring
```bash
# Check all platform status
curl -s https://your-backend.herokuapp.com/api/health
curl -s https://your-frontend.vercel.app/api/health

# Monitor with deployment script
./scripts/deployment-config.sh --check-secrets
```

## 🔒 Security Best Practices

### Environment Variables
- ✅ Never commit secrets to repository
- ✅ Use platform-specific environment management
- ✅ Rotate API keys regularly
- ✅ Use HTTPS-only in production

### CORS Configuration
```env
# Production CORS settings
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
CORS_SUPPORTS_CREDENTIALS=true
SESSION_SECURE_COOKIE=true
```

### Security Headers
All platforms configured with:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check logs
gh workflow view --repo syed-reza98/Weeding

# Local testing
npm run build  # Frontend
php artisan config:cache  # Backend
```

#### Database Connection Issues
```bash
# Heroku
heroku logs --tail --app your-app-name
heroku pg:info --app your-app-name

# Railway
railway logs
railway status
```

#### CORS Errors
1. Verify `CORS_ALLOWED_ORIGINS` includes frontend domain
2. Check `SANCTUM_STATEFUL_DOMAINS` configuration
3. Ensure `SESSION_DOMAIN` is correct

### Getting Help

1. **Logs**: Check platform-specific logs
2. **Health Checks**: Verify endpoint responses
3. **GitHub Actions**: Review workflow run details
4. **Platform Status**: Check platform status pages

## 📈 Performance Optimization

### Frontend (Vercel)
- ✅ Edge CDN distribution
- ✅ Automatic image optimization
- ✅ Static generation where possible
- ✅ Code splitting and lazy loading

### Backend (Heroku/Railway)
- ✅ OPcache enabled
- ✅ Database query optimization
- ✅ Redis caching
- ✅ Gzip compression

### Container Optimization
- ✅ Multi-stage builds
- ✅ Alpine Linux base images
- ✅ Layer caching optimization
- ✅ Security scanning

## 🔄 CI/CD Pipeline

### Workflow Stages
1. **Test**: Run tests for backend and frontend
2. **Build**: Create optimized production builds
3. **Security**: Scan containers for vulnerabilities
4. **Deploy**: Deploy to selected platforms
5. **Verify**: Run health checks post-deployment

### Quality Gates
- ✅ All tests must pass
- ✅ Code linting and formatting
- ✅ Security vulnerability scanning
- ✅ Health check verification

## 📝 Maintenance

### Regular Tasks
- **Weekly**: Review deployment logs and performance
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and rotate API keys
- **As needed**: Scale resources based on usage

### Backup Strategy
- **Database**: Automated backups on Heroku/Railway
- **Media Files**: S3/CloudFlare R2 backup
- **Code**: Git repository with branch protection

---

## 🚀 Quick Start Commands

```bash
# Full deployment verification
./scripts/deployment-config.sh

# Build and test locally
cd frontend && npm run build
cd backend && php artisan test

# Deploy to all platforms
git push origin main

# Deploy to specific platform
gh workflow run deploy-multi-platform.yml -f deploy_target=vercel
```

## 📞 Support

For deployment issues:
1. Check this documentation
2. Review platform-specific logs
3. Use the deployment dashboard for real-time status
4. Check GitHub Actions workflow runs

---

*Last updated: $(date)*
*Version: 2.0*