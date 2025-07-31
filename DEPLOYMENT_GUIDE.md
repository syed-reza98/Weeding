# Wedding Website Deployment Guide

## 🚀 Deployment Architecture Overview

This project implements a modern, containerized deployment pipeline using:

- **🧪 GitHub Actions** - CI/CD automation
- **📦 GHCR (GitHub Container Registry)** - Container image storage
- **🚂 Railway** - Backend deployment platform
- **⚡ Vercel** - Frontend deployment platform

## 📋 Sequential Deployment Pipeline

The deployment follows this exact order to ensure reliability:

### 1. **Tests & Quality Checks** 🧪
- Runs Laravel backend tests
- Runs Next.js frontend tests
- Linting and code quality validation
- **Trigger**: Push to `main` branch or manual workflow dispatch

### 2. **Container Build & Push** 📦
- Builds Docker images for backend and frontend
- Pushes to GitHub Container Registry (GHCR)
- Multi-architecture support (AMD64, ARM64)
- **Depends on**: Tests passing

### 3. **Backend Deployment** 🚂
- Deploys backend to Railway using GHCR image
- Runs database migrations
- Health checks and validation
- **Depends on**: Container build success

### 4. **Frontend Deployment** ⚡
- Deploys frontend to Vercel
- Configures backend API URL automatically
- Environment-specific builds
- **Depends on**: Backend deployment success

### 5. **Full Stack Validation** ✅
- Tests backend API endpoints
- Validates frontend accessibility
- Confirms frontend-backend connectivity
- **Depends on**: Both deployments success

## 🔧 Configuration Requirements

### GitHub Secrets
Configure these secrets in your GitHub repository:

#### Railway (Backend)
```
RAILWAY_TOKEN=your_railway_token
```

#### Vercel (Frontend)
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
```

#### GHCR (Automatic)
- Uses `GITHUB_TOKEN` (automatically provided)
- Requires `packages: write` permission

### Railway Configuration
1. Create a new Railway project
2. Connect to this repository
3. Set the service to use `backend/Dockerfile`
4. Configure environment variables:
   ```
   APP_ENV=production
   APP_DEBUG=false
   ```

### Vercel Configuration
1. Import this repository to Vercel
2. Set framework preset to "Next.js"
3. Set root directory to `frontend`
4. Configure environment variables

## 📚 Workflow Files

### Main Orchestration
- **`deploy-production.yml`** - Main deployment pipeline

### Individual Components
- **`ci-cd.yml`** - Tests and quality checks
- **`ghcr-build.yml`** - Container builds
- **`railway-deploy.yml`** - Backend deployment
- **`vercel-deploy.yml`** - Frontend deployment

## 🐳 Container Usage

### Production (GHCR Images)
```bash
# Pull latest images
docker pull ghcr.io/syed-reza98/weeding/backend:latest
docker pull ghcr.io/syed-reza98/weeding/frontend:latest

# Run with docker-compose (default profile)
docker-compose up -d
```

### Development (Local Builds)
```bash
# Run development environment
docker-compose --profile development up -d

# Access services
# Backend: http://localhost:8001
# Frontend: http://localhost:3001
```

### Production with Nginx
```bash
# Run full production stack
docker-compose --profile production up -d

# Access through Nginx
# Frontend: http://localhost
# Backend API: http://localhost/api
```

## 🔍 Monitoring & Health Checks

### Automated Health Checks
- **Backend**: `/api/health` endpoint
- **Frontend**: Root URL accessibility
- **Full Stack**: Cross-service connectivity

### Manual Validation
```bash
# Check backend health
curl https://your-railway-url/api/health

# Check frontend
curl https://your-vercel-url

# Check API connectivity
curl https://your-railway-url/api
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Container Build Failures
- Check Dockerfile syntax
- Verify dependency installation
- Review GitHub Actions logs

#### 2. Railway Deployment Issues
- Verify Railway token validity
- Check service configuration
- Review Railway logs in dashboard

#### 3. Vercel Deployment Issues
- Verify Vercel token and project ID
- Check environment variables
- Review build logs

#### 4. Frontend-Backend Connectivity
- Ensure backend URL is correctly configured
- Check CORS settings
- Verify API endpoints

### Debug Commands
```bash
# Check Railway status
railway status

# View Railway logs
railway logs --tail 100

# Test local Docker setup
docker-compose --profile development up

# Validate GHCR authentication
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

## 📈 Performance & Scaling

### Railway (Backend)
- Automatic scaling based on traffic
- Built-in PostgreSQL database
- Redis caching available
- Monitoring and metrics dashboard

### Vercel (Frontend)
- Global CDN deployment
- Edge functions support
- Automatic HTTPS
- Performance monitoring

### GHCR (Container Registry)
- Automatic cleanup policies
- Multi-architecture support
- Integration with GitHub Security

## 🔄 Development Workflow

### For Feature Development
1. Create feature branch
2. Push changes triggers preview deployment
3. Automatic PR comments with preview URLs
4. Merge to `main` triggers full production deployment

### For Hotfixes
1. Use `workflow_dispatch` for manual deployment
2. Option to force deploy even if tests fail
3. Real-time deployment status in GitHub Actions

## 📋 Maintenance

### Regular Tasks
- Monitor GitHub Actions usage
- Review GHCR storage usage
- Update dependencies in Dockerfiles
- Review Railway and Vercel logs

### Updates
- Container images update automatically on push to `main`
- Vercel deployments update automatically
- Railway deployments trigger on container updates

## 🏗️ Migration from Docker Hub

This setup has completely replaced Docker Hub with GHCR:

### Removed
- ❌ Docker Hub credentials
- ❌ Docker Hub deployment workflow
- ❌ Docker Hub image references

### Added
- ✅ GHCR authentication (via GitHub token)
- ✅ GHCR image builds and storage
- ✅ Sequential deployment pipeline
- ✅ Enhanced monitoring and validation

### Benefits
- 🔒 Better security (no external credentials)
- 📦 Integrated with GitHub ecosystem
- 🚀 Faster build times (same infrastructure)
- 💰 No additional costs for private repositories