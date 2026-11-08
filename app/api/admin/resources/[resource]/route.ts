/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { asc, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { isResourceKey, resources } from '@/lib/admin-resources';
import { afterSave, beforeSave, databaseError, guardValues, logActivity, optionFields, resourceAccess, tables, validate } from '@/lib/admin-api';
import { sessionFromRequest } from '@/lib/session';

type Context = { params: Promise<{ resource: string }> };
const forbidden = () => NextResponse.json({ error: 'Forbidden' }, { status: 403 });

export async function GET(request: NextRequest, { params }: Context) {
  const { resource } = await params;
  if (!isResourceKey(resource)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  const session = await sessionFromRequest(request);
  if (!session || session.mustChangePassword) return forbidden();

  try {
    const table = tables[resource];
    const { sortAsc } = resources[resource];
    const query = () => db.select().from(table).orderBy(sortAsc ? asc(table[sortAsc]) : desc(table.id)).limit(5000);

    // Dropdowns only need a name, so anyone with admin-area access can load this minimal list.
    if (request.nextUrl.searchParams.get('options') === '1') {
      const fields = optionFields[resource];
      if (!fields || session.permissions.length === 0) return forbidden();
      const rows = await query();
      return NextResponse.json({ rows: rows.map((row: any) => Object.fromEntries(['id', ...fields].map((f) => [f, row[f]]))) });
    }

    const access = resourceAccess(session, resource);
    if (!access.read) return forbidden();
    const rows = await query();
    return NextResponse.json({ rows: access.readCategories ? rows.filter((row: any) => access.readCategories!.includes(row.category)) : rows });
  } catch (error) {
    return databaseError(error);
  }
}

export async function POST(request: NextRequest, { params }: Context) {
  const { resource } = await params;
  if (!isResourceKey(resource)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (resources[resource].readOnly) return NextResponse.json({ error: 'Read only' }, { status: 405 });
  if (!db) return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  const session = await sessionFromRequest(request);
  if (!session || session.mustChangePassword) return forbidden();
  const access = resourceAccess(session, resource);
  if (!access.write) return forbidden();

  const { values, errors } = validate(resources[resource], await request.json().catch(() => ({})), false);
  if (errors.length > 0) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
  if (!guardValues(session, resource, access, values)) return forbidden();

  try {
    await beforeSave(resource, values);
    const [row] = await db.insert(tables[resource]).values(values).returning();
    await afterSave(resource, row);
    await logActivity(session.email, 'created', resource, row);
    return NextResponse.json({ row }, { status: 201 });
  } catch (error) {
    return databaseError(error);
  }
}
