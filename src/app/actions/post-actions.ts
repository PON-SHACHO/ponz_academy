'use server';

import { sql } from '@/lib/db-neon';
import { Post, Category } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getPosts(options?: { categorySlug?: string; limit?: number }) {
  try {
    let query = sql`
      SELECT p.*, c.name as "categoryName", u.name as "authorName"
      FROM "Post" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      LEFT JOIN "User" u ON p."authorId" = u.id
      WHERE p.published = true
    `;

    if (options?.categorySlug && options.categorySlug !== 'すべて') {
      // In a real app we'd append WHERE or use a better query builder
      // For now, let's just filter by category name for simplicity in this raw SQL example
      const posts = await sql`
        SELECT p.*, c.name as "categoryName", u.name as "authorName"
        FROM "Post" p
        LEFT JOIN "Category" c ON p."categoryId" = c.id
        LEFT JOIN "User" u ON p."authorId" = u.id
        WHERE p.published = true AND (c.name = ${options.categorySlug} OR c.slug = ${options.categorySlug})
        ORDER BY p."createdAt" DESC
        LIMIT ${options.limit || 10}
      `;
      return posts as unknown as Post[];
    }

    const posts = await sql`
      SELECT p.*, c.name as "categoryName", u.name as "authorName"
      FROM "Post" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      LEFT JOIN "User" u ON p."authorId" = u.id
      WHERE p.published = true
      ORDER BY p."createdAt" DESC
      LIMIT ${options?.limit || 10}
    `;
    return posts as unknown as Post[];
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
      SELECT p.*, c.name as "categoryName", u.name as "authorName"
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
    const categories = await sql`SELECT * FROM "Category" ORDER BY name ASC`;
    return categories as unknown as Category[];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function savePost(data: Partial<Post>) {
  try {
    const { id, title, slug, subtitle, content, coverImage, readingTime, categoryId } = data;
    
    if (id) {
      // Update
      await sql`
        UPDATE "Post"
        SET title = ${title}, slug = ${slug}, subtitle = ${subtitle}, 
            content = ${content}, "coverImage" = ${coverImage}, 
            "readingTime" = ${readingTime}, "categoryId" = ${categoryId},
            "updatedAt" = NOW()
        WHERE id = ${id}
      `;
    } else {
      // Create
      await sql`
        INSERT INTO "Post" (id, title, slug, subtitle, content, "coverImage", "readingTime", published, "authorId", "categoryId")
        VALUES (gen_random_uuid()::text, ${title}, ${slug}, ${subtitle}, ${content}, ${coverImage}, ${readingTime}, true, 'admin-id', ${categoryId})
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
