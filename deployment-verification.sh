#!/bin/bash

# Wedding Website Deployment Verification & Final Deployment Script
# This script validates all deployment accounts and performs final deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo ""
    echo -e "${PURPLE}===================================================${NC}"
    echo -e "${PURPLE} $1${NC}"
    echo -e "${PURPLE}===================================================${NC}"
}

print_section() {
    echo ""
    echo -e "${BLUE}➤ $1${NC}"
    echo -e "${BLUE}--------------------------------------------------${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test counter
tests_passed=0
tests_failed=0

# Function to record test result
record_test() {
    if [ "$1" = "pass" ]; then
        tests_passed=$((tests_passed + 1))
        print_success "$2"
    else
        tests_failed=$((tests_failed + 1))
        print_error "$2"
    fi
}

# Function to check if command exists
check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        record_test "pass" "$1 is installed"
        return 0
    else
        record_test "fail" "$1 is not installed"
        return 1
    fi
}

# Function to validate GitHub Container Registry setup
validate_ghcr() {
    print_section "GitHub Container Registry (GHCR) Validation"
    
    # Check if we can authenticate to GHCR
    if [ -n "$GITHUB_TOKEN" ]; then
        record_test "pass" "GITHUB_TOKEN is available"
    else
        record_test "fail" "GITHUB_TOKEN is not available"
        return 1
    fi
    
    # Check Docker availability
    if check_command "docker"; then
        # Try to authenticate
        if echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin > /dev/null 2>&1; then
            record_test "pass" "GHCR authentication successful"
        else
            record_test "fail" "GHCR authentication failed"
            return 1
        fi
    else
        return 1
    fi
    
    # Check if we can pull existing images (if any)
    if docker pull ghcr.io/syed-reza98/weeding/backend:latest > /dev/null 2>&1; then
        record_test "pass" "Backend image exists in GHCR"
    else
        print_warning "Backend image not found in GHCR (will be built during deployment)"
    fi
    
    if docker pull ghcr.io/syed-reza98/weeding/frontend:latest > /dev/null 2>&1; then
        record_test "pass" "Frontend image exists in GHCR"
    else
        print_warning "Frontend image not found in GHCR (will be built during deployment)"
    fi
}

# Function to validate Railway setup
validate_railway() {
    print_section "Railway Backend Deployment Validation"
    
    # Check Railway CLI availability
    if check_command "railway"; then
        # Check Railway token
        if [ -n "$RAILWAY_TOKEN" ]; then
            record_test "pass" "RAILWAY_TOKEN is available"
            
            # Test Railway authentication
            if railway whoami > /dev/null 2>&1; then
                record_test "pass" "Railway authentication successful"
                
                # Check project status
                if railway status > /dev/null 2>&1; then
                    record_test "pass" "Railway project access confirmed"
                    
                    # Get project info
                    PROJECT_INFO=$(railway status --json 2>/dev/null | jq -r '.name // "unknown"' 2>/dev/null || echo "unknown")
                    print_status "Connected to Railway project: $PROJECT_INFO"
                else
                    record_test "fail" "Cannot access Railway project"
                fi
            else
                record_test "fail" "Railway authentication failed"
            fi
        else
            record_test "fail" "RAILWAY_TOKEN is not available"
        fi
    else
        print_warning "Railway CLI not installed, installing..."
        curl -fsSL https://railway.app/install.sh | sh
        export PATH="$HOME/.railway/bin:$PATH"
        
        if check_command "railway"; then
            validate_railway
        else
            record_test "fail" "Failed to install Railway CLI"
        fi
    fi
}

# Function to validate Vercel setup
validate_vercel() {
    print_section "Vercel Frontend Deployment Validation"
    
    # Check Vercel CLI availability
    if check_command "vercel"; then
        # Check Vercel token
        if [ -n "$VERCEL_TOKEN" ]; then
            record_test "pass" "VERCEL_TOKEN is available"
            
            # Test Vercel authentication
            if vercel whoami --token="$VERCEL_TOKEN" > /dev/null 2>&1; then
                record_test "pass" "Vercel authentication successful"
                
                # Check project configuration
                if [ -n "$VERCEL_ORG_ID" ] && [ -n "$VERCEL_PROJECT_ID" ]; then
                    record_test "pass" "Vercel project configuration available"
                    print_status "Vercel Org ID: $VERCEL_ORG_ID"
                    print_status "Vercel Project ID: $VERCEL_PROJECT_ID"
                else
                    record_test "fail" "Vercel project configuration incomplete"
                fi
            else
                record_test "fail" "Vercel authentication failed"
            fi
        else
            record_test "fail" "VERCEL_TOKEN is not available"
        fi
    else
        print_warning "Vercel CLI not installed, installing..."
        npm install --global vercel@latest
        
        if check_command "vercel"; then
            validate_vercel
        else
            record_test "fail" "Failed to install Vercel CLI"
        fi
    fi
}

