/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { and, eq, ne } from 'drizzle-orm';
import { db } from '@/lib/db';
import { resources, type Field, type ResourceConfig, type ResourceKey } from '@/lib/admin-resources';
import { allPermissions, resourceSection } from '@/lib/permissions';
import type { Session } from '@/lib/session';
import { activityLog, budgetEntries, events, members, roles, sponsors, tasks, ticketSales, ticketTypes, vendors } from '@/lib/schema';

export const tables: Record<ResourceKey, any> = {
  members,
  roles,
  events,
  'ticket-types': ticketTypes,
  'ticket-sales': ticketSales,
  tasks,
  budget: budgetEntries,
  sponsors,
  vendors,
  activity: activityLog,
};

const MAX_PHOTO_LENGTH = 200_000;

function clean(field: Field, raw: unknown): { value?: unknown; error?: string } {
  const bad = (message: string) => ({ error: `${field.label}: ${message}` });

  if (field.type === 'checkbox') return typeof raw === 'boolean' ? { value: raw } : bad('must be yes or no');
  if (field.type === 'permissions') {
    if (!Array.isArray(raw) || raw.some((p) => !allPermissions.includes(p))) return bad('contains an unknown permission');
    return { value: Array.from(new Set(raw)) };
  }

  const text = typeof raw === 'number' ? String(raw) : typeof raw === 'string' ? raw.trim() : raw == null ? '' : null;
  if (text === null) return bad('is not valid');
  if (text === '') return field.required ? bad('is required') : { value: null };

  switch (field.type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) && text.length <= 255 ? { value: text.toLowerCase() } : bad('is not a valid email');
    case 'url':
      return /^https?:\/\/\S+$/i.test(text) && text.length <= 2000 ? { value: text } : bad('must start with http:// or https://');
    case 'number':
      return /^\d{1,9}$/.test(text) ? { value: Number(text) } : bad('must be a whole number');
    case 'money':
      return /^\d{1,10}(\.\d{1,2})?$/.test(text) ? { value: text } : bad('must be an amount like 150 or 150.50');
    case 'date': {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(Date.parse(text))) return bad('is not a valid date');
      return { value: text };
    }
    case 'select':
      return field.options?.includes(text) ? { value: text } : bad('is not an allowed option');
    case 'source':
      return /^\d{1,9}$/.test(text) ? { value: Number(text) } : bad('is not valid');
    case 'photo':
      return /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(text) && text.length <= MAX_PHOTO_LENGTH ? { value: text } : bad('is not a valid image');
    case 'textarea':
      return text.length <= 5000 ? { value: text } : bad('is too long');
    default:
      return text.length <= (field.max ?? 255) ? { value: text } : bad(`must be ${field.max ?? 255} characters or fewer`);
  }
}

export function validate(config: ResourceConfig, body: Record<string, unknown>, partial: boolean) {
  const values: Record<string, unknown> = {};
  const errors: string[] = [];
  for (const field of config.fields) {
    if (field.type === 'readonly') continue;
    if (!(field.name in body)) {
      if (!partial && field.required && field.defaultValue === undefined) errors.push(`${field.label}: is required`);
      continue;
    }
    const { value, error } = clean(field, body[field.name]);
    if (error) errors.push(error);
    else values[field.name] = value;
  }
  return { values, errors };
}

export async function logActivity(actor: string, action: string, resource: ResourceKey, row: Record<string, any>) {
  const label = row[resources[resource].titleField];
  await db.insert(activityLog).values({
    actor,
    action,
    resource,
    recordId: row.id,
    summary: label == null ? null : String(label).slice(0, 500),
  });
}

/** The fields a dropdown needs from each record type. */
export const optionFields: Partial<Record<ResourceKey, string[]>> = {
  members: ['fullName'],
  roles: ['name'],
  'ticket-types': ['name', 'tier'],
};

export type ResourceAccess = { read: boolean; write: boolean; readCategories: string[] | null; writeCategories: string[] | null };

export function resourceAccess(session: Session, resource: ResourceKey): ResourceAccess {
  if (session.kind === 'admin') return { read: true, write: true, readCategories: null, writeCategories: null };
  const has = (permission: string) => session.permissions.includes(permission);

  if (resource === 'members') {
    // Users covers everyone; Executives and Volunteers each cover only their own group.
    const scoped = (action: string) => {
      if (has(`users.${action}`)) return null;
      return [has(`executives.${action}`) && 'executive', has(`volunteers.${action}`) && 'volunteer'].filter(Boolean) as string[];
    };
    const readCategories = scoped('view');
    const writeCategories = scoped('manage');
    return { read: readCategories === null || readCategories.length > 0, write: writeCategories === null || writeCategories.length > 0, readCategories, writeCategories };
  }

  const section = resourceSection(resource);
  return { read: has(`${section}.view`), write: has(`${section}.manage`), readCategories: null, writeCategories: null };
}

/** Blocks changes outside someone's scope, including handing out roles without permission to manage them. */
export function guardValues(session: Session, resource: ResourceKey, access: ResourceAccess, values: Record<string, unknown>) {
  if (session.kind === 'admin' || resource !== 'members') return true;
  if ('roleId' in values && !session.permissions.includes('roles.manage')) delete values.roleId;
  if (access.writeCategories && 'category' in values && !access.writeCategories.includes(String(values.category))) return false;
  return true;
}

export async function beforeSave(resource: ResourceKey, values: Record<string, any>) {
  if (resource === 'ticket-sales' && values.amount == null && values.ticketTypeId) {
    const [type] = await db.select().from(ticketTypes).where(eq(ticketTypes.id, values.ticketTypeId)).limit(1);
    if (type) values.amount = (Number(type.price) * Number(values.quantity ?? 1)).toFixed(2);
  }
}

export async function afterSave(resource: ResourceKey, row: Record<string, any>) {
  if (resource === 'members' && !row.memberCode) {
    const memberCode = `TR-${String(row.id).padStart(4, '0')}`;
    await db.update(members).set({ memberCode }).where(eq(members.id, row.id));
    row.memberCode = memberCode;
  }
  if (resource === 'events' && row.isCurrent) {
    // Only one event can drive the public website.
    await db.update(events).set({ isCurrent: false }).where(and(eq(events.isCurrent, true), ne(events.id, row.id)));
  }
}

export function databaseError(error: any) {
  const code = error?.code ?? error?.cause?.code;
  if (code === '23505') return NextResponse.json({ error: 'That value is already in use.' }, { status: 409 });
  if (code === '23503') return NextResponse.json({ error: 'This record is linked to other records, so it can’t be changed that way.' }, { status: 409 });
  if (code === '22001') return NextResponse.json({ error: 'One of the values is too long.' }, { status: 400 });
  console.error('Admin resource error:', error);
  return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
}
