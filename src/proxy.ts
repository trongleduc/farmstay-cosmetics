import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { SESSION_COOKIE } from '@/lib/auth';

/**
 * Chặn sớm các đường dẫn /admin khi chưa có cookie phiên.
 * Đây chỉ là kiểm tra lạc quan cho trải nghiệm chuyển trang; việc xác thực
 * thật nằm ở `requireAdmin()` trong layout admin và trong từng Server Action.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === '/admin/login') return NextResponse.next();
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const loginUrl = new URL('/admin/login', request.url);
  if (pathname !== '/admin') loginUrl.searchParams.set('next', pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: '/admin/:path*',
};
