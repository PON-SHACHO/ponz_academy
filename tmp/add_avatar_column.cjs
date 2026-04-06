const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env.local')) {
  const config = dotenv.parse(fs.readFileSync('.env.local'));
  Object.assign(process.env, config);
}

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('ADDING avatarUrl COLUMN TO User TABLE...');
  try {
    await sql`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT`;
    console.log('✅ Column added successfully');
  } catch (e) {
    console.error('❌ Failed:', e.message);
  }
}

run();
