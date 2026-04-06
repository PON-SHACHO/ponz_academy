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

async function fix() {
  console.log('UPDATING ADMIN USER PROFILE...');
  try {
    await sql`
      UPDATE "User"
      SET name = 'Admin User', bio = '経営コンサルタント / 退職歯科医'
      WHERE id = 'admin-id'
    `;
    console.log('✅ Admin User updated successfully');
  } catch (e) {
    console.error('❌ Failed:', e.message);
  }
}

fix();
