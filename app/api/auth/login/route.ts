import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { isAccountType, personSources, type AccountType } from '@/lib/people';
import { adminUsers, userAccounts } from '@/lib/schema';
import { homeFor, SESSION_COOKIE, SESSION_SECONDS, sessionCookieOptions, signSession } from '@/lib/session';

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const invalid = () => NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const dummyHash = bcrypt.hash('not-a-real-password', 12);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }
    if (!db || !process.env.JWT_SECRET) {
      return NextResponse.json({ message: 'Server is not configured' }, { status: 500 });
    }

    const address = email.trim().toLowerCase();
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, address)).limit(1);
    const [account] = admin ? [undefined] : await db.select().from(userAccounts).where(eq(userAccounts.email, address)).limit(1);
    const user = admin ?? account;
    const table = admin ? adminUsers : userAccounts;

    if (!user) {
      await bcrypt.compare(password, await dummyHash);
      return invalid();
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json({ message: `Too many attempts. Try again in ${LOCK_MINUTES} minutes.` }, { status: 429 });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const failedAttempts = user.failedAttempts + 1;
      const locked = failedAttempts >= MAX_ATTEMPTS;
      await db
        .update(table)
        .set({ failedAttempts: locked ? 0 : failedAttempts, lockedUntil: locked ? new Date(Date.now() + LOCK_MINUTES * 60000) : null })
        .where(eq(table.id, user.id));
      return invalid();
    }

    if (!user.isActive) return NextResponse.json({ message: 'This account has been disabled.' }, { status: 403 });

    if (account) {
      if (!isAccountType(account.accountType)) return invalid();
      const source = personSources[account.accountType as AccountType];
      const [person] = await db.select().from(source.table).where(eq(source.table.id, account.refId)).limit(1);
      if (!person || !source.isActive(person)) return NextResponse.json({ message: 'This account is not active.' }, { status: 403 });
    }

    await db.update(table).set({ lastLoginAt: new Date(), failedAttempts: 0, lockedUntil: null }).where(eq(table.id, user.id));

    const kind = admin ? ('admin' as const) : ('account' as const);
    const mustChangePassword = account?.mustChangePassword ?? false;
    const response = NextResponse.json({ message: 'Login successful', kind, home: homeFor({ kind, mustChangePassword }) });
    response.cookies.set(SESSION_COOKIE, signSession({ kind, id: user.id, email: user.email, v: user.sessionVersion }), { ...sessionCookieOptions, maxAge: SESSION_SECONDS });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