# Function to test Docker builds locally
test_docker_builds() {
    print_section "Docker Build Validation"
    
    # Test backend Docker build
    print_status "Testing backend Docker build..."
    if docker build -t wedding-backend-test ./backend > /dev/null 2>&1; then
        record_test "pass" "Backend Docker build successful"
        docker rmi wedding-backend-test > /dev/null 2>&1 || true
    else
        record_test "fail" "Backend Docker build failed"
    fi
    
    # Test frontend Docker build
    print_status "Testing frontend Docker build..."
    if docker build -t wedding-frontend-test ./frontend > /dev/null 2>&1; then
        record_test "pass" "Frontend Docker build successful"
        docker rmi wedding-frontend-test > /dev/null 2>&1 || true
    else
        record_test "fail" "Frontend Docker build failed"
    fi
}

# Function to validate workflow files
validate_workflows() {
    print_section "GitHub Actions Workflow Validation"
    
    # Check if all required workflow files exist
    workflows=(
        ".github/workflows/ci-cd.yml"
        ".github/workflows/deploy-production.yml"
        ".github/workflows/ghcr-build.yml"
        ".github/workflows/railway-deploy.yml"
        ".github/workflows/vercel-deploy.yml"
    )
    
    for workflow in "${workflows[@]}"; do
        if [ -f "$workflow" ]; then
            record_test "pass" "Workflow exists: $workflow"
        else
            record_test "fail" "Workflow missing: $workflow"
        fi
    done
    
    # Validate workflow syntax (basic YAML check)
    for workflow in "${workflows[@]}"; do
        if [ -f "$workflow" ]; then
            if python3 -c "import yaml; yaml.safe_load(open('$workflow'))" > /dev/null 2>&1; then
                record_test "pass" "Workflow syntax valid: $workflow"
            else
                record_test "fail" "Workflow syntax invalid: $workflow"
            fi
        fi
    done
}

# Function to check environment configuration
check_environment() {
    print_section "Environment Configuration Check"
    
    # Check backend .env.example
    if [ -f "backend/.env.example" ]; then
        record_test "pass" "Backend .env.example exists"
    else
        record_test "fail" "Backend .env.example missing"
    fi
    
    # Check frontend package.json
    if [ -f "frontend/package.json" ]; then
        record_test "pass" "Frontend package.json exists"
        
        # Check for required scripts
        if grep -q '"build"' frontend/package.json; then
            record_test "pass" "Frontend build script exists"
        else
            record_test "fail" "Frontend build script missing"
        fi
    else
        record_test "fail" "Frontend package.json missing"
    fi
    
    # Check Docker configurations
    if [ -f "docker-compose.yml" ]; then
        record_test "pass" "docker-compose.yml exists"
    else
        record_test "fail" "docker-compose.yml missing"
    fi
    
    # Check Railway configuration
    if [ -f "railway.toml" ]; then
        record_test "pass" "railway.toml exists"
    else
        record_test "fail" "railway.toml missing"
    fi
}

# Function to perform final deployment
perform_deployment() {
    print_section "Final Deployment Execution"
    
    if [ "$tests_failed" -gt 0 ]; then
        print_error "Cannot proceed with deployment due to failed validations"
        return 1
    fi
    
    print_status "All validations passed. Proceeding with deployment..."
    
    # Trigger the main deployment workflow
    print_status "Triggering production deployment pipeline..."
    
    # Check if we can trigger workflow via GitHub CLI
    if command -v gh >/dev/null 2>&1; then
        if gh workflow run "deploy-production.yml" --field force_deploy=false > /dev/null 2>&1; then
            record_test "pass" "Production deployment workflow triggered"
            print_status "Monitor deployment progress at: https://github.com/syed-reza98/Weeding/actions"
        else
            print_warning "Could not trigger workflow via CLI. Please trigger manually."
        fi
    else
        print_warning "GitHub CLI not available. Please trigger deployment manually via GitHub Actions UI."
    fi
}

