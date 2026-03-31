/**
 * 特定のメールアドレスを管理者として判定するユーティリティ
 */

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ponz.academy';

/**
 * 渡されたメールアドレスが管理者かどうかをチェックします。
 * @param email ユーザーのメールアドレス
 * @returns boolean
 */
export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
