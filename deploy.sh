#!/bin/bash

##############################################################################
# Queue Management System - Deployment Script
# 
# This script deploys the application from git repo to production.
# 
# Usage:
#   ./deploy.sh              - Full deployment
#   ./deploy.sh --skip-build - Skip build (config changes only)
#   ./deploy.sh --backup     - Create backup before deploying
#
# Directories:
#   Source: /root/project/queue-management-system (git repo)
#   Target: /var/www/qms (production)
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
GIT_REPO_DIR="/root/project/queue-management-system"
DEPLOY_DIR="/var/www/qms"
GIT_BRANCH="main"
PM2_APP_NAME="queue-system-backend"

# Flags
SKIP_BUILD=false
CREATE_BACKUP=false

# Parse arguments
for arg in "$@"; do
  case $arg in
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    --backup)
      CREATE_BACKUP=true
      shift
      ;;
    --help)
      echo "Usage: ./deploy.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --skip-build    Skip npm install and build steps"
      echo "  --backup        Create backup before deploying"
      echo "  --help          Show this help message"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $arg${NC}"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Helper functions
log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_header() {
  echo ""
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}========================================${NC}"
  echo ""
}

# Start deployment
DEPLOY_START=$(date +%s)
print_header "Queue Management System - Deployment Started"
log_info "Start time: $(date '+%Y-%m-%d %H:%M:%S')"

# Step 1: Pre-flight checks
print_header "Step 1: Pre-flight Checks"

log_info "Checking current directory..."
if [ ! -f "$GIT_REPO_DIR/deploy.sh" ]; then
  log_error "Not in correct directory. Please run from: $GIT_REPO_DIR"
  exit 1
fi
log_success "Directory check passed"

log_info "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
  log_error "Node.js is not installed"
  exit 1
fi
log_success "Node.js version: $(node --version)"

log_info "Checking npm installation..."
if ! command -v npm &> /dev/null; then
  log_error "npm is not installed"
  exit 1
fi
log_success "npm version: $(npm --version)"

log_info "Checking PM2 installation..."
if ! command -v pm2 &> /dev/null; then
  log_error "PM2 is not installed"
  exit 1
fi
log_success "PM2 is installed"

# Step 2: Create backup (if requested)
if [ "$CREATE_BACKUP" = true ]; then
  print_header "Step 2: Creating Backup"
  BACKUP_DIR="/var/backups/qms/$(date +%Y%m%d-%H%M%S)"
  log_info "Creating backup at: $BACKUP_DIR"
  mkdir -p "$BACKUP_DIR"
  cp -r "$DEPLOY_DIR/frontend" "$BACKUP_DIR/" 2>/dev/null || log_warning "No frontend to backup"
  cp -r "$DEPLOY_DIR/backend" "$BACKUP_DIR/" 2>/dev/null || log_warning "No backend to backup"
  log_success "Backup created successfully"
fi

# Step 3: Pull latest code
print_header "Step 3: Pulling Latest Code"
cd "$GIT_REPO_DIR"
log_info "Current branch: $(git branch --show-current)"
log_info "Pulling from origin/$GIT_BRANCH..."
git pull origin "$GIT_BRANCH"
log_success "Git pull completed"
log_info "Latest commit: $(git log -1 --pretty=format:'%h - %s (%ar)')"

# Step 4: Build frontend
if [ "$SKIP_BUILD" = false ]; then
  print_header "Step 4: Building Frontend"
  cd "$GIT_REPO_DIR/frontend"
  log_info "Installing frontend dependencies..."
  npm install
  log_info "Building frontend..."
  npm run build
  log_success "Frontend build completed"
else
  log_warning "Skipping frontend build (--skip-build flag)"
fi

# Step 5: Build backend
if [ "$SKIP_BUILD" = false ]; then
  print_header "Step 5: Building Backend"
  cd "$GIT_REPO_DIR/backend"
  log_info "Installing backend dependencies..."
  npm install
  log_info "Building backend..."
  npm run build
  log_success "Backend build completed"
else
  log_warning "Skipping backend build (--skip-build flag)"
fi

# Step 6: Deploy frontend
print_header "Step 6: Deploying Frontend"
log_info "Creating frontend directory if not exists..."
mkdir -p "$DEPLOY_DIR/frontend"
log_info "Removing old frontend files..."
rm -rf "$DEPLOY_DIR/frontend"/*
log_info "Copying new frontend files..."
cp -r "$GIT_REPO_DIR/frontend/dist"/* "$DEPLOY_DIR/frontend/"
log_success "Frontend deployed to: $DEPLOY_DIR/frontend"

# Step 7: Deploy backend
print_header "Step 7: Deploying Backend"
log_info "Creating backend directories..."
mkdir -p "$DEPLOY_DIR/backend/dist"
mkdir -p "$DEPLOY_DIR/backend/logs"

log_info "Copying backend files..."
cp -r "$GIT_REPO_DIR/backend/dist"/* "$DEPLOY_DIR/backend/dist/"
cp "$GIT_REPO_DIR/backend/package.json" "$DEPLOY_DIR/backend/"
cp "$GIT_REPO_DIR/backend/ecosystem.config.js" "$DEPLOY_DIR/backend/"

log_info "Installing production dependencies..."
cd "$DEPLOY_DIR/backend"
npm install --production

# Check if .env exists
if [ ! -f "$DEPLOY_DIR/backend/.env" ]; then
  log_warning ".env file not found in $DEPLOY_DIR/backend/"
  log_warning "Please create .env with JWT_SECRET before starting the app"
fi

log_success "Backend deployed to: $DEPLOY_DIR/backend"

# Step 8: Restart PM2
print_header "Step 8: Restarting Application"
cd "$DEPLOY_DIR/backend"

# Check if PM2 app is already running
if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
  log_info "Restarting PM2 application: $PM2_APP_NAME"
  pm2 restart "$PM2_APP_NAME"
else
  log_warning "PM2 app '$PM2_APP_NAME' not found. Starting new instance..."
  pm2 start ecosystem.config.js
  pm2 save
fi

log_success "Application restarted successfully"

# Step 9: Verify deployment
print_header "Step 9: Deployment Verification"
log_info "PM2 Status:"
pm2 status "$PM2_APP_NAME"

echo ""
log_info "PM2 Logs (last 10 lines):"
pm2 logs "$PM2_APP_NAME" --lines 10 --nostream

# Calculate deployment time
DEPLOY_END=$(date +%s)
DEPLOY_TIME=$((DEPLOY_END - DEPLOY_START))

# Final summary
print_header "Deployment Completed Successfully!"
echo -e "${GREEN}✓${NC} Frontend deployed to: $DEPLOY_DIR/frontend"
echo -e "${GREEN}✓${NC} Backend deployed to: $DEPLOY_DIR/backend"
echo -e "${GREEN}✓${NC} PM2 application: $PM2_APP_NAME (restarted)"
echo -e "${GREEN}✓${NC} Deployment time: ${DEPLOY_TIME}s"
echo -e "${GREEN}✓${NC} Completed at: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
log_info "Your application should now be live at: https://qms.zayyanabdillah.com"
echo ""
