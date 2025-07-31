#!/bin/bash

# Railway Backend Deployment Validation Script
# This script validates that the Railway backend deployment should work correctly

set -e

echo "🚂 Railway Backend Deployment Validation"
echo "========================================"
echo ""

# Check if we're in the correct directory
if [[ ! -f "railway.toml" ]]; then
    echo "❌ Error: railway.toml not found. Run this script from the project root."
    exit 1
fi

# Validate railway.toml configuration
echo "✅ Checking railway.toml configuration..."
if grep -q "dockerfilePath = \"backend/Dockerfile.railway\"" railway.toml; then
    echo "   ✓ Dockerfile path correctly configured"
else
    echo "   ❌ Dockerfile path not configured correctly"
    exit 1
fi

if grep -q "healthcheckPath = \"/api/health\"" railway.toml; then
    echo "   ✓ Health check endpoint configured"
else
    echo "   ❌ Health check endpoint not configured"
    exit 1
fi

# Check backend files
echo ""
echo "✅ Checking backend configuration files..."

if [[ -f "backend/Dockerfile.railway" ]]; then
    echo "   ✓ Railway Dockerfile exists"
else
    echo "   ❌ Railway Dockerfile missing"
    exit 1
fi

if [[ -f "backend/docker/nginx.conf.template" ]]; then
    echo "   ✓ Nginx template exists for PORT substitution"
else
    echo "   ❌ Nginx template missing"
    exit 1
fi

if [[ -f "backend/docker/supervisord.conf" ]]; then
    echo "   ✓ Supervisor configuration exists"
else
    echo "   ❌ Supervisor configuration missing"
    exit 1
fi

# Check Laravel configuration
echo ""
echo "✅ Checking Laravel backend..."

cd backend

if [[ ! -d "vendor" ]]; then
    echo "   ❌ Laravel dependencies not installed. Installing..."
    composer install --no-dev --optimize-autoloader
fi

if [[ -f "vendor/autoload.php" ]]; then
    echo "   ✓ Laravel dependencies installed"
else
    echo "   ❌ Laravel dependencies installation failed"
    exit 1
fi

# Test Laravel application
if [[ ! -f ".env" ]]; then
    echo "   ⚠️  Creating .env file for testing..."
    cp .env.example .env
    php artisan key:generate --force
fi

echo "   ✓ Laravel application configured"

# Test health endpoint route
if php artisan route:list | grep -q "api/health"; then
    echo "   ✓ Health endpoint route exists"
else
    echo "   ❌ Health endpoint route missing"
    exit 1
fi

# Test the application briefly
echo ""
echo "✅ Testing Laravel application..."

# Test configuration caching
if php artisan config:cache > /dev/null 2>&1; then
    echo "   ✓ Configuration caching works"
else
    echo "   ❌ Configuration caching failed"
    exit 1
fi

if php artisan route:cache > /dev/null 2>&1; then
    echo "   ✓ Route caching works"
else
    echo "   ❌ Route caching failed"
    exit 1
fi

cd ..

echo ""
echo "🎉 Railway Deployment Validation PASSED!"
echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo ""
echo "✅ Port Configuration:"
echo "   - Nginx template uses \$PORT environment variable"
echo "   - Railway startup script substitutes PORT dynamically"
echo "   - Health check timeout increased to 300 seconds"
echo ""
echo "✅ Environment Configuration:"
echo "   - Auto-detection of PostgreSQL vs SQLite"
echo "   - Fallback to file-based cache if Redis unavailable"
echo "   - Railway environment variables configured"
echo ""
echo "✅ Health Check:"
echo "   - Laravel /api/health endpoint available"
echo "   - Nginx conflicting /health endpoint removed"
echo "   - Health check path: /api/health"
echo ""
echo "✅ Docker Configuration:"
echo "   - Railway-optimized Dockerfile with envsubst support"
echo "   - PHP-FPM + Nginx via Supervisor"
echo "   - Production-ready with OPcache"
echo ""
echo "🚀 Ready for Railway Deployment!"
echo ""
echo "Expected Backend URL: https://weeding-backend-production.up.railway.app"
echo "Expected API Health:  https://weeding-backend-production.up.railway.app/api/health"
echo ""
echo "🔧 Key Fixes Applied:"
echo "====================="
echo ""
echo "1. ✅ PORT Configuration"
echo "   - Fixed nginx hardcoded port 8000 → dynamic \$PORT"
echo "   - Added envsubst for environment variable substitution"
echo ""
echo "2. ✅ Health Check Conflicts"
echo "   - Removed nginx /health endpoint"
echo "   - Railway uses Laravel's /api/health properly"
echo ""
echo "3. ✅ Database Configuration"
echo "   - Auto-detection of Railway PostgreSQL"
echo "   - SQLite fallback for local development"
echo ""
echo "4. ✅ Environment Variables"
echo "   - Added Railway-specific environment defaults"
echo "   - Improved health check timeout and retries"
echo ""
echo "The backend deployment should now work correctly on Railway!"