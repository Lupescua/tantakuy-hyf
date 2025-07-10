import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Only apply on homepage
  if (pathname === '/' && token) {
    try {
      const user = verifyToken(token);
      if (user?.role === 'company') {
        const redirectUrl = new URL(`/company/${user.id}/profile`, request.url);
        return NextResponse.redirect(redirectUrl);
      }
    } catch (err) {
      console.error('Invalid token in middleware:', err);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
