import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.NODE_ENV === 'production'
  ? process.env.NEON_DATABASE_URL
  : process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Database connection string not found');
}

async function main() {
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  console.log('Running migrations...');
  
  await migrate(db, { migrationsFolder: './drizzle' });
  
  console.log('Migrations complete!');
  
  await migrationClient.end();
}

main().catch((err) => {
  console.error('Migration failed!', err);
  process.exit(1);
});
