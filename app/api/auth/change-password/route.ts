import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { adminUsers, userAccounts } from '@/lib/schema';
import { homeFor, SESSION_COOKIE, SESSION_SECONDS, sessionCookieOptions, sessionFromRequest, signSession } from '@/lib/session';

const MIN_LENGTH = 10;

export async function POST(request: NextRequest) {
  const session = await sessionFromRequest(request);
  if (!session || !db) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { current, next } = await request.json().catch(() => ({}));
  if (typeof current !== 'string' || typeof next !== 'string') return NextResponse.json({ message: 'Enter your current and new password.' }, { status: 400 });
  if (next.length < MIN_LENGTH) return NextResponse.json({ message: `Your new password must be at least ${MIN_LENGTH} characters.` }, { status: 400 });
  if (next === current) return NextResponse.json({ message: 'Choose a different password from your current one.' }, { status: 400 });

  const table = session.kind === 'admin' ? adminUsers : userAccounts;
  const [user] = await db.select().from(table).where(eq(table.id, session.id)).limit(1);
  if (!user || !(await bcrypt.compare(current, user.password))) return NextResponse.json({ message: 'Your current password is incorrect.' }, { status: 400 });

  // A new version signs out every other device using the old password.
  const version = user.sessionVersion + 1;
  const changes = session.kind === 'admin'
    ? { password: await bcrypt.hash(next, 12), sessionVersion: version }
    : { password: await bcrypt.hash(next, 12), sessionVersion: version, mustChangePassword: false };
  await db.update(table).set(changes).where(eq(table.id, session.id));

  const response = NextResponse.json({ home: homeFor({ kind: session.kind, mustChangePassword: false }) });
  response.cookies.set(SESSION_COOKIE, signSession({ kind: session.kind, id: session.id, email: session.email, v: version }), { ...sessionCookieOptions, maxAge: SESSION_SECONDS });
  return response;
}
