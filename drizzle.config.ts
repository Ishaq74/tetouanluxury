import { defineConfig } from 'drizzle-kit';

// Use NeonDB in production, local PostgreSQL in development
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = isProduction
  ? process.env.NEON_DATABASE_URL
  : process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5432/tetouanluxury';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
  verbose: true,
  strict: true,
});
