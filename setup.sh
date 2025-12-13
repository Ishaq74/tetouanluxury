#!/bin/bash

# Tétouan Luxury Villas - Setup Script
# This script automates the initial setup of the development environment

echo "🏖️  Tétouan Luxury Villas - Setup Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.x or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL 14.x or higher."
    echo "   You can skip database setup for now and run it later."
    read -p "   Continue without database setup? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    SKIP_DB=true
else
    echo "✅ PostgreSQL is installed"
    SKIP_DB=false
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "✅ .env file already exists"
fi

# Setup database
if [ "$SKIP_DB" = false ]; then
    echo ""
    read -p "🗄️  Would you like to create the database now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "   Enter database name (default: tetouanluxury): " DB_NAME
        DB_NAME=${DB_NAME:-tetouanluxury}
        
        echo "   Creating database: $DB_NAME"
        createdb $DB_NAME 2>/dev/null || echo "   Database may already exist"
        
        echo "   Generating migrations..."
        npm run db:generate
        
        echo "   Pushing schema to database..."
        npm run db:push
        
        read -p "   Would you like to seed the database with sample data? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "   Seeding database..."
            node --loader tsx src/db/seed.ts
        fi
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Update your .env file with your configuration"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Open http://localhost:4321 in your browser"
echo ""
echo "🔧 Available commands:"
echo "   npm run dev       - Start development server"
echo "   npm run build     - Build for production"
echo "   npm run preview   - Preview production build"
echo "   npm run db:studio - Open Drizzle Studio (database GUI)"
echo ""
echo "Happy coding! 🚀"
