export type Role = 'USER' | 'MEMBER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  content: string;
  coverImage?: string | null;
  readingTime?: string | null;
  published: boolean;
  authorId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Joined fields
  categoryName?: string;
  authorName?: string;
  authorBio?: string | null;
  authorAvatarUrl?: string | null;
}
