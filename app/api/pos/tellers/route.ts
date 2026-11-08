/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { databaseError } from '@/lib/admin-api';
import { admitsPerTicket } from '@/lib/pos';
import { activityLog, members, posTellers, roles, ticketSales, ticketTypes, userAccounts } from '@/lib/schema';
import { sessionFromRequest } from '@/lib/session';

const MAX = 1_000_000;
const validCount = (value: unknown) => Number.isInteger(value) && (value as number) >= 0 && (value as number) <= MAX;

async function loadTellers() {
  const [people, allRoles, allocations, accounts, sales, types] = await Promise.all([
    db.select().from(members).where(eq(members.status, 'active')),
    db.select().from(roles),
    db.select().from(posTellers),
    db.select({ email: userAccounts.email, refId: userAccounts.refId }).from(userAccounts).where(eq(userAccounts.accountType, 'member')),
    db.select().from(ticketSales).where(eq(ticketSales.status, 'paid')),
    db.select({ id: ticketTypes.id, admits: ticketTypes.admits }).from(ticketTypes),
  ]);

  // A teller is anyone whose role lets them record sales on the POS.
  return people
    .filter((person: any) => allRoles.find((role: any) => role.id === person.roleId)?.permissions.includes('pos.manage'))
    .map((person: any) => {
      const allocation = allocations.find((a: any) => a.memberId === person.id);
      const email = accounts.find((a: any) => a.refId === person.id)?.email ?? null;
      const mine = email ? sales.filter((s: any) => s.soldBy === email) : [];
      return {
        memberId: person.id,
        name: person.fullName,
        code: person.memberCode,
        hasLogin: Boolean(email),
        ticketsAllocated: allocation?.ticketsAllocated ?? 0,
        admitLimit: allocation?.admitLimit ?? 0,
        ticketsSold: mine.reduce((sum: number, s: any) => sum + s.quantity, 0),
        peopleAdmitted: mine.reduce((sum: number, s: any) => sum + s.quantity * admitsPerTicket(types.find((t: any) => t.id === s.ticketTypeId)?.admits), 0),
        cash: mine.reduce((sum: number, s: any) => sum + Number(s.amount ?? 0), 0),
      };
    })
    .sort((a: any, b: any) => a.name.localeCompare(b.name));
}

export async function GET() {
  if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  try {
    return NextResponse.json({ tellers: await loadTellers() });
  } catch (error) {
    return databaseError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const session = await sessionFromRequest(request);
  if (!session || !db) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { memberId, ticketsAllocated, admitLimit } = await request.json().catch(() => ({}));
  if (!Number.isInteger(memberId) || !validCount(ticketsAllocated) || !validCount(admitLimit)) {
    return NextResponse.json({ error: 'Enter whole numbers of 0 or more.' }, { status: 400 });
  }

  try {
    const teller = (await loadTellers()).find((t: any) => t.memberId === memberId);
    if (!teller) return NextResponse.json({ error: 'This person is not a POS teller.' }, { status: 404 });

    await db
      .insert(posTellers)
      .values({ memberId, ticketsAllocated, admitLimit })
      .onConflictDoUpdate({ target: posTellers.memberId, set: { ticketsAllocated, admitLimit, updatedAt: new Date() } });
    await db.insert(activityLog).values({
      actor: session.email,
      action: 'updated',
      resource: 'pos-tellers',
      recordId: memberId,
      summary: `${teller.name}: ${ticketsAllocated} tickets, ${admitLimit} people`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return databaseError(error);
  }
}
