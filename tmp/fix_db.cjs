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

async function fix() {
  console.log('=== DB FIX SCRIPT ===\n');

  // --- Bug 3: Create PasswordResetToken table ---
  console.log('Bug 3: Creating PasswordResetToken table...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
        "id"        TEXT NOT NULL PRIMARY KEY,
        "token"     TEXT NOT NULL UNIQUE,
        "email"     TEXT NOT NULL,
        "expires"   TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `;
    console.log('  ✅ PasswordResetToken table created (or already exists)');
  } catch (e) {
    console.error('  ❌ Failed:', e.message);
  }

  // --- Bug 4: Fix category slugs ---
  console.log('\nBug 4: Fixing category slugs...');
  const slugFixes = [
    { name: 'すべて',     slug: 'all' },
    { name: '財務・経営', slug: 'finance' },
    { name: '人材育成',   slug: 'hr' },
    { name: 'マインドセット', slug: 'mindset' },
  ];
  for (const fix of slugFixes) {
    try {
      const result = await sql`UPDATE "Category" SET slug = ${fix.slug} WHERE name = ${fix.name}`;
      console.log(`  ✅ "${fix.name}" → slug="${fix.slug}"`);
    } catch (e) {
      console.error(`  ❌ "${fix.name}" failed:`, e.message);
    }
  }

  // --- Bug 5: Fix broken post slug "2" ---
  console.log('\nBug 5: Fixing broken post slug "2"...');
  try {
    // Fetch the post with slug "2"
    const posts = await sql`SELECT id, title FROM "Post" WHERE slug = '2'`;
    if (posts.length === 0) {
      console.log('  ⚠️  No post with slug="2" found (already fixed?)');
    } else {
      const post = posts[0];
      console.log(`  Found post: "${post.title}"`);
      // Generate a proper ASCII slug from the title
      const newSlug = 'gijutsu-wo-migaku-hodo-kyaku-ga-hanareru-gyakusetsu';
      await sql`UPDATE "Post" SET slug = ${newSlug} WHERE id = ${post.id}`;
      console.log(`  ✅ slug updated to "${newSlug}"`);
    }
  } catch (e) {
    console.error('  ❌ Failed:', e.message);
  }

  // --- Verification ---
  console.log('\n=== VERIFICATION ===');
  const cats = await sql`SELECT name, slug FROM "Category" ORDER BY name`;
  console.log('Categories:');
  cats.forEach(c => console.log(`  - "${c.name}" → slug="${c.slug}"`));

  const prt = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'PasswordResetToken'`;
  console.log('\nPasswordResetToken columns:', prt.map(c => c.column_name).join(', '));

  const slugTwo = await sql`SELECT id, title, slug FROM "Post" WHERE slug = '2'`;
  if (slugTwo.length === 0) {
    console.log('✅ No more broken slug="2" posts');
  } else {
    console.log('⚠️  Still have slug="2" posts:', slugTwo.length);
  }

  console.log('\n=== DONE ===');
}

fix().catch(e => console.error('Fatal:', e.message));
