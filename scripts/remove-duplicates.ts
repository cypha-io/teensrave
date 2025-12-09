import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import { 
  mediaAccreditation, 
  artistApplications, 
  contactSubmissions, 
  newsletterSubscribers 
} from '../lib/schema';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function removeDuplicates() {
  console.log('🔍 Starting duplicate removal process...\n');

  try {
    // 1. Remove duplicate media accreditation applications (keep the earliest submission)
    console.log('📧 Checking Media Accreditation duplicates...');
    const mediaResult = await db.execute(sql`
      WITH duplicates AS (
        SELECT 
          id,
          email,
          submitted_at,
          ROW_NUMBER() OVER (PARTITION BY email ORDER BY submitted_at ASC) as rn
        FROM media_accreditation
      )
      DELETE FROM media_accreditation
      WHERE id IN (
        SELECT id FROM duplicates WHERE rn > 1
      )
      RETURNING id, email
    `);
    console.log(`   ✓ Removed ${mediaResult.rowCount || 0} duplicate media accreditation submissions\n`);

    // 2. Remove duplicate artist applications (keep the earliest submission)
    console.log('🎤 Checking Artist Applications duplicates...');
    const artistResult = await db.execute(sql`
      WITH duplicates AS (
        SELECT 
          id,
          email,
          submitted_at,
          ROW_NUMBER() OVER (PARTITION BY email ORDER BY submitted_at ASC) as rn
        FROM artist_applications
      )
      DELETE FROM artist_applications
      WHERE id IN (
        SELECT id FROM duplicates WHERE rn > 1
      )
      RETURNING id, email
    `);
    console.log(`   ✓ Removed ${artistResult.rowCount || 0} duplicate artist applications\n`);

    // 3. Remove duplicate contact submissions (keep the earliest submission)
    console.log('📝 Checking Contact Form duplicates...');
    const contactResult = await db.execute(sql`
      WITH duplicates AS (
        SELECT 
          id,
          email,
          subject,
          submitted_at,
          ROW_NUMBER() OVER (PARTITION BY email, subject ORDER BY submitted_at ASC) as rn
        FROM contact_submissions
      )
      DELETE FROM contact_submissions
      WHERE id IN (
        SELECT id FROM duplicates WHERE rn > 1
      )
      RETURNING id, email
    `);
    console.log(`   ✓ Removed ${contactResult.rowCount || 0} duplicate contact submissions\n`);

    // 4. Newsletter duplicates are already handled by unique email constraint
    console.log('📬 Newsletter subscribers already have unique email constraint\n');

    // Summary
    console.log('═══════════════════════════════════════════════');
    console.log('✅ Duplicate Removal Complete!');
    console.log('═══════════════════════════════════════════════');
    console.log(`Media Accreditation: ${mediaResult.rowCount || 0} duplicates removed`);
    console.log(`Artist Applications: ${artistResult.rowCount || 0} duplicates removed`);
    console.log(`Contact Submissions: ${contactResult.rowCount || 0} duplicates removed`);
    console.log('═══════════════════════════════════════════════\n');

    // Show current counts
    console.log('📊 Current database counts:');
    
    const mediaCounts = await db.execute(sql`
      SELECT COUNT(*) as total, COUNT(DISTINCT email) as unique_emails 
      FROM media_accreditation
    `);
    console.log(`   Media Accreditation: ${mediaCounts.rows[0].total} total (${mediaCounts.rows[0].unique_emails} unique emails)`);
    
    const artistCounts = await db.execute(sql`
      SELECT COUNT(*) as total, COUNT(DISTINCT email) as unique_emails 
      FROM artist_applications
    `);
    console.log(`   Artist Applications: ${artistCounts.rows[0].total} total (${artistCounts.rows[0].unique_emails} unique emails)`);
    
    const contactCounts = await db.execute(sql`
      SELECT COUNT(*) as total, COUNT(DISTINCT email) as unique_emails 
      FROM contact_submissions
    `);
    console.log(`   Contact Submissions: ${contactCounts.rows[0].total} total (${contactCounts.rows[0].unique_emails} unique emails)`);
    
    const newsletterCounts = await db.execute(sql`
      SELECT COUNT(*) as total FROM newsletter_subscribers
    `);
    console.log(`   Newsletter Subscribers: ${newsletterCounts.rows[0].total} total\n`);

  } catch (error) {
    console.error('❌ Error removing duplicates:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the script
removeDuplicates()
  .then(() => {
    console.log('✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
