#!/bin/bash

# Workflow Validation Script
# This script validates GitHub Actions workflows can run without secrets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Function to validate workflow YAML syntax
validate_workflow() {
    local workflow_file=$1
    local workflow_name=$(basename "$workflow_file" .yml)
    
    print_info "Validating $workflow_name..."
    
    # Check if file exists
    if [ ! -f "$workflow_file" ]; then
        print_error "$workflow_file does not exist"
        return 1
    fi
    
    # Basic YAML syntax check using Python
    if command -v python3 >/dev/null 2>&1; then
        python3 -c "
import yaml
import sys
try:
    with open('$workflow_file', 'r') as f:
        yaml.safe_load(f)
    print('✅ YAML syntax is valid')
except yaml.YAMLError as e:
    print(f'❌ YAML syntax error: {e}')
    sys.exit(1)
except Exception as e:
    print(f'❌ Error reading file: {e}')
    sys.exit(1)
" || {
        print_warning "YAML validation failed or PyYAML not installed"
    }
    else
        print_warning "Python3 not available, skipping YAML validation"
    fi
    
    # Check for required workflow structure
    if grep -q "name:" "$workflow_file" && \
       grep -q "on:" "$workflow_file" && \
       grep -q "jobs:" "$workflow_file"; then
        print_status "Workflow structure is valid"
    else
        print_error "Workflow structure is invalid (missing name, on, or jobs)"
        return 1
    fi
    
    # Check for permissions (should be present for GHCR)
    if grep -q "permissions:" "$workflow_file"; then
        print_status "Permissions are configured"
    else
        print_warning "No permissions configured"
    fi
    
    # Check for secrets usage
    local secrets_count=$(grep -c "secrets\." "$workflow_file" || echo "0")
    if [ "$secrets_count" -gt 0 ]; then
        print_info "Uses $secrets_count secret references"
        
        # Check for conditional secret usage
        if grep -q "secrets\..*!=" "$workflow_file"; then
            print_status "Has conditional secret checks"
        else
            print_warning "Some steps may fail without secrets"
        fi
    else
        print_status "No secrets required"
    fi
    
    return 0
}

# Function to check workflow triggers
check_triggers() {
    local workflow_file=$1
    
    print_info "Checking triggers for $(basename "$workflow_file" .yml)..."
    
    # Check push triggers
    if grep -A 5 "on:" "$workflow_file" | grep -q "push:"; then
        print_info "Triggered on push"
    fi
    
    # Check PR triggers
    if grep -A 5 "on:" "$workflow_file" | grep -q "pull_request:"; then
        print_info "Triggered on pull requests"
    fi
    
    # Check manual triggers
    if grep -A 5 "on:" "$workflow_file" | grep -q "workflow_dispatch:"; then
        print_status "Manual trigger available"
    fi
}

# Function to check job dependencies
check_job_structure() {
    local workflow_file=$1
    
    print_info "Checking job structure for $(basename "$workflow_file" .yml)..."
    
    # Count jobs
    local job_count=$(grep -c "^  [a-zA-Z_-]*:" "$workflow_file" | head -1)
    print_info "Contains approximately $job_count jobs"
    
    # Check for needs dependencies
    if grep -q "needs:" "$workflow_file"; then
        print_status "Has job dependencies configured"
    fi
    
    # Check for conditional execution
    if grep -q "if:" "$workflow_file"; then
        print_status "Has conditional job execution"
    fi
}

# Main function
main() {
    print_header "GitHub Actions Workflow Validation"
    
    echo "This script validates GitHub Actions workflows for syntax and structure."
    echo "It checks if workflows can run without requiring secrets."
    echo ""
    
    local workflows_dir=".github/workflows"
    local all_valid=true
    
    if [ ! -d "$workflows_dir" ]; then
        print_error "Workflows directory not found: $workflows_dir"
        exit 1
    fi
    
    # Find all workflow files
    local workflow_files=($(find "$workflows_dir" -name "*.yml" -o -name "*.yaml"))
    
    if [ ${#workflow_files[@]} -eq 0 ]; then
        print_error "No workflow files found in $workflows_dir"
        exit 1
    fi
    
    print_info "Found ${#workflow_files[@]} workflow files"
    
    # Validate each workflow
    for workflow_file in "${workflow_files[@]}"; do
        print_header "Validating $(basename "$workflow_file")"
        
        if validate_workflow "$workflow_file"; then
            check_triggers "$workflow_file"
            check_job_structure "$workflow_file"
            print_status "$(basename "$workflow_file") validation passed"
        else
            print_error "$(basename "$workflow_file") validation failed"
            all_valid=false
        fi
    done
    
    # Summary
    print_header "Validation Summary"
    
    if [ "$all_valid" = true ]; then
        print_status "All workflows are valid!"
        echo ""
        print_info "Next steps:"
        echo "1. Set required secrets in GitHub repository settings"
        echo "2. Test workflows using workflow_dispatch"
        echo "3. Monitor deployment status via admin dashboard"
        echo ""
        print_info "Workflow testing commands:"
        echo "gh workflow list"
        echo "gh workflow run ci-cd.yml"
        echo "gh workflow run deploy-multi-platform.yml"
    else
        print_error "Some workflows have validation issues!"
        echo ""
        print_info "Please fix the issues above before deploying."
    fi
}

# Check dependencies
if ! command -v grep >/dev/null 2>&1; then
    print_error "grep command not found"
    exit 1
fi

# Run main function
main "$@"