/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { asc, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { admitsPerTicket } from '@/lib/pos';
import { events, posTellers, ticketSales, ticketTypes } from '@/lib/schema';
import { sessionFromRequest } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await sessionFromRequest(request);
  if (!session || !db) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const device = request.nextUrl.searchParams.get('device') ?? '';
  if (!/^[A-Z0-9]{4}$/.test(device)) return NextResponse.json({ error: 'Invalid device' }, { status: 400 });

  try {
    const [types, sales, [event]] = await Promise.all([
      db.select().from(ticketTypes).where(eq(ticketTypes.isActive, true)).orderBy(asc(ticketTypes.sortOrder), asc(ticketTypes.id)),
      db.select({ ticketTypeId: ticketSales.ticketTypeId, quantity: ticketSales.quantity, status: ticketSales.status, soldBy: ticketSales.soldBy, receiptCode: ticketSales.receiptCode }).from(ticketSales),
      db.select({ name: events.name }).from(events).where(eq(events.isCurrent, true)).orderBy(desc(events.id)).limit(1),
    ]);

    const paid = sales.filter((s: any) => s.status === 'paid');
    const sold = (id: number) => paid.filter((s: any) => s.ticketTypeId === id).reduce((sum: number, s: any) => sum + s.quantity, 0);
    const tickets = types.map((type: any) => ({
      id: type.id,
      name: type.name,
      admits: type.admits,
      admitsCount: admitsPerTicket(type.admits),
      tier: type.tier,
      price: type.price,
      remaining: type.capacity == null ? null : Math.max(0, type.capacity - sold(type.id)),
    }));

    // Admins have no limit. A teller with no allowance yet gets zero rather than unlimited.
    let allocation = { tickets: null as number | null, admits: null as number | null, usedElsewhereTickets: 0, usedElsewhereAdmits: 0 };
    if (session.kind !== 'admin' && session.refId != null) {
      const [teller] = await db.select().from(posTellers).where(eq(posTellers.memberId, session.refId)).limit(1);
      // This device adds its own sales, so only count what this teller sold elsewhere.
      const elsewhere = paid.filter((s: any) => s.soldBy === session.email && !s.receiptCode?.startsWith(`${device}-`));
      const allTypes = await db.select({ id: ticketTypes.id, admits: ticketTypes.admits }).from(ticketTypes);
      allocation = {
        tickets: teller?.ticketsAllocated ?? 0,
        admits: teller?.admitLimit ?? 0,
        usedElsewhereTickets: elsewhere.reduce((sum: number, s: any) => sum + s.quantity, 0),
        usedElsewhereAdmits: elsewhere.reduce((sum: number, s: any) => sum + s.quantity * admitsPerTicket(allTypes.find((t: any) => t.id === s.ticketTypeId)?.admits), 0),
      };
    }

    return NextResponse.json({ staff: session.email, eventName: event?.name ?? 'TeensRave', tickets, allocation });
  } catch (error) {
    console.error('POS bootstrap error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
