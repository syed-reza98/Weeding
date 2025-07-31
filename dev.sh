#!/bin/bash

# Wedding Website Development Helper Script
# This script provides common development operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to show usage
show_usage() {
    echo "Wedding Website Development Helper"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  dev          Start development environment"
    echo "  prod         Start production environment (using GHCR images)"
    echo "  stop         Stop all containers"
    echo "  clean        Clean up containers and volumes"
    echo "  logs         Show logs for all services"
    echo "  status       Show status of all containers"
    echo "  backend      Show backend logs"
    echo "  frontend     Show frontend logs"
    echo "  migrate      Run database migrations"
    echo "  test         Run tests"
    echo "  build        Build local Docker images"
    echo "  pull         Pull latest GHCR images"
    echo "  help         Show this help message"
    echo ""
}

# Start development environment
start_dev() {
    print_status "Starting development environment..."
    check_docker
    docker-compose up -d
    print_success "Development environment started!"
    print_status "Backend: http://localhost:8000"
    print_status "Frontend: http://localhost:3000"
    print_status "Redis: localhost:6379"
}

# Start production environment
start_prod() {
    print_status "Starting production environment with GHCR images..."
    check_docker
    
    # First, pull latest images
    print_status "Pulling latest images from GHCR..."
    docker-compose pull backend frontend 2>/dev/null || print_warning "Could not pull GHCR images, using local if available"
    
    # Start production with nginx
    docker-compose --profile production up -d
    print_success "Production environment started!"
    print_status "Application: http://localhost"
    print_status "Backend API: http://localhost/api"
}

# Stop all containers
stop_containers() {
    print_status "Stopping all containers..."
    docker-compose --profile development --profile production down
    print_success "All containers stopped!"
}

# Clean up
clean_up() {
    print_status "Cleaning up containers, networks, and volumes..."
    docker-compose --profile development --profile production down -v --remove-orphans
    docker system prune -f
    print_success "Cleanup completed!"
}

# Show logs
show_logs() {
    print_status "Showing logs for all services..."
    docker-compose logs -f
}

# Show status
show_status() {
    print_status "Container status:"
    docker-compose ps
}

# Show backend logs
show_backend_logs() {
    print_status "Showing backend logs..."
    docker-compose logs -f backend
}

# Show frontend logs
show_frontend_logs() {
    print_status "Showing frontend logs..."
    docker-compose logs -f frontend
}

# Run migrations
run_migrations() {
    print_status "Running database migrations..."
    docker-compose exec backend php artisan migrate --force
    print_success "Migrations completed!"
}

# Run tests
run_tests() {
    print_status "Running backend tests..."
    docker-compose exec backend php artisan test
    
    print_status "Running frontend tests..."
    docker-compose exec frontend npm test
    
    print_success "All tests completed!"
}

# Build local images
build_images() {
    print_status "Building local Docker images..."
    docker-compose build
    print_success "Images built successfully!"
}

# Pull GHCR images
pull_images() {
    print_status "Pulling latest images from GHCR..."
    docker pull ghcr.io/syed-reza98/weeding/backend:latest || print_warning "Could not pull backend image"
    docker pull ghcr.io/syed-reza98/weeding/frontend:latest || print_warning "Could not pull frontend image"
    print_success "Images updated!"
}

# Main script logic
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "stop")
        stop_containers
        ;;
    "clean")
        clean_up
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "backend")
        show_backend_logs
        ;;
    "frontend")
        show_frontend_logs
        ;;
    "migrate")
        run_migrations
        ;;
    "test")
        run_tests
        ;;
    "build")
        build_images
        ;;
    "pull")
        pull_images
        ;;
    "help"|*)
        show_usage
        ;;
esac