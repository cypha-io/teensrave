import { cache } from 'react';
import { asc, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { events, ticketTypes } from '@/lib/schema';

const fallback = {
  name: 'Evolution SZN',
  date: '29th December, 2026',
  isoDate: '2026-12-29' as string | null,
  venue: 'Untamed Empire',
  time: '11:00 AM - 10:00 PM',
  ticketUrl: 'https://chaleapp.com/eventcheck/teens-rave/137',
};

function formatDate(value: string) {
  const parsed = new Date(`${value}T00:00:00Z`);
  const day = parsed.getUTCDate();
  const suffix = day % 100 >= 11 && day % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][day % 10] ?? 'th';
  const month = parsed.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' });
  return `${day}${suffix} ${month}, ${parsed.getUTCFullYear()}`;
}

export const getSiteEvent = cache(async () => {
  if (!db) return fallback;
  try {
    const [event] = await db.select().from(events).where(eq(events.isCurrent, true)).orderBy(desc(events.id)).limit(1);
    if (!event) return fallback;
    return {
      name: event.name,
      date: event.eventDate ? formatDate(event.eventDate) : 'Date to be announced',
      isoDate: event.eventDate,
      venue: event.venue || 'Venue to be announced',
      time: event.timeLabel || 'Time to be announced',
      ticketUrl: event.ticketUrl || fallback.ticketUrl,
    };
  } catch (error) {
    console.error('Could not load the current event:', error);
    return fallback;
  }
});

export type TicketPass = { name: string; admits: string | null; tiers: { tier: string; price: string; amount: number }[] };

export async function getTicketPasses(): Promise<TicketPass[]> {
  if (!db) return [];
  try {
    const rows = await db.select().from(ticketTypes).where(eq(ticketTypes.isActive, true)).orderBy(asc(ticketTypes.sortOrder), asc(ticketTypes.id));
    const passes = new Map<string, TicketPass>();
    for (const row of rows) {
      const pass: TicketPass = passes.get(row.name) ?? { name: row.name, admits: row.admits, tiers: [] };
      pass.tiers.push({ tier: row.tier, price: `₵${Number(row.price).toLocaleString('en-GB', { maximumFractionDigits: 2 })}`, amount: Number(row.price) });
      passes.set(row.name, pass);
    }
    return Array.from(passes.values());
  } catch (error) {
    console.error('Could not load ticket types:', error);
    return [];
  }
}
