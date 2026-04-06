
const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('.env.local')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  try {
    console.log('Adding bio column to User table...');
    await sql`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bio" TEXT`;
    console.log('✅ Successfully added bio column');
  } catch (err) {
    console.error('❌ Failed to add column:', err.message);
  }
}

migrate();
