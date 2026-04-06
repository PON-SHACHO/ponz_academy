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

export async function updateUserProfile(userId: string, data: { name: string; bio: string }) {
  try {
    await sql`
      UPDATE "User"
      SET name = ${data.name}, bio = ${data.bio}, "updatedAt" = NOW()
      WHERE id = ${userId}
    `;
    revalidatePath('/admin/users');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { success: false, error: 'プロフィールの更新に失敗しました。' };
  }
}

import bcrypt from 'bcryptjs';

export async function changePassword(userId: string, currentPass: string, newPass: string) {
  try {
    const users = await sql`SELECT password FROM "User" WHERE id = ${userId}`;
    if (users.length === 0) return { success: false, error: 'ユーザーが見つかりません。' };

    const isMatch = await bcrypt.compare(currentPass, users[0].password);
    if (!isMatch) return { success: false, error: '現在のパスワードが正しくありません。' };

    const hashed = await bcrypt.hash(newPass, 10);
    await sql`
      UPDATE "User"
      SET password = ${hashed}, "updatedAt" = NOW()
      WHERE id = ${userId}
    `;
    return { success: true };
  } catch (error) {
    console.error('Failed to change password:', error);
    return { success: false, error: 'パスワードの変更に失敗しました。' };
  }
}
