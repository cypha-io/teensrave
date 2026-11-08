/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { databaseError } from '@/lib/admin-api';
import { admitsPerTicket } from '@/lib/pos';
import { activityLog, members, posTellerTickets, posTellers, roles, ticketSales, ticketTypes, userAccounts } from '@/lib/schema';
import { sessionFromRequest } from '@/lib/session';

const MAX = 1_000_000;
const validCount = (value: unknown) => Number.isInteger(value) && (value as number) >= 0 && (value as number) <= MAX;

// { ticketTypeId: limit }, where null removes that ticket type's own limit.
function validTypeLimits(value: unknown) {
  if (value === undefined) return true;
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  return Object.entries(value).every(([id, limit]) => /^\d{1,9}$/.test(id) && (limit === null || validCount(limit)));
}

async function saveTypeLimits(memberId: number, limits: Record<string, number | null> | undefined) {
  if (!limits) return;
  const entries = Object.entries(limits);
  const set = entries.filter(([, limit]) => limit !== null).map(([id, limit]) => ({ memberId, ticketTypeId: Number(id), ticketLimit: limit as number }));
  const cleared = entries.filter(([, limit]) => limit === null).map(([id]) => Number(id));
  if (set.length > 0) {
    await db
      .insert(posTellerTickets)
      .values(set)
      .onConflictDoUpdate({ target: [posTellerTickets.memberId, posTellerTickets.ticketTypeId], set: { ticketLimit: sql`excluded.ticket_limit` } });
  }
  if (cleared.length > 0) await db.delete(posTellerTickets).where(and(eq(posTellerTickets.memberId, memberId), inArray(posTellerTickets.ticketTypeId, cleared)));
}

async function loadTellers() {
  const [people, allRoles, allocations, accounts, sales, types, typeLimits] = await Promise.all([
    db.select().from(members).where(eq(members.status, 'active')),
    db.select().from(roles),
    db.select().from(posTellers),
    db.select({ email: userAccounts.email, refId: userAccounts.refId }).from(userAccounts).where(eq(userAccounts.accountType, 'member')),
    db.select().from(ticketSales).where(eq(ticketSales.status, 'paid')),
    db.select({ id: ticketTypes.id, admits: ticketTypes.admits, name: ticketTypes.name, tier: ticketTypes.tier, isActive: ticketTypes.isActive, sortOrder: ticketTypes.sortOrder }).from(ticketTypes),
    db.select().from(posTellerTickets),
  ]);

  const viaRole = (person: any) => Boolean(allRoles.find((role: any) => role.id === person.roleId)?.permissions.includes('pos.manage'));
  const assigned = (person: any) => allocations.some((a: any) => a.memberId === person.id);

  const tellers = people
    .filter((person: any) => viaRole(person) || assigned(person))
    .map((person: any) => {
      const allocation = allocations.find((a: any) => a.memberId === person.id);
      const email = accounts.find((a: any) => a.refId === person.id)?.email ?? null;
      const mine = email ? sales.filter((s: any) => s.soldBy === email) : [];
      return {
        memberId: person.id,
        name: person.fullName,
        code: person.memberCode,
        hasLogin: Boolean(email),
        viaRole: viaRole(person),
        ticketsAllocated: allocation?.ticketsAllocated ?? 0,
        admitLimit: allocation?.admitLimit ?? 0,
        ticketsSold: mine.reduce((sum: number, s: any) => sum + s.quantity, 0),
        peopleAdmitted: mine.reduce((sum: number, s: any) => sum + s.quantity * admitsPerTicket(types.find((t: any) => t.id === s.ticketTypeId)?.admits), 0),
        cash: mine.reduce((sum: number, s: any) => sum + Number(s.amount ?? 0), 0),
        typeLimits: Object.fromEntries(typeLimits.filter((row: any) => row.memberId === person.id).map((row: any) => [row.ticketTypeId, row.ticketLimit])),
        typeSold: Object.fromEntries(types.map((type: any) => [type.id, mine.filter((s: any) => s.ticketTypeId === type.id).reduce((sum: number, s: any) => sum + s.quantity, 0)])),
      };
    })
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  const candidates = people
    .filter((person: any) => !viaRole(person) && !assigned(person))
    .map((person: any) => ({ memberId: person.id, name: person.fullName, category: person.category }))
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  const ticketOptions = types
    .filter((type: any) => type.isActive)
    .sort((a: any, b: any) => a.sortOrder - b.sortOrder || a.id - b.id)
    .map((type: any) => ({ id: type.id, name: type.name, tier: type.tier }));

  return { tellers, candidates, ticketTypes: ticketOptions };
}

export async function GET() {
  if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  try {
    return NextResponse.json(await loadTellers());
  } catch (error) {
    return databaseError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const session = await sessionFromRequest(request);
  if (!session || !db) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { memberId, ticketsAllocated, admitLimit, typeLimits } = await request.json().catch(() => ({}));
  if (!Number.isInteger(memberId) || !validCount(ticketsAllocated) || !validCount(admitLimit) || !validTypeLimits(typeLimits)) {
    return NextResponse.json({ error: 'Enter whole numbers of 0 or more.' }, { status: 400 });
  }

  try {
    const teller = (await loadTellers()).tellers.find((t: any) => t.memberId === memberId);
    if (!teller) return NextResponse.json({ error: 'This person is not a POS teller.' }, { status: 404 });

    await db
      .insert(posTellers)
      .values({ memberId, ticketsAllocated, admitLimit })
      .onConflictDoUpdate({ target: posTellers.memberId, set: { ticketsAllocated, admitLimit, updatedAt: new Date() } });
    await saveTypeLimits(memberId, typeLimits);
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

// Makes someone a teller, without touching the role they already hold.
export async function POST(request: NextRequest) {
  const session = await sessionFromRequest(request);
  if (!session || !db) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { memberId, ticketsAllocated = 0, admitLimit = 0 } = await request.json().catch(() => ({}));
  if (!Number.isInteger(memberId) || !validCount(ticketsAllocated) || !validCount(admitLimit)) {
    return NextResponse.json({ error: 'Choose a person and enter whole numbers of 0 or more.' }, { status: 400 });
  }

  try {
    const person = (await loadTellers()).candidates.find((c: any) => c.memberId === memberId);
    if (!person) return NextResponse.json({ error: 'This person can’t be assigned. They may already be a teller or be inactive.' }, { status: 409 });
    await db.insert(posTellers).values({ memberId, ticketsAllocated, admitLimit });
    await db.insert(activityLog).values({ actor: session.email, action: 'created', resource: 'pos-tellers', recordId: memberId, summary: `${person.name}: assigned as teller` });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return databaseError(error);
  }
}

export async function DELETE(request: NextRequest) {
  const session = await sessionFromRequest(request);
  if (!session || !db) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const memberId = Number(request.nextUrl.searchParams.get('memberId'));
  if (!Number.isInteger(memberId) || memberId < 1) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  try {
    const teller = (await loadTellers()).tellers.find((t: any) => t.memberId === memberId);
    if (!teller) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (teller.viaRole) return NextResponse.json({ error: 'This person is a teller through their role. Change their role in Users.' }, { status: 400 });
    await db.delete(posTellerTickets).where(eq(posTellerTickets.memberId, memberId));
    await db.delete(posTellers).where(eq(posTellers.memberId, memberId));
    await db.insert(activityLog).values({ actor: session.email, action: 'deleted', resource: 'pos-tellers', recordId: memberId, summary: `${teller.name}: removed as teller` });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return databaseError(error);
  }
}
