import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function updateSchema() {
  console.log('Updating User table...');
  try {
    await sql`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password" TEXT;`;
    console.log('✅ Updated User table successful.');
  } catch (err) {
    console.error('❌ Failed to update table:', err);
  }
}

updateSchema();
