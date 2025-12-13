#!/bin/bash

# Setup script for Tetouan Luxury Villas Database Migration
# Run this script to set up the database from scratch

set -e

echo "🏝️  Tetouan Luxury Villas - Database Setup"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your database credentials."
    echo ""
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker is not running. Please start Docker first if you want to use the local PostgreSQL container."
    echo "   You can skip this if you're using an external database."
    read -p "   Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    # Check if postgres container exists
    if [ ! "$(docker ps -a -q -f name=tetouanluxury-postgres)" ]; then
        echo "🐳 Starting PostgreSQL container..."
        docker run --name tetouanluxury-postgres \
            -e POSTGRES_PASSWORD=password \
            -e POSTGRES_DB=tetouanluxury \
            -p 5432:5432 \
            -d postgres:16-alpine
        echo "✅ PostgreSQL container started"
        echo "   Waiting 5 seconds for database to initialize..."
        sleep 5
    else
        echo "✅ PostgreSQL container already exists"
        if [ ! "$(docker ps -q -f name=tetouanluxury-postgres)" ]; then
            echo "   Starting existing container..."
            docker start tetouanluxury-postgres
            sleep 3
        fi
    fi
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Generating database migrations..."
npm run db:generate

echo ""
echo "🚀 Pushing schema to database..."
npm run db:push

echo ""
echo "🌱 Seeding database with mock data..."
npm run db:seed

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. npm run dev          - Start development server"
echo "  2. npm run db:studio    - Open Drizzle Studio (database GUI)"
echo ""
echo "Database connection:"
echo "  URL: postgresql://postgres:password@localhost:5432/tetouanluxury"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: tetouanluxury"
echo "  Username: postgres"
echo "  Password: password"
echo ""
echo "Happy coding! 🎉"
