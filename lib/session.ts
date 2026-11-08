import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { allPermissions } from '@/lib/permissions';
import { isAccountType, personSources, type AccountType } from '@/lib/people';
import { adminUsers, members, roles, userAccounts } from '@/lib/schema';

export const SESSION_COOKIE = 'tr_session';
export const SESSION_SECONDS = 86400;

export const sessionCookieOptions = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

type TokenPayload = { kind: 'admin' | 'account'; id: number; email: string; v: number };

export type Session = {
  kind: 'admin' | 'account';
  id: number;
  email: string;
  accountType: AccountType | 'admin';
  refId: number | null;
  /** Dashboard variant: admin, executive, volunteer, staff, crew, media, performer, vendor or sponsor. */
  userType: string;
  permissions: string[];
  mustChangePassword: boolean;
};

export function signSession(payload: TokenPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.sign(payload, secret, { expiresIn: SESSION_SECONDS });
}

export function homeFor(session: Pick<Session, 'kind' | 'mustChangePassword'>) {
  if (session.mustChangePassword) return '/change-password';
  return session.kind === 'admin' ? '/admin/dashboard/overview' : '/dashboard';
}

// Checked against the database on every request, so disabling someone or changing their role applies at once.
export async function loadSession(token: string | undefined): Promise<Session | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret || !token || !db) return null;

  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, secret) as TokenPayload;
  } catch {
    return null;
  }

  try {
    if (payload.kind === 'admin') {
      const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, payload.id)).limit(1);
      if (!admin || !admin.isActive || admin.sessionVersion !== payload.v) return null;
      return { kind: 'admin', id: admin.id, email: admin.email, accountType: 'admin', refId: null, userType: 'admin', permissions: allPermissions, mustChangePassword: false };
    }

    if (payload.kind !== 'account') return null;
    const [account] = await db.select().from(userAccounts).where(eq(userAccounts.id, payload.id)).limit(1);
    if (!account || !account.isActive || account.sessionVersion !== payload.v || !isAccountType(account.accountType)) return null;

    const source = personSources[account.accountType as AccountType];
    const [person] = await db.select().from(source.table).where(eq(source.table.id, account.refId)).limit(1);
    if (!person || !source.isActive(person)) return null;

    let permissions: string[] = [];
    let userType: string = account.accountType;
    if (account.accountType === 'member') {
      const member = person as typeof members.$inferSelect;
      userType = member.category;
      if (member.roleId) {
        const [role] = await db.select().from(roles).where(eq(roles.id, member.roleId)).limit(1);
        permissions = role?.permissions ?? [];
      }
    }

    return { kind: 'account', id: account.id, email: account.email, accountType: account.accountType, refId: account.refId, userType, permissions, mustChangePassword: account.mustChangePassword };
  } catch (error) {
    console.error('Could not load session:', error);
    return null;
  }
}

export function sessionFromRequest(request: NextRequest) {
  return loadSession(request.cookies.get(SESSION_COOKIE)?.value);
}
