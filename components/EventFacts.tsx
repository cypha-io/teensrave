import { Calendar, Clock, MapPin } from 'lucide-react';
import { getSiteEvent } from '@/lib/site-event';

export default async function EventFacts({ className = '' }: { className?: string }) {
  const event = await getSiteEvent();
  const facts = [
    { icon: Calendar, label: 'Date', value: event.date },
    { icon: MapPin, label: 'Venue', value: event.venue },
    { icon: Clock, label: 'Time', value: event.time },
  ];

  return (
    <dl className={`grid grid-cols-1 md:grid-cols-3 ${className}`}>
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-4 border-b border-white/30 py-6 last:border-b-0 md:border-b-0 md:pr-8">
          <Icon className="h-6 w-6 shrink-0 text-white" aria-hidden="true" />
          <div>
            <dt className="text-xs font-bold tracking-wider text-white/80 uppercase">{label}</dt>
            <dd className="text-lg font-semibold text-white uppercase">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
