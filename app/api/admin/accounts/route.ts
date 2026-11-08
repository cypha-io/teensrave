/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomInt } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { databaseError } from '@/lib/admin-api';
import { isAccountType, personSources, type AccountType } from '@/lib/people';
import { activityLog, adminUsers, userAccounts } from '@/lib/schema';
import { sessionFromRequest, type Session } from '@/lib/session';

const ALPHABET = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
const temporaryPassword = () => Array.from({ length: 14 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');

async function adminOnly(request: NextRequest): Promise<Session | NextResponse> {
  const session = await sessionFromRequest(request);
  if (session?.kind !== 'admin' || !db) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return session;
}

function parse(type: unknown, id: unknown): { type: AccountType; id: number } | null {
  const number = Number(id);
  return isAccountType(type) && Number.isInteger(number) && number > 0 ? { type, id: number } : null;
}

async function findAccount(type: AccountType, id: number) {
  const [account] = await db.select().from(userAccounts).where(and(eq(userAccounts.accountType, type), eq(userAccounts.refId, id))).limit(1);
  return account as typeof userAccounts.$inferSelect | undefined;
}

async function findPerson(type: AccountType, id: number) {
  const source = personSources[type];
  const [person] = await db.select().from(source.table).where(eq(source.table.id, id)).limit(1);
  return person as Record<string, any> | undefined;
}

const summary = (account?: typeof userAccounts.$inferSelect) =>
  account ? { email: account.email, isActive: account.isActive, mustChangePassword: account.mustChangePassword, lastLoginAt: account.lastLoginAt } : null;

const log = (session: Session, action: string, type: AccountType, id: number, email: string) =>
  db.insert(activityLog).values({ actor: session.email, action, resource: `${type} login`, recordId: id, summary: email });

export async function GET(request: NextRequest) {
  const session = await adminOnly(request);
  if (session instanceof NextResponse) return session;
  const { searchParams } = request.nextUrl;
  const target = parse(searchParams.get('type'), searchParams.get('id'));
  if (!target) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  try {
    const person = await findPerson(target.type, target.id);
    if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ account: summary(await findAccount(target.type, target.id)), email: person[personSources[target.type].emailField] ?? null });
  } catch (error) {
    return databaseError(error);
  }
}

// Creates a login, or resets the password of an existing one.
export async function POST(request: NextRequest) {
  const session = await adminOnly(request);
  if (session instanceof NextResponse) return session;
  const body = await request.json().catch(() => ({}));
  const target = parse(body.type, body.id);
  if (!target) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  try {
    const source = personSources[target.type];
    const person = await findPerson(target.type, target.id);
    if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!source.isActive(person)) return NextResponse.json({ error: 'This person isn’t active, so they can’t have a login.' }, { status: 400 });

    const email = String(person[source.emailField] ?? '').trim().toLowerCase();
    if (!email) return NextResponse.json({ error: 'Add an email address to this person first.' }, { status: 400 });

    const [adminClash] = await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    if (adminClash) return NextResponse.json({ error: 'That email already belongs to an admin login.' }, { status: 409 });

    const plain = temporaryPassword();
    const password = await bcrypt.hash(plain, 12);
    const existing = await findAccount(target.type, target.id);
    if (existing) {
      await db
        .update(userAccounts)
        .set({ email, password, mustChangePassword: true, isActive: true, sessionVersion: existing.sessionVersion + 1, failedAttempts: 0, lockedUntil: null })
        .where(eq(userAccounts.id, existing.id));
    } else {
      await db.insert(userAccounts).values({ email, password, accountType: target.type, refId: target.id });
    }
    await log(session, existing ? 'password reset' : 'login created', target.type, target.id, email);

    return NextResponse.json({ email, temporaryPassword: plain, account: summary(await findAccount(target.type, target.id)) });
  } catch (error) {
    return databaseError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const session = await adminOnly(request);
  if (session instanceof NextResponse) return session;
  const body = await request.json().catch(() => ({}));
  const target = parse(body.type, body.id);
  if (!target || typeof body.isActive !== 'boolean') return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  try {
    const existing = await findAccount(target.type, target.id);
    if (!existing) return NextResponse.json({ error: 'No login exists yet.' }, { status: 404 });
    await db.update(userAccounts).set({ isActive: body.isActive }).where(eq(userAccounts.id, existing.id));
    await log(session, body.isActive ? 'login enabled' : 'login disabled', target.type, target.id, existing.email);
    return NextResponse.json({ account: summary(await findAccount(target.type, target.id)) });
  } catch (error) {
    return databaseError(error);
  }
}
