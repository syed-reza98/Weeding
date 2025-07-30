# Wedding Website Deployment Guide

## Overview
This wedding website consists of a Next.js frontend and Laravel backend with automated deployment to three platforms:

## Architecture
- **Frontend**: Next.js application deployed to Vercel with global CDN
- **Backend**: Laravel API deployed to Railway with PostgreSQL database  
- **Containers**: Docker images published to Docker Hub for distribution

## Deployment Platforms

### 1. Vercel (Frontend)
- **Automatic deployments** on push to `main` branch
- **Preview deployments** for pull requests
- **Global CDN** with edge optimization
- **Custom domain** support with automatic HTTPS

**Manual Deployment:**
```bash
cd frontend
npm run deploy:vercel     # Production deployment
npm run deploy:preview    # Preview deployment
```

### 2. Railway (Backend)
- **Automatic deployments** from root directory
- **PostgreSQL database** automatically provisioned
- **Environment variables** managed via Railway dashboard
- **Health checks** and auto-restart configured

**Required Environment Variables:**
```env
APP_KEY=<Laravel app key>
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=pgsql
```

### 3. Docker Hub (Containers)
- **Multi-platform images** (linux/amd64, linux/arm64)
- **Automatic tagging** with branch names and commit SHAs
- **Latest tag** for main branch builds

**Usage:**
```bash
docker pull syedreza98/weeding-backend:latest
docker pull syedreza98/weeding-frontend:latest
```

## CI/CD Workflows

### Main CI/CD Pipeline (`ci-cd.yml`)
- Runs tests for both frontend and backend
- Validates code quality and security
- Triggers on push to `main`/`develop` and pull requests

### Deployment Workflows
1. **`vercel-deploy.yml`** - Deploy frontend to Vercel
2. **`railway-deploy.yml`** - Deploy backend to Railway
3. **`docker-hub-deploy.yml`** - Build and push Docker images

## Deployment Process

1. **Push to `main` branch** triggers all deployments
2. **Tests run first** - deployment only proceeds if tests pass
3. **Parallel deployment** to all three platforms
4. **Health checks** verify successful deployments
5. **Automatic rollback** if health checks fail

## URLs
- **Frontend**: `https://weeding-frontend.vercel.app`
- **Backend API**: `https://weeding-backend.railway.app/api`
- **Docker Images**: `https://hub.docker.com/u/syedreza98`

## Required Secrets

All secrets are configured in GitHub repository settings:

### Railway Deployment
- `RAILWAY_TOKEN` - Railway API token

### Vercel Deployment  
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `NEXT_PUBLIC_API_URL` - Backend API URL for frontend
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key

### Docker Hub Deployment
- `DOCKER_HUB_USERNAME` - Docker Hub username
- `DOCKER_HUB_ACCESS_TOKEN` - Docker Hub access token

## Local Development

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend  
cd frontend
npm install
npm run dev
```

## Health Checks

All deployments include automated health checks:
- **Frontend**: HTTP 200 response from homepage
- **Backend**: HTTP 200 response from `/api/health` endpoint
- **Retry logic** with exponential backoff

## Monitoring

- **GitHub Actions** provides deployment status and logs
- **Vercel Dashboard** for frontend analytics and performance
- **Railway Dashboard** for backend metrics and database monitoring
- **Docker Hub** for image download statistics

## Troubleshooting

### Common Issues
1. **Vercel build fails**: Check Next.js configuration and dependencies
2. **Railway deployment fails**: Verify environment variables and database connection
3. **Docker build fails**: Check Dockerfile syntax and dependencies

### Debug Commands
```bash
# Check workflow status
gh workflow list
gh workflow view <workflow-name>

# Manual workflow triggers
gh workflow run vercel-deploy.yml
gh workflow run railway-deploy.yml
gh workflow run docker-hub-deploy.yml
```