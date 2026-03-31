'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  createAdminSessionToken,
  getAdminCookieOptions,
  ADMIN_COOKIE_NAME,
} from '@/lib/admin-session';

export async function adminLogin(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error: string }> {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: 'ADMIN_PASSWORD is not configured.' };
  }

  if (password !== adminPassword) {
    return { error: 'パスワードが正しくありません。' };
  }

  const token = await createAdminSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, getAdminCookieOptions());

  redirect('/admin/posts');
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect('/admin/login');
}
