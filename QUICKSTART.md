# 🚀 QUICK START GUIDE

## Initial Setup (One-time)

```bash
# 1. Clone and install
npm install

# 2. Run automated setup
chmod +x setup.sh
./setup.sh
```

OR manually:

```bash
# Start PostgreSQL
docker run --name tetouanluxury-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=tetouanluxury \
  -p 5432:5432 -d postgres:16-alpine

# Configure environment
cp .env.example .env

# Setup database
npm run db:push
npm run db:seed
```

## Daily Development

```bash
# Start development server
npm run dev

# Open database GUI
npm run db:studio

# Run tests
npm test
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run test:ui` | Interactive test UI |
| `npm run test:coverage` | Check test coverage |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:push` | Push schema changes |
| `npm run db:seed` | Seed database |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Run migrations |

## Database Access

**Connection String:**
```
postgresql://postgres:password@localhost:5432/tetouanluxury
```

**Credentials:**
- Host: `localhost`
- Port: `5432`
- Database: `tetouanluxury`
- Username: `postgres`
- Password: `password`

## File Structure

```
📁 Project Root
├── 📁 api/             # API layer (database.ts = real, mock.ts = legacy)
├── 📁 auth/            # Better Auth configuration
├── 📁 database/        # Schema, migrations, seeds
├── 📁 lib/             # Utilities (db.ts = connection)
├── 📁 tests/           # Test files
├── 📄 .env             # Environment variables (DO NOT COMMIT)
├── 📄 drizzle.config.ts  # Drizzle configuration
├── 📄 vitest.config.ts   # Test configuration
└── 📄 setup.sh         # Automated setup script
```

## Next Steps

1. ✅ **Database is ready** - Schema created and seeded
2. ⏳ **Update UI components** - Replace `api/mock.ts` with `api/database.ts`
3. ⏳ **Add authentication** - Implement login/signup UI
4. ⏳ **Write tests** - Aim for 100% coverage
5. ⏳ **Deploy** - Push to NeonDB for production

## Troubleshooting

**Database connection error?**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart container
docker restart tetouanluxury-postgres
```

**Port already in use?**
```bash
# Kill process on port 5432
lsof -ti:5432 | xargs kill -9

# Or use different port in .env
DATABASE_URL=postgresql://postgres:password@localhost:5433/tetouanluxury
```

**Need to reset database?**
```bash
# Drop and recreate
docker exec -it tetouanluxury-postgres psql -U postgres -c "DROP DATABASE tetouanluxury;"
docker exec -it tetouanluxury-postgres psql -U postgres -c "CREATE DATABASE tetouanluxury;"

# Re-push schema and seed
npm run db:push
npm run db:seed
```

## Important Links

- 📖 Full Guide: `DATABASE_MIGRATION.md`
- 📊 Implementation Status: `IMPLEMENTATION_SUMMARY.md`
- 🔍 Drizzle Studio: `npm run db:studio`
- 🧪 Test UI: `npm run test:ui`

## Production Deployment

```bash
# 1. Create NeonDB project at neon.tech

# 2. Update .env with production URL
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require

# 3. Run migrations
npm run db:migrate

# 4. Seed production data
npm run db:seed

# 5. Deploy to Vercel
vercel deploy --prod
```

---

**Status**: ✅ Implementation complete, ready for UI integration

**Time to implement**: Run `./setup.sh` and you're ready in ~2 minutes!
