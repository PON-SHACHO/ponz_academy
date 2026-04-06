
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
    const userColumns = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'User'`;
    console.log('User Columns:', userColumns.map(c => c.column_name));
    
    const postColumns = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'Post'`;
    console.log('Post Columns:', postColumns.map(c => c.column_name));

    const categoryColumns = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'Category'`;
    console.log('Category Columns:', categoryColumns.map(c => c.column_name));

  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

check();
