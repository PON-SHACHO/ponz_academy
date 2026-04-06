
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
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User'
    `;
    console.log('Columns for User table:', columns.map(c => c.column_name));
    
    const sample = await sql`SELECT * FROM "User" LIMIT 1`;
    console.log('Sample row keys:', Object.keys(sample[0]));
    console.log('Sample row data:', sample[0]);
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

check();
