import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getSiteEvent } from '@/lib/site-event';

export default async function CtaBand() {
  const event = await getSiteEvent();

  return (
    <section className="w-full bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 py-16 md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <h2
          className="text-6xl leading-[.9] text-white uppercase sm:text-7xl lg:text-8xl"
          style={{ fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' }}
        >
          {event.name}
        </h2>
        <Link
          href="/events"
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-bold text-white transition-colors duration-200 hover:bg-neutral-900 sm:w-max"
        >
          Get Tickets
          <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
