import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function dump() {
  const sql = neon(process.env.DATABASE_URL!);
  const users = await sql('SELECT id, email, name FROM "User"');
  const categories = await sql('SELECT id, name, slug FROM "Category"');
  const posts = await sql('SELECT id, title, slug, published, "authorId" FROM "Post" ORDER BY "createdAt" DESC LIMIT 5');
  
  console.log('--- VALID USERS ---');
  console.log(JSON.stringify(users, null, 2));
  console.log('--- VALID CATEGORIES ---');
  console.log(JSON.stringify(categories, null, 2));
  console.log('--- RECENT POSTS ---');
  console.log(JSON.stringify(posts, null, 2));
}

dump().catch(console.error);
