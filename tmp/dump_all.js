const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function dump() {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql('SELECT id, slug, title FROM "Post"');
  console.log(JSON.stringify(rows, null, 2));
}

dump();
