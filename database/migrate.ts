import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, client } from '../lib/db';

async function main() {
  console.log('🚀 Starting database migration...');
  
  try {
    await migrate(db, { migrationsFolder: './database/migrations' });
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
