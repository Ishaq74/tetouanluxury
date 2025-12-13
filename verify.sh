#!/bin/bash

# Verification script to check if implementation is complete

echo "🔍 Tetouan Luxury Villas - Implementation Verification"
echo "======================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ (missing)"
        return 1
    fi
}

check_npm_package() {
    if npm list "$1" >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (not installed)"
        return 1
    fi
}

errors=0

# Check critical files
echo "📁 Checking Critical Files..."
check_file ".env" || ((errors++))
check_file "package.json" || ((errors++))
check_file "drizzle.config.ts" || ((errors++))
check_file "vitest.config.ts" || ((errors++))
check_file "tsconfig.json" || ((errors++))
echo ""

# Check database files
echo "🗄️  Checking Database Files..."
check_file "database/schema.ts" || ((errors++))
check_file "database/seed.ts" || ((errors++))
check_file "database/seed-runner.ts" || ((errors++))
check_file "database/migrate.ts" || ((errors++))
check_dir "database/migrations" || ((errors++))
echo ""

# Check lib files
echo "📚 Checking Library Files..."
check_file "lib/db.ts" || ((errors++))
check_file "lib/booking-logic.ts" || ((errors++))
check_file "lib/pdf-generator.ts" || ((errors++))
echo ""

# Check API files
echo "🌐 Checking API Files..."
check_file "api/database.ts" || ((errors++))
check_file "api/mock.ts" || ((errors++))
echo ""

# Check auth files
echo "🔐 Checking Auth Files..."
check_file "auth/config.ts" || ((errors++))
check_dir "auth" || ((errors++))
echo ""

# Check test files
echo "🧪 Checking Test Files..."
check_file "tests/setup.ts" || ((errors++))
check_file "tests/__tests__/api/database.test.ts" || ((errors++))
check_file "tests/__tests__/database/schema.test.ts" || ((errors++))
echo ""

# Check documentation
echo "📖 Checking Documentation..."
check_file "DATABASE_MIGRATION.md" || ((errors++))
check_file "IMPLEMENTATION_SUMMARY.md" || ((errors++))
check_file "QUICKSTART.md" || ((errors++))
check_file "README.md" || ((errors++))
echo ""

# Check npm packages
echo "📦 Checking NPM Packages..."
check_npm_package "drizzle-orm" || ((errors++))
check_npm_package "postgres" || ((errors++))
check_npm_package "better-auth" || ((errors++))
check_npm_package "drizzle-kit" || ((errors++))
check_npm_package "vitest" || ((errors++))
check_npm_package "tsx" || ((errors++))
echo ""

# Check environment variables
echo "⚙️  Checking Environment Variables..."
if [ -f .env ]; then
    if grep -q "DATABASE_URL" .env; then
        echo -e "${GREEN}✓${NC} DATABASE_URL set"
    else
        echo -e "${RED}✗${NC} DATABASE_URL not set in .env"
        ((errors++))
    fi
    if grep -q "BETTER_AUTH_SECRET" .env; then
        echo -e "${GREEN}✓${NC} BETTER_AUTH_SECRET set"
    else
        echo -e "${YELLOW}⚠${NC} BETTER_AUTH_SECRET not set (recommended for production)"
    fi
else
    echo -e "${RED}✗${NC} .env file missing"
    ((errors++))
fi
echo ""

# Check Docker (optional)
echo "🐳 Checking Docker (optional)..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker installed"
    if docker info > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Docker running"
        if docker ps -a | grep -q tetouanluxury-postgres; then
            echo -e "${GREEN}✓${NC} PostgreSQL container exists"
            if docker ps | grep -q tetouanluxury-postgres; then
                echo -e "${GREEN}✓${NC} PostgreSQL container running"
            else
                echo -e "${YELLOW}⚠${NC} PostgreSQL container stopped (run: docker start tetouanluxury-postgres)"
            fi
        else
            echo -e "${YELLOW}⚠${NC} PostgreSQL container not created (run: ./setup.sh)"
        fi
    else
        echo -e "${YELLOW}⚠${NC} Docker not running"
    fi
else
    echo -e "${YELLOW}⚠${NC} Docker not installed (optional, but recommended for local dev)"
fi
echo ""

# Summary
echo "======================================================"
if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Implementation is complete.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run './setup.sh' to initialize database (if not done)"
    echo "  2. Run 'npm run dev' to start development server"
    echo "  3. Run 'npm run db:studio' to view database"
    echo "  4. Read QUICKSTART.md for daily workflow"
else
    echo -e "${RED}❌ $errors error(s) found. Please fix the issues above.${NC}"
    echo ""
    echo "To fix:"
    echo "  1. Run 'npm install' to install missing packages"
    echo "  2. Run './setup.sh' to complete setup"
    echo "  3. Check DATABASE_MIGRATION.md for detailed instructions"
fi
echo "======================================================"

exit $errors
