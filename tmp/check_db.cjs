const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env.local')) {
  const config = dotenv.parse(fs.readFileSync('.env.local'));
  Object.assign(process.env, config);
}

const sql = neon(process.env.DATABASE_URL);

async function check() {
  console.log('--- USERS ---');
  const users = await sql`SELECT id, name, email, bio FROM "User"`;
  console.table(users);

  console.log('--- POST AUTHORS ---');
  const postAuthors = await sql`SELECT DISTINCT p."authorId", u.name, u.email, u.bio FROM "Post" p JOIN "User" u ON p."authorId" = u.id`;
  console.table(postAuthors);
}

check().catch(console.error);
