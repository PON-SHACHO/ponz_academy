'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db-neon';
import { 
  createMemberSessionToken, 
  getMemberCookieOptions, 
  MEMBER_COOKIE_NAME 
} from '@/lib/member-session';

export async function memberRegister(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error: string }> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'すべての項目を入力してください。' };
  }

  try {
    // Check if email already exists
    const existing = await sql`SELECT id FROM "User" WHERE email = ${email.toLowerCase()} LIMIT 1`;
    if (existing.length > 0) {
      return { error: 'このメールアドレスは既に登録されています。' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await sql`
      INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, ${name}, ${email.toLowerCase()}, ${hashedPassword}, 'MEMBER', NOW(), NOW())
      RETURNING id, role
    `;

    const userId = result[0].id;
    const role = result[0].role as string;
    const token = await createMemberSessionToken(userId, role);
    const cookieStore = await cookies();
    
    cookieStore.set(MEMBER_COOKIE_NAME, token, getMemberCookieOptions());
  } catch (error) {
    console.error('Registration failed:', error);
    return { error: '登録に失敗しました。もう一度お試しください。' };
  }

  redirect('/');
}

export async function memberLogin(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'メールアドレスとパスワードを入力してください。' };
  }

  try {
    // Find user — fetch role too so JWT has the correct role
    const users = await sql`SELECT id, password, role FROM "User" WHERE email = ${email.toLowerCase()} LIMIT 1`;
    if (users.length === 0) {
      return { error: 'メールアドレスまたはパスワードが正しくありません。' };
    }

    const user = users[0];
    
    // Check password (handle legacy plain text if any, but focus on hashed)
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { error: 'メールアドレスまたはパスワードが正しくありません。' };
    }

    const token = await createMemberSessionToken(user.id as string, user.role as string);
    const cookieStore = await cookies();
    
    cookieStore.set(MEMBER_COOKIE_NAME, token, getMemberCookieOptions());
  } catch (error) {
    console.error('Login failed:', error);
    return { error: 'ログインに失敗しました。' };
  }

  redirect('/');
}

export async function memberLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(MEMBER_COOKIE_NAME);
  redirect('/login');
}


