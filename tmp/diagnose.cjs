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

async function diagnose() {
  console.log('=== FULL APPLICATION DIAGNOSIS ===\n');

  // 1. Check all tables
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  console.log('1. Tables:', tables.map(t => t.table_name));

  // 2. Check User columns
  const userCols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'User' ORDER BY ordinal_position`;
  console.log('\n2. User columns:', userCols.map(c => `${c.column_name} (${c.data_type})`));

  // 3. Check Post columns
  const postCols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Post' ORDER BY ordinal_position`;
  console.log('\n3. Post columns:', postCols.map(c => `${c.column_name} (${c.data_type})`));

  // 4. Category columns
  const catCols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Category' ORDER BY ordinal_position`;
  console.log('\n4. Category columns:', catCols.map(c => `${c.column_name} (${c.data_type})`));

  // 5. Count records
  const userCount = await sql`SELECT COUNT(*) as c FROM "User"`;
  const postCount = await sql`SELECT COUNT(*) as c FROM "Post"`;
  const catCount = await sql`SELECT COUNT(*) as c FROM "Category"`;
  console.log(`\n5. Record counts: Users=${userCount[0].c}, Posts=${postCount[0].c}, Categories=${catCount[0].c}`);

  // 6. List all posts with slugs
  const posts = await sql`SELECT id, title, slug, published, "authorId", "categoryId" FROM "Post" ORDER BY "createdAt" DESC`;
  console.log('\n6. Posts:');
  posts.forEach(p => {
    console.log(`   - [${p.published ? 'PUB' : 'DRAFT'}] "${p.title}" slug="${p.slug}" authorId="${p.authorId}" catId="${p.categoryId}"`);
  });

  // 7. List categories
  const cats = await sql`SELECT * FROM "Category"`;
  console.log('\n7. Categories:');
  cats.forEach(c => console.log(`   - id="${c.id}" name="${c.name}" slug="${c.slug}"`));

  // 8. List users
  const users = await sql`SELECT id, email, role, name FROM "User"`;
  console.log('\n8. Users:');
  users.forEach(u => console.log(`   - id="${u.id}" email="${u.email}" role="${u.role}" name="${u.name}"`));

  // 9. Test the exact query used in getPosts
  console.log('\n9. Testing getPosts query (published=true)...');
  try {
    const result = await sql`
      SELECT p.*, c.name as "categoryName", u.name as "authorName"
      FROM "Post" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      LEFT JOIN "User" u ON p."authorId" = u.id
      WHERE p.published = true
      ORDER BY p."createdAt" DESC
      LIMIT 10
    `;
    console.log(`   Result: ${result.length} posts found`);
    if (result.length > 0) {
      console.log('   First post keys:', Object.keys(result[0]));
    }
  } catch (e) {
    console.error('   FAILED:', e.message);
  }

  // 10. Test getPostByIdOrSlug query
  if (posts.length > 0) {
    const testSlug = posts[0].slug;
    console.log(`\n10. Testing getPostByIdOrSlug("${testSlug}")...`);
    try {
      const result = await sql`
        SELECT p.*, c.name as "categoryName", u.name as "authorName", u.bio as "authorBio"
        FROM "Post" p
        LEFT JOIN "Category" c ON p."categoryId" = c.id
        LEFT JOIN "User" u ON p."authorId" = u.id
        WHERE p.id::text = ${testSlug} OR p.slug = ${testSlug}
        LIMIT 1
      `;
      console.log(`   Result: ${result.length} posts found`);
      if (result.length > 0) {
        console.log('   Found:', result[0].title);
      }
    } catch (e) {
      console.error('   FAILED:', e.message);
    }
  }

  // 11. Check for PasswordResetToken table
  const prtCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'PasswordResetToken'`;
  console.log('\n11. PasswordResetToken columns:', prtCols.map(c => c.column_name));

  console.log('\n=== DIAGNOSIS COMPLETE ===');
}

diagnose().catch(e => console.error('Fatal error:', e));
