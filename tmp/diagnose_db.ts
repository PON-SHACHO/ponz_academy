import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function diagnose() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    return;
  }
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    const users = await sql('SELECT id, email FROM "User" LIMIT 5');
    const categories = await sql('SELECT id, name FROM "Category" LIMIT 5');
    console.log('--- USERS ---');
    console.log(JSON.stringify(users, null, 2));
    console.log('--- CATEGORIES ---');
    console.log(JSON.stringify(categories, null, 2));
  } catch (error) {
    console.error('DIAGNOSTIC ERROR:', error);
  }
}

diagnose();
