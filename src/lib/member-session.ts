import 'server-only';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'member_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET || 'fallback-secret-for-members';
  return new TextEncoder().encode(secret);
}

export async function createMemberSessionToken(userId: string): Promise<string> {
  return new SignJWT({ userId, role: 'MEMBER' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyMemberSessionToken(token: string): Promise<{ userId: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    });
    return { userId: payload.userId as string, role: payload.role as string };
  } catch {
    return null;
  }
}

export function getMemberCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export { COOKIE_NAME as MEMBER_COOKIE_NAME };
