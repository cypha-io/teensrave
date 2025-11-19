import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

let sql: any;
let db: any;

if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL!);
  db = drizzle(sql);
} else {
  // For build time when DATABASE_URL is not available
  sql = null;
  db = null;
}

export { db };