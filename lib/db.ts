import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

let sql: any;
let db: any;

try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL!);
    db = drizzle(sql);
  } else {
    sql = null;
    db = null;
  }
} catch (error) {
  console.error('Failed to initialize database connection:', error);
  sql = null;
  db = null;
}

export { db };