# Function to display final report
display_report() {
    print_header "DEPLOYMENT VERIFICATION REPORT"
    
    echo -e "${BLUE}Tests Passed:${NC} ${GREEN}$tests_passed${NC}"
    echo -e "${BLUE}Tests Failed:${NC} ${RED}$tests_failed${NC}"
    echo -e "${BLUE}Total Tests:${NC} $((tests_passed + tests_failed))"
    
    if [ "$tests_failed" -eq 0 ]; then
        echo ""
        print_success "✅ All validations passed! Deployment ready."
        echo ""
        echo -e "${GREEN}🚀 Next Steps:${NC}"
        echo "1. Monitor deployment at: https://github.com/syed-reza98/Weeding/actions"
        echo "2. Backend will be deployed to Railway"
        echo "3. Frontend will be deployed to Vercel"
        echo "4. Full stack validation will be performed"
        echo ""
        echo -e "${GREEN}📱 Expected URLs:${NC}"
        echo "- Backend API: https://weeding-backend-production.up.railway.app"
        echo "- Frontend App: https://[project-name].vercel.app"
    else
        echo ""
        print_error "❌ Some validations failed. Please address issues before deployment."
        echo ""
        echo -e "${RED}🔧 Required Actions:${NC}"
        if [ -z "$GITHUB_TOKEN" ]; then
            echo "- Set GITHUB_TOKEN environment variable"
        fi
        if [ -z "$RAILWAY_TOKEN" ]; then
            echo "- Set RAILWAY_TOKEN environment variable"
        fi
        if [ -z "$VERCEL_TOKEN" ]; then
            echo "- Set VERCEL_TOKEN environment variable"
        fi
        if [ -z "$VERCEL_ORG_ID" ] || [ -z "$VERCEL_PROJECT_ID" ]; then
            echo "- Set VERCEL_ORG_ID and VERCEL_PROJECT_ID environment variables"
        fi
    fi
    
    echo ""
    print_header "DEPLOYMENT ACCOUNTS SUMMARY"
    echo ""
    echo -e "${BLUE}🐙 GitHub Container Registry (GHCR):${NC}"
    echo "   • Registry: ghcr.io/syed-reza98/weeding"
    echo "   • Authentication: GitHub Token"
    echo "   • Backend Image: ghcr.io/syed-reza98/weeding/backend:latest"
    echo "   • Frontend Image: ghcr.io/syed-reza98/weeding/frontend:latest"
    echo ""
    echo -e "${BLUE}🚂 Railway (Backend):${NC}"
    echo "   • Platform: Railway"
    echo "   • Project ID: aa657bf5-3950-4119-b82e-d42bf3d5607b"
    echo "   • Service ID: c1031165-c408-45e4-8f1f-c5ce86ad6639"
    echo "   • Expected URL: https://weeding-backend-production.up.railway.app"
    echo ""
    echo -e "${BLUE}⚡ Vercel (Frontend):${NC}"
    echo "   • Platform: Vercel"
    echo "   • Framework: Next.js"
    echo "   • Auto-deploy: Enabled"
    echo "   • Backend Integration: Configured"
}

# Main execution
main() {
    print_header "WEDDING WEBSITE DEPLOYMENT VERIFICATION"
    
    print_status "Starting comprehensive deployment validation..."
    print_status "This script will validate all deployment accounts and configurations."
    
    # Check prerequisites
    check_command "git"
    check_command "docker"
    check_command "node"
    check_command "npm"
    
    # Load environment variables if available
    if [ -f ".env" ]; then
        export $(grep -v '^#' .env | xargs) 2>/dev/null || true
    fi
    
    # Run all validations
    validate_ghcr
    validate_railway
    validate_vercel
    test_docker_builds
    validate_workflows
    check_environment
    
    # Perform deployment if all tests pass
    perform_deployment
    
    # Display final report
    display_report
}

# Run main function
main "$@"