# Wedding Website Deployment Guide

## Architecture
- **Frontend**: Deployed to Vercel (Next.js)
- **Backend**: Deployed to Railway (Laravel + PostgreSQL)
- **Containers**: Published to Docker Hub for distribution

## Deployment Process
1. Push to `main` branch triggers all deployments
2. Tests run automatically before deployment
3. Railway auto-provisions PostgreSQL database
4. Vercel handles frontend with global CDN
5. Docker images published to Docker Hub

## URLs
- Frontend: https://[vercel-project].vercel.app
- Backend API: https://[railway-app].railway.app/api
- Docker Images: hub.docker.com/u/[username]

## Required Secrets
All secrets are already configured:
- RAILWAY_TOKEN
- VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID  
- DOCKER_HUB_USERNAME, DOCKER_HUB_ACCESS_TOKEN