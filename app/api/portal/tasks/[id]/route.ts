import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { tasks } from '@/lib/schema';
import { sessionFromRequest } from '@/lib/session';

const STATUSES = ['open', 'in progress', 'done'];

// People can update the status of tasks assigned to them, and nothing else.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await sessionFromRequest(request);
  if (session?.accountType !== 'member' || session.refId == null || !db) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const { status } = await request.json().catch(() => ({}));
  if (!/^\d{1,9}$/.test(id) || !STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const updated = await db
    .update(tasks)
    .set({ status })
    .where(and(eq(tasks.id, Number(id)), eq(tasks.assigneeId, session.refId)))
    .returning({ id: tasks.id });
  if (updated.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
