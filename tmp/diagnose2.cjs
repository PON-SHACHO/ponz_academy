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
const lines = [];
function log(msg) { lines.push(msg); }

async function diagnose() {
  log('=== FULL APPLICATION DIAGNOSIS ===');

  // 1. Tables
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  log('1. Tables: ' + JSON.stringify(tables.map(t => t.table_name)));

  // 2. User columns
  const userCols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'User' ORDER BY ordinal_position`;
  log('2. User columns: ' + JSON.stringify(userCols.map(c => c.column_name + ':' + c.data_type)));

  // 3. Post columns
  const postCols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Post' ORDER BY ordinal_position`;
  log('3. Post columns: ' + JSON.stringify(postCols.map(c => c.column_name + ':' + c.data_type)));

  // 4. Category columns
  const catCols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Category' ORDER BY ordinal_position`;
  log('4. Category columns: ' + JSON.stringify(catCols.map(c => c.column_name + ':' + c.data_type)));

  // 5. Counts
  const userCount = await sql`SELECT COUNT(*) as c FROM "User"`;
  const postCount = await sql`SELECT COUNT(*) as c FROM "Post"`;
  const catCount = await sql`SELECT COUNT(*) as c FROM "Category"`;
  log('5. Counts: Users=' + userCount[0].c + ' Posts=' + postCount[0].c + ' Categories=' + catCount[0].c);

  // 6. All posts
  const posts = await sql`SELECT id, title, slug, published, "authorId", "categoryId" FROM "Post" ORDER BY "createdAt" DESC`;
  log('6. Posts (' + posts.length + '):');
  for (const p of posts) {
    log('   [' + (p.published ? 'PUB' : 'DRAFT') + '] title="' + p.title + '" slug="' + p.slug + '" authorId="' + p.authorId + '" catId="' + p.categoryId + '"');
  }

  // 7. Categories
  const cats = await sql`SELECT * FROM "Category"`;
  log('7. Categories (' + cats.length + '):');
  for (const c of cats) {
    log('   id="' + c.id + '" name="' + c.name + '" slug="' + c.slug + '"');
  }

  // 8. Users
  const users = await sql`SELECT id, email, role, name, bio FROM "User"`;
  log('8. Users (' + users.length + '):');
  for (const u of users) {
    log('   id="' + u.id + '" email="' + u.email + '" role="' + u.role + '" name="' + u.name + '" bio="' + u.bio + '"');
  }

  // 9. Test getPosts query
  log('9. Testing getPosts (published=true)...');
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
    log('   Result: ' + result.length + ' posts');
    if (result.length > 0) {
      log('   Keys: ' + JSON.stringify(Object.keys(result[0])));
      log('   First: slug="' + result[0].slug + '" title="' + result[0].title + '"');
    }
  } catch (e) {
    log('   FAILED: ' + e.message);
  }

  // 10. Test getPostByIdOrSlug
  if (posts.length > 0) {
    const testSlug = posts[0].slug;
    log('10. Testing getPostByIdOrSlug slug="' + testSlug + '"...');
    try {
      const result = await sql`
        SELECT p.*, c.name as "categoryName", u.name as "authorName", u.bio as "authorBio"
        FROM "Post" p
        LEFT JOIN "Category" c ON p."categoryId" = c.id
        LEFT JOIN "User" u ON p."authorId" = u.id
        WHERE p.id::text = ${testSlug} OR p.slug = ${testSlug}
        LIMIT 1
      `;
      log('   Result: ' + result.length + ' posts');
      if (result.length > 0) log('   Found: "' + result[0].title + '"');
    } catch (e) {
      log('   FAILED: ' + e.message);
    }
  }

  // 11. Check PasswordResetToken
  const prtCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'PasswordResetToken'`;
  log('11. PasswordResetToken columns: ' + JSON.stringify(prtCols.map(c => c.column_name)));

  // 12. Check for orphan references
  log('12. Checking orphan references...');
  const orphanPosts = await sql`
    SELECT p.id, p.title, p."authorId", p."categoryId"
    FROM "Post" p
    LEFT JOIN "User" u ON p."authorId" = u.id
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    WHERE u.id IS NULL OR c.id IS NULL
  `;
  if (orphanPosts.length > 0) {
    log('   WARNING: ' + orphanPosts.length + ' posts with orphan references:');
    for (const p of orphanPosts) {
      log('   - id="' + p.id + '" title="' + p.title + '" authorId="' + p.authorId + '" catId="' + p.categoryId + '"');
    }
  } else {
    log('   OK: No orphan references found');
  }

  log('=== DIAGNOSIS COMPLETE ===');
  
  const output = lines.join('\n');
  fs.writeFileSync('tmp/diagnosis_result.txt', output);
  console.log('Done. Written to tmp/diagnosis_result.txt');
}

diagnose().catch(e => {
  log('FATAL: ' + e.message);
  fs.writeFileSync('tmp/diagnosis_result.txt', lines.join('\n'));
  console.error('Fatal error:', e.message);
});
