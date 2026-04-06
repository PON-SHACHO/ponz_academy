import { cookies } from 'next/headers';
import { verifyMemberSessionToken, MEMBER_COOKIE_NAME } from '@/lib/member-session';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-session';

export async function getSession() {
  const cookieStore = await cookies();
  
  // Try Member Session first
  const memberToken = cookieStore.get(MEMBER_COOKIE_NAME)?.value;
  if (memberToken) {
    const payload = await verifyMemberSessionToken(memberToken);
    if (payload) {
      return { userId: payload.userId, role: payload.role };
    }
  }
  
  // Try Admin Session
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (adminToken) {
    const isAdmin = await verifyAdminSessionToken(adminToken);
    if (isAdmin) {
      // Return hardcoded admin-id as used in post-actions.ts insert
      return { userId: 'admin-id', role: 'ADMIN' };
    }
  }
  
  return null;
}
