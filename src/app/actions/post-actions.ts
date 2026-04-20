'use server';

import { sql } from '@/lib/db-neon';
import { Post, Category } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getPosts(options?: { categorySlug?: string; limit?: number }) {
  try {
    let query = sql`
      SELECT p.*, c.name as "categoryName", u.name as "authorName", u.bio as "authorBio", u."avatarUrl" as "authorAvatarUrl"
      FROM "Post" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      LEFT JOIN "User" u ON p."authorId" = u.id
      WHERE p.published = true
    `;

    if (options?.categorySlug && options.categorySlug !== 'すべて') {
      // In a real app we'd append WHERE or use a better query builder
      // For now, let's just filter by category name for simplicity in this raw SQL example
      const posts = await sql`
        SELECT p.*, c.name as "categoryName", u.name as "authorName", u.bio as "authorBio", u."avatarUrl" as "authorAvatarUrl"
        FROM "Post" p
        LEFT JOIN "Category" c ON p."categoryId" = c.id
        LEFT JOIN "User" u ON p."authorId" = u.id
        WHERE p.published = true AND (c.name = ${options.categorySlug} OR c.slug = ${options.categorySlug})
        ORDER BY p."createdAt" DESC
        LIMIT ${options.limit || 10}
      `;
      return posts as unknown as Post[];
    }
    const categoryFilter = options?.categorySlug && options.categorySlug !== 'すべて'
      ? sql`AND (c.name = ${options.categorySlug} OR c.slug = ${options.categorySlug})`
      : sql``;
    const limit = options?.limit || 10;

    const posts = await sql`
      SELECT p.*, c.name as "categoryName", u.name as "authorName", u.bio as "authorBio", u."avatarUrl" as "authorAvatarUrl"
      FROM "Post" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      LEFT JOIN "User" u ON p."authorId" = u.id
      WHERE p.published = true
      ${categoryFilter}
      ORDER BY p."createdAt" DESC
      LIMIT ${limit}
    `;

    // Smart Image Extraction for list view
    const mappedPosts = posts.map(p => {
      if (!p.coverImage && p.content) {
        const imageMatch = p.content.match(/!\[.*?\]\((.*?)\)/);
        if (imageMatch) {
          p.coverImage = imageMatch[1];
        }
      }
      return p;
    });

    return mappedPosts as unknown as Post[];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export async function getPostByIdOrSlug(idOrSlug: string) {
  if (!idOrSlug) return null;
  
  const decoded = decodeURIComponent(idOrSlug);
  console.log(`[DB] Fetching post by ID or Slug: "${decoded}" (original: "${idOrSlug}")`);
  try {
    // Specifically check for both. We cast to string to ensure type compatibility.
    const posts = await sql`
      SELECT p.*, c.name as "categoryName", u.name as "authorName", u.bio as "authorBio", u."avatarUrl" as "authorAvatarUrl"
      FROM "Post" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      LEFT JOIN "User" u ON p."authorId" = u.id
      WHERE p.id::text = ${decoded} OR p.slug = ${decoded}
      LIMIT 1
    `;
    
    if (posts.length === 0) {
      console.warn(`[DB] No post found for "${idOrSlug}"`);
      return null;
    }
    
    console.log(`[DB] Found post: ${posts[0].title} (slug: ${posts[0].slug})`);
    return (posts[0] as unknown as Post) || null;
  } catch (error) {
    console.error(`[DB] ERROR fetching post "${idOrSlug}":`, error);
    return null;
  }
}

export async function getCategories() {
  try {
    let categories = await sql`
      SELECT * 
      FROM "Category"
      ORDER BY name ASC
    ` as unknown as Category[];

    // 「動画」カテゴリーがない場合は自動作成
    if (!categories.find(c => c.name === '動画')) {
      await sql`
        INSERT INTO "Category" (id, name, slug)
        VALUES (gen_random_uuid()::text, '動画', 'video')
      `;
      // 再取得
      categories = await sql`
        SELECT * 
        FROM "Category"
        ORDER BY name ASC
      ` as unknown as Category[];
    }

    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function savePost(data: Partial<Post>) {
  try {
    // DB 互換性維持のための緊急処理: videoUrl カラムが存在することを確認
    try {
      await sql`ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT`;
    } catch (e) {
      // 既に存在するか、名前の不一致がある場合
      try {
        await sql`ALTER TABLE "Post" RENAME COLUMN "videoUrls" TO "videoUrl"`;
      } catch (e2) {
        // すでに singular になっているか、 plural がない場合は無視
      }
    }

    const { id, title, slug, subtitle, content, coverImage, videoUrl, readingTime, categoryId } = data;
    
    // Ensure videoUrl (array in code) is stored as a JSON string in DB
    const videoUrlStr = Array.isArray(videoUrl) ? JSON.stringify(videoUrl) : videoUrl;

    if (id) {
      // Update
      await sql`
        UPDATE "Post"
        SET title = ${title}, slug = ${slug}, subtitle = ${subtitle}, 
            content = ${content}, "coverImage" = ${coverImage}, 
            "videoUrl" = ${videoUrlStr},
            "readingTime" = ${readingTime}, "categoryId" = ${categoryId},
            "updatedAt" = NOW()
        WHERE id = ${id}
      `;
    } else {
      // Create
      await sql`
        INSERT INTO "Post" (id, title, slug, subtitle, content, "coverImage", "videoUrl", "readingTime", published, "authorId", "categoryId")
        VALUES (gen_random_uuid()::text, ${title}, ${slug}, ${subtitle}, ${content}, ${coverImage}, ${videoUrlStr}, ${readingTime}, true, 'admin-id', ${categoryId})
      `;
    }
    
    revalidatePath('/');
    revalidatePath('/admin/posts');
    return { success: true };
  } catch (error) {
    console.error('Failed to save post:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deletePost(id: string) {
  if (!id) return { success: false, error: 'ID is required' };
  
  console.log(`[DB] Deleting post with ID: ${id}`);
  try {
    await sql`DELETE FROM "Post" WHERE id = ${id}`;
    
    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath('/admin/videos');
    return { success: true };
  } catch (error) {
    console.error(`[DB] Failed to delete post ${id}:`, error);
    return { success: false, error: (error as Error).message };
  }
}

export async function saveCategory(data: { id?: string; name: string; slug?: string }) {
  try {
    const { id, name } = data;
    let slug = data.slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    if (!slug) slug = `category-${Date.now()}`;

    if (id) {
      await sql`
        UPDATE "Category"
        SET name = ${name}, slug = ${slug}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        INSERT INTO "Category" (id, name, slug)
        VALUES (gen_random_uuid()::text, ${name}, ${slug})
      `;
    }

    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    console.error('Failed to save category:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if category has posts
    const postCount = await sql`
      SELECT COUNT(*) as count FROM "Post" WHERE "categoryId" = ${id}
    `;
    
    if (parseInt(postCount[0].count) > 0) {
      return { success: false, error: 'このカテゴリーを使用している記事があるため削除できません。' };
    }

    await sql`DELETE FROM "Category" WHERE id = ${id}`;
    
    revalidatePath('/');
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete category:', error);
    return { success: false, error: (error as Error).message };
  }
}
