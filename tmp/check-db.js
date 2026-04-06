
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function checkDb() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tables:', tables.map(t => t.table_name));

    for (const table of tables) {
      const name = table.table_name;
      // Use double quotes for table names in case they are case-sensitive
      const count = await sql`SELECT COUNT(*) FROM "${name}"`;
      console.log(`Count for ${name}:`, count[0].count);
    }

    const users = await sql`SELECT * FROM "User" LIMIT 5`;
    console.log('User sample:', users);

  } catch (err) {
    console.error('Error:', err);
  }
}

checkDb();
