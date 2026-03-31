import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-session';
import { verifyMemberSessionToken, MEMBER_COOKIE_NAME } from '@/lib/member-session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // --- Admin Area Protection ---
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next(); // Admin login is public
    }
    
    const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isAdminAuthenticated = adminToken ? await verifyAdminSessionToken(adminToken) : false;

    if (!isAdminAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // --- General Member Area Protection ---
  // Public auth pages for members
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  const memberToken = request.cookies.get(MEMBER_COOKIE_NAME)?.value;
  const memberSession = memberToken ? await verifyMemberSessionToken(memberToken) : null;

  if (!memberSession) {
    const url = request.nextUrl.clone();
    // Pre-fill a redirect parameter if needed in the future, for now just go to login
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Pass session data to headers so pages can know who is logged in if needed
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', memberSession.userId);
  requestHeaders.set('x-user-role', memberSession.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
