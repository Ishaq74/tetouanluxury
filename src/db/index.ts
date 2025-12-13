import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Determine database connection based on environment
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = isProduction
  ? process.env.NEON_DATABASE_URL
  : process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    `Database connection string not found. Please set ${
      isProduction ? 'NEON_DATABASE_URL' : 'DATABASE_URL'
    } in your .env file.`
  );
}

// Configure postgres client based on environment
const queryClient = isProduction
  ? postgres(connectionString, {
      ssl: 'require',
      max: 10, // Connection pool for serverless
      idle_timeout: 20,
      connect_timeout: 10,
    })
  : postgres(connectionString);

// Initialize Drizzle with schema
export const db = drizzle(queryClient, { schema });

// Close connection (mainly for migrations and scripts)
export async function closeConnection() {
  await queryClient.end();
}

// Export connection info for debugging
export const dbInfo = {
  isProduction,
  hasConnection: !!connectionString,
  database: isProduction ? 'NeonDB' : 'Local PostgreSQL',
};
