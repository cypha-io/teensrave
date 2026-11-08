import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { isResourceKey, resources, type ResourceKey } from '@/lib/admin-resources';
import { afterSave, beforeSave, databaseError, guardValues, logActivity, resourceAccess, tables, validate } from '@/lib/admin-api';
import { userAccounts } from '@/lib/schema';
import { sessionFromRequest, type Session } from '@/lib/session';

type Context = { params: Promise<{ resource: string; id: string }> };
type Target = { resource: ResourceKey; id: number; session: Session; access: ReturnType<typeof resourceAccess> };
const forbidden = () => NextResponse.json({ error: 'Forbidden' }, { status: 403 });
const accountTypeFor: Partial<Record<ResourceKey, string>> = { members: 'member', vendors: 'vendor', sponsors: 'sponsor' };

async function resolve(request: NextRequest, context: Context): Promise<Target | NextResponse> {
  const { resource, id } = await context.params;
  if (!isResourceKey(resource) || !/^\d{1,9}$/.test(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (resources[resource].readOnly) return NextResponse.json({ error: 'Read only' }, { status: 405 });
  if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  const session = await sessionFromRequest(request);
  if (!session || session.mustChangePassword) return forbidden();
  const access = resourceAccess(session, resource);
  if (!access.write) return forbidden();
  return { resource, id: Number(id), session, access };
}

async function outOfScope({ resource, id, access }: Target) {
  if (!access.writeCategories) return false;
  const table = tables[resource];
  const [existing] = await db.select().from(table).where(eq(table.id, id)).limit(1);
  return Boolean(existing) && !access.writeCategories.includes(existing.category);
}

export async function PATCH(request: NextRequest, context: Context) {
  const target = await resolve(request, context);
  if (target instanceof NextResponse) return target;
  const { resource, id, session, access } = target;

  const { values, errors } = validate(resources[resource], await request.json().catch(() => ({})), true);
  if (errors.length > 0) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
  if (!guardValues(session, resource, access, values)) return forbidden();
  if (Object.keys(values).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });

  try {
    if (await outOfScope(target)) return forbidden();
    await beforeSave(resource, values);
    const table = tables[resource];
    const [row] = await db.update(table).set(values).where(eq(table.id, id)).returning();
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await afterSave(resource, row);
    await logActivity(session.email, 'updated', resource, row);
    return NextResponse.json({ row });
  } catch (error) {
    return databaseError(error);
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const target = await resolve(request, context);
  if (target instanceof NextResponse) return target;
  const { resource, id, session } = target;

  try {
    if (await outOfScope(target)) return forbidden();
    const table = tables[resource];
    const [row] = await db.delete(table).where(eq(table.id, id)).returning();
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const accountType = accountTypeFor[resource];
    if (accountType) await db.delete(userAccounts).where(and(eq(userAccounts.accountType, accountType), eq(userAccounts.refId, id)));
    await logActivity(session.email, 'deleted', resource, row);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return databaseError(error);
  }
}
