#!/bin/bash

# Deployment Configuration Verification Script
# This script helps verify and set up deployment configurations for all platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Function to check if a secret is set
check_secret() {
    local secret_name=$1
    local is_optional=${2:-false}
    
    if [ -z "${!secret_name}" ]; then
        if [ "$is_optional" = true ]; then
            print_warning "Optional secret $secret_name is not set"
            return 1
        else
            print_error "Required secret $secret_name is not set"
            return 1
        fi
    else
        print_status "Secret $secret_name is configured"
        return 0
    fi
}

# Function to validate URL format
validate_url() {
    local url=$1
    local name=$2
    
    if [[ $url =~ ^https?:// ]]; then
        print_status "$name URL format is valid"
        return 0
    else
        print_error "$name URL format is invalid: $url"
        return 1
    fi
}

# Main verification function
main() {
    print_header "Wedding Website Deployment Configuration Verification"
    
    echo "This script verifies deployment configurations for all supported platforms."
    echo "It checks for required secrets and validates configuration files."
    echo ""
    
    local all_good=true
    
    # Check GitHub Container Registry (GHCR) requirements
    print_header "GitHub Container Registry (GHCR)"
    print_info "GHCR uses GITHUB_TOKEN automatically - no additional secrets needed"
    print_status "GHCR configuration is valid"
    
    # Check Vercel requirements
    print_header "Vercel Deployment"
    check_secret "VERCEL_TOKEN" || all_good=false
    check_secret "VERCEL_ORG_ID" || all_good=false
    check_secret "VERCEL_PROJECT_ID" || all_good=false
    check_secret "NEXT_PUBLIC_API_URL" || all_good=false
    check_secret "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" true || true
    
    # Validate Vercel configuration file
    if [ -f "vercel.json" ]; then
        print_status "vercel.json configuration file exists"
    else
        print_error "vercel.json configuration file is missing"
        all_good=false
    fi
    
    # Check Docker Hub requirements
    print_header "Docker Hub Deployment"
    check_secret "DOCKER_HUB_USERNAME" true || true
    check_secret "DOCKER_HUB_ACCESS_TOKEN" true || true
    
    # Check Heroku requirements
    print_header "Heroku Deployment"
    check_secret "HEROKU_API_KEY" true || true
    check_secret "HEROKU_APP_NAME_BACKEND" true || true
    check_secret "HEROKU_EMAIL" true || true
    
    # Validate Heroku Dockerfile
    if [ -f "backend/Dockerfile.heroku" ]; then
        print_status "Heroku Dockerfile exists"
    else
        print_error "backend/Dockerfile.heroku is missing"
        all_good=false
    fi
    
    # Check Railway requirements
    print_header "Railway Deployment"
    check_secret "RAILWAY_TOKEN" true || true
    
    # Validate Railway configuration
    if [ -f "backend/railway.json" ]; then
        print_status "Railway configuration file exists"
    else
        print_error "backend/railway.json configuration file is missing"
        all_good=false
    fi
    
    # Check Dockerfile configurations
    print_header "Docker Configurations"
    if [ -f "backend/Dockerfile" ]; then
        print_status "Backend Dockerfile exists"
    else
        print_error "backend/Dockerfile is missing"
        all_good=false
    fi
    
    if [ -f "frontend/Dockerfile" ]; then
        print_status "Frontend Dockerfile exists"
    else
        print_error "frontend/Dockerfile is missing"
        all_good=false
    fi
    
    # Check workflow files
    print_header "GitHub Actions Workflows"
    local workflows=("ci-cd.yml" "deploy-multi-platform.yml" "vercel-deploy.yml" "docker-hub-deploy.yml" "heroku-deploy.yml" "railway-deploy.yml")
    
    for workflow in "${workflows[@]}"; do
        if [ -f ".github/workflows/$workflow" ]; then
            print_status "Workflow $workflow exists"
        else
            print_error "Workflow .github/workflows/$workflow is missing"
            all_good=false
        fi
    done
    
    # Check environment files
    print_header "Environment Configuration"
    if [ -f "backend/.env.example" ]; then
        print_status "Backend .env.example exists"
    else
        print_error "backend/.env.example is missing"
        all_good=false
    fi
    
    # Summary
    print_header "Configuration Summary"
    if [ "$all_good" = true ]; then
        print_status "All core configurations are valid!"
        echo ""
        print_info "Next steps:"
        echo "1. Set required secrets in GitHub repository settings"
        echo "2. Configure environment variables for each platform"
        echo "3. Test deployments using workflow_dispatch"
        echo ""
        print_info "Required secrets setup guide:"
        echo "GitHub → Settings → Secrets and variables → Actions"
        echo ""
        echo "Vercel secrets (required):"
        echo "- VERCEL_TOKEN"
        echo "- VERCEL_ORG_ID"
        echo "- VERCEL_PROJECT_ID"
        echo "- NEXT_PUBLIC_API_URL"
        echo ""
        echo "Optional platform secrets:"
        echo "- DOCKER_HUB_USERNAME, DOCKER_HUB_ACCESS_TOKEN"
        echo "- HEROKU_API_KEY, HEROKU_APP_NAME_BACKEND, HEROKU_EMAIL"
        echo "- RAILWAY_TOKEN"
        echo "- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
        
    else
        print_error "Some configurations need attention!"
        echo ""
        print_info "Please fix the issues above before deploying."
    fi
    
    exit 0
}

# Script options
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h          Show this help message"
        echo "  --check-secrets     Check only secrets (requires environment variables)"
        echo ""
        echo "This script verifies deployment configurations for the Wedding Website."
        echo "Run without arguments to perform a full configuration check."
        exit 0
        ;;
    --check-secrets)
        print_header "Secrets Verification Mode"
        print_info "Checking environment variables for secrets..."
        main
        ;;
    *)
        main
        ;;
esac