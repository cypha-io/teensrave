import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import EventFacts from '@/components/EventFacts';
import PageHero from '@/components/PageHero';
import TicketOptions from '@/components/TicketOptions';
import { getSiteEvent, getTicketPasses } from '@/lib/site-event';

export async function generateMetadata(): Promise<Metadata> {
  const event = await getSiteEvent();
  return pageMetadata({
    title: 'Events & Tickets',
    description: `Find upcoming TeensRave events and get your tickets for ${event.name}, ${event.date} at ${event.venue}.`,
    path: '/events',
  });
}

export const revalidate = 60;

export default async function EventsPage() {
  const [event, passes] = await Promise.all([getSiteEvent(), getTicketPasses()]);

  const eventSchema = event.isoDate && {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    startDate: event.isoDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: event.venue, address: { '@type': 'PostalAddress', addressCountry: 'GH' } },
    image: [`${SITE_URL}/3.jpg`],
    description: `${event.name} by ${SITE_NAME}.`,
    organizer: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    offers: passes.flatMap((pass) =>
      pass.tiers.map(({ tier, amount }) => ({
        '@type': 'Offer',
        name: `${pass.name} - ${tier}`,
        price: amount,
        priceCurrency: 'GHS',
        availability: 'https://schema.org/InStock',
        url: event.ticketUrl,
      }))
    ),
  };

  return (
    <>
      {eventSchema && <JsonLd data={eventSchema} />}
      <PageHero
        eyebrow={event.name}
        title="Events &"
        outline="Tickets"
        image="/3.jpg"
        cta={{ label: 'Choose Your Ticket', href: '#tickets' }}
      />
      <section className="w-full bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500">
        <EventFacts className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
      </section>
      <TicketOptions passes={passes} ticketUrl={event.ticketUrl} />
    </>
  );
}
