/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { eventCardLabel, toCardPerson } from '@/lib/id-card';
import { pagePermissions, permissionSections } from '@/lib/permissions';
import { personSources, type AccountType } from '@/lib/people';
import { events, members, roles, tasks, ticketSales } from '@/lib/schema';
import { sessionFromRequest } from '@/lib/session';

const orNotSet = (value: unknown) => (value == null || value === '' ? 'Not set' : String(value));
const cedis = (value: unknown) => (value == null ? 'Not set' : `₵${Number(value).toLocaleString('en-GB', { maximumFractionDigits: 2 })}`);
const label = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

// Only the fields a person should see about themselves. Reviewer and admin notes never leave the server.
function panelsFor(type: AccountType, person: Record<string, any>, roleName?: string) {
  switch (type) {
    case 'media':
      return { title: 'Your Accreditation', rows: [['Status', label(person.status)], ['Outlet', person.mediaOutlet], ['Media type', person.mediaType], ['Category', person.accreditationCategory], ['Email', person.email], ['Phone', person.phone]] };
    case 'performer':
      return { title: 'Your Performance', rows: [['Status', label(person.status)], ['Category', person.performanceCategory], ['Act', orNotSet(person.groupName || person.performanceType)], ['City', person.city], ['Email', person.email], ['Phone', person.phone]] };
    case 'vendor':
      return { title: 'Your Vendor Details', rows: [['Status', label(person.status)], ['Company', person.name], ['Service', orNotSet(person.service)], ['Agreed fee', cedis(person.fee)], ['Contact', orNotSet(person.contactName)], ['Phone', orNotSet(person.contactPhone)]] };
    case 'sponsor':
      return { title: 'Your Sponsorship', rows: [['Status', label(person.status)], ['Company', person.name], ['Tier', orNotSet(person.tier)], ['Value', cedis(person.amount)], ['Contact', orNotSet(person.contactName)], ['Phone', orNotSet(person.contactPhone)]] };
    default:
      return { title: 'Your Details', rows: [['Position', orNotSet(person.position)], ['Department', orNotSet(person.department)], ['Role', orNotSet(roleName)], ['Email', orNotSet(person.email)], ['Phone', orNotSet(person.phone)], ['Emergency contact', orNotSet(person.emergencyContact)]] };
  }
}

export async function GET(request: NextRequest) {
  const session = await sessionFromRequest(request);
  if (session?.kind !== 'account' || session.refId == null || session.accountType === 'admin' || !db) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const type = session.accountType;
    const source = personSources[type];
    const [person] = await db.select().from(source.table).where(eq(source.table.id, session.refId)).limit(1);
    if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [event] = await db.select().from(events).where(eq(events.isCurrent, true)).orderBy(desc(events.id)).limit(1);
    let roleName: string | undefined;
    if (type === 'member' && person.roleId) {
      [{ name: roleName } = { name: undefined as any }] = await db.select({ name: roles.name }).from(roles).where(eq(roles.id, person.roleId)).limit(1);
    }

    const myTasks =
      type === 'member'
        ? await db
            .select({ id: tasks.id, title: tasks.title, priority: tasks.priority, status: tasks.status, dueDate: tasks.dueDate, notes: tasks.notes })
            .from(tasks)
            .where(eq(tasks.assigneeId, session.refId))
            .orderBy(desc(tasks.id))
        : null;

    let summary: { label: string; value: string }[] | null = null;
    if (session.userType === 'executive') {
      const [team, allTasks, sales] = await Promise.all([
        db.select({ status: members.status }).from(members),
        db.select({ status: tasks.status }).from(tasks),
        db.select({ status: ticketSales.status, quantity: ticketSales.quantity }).from(ticketSales),
      ]);
      summary = [
        { label: 'Active team', value: String(team.filter((m: any) => m.status === 'active').length) },
        { label: 'Open tasks', value: String(allTasks.filter((t: any) => t.status !== 'done').length) },
        { label: 'Tickets sold', value: String(sales.filter((s: any) => s.status === 'paid').reduce((sum: number, s: any) => sum + s.quantity, 0)) },
      ];
    }

    const manage = Object.entries(pagePermissions)
      .filter(([, needed]) => needed.every((p) => session.permissions.includes(p)))
      .map(([segment]) => ({
        label: (permissionSections.find((section) => section.key === segment)?.label ?? 'Accepted Applications').replace(/ \(.*\)$/, ''),
        href: `/admin/dashboard/${segment}`,
      }));

    return NextResponse.json({
      userType: session.userType,
      email: session.email,
      name: person[source.nameField],
      card: toCardPerson(type, person, { roleName, eventLabel: eventCardLabel(event) }),
      event: event ? { name: event.name, date: event.eventDate, venue: event.venue, time: event.timeLabel, ticketUrl: event.ticketUrl } : null,
      details: panelsFor(type, person, roleName),
      tasks: myTasks,
      summary,
      manage,
    });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
