/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { activityLog, ticketSales, ticketTypes } from '@/lib/schema';
import { sessionFromRequest } from '@/lib/session';

const MAX_BATCH = 100;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function problem(sale: any, validTypes: Set<number>) {
  if (typeof sale?.clientRef !== 'string' || !UUID.test(sale.clientRef)) return 'Invalid reference';
  if (typeof sale.receiptCode !== 'string' || !/^[A-Z0-9-]{3,32}$/.test(sale.receiptCode)) return 'Invalid receipt code';
  if (!validTypes.has(sale.ticketTypeId)) return 'This ticket type no longer exists';
  if (!Number.isInteger(sale.quantity) || sale.quantity < 1 || sale.quantity > 50) return 'Invalid quantity';
  if (typeof sale.amount !== 'string' || !/^\d{1,10}(\.\d{1,2})?$/.test(sale.amount)) return 'Invalid amount';
  if (typeof sale.soldAt !== 'string' || Number.isNaN(Date.parse(sale.soldAt))) return 'Invalid time';
  if (typeof sale.voided !== 'boolean') return 'Invalid sale';
  return null;
}

// Safe to repeat: a sale already uploaded is recognised by its reference and never counted twice.
export async function POST(request: NextRequest) {
  const session = await sessionFromRequest(request);
  if (!session || !db) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const sales = body?.sales;
  if (!Array.isArray(sales) || sales.length === 0 || sales.length > MAX_BATCH) return NextResponse.json({ error: 'Invalid batch' }, { status: 400 });
  const deviceLabel = typeof body.deviceLabel === 'string' ? body.deviceLabel.slice(0, 60) : null;

  try {
    const types = await db.select({ id: ticketTypes.id }).from(ticketTypes);
    const validTypes = new Set<number>(types.map((t: any) => t.id));

    const rejected: { clientRef: unknown; error: string }[] = [];
    const valid = sales.filter((sale: any) => {
      const error = problem(sale, validTypes);
      if (error) rejected.push({ clientRef: sale?.clientRef, error });
      return !error;
    });

    if (valid.length > 0) {
      await db
        .insert(ticketSales)
        .values(
          valid.map((sale: any) => ({
            ticketTypeId: sale.ticketTypeId,
            buyerName: String(sale.buyerName || 'Walk-in').slice(0, 255),
            quantity: sale.quantity,
            amount: sale.amount,
            channel: 'Cash',
            // Selling at the door is the admission.
            checkedIn: !sale.voided,
            status: sale.voided ? 'refunded' : 'paid',
            clientRef: sale.clientRef,
            receiptCode: sale.receiptCode,
            deviceLabel,
            soldBy: session.email,
            soldAt: new Date(sale.soldAt),
          }))
        )
        .onConflictDoNothing({ target: ticketSales.clientRef });

      // A sale can be voided after it was uploaded. Voids only ever apply one way.
      const voided = valid.filter((sale: any) => sale.voided).map((sale: any) => sale.clientRef);
      if (voided.length > 0) await db.update(ticketSales).set({ status: 'refunded', checkedIn: false }).where(inArray(ticketSales.clientRef, voided));

      await db.insert(activityLog).values({ actor: session.email, action: 'updated', resource: 'ticket-sales', summary: `${valid.length} POS sale(s) uploaded from ${deviceLabel ?? 'a device'}` });
    }

    return NextResponse.json({ accepted: valid.map((sale: any) => sale.clientRef), rejected });
  } catch (error) {
    console.error('POS sync error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
