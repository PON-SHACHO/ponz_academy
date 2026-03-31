'use server';

import { sql } from '@/lib/db-neon';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  try {
    const users = await sql`
      SELECT id, name, email, role, "createdAt", "updatedAt"
      FROM "User"
      ORDER BY "createdAt" ASC
    `;
    return users.map(user => ({
      ...user,
      id: user.id as string,
      name: user.name as string | null,
      email: user.email as string,
      role: user.role as string,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    await sql`
      UPDATE "User"
      SET role = ${newRole}, "updatedAt" = NOW()
      WHERE id = ${userId}
    `;
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Failed to update user role:', error);
    return { success: false, error: 'ロールの更新に失敗しました。' };
  }
}

export async function deleteUser(userId: string) {
  try {
    await sql`
      DELETE FROM "User"
      WHERE id = ${userId}
    `;
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete user:', error);
    return { success: false, error: 'ユーザーの削除に失敗しました。' };
  }
}
