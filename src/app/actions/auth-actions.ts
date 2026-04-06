'use server';

import { sql } from '@/lib/db-neon';
import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import { crypto } from 'next/dist/compiled/@edge-runtime/primitives';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function requestPasswordReset(email: string) {
  try {
    // Check if user exists
    const users = await sql`SELECT id FROM "User" WHERE email = ${email}`;
    if (users.length === 0) {
      // For security, don't reveal if user exists. Just return success.
      return { success: true };
    }

    // Generate token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 3600000); // 1 hour expiry

    // Save token to DB
    await sql`
      INSERT INTO "PasswordResetToken" (id, token, email, expires)
      VALUES (gen_random_uuid()::text, ${token}, ${email}, ${expires})
      ON CONFLICT (token) DO UPDATE SET expires = ${expires}
    `;

    // Send email via Resend
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ponz-academy.vercel.app'}/reset-password?token=${token}`;
    
    await resend.emails.send({
      from: 'Ponzu Academy <onboarding@resend.dev>',
      to: email,
      subject: 'パスワード再設定のご案内',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>パスワード再設定</h2>
          <p>以下のボタンをクリックしてパスワードの再設定を完了させてください。有効期限は1時間です。</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2A4D4D; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">パスワードを再設定する</a>
          <p>このメールに心当たりがない場合は、無視していただいて構いません。</p>
        </div>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { success: false, error: '送信に失敗しました。後ほどやり直してください。' };
  }
}

export async function resetPassword(token: string, newPass: string) {
  try {
    // Validate token
    const tokens = await sql`
      SELECT * FROM "PasswordResetToken" 
      WHERE token = ${token} AND expires > NOW()
    `;
    
    if (tokens.length === 0) {
      return { success: false, error: '無効なトークンか、有効期限が切れています。' };
    }

    const { email } = tokens[0];
    const hashed = await bcrypt.hash(newPass, 10);

    // Update user password
    await sql`
      UPDATE "User"
      SET password = ${hashed}, "updatedAt" = NOW()
      WHERE email = ${email}
    `;

    // Delete token
    await sql`DELETE FROM "PasswordResetToken" WHERE token = ${token}`;

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'パスワードの更新に失敗しました。' };
  }
}
