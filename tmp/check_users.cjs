
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

async function check() {
  try {
    const res = await sql`SELECT COUNT(*) FROM "User"`;
    console.log('User count:', res[0].count);
    
    const users = await sql`SELECT id, email, role FROM "User" LIMIT 10`;
    console.log('Users:', users);
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

check();
