import { NextResponse } from 'next/server';
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });
  response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, expires: new Date(0) });
  return response;
}
