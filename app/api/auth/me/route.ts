import { NextRequest, NextResponse } from 'next/server';
import { sessionFromRequest } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await sessionFromRequest(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ kind: session.kind, userType: session.userType, email: session.email, permissions: session.permissions, mustChangePassword: session.mustChangePassword });
}
