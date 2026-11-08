import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import EventFacts from './EventFacts';
import { getSiteEvent } from '@/lib/site-event';

const impact = { fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' };

const tiles = [
  {
    title: 'The Experience',
    text: 'Step inside the sound, the lights, and the crowd.',
    href: '/experience',
    image: '/1.jpg',
    className: 'lg:col-span-2 lg:row-span-2',
    sizes: '(min-width: 1024px) 66vw, 100vw',
  },
  {
    title: 'Gallery',
    text: 'Unforgettable moments from TeensRave events.',
    href: '/gallery',
    image: '/2.jpg',
    className: '',
    sizes: '(min-width: 1024px) 33vw, 100vw',
  },
  {
    title: 'Shop',
    text: 'Official merchandise, coming soon.',
    href: '/shop',
    image: '/3.jpg',
    className: '',
    sizes: '(min-width: 1024px) 33vw, 100vw',
  },
];

export default async function HomeHighlights() {
  const event = await getSiteEvent();

  return (
    <>
      {/* Next event */}
      <section className="w-full bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-4 text-sm font-bold tracking-[0.2em] text-white/80 uppercase">Next up</p>
              <h2 className="text-6xl leading-[.9] text-white uppercase sm:text-7xl lg:text-8xl xl:text-9xl" style={impact}>
                {event.name}<br />
                {/* <br /> */}
                {/* In Venice */}
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-bold text-white transition-colors duration-200 hover:bg-neutral-900 sm:w-max"
            >
              Get Tickets
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>

          <EventFacts className="mt-12 border-t border-white/30" />
        </div>
      </section>

      {/* Explore */}
      <section className="w-full bg-black py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            className="mb-10 text-5xl leading-[.9] uppercase sm:text-6xl lg:text-7xl"
            style={{ ...impact, color: 'transparent', WebkitTextStroke: '1px #4ade80' }}
          >
            Explore
          </h2>

          <div className="grid grid-cols-1 gap-4 lg:h-[640px] lg:grid-cols-3 lg:grid-rows-2">
            {tiles.map((tile) => (
              <Link
                key={tile.href}
                href={tile.href}
                className={`group relative block h-72 overflow-hidden rounded-[2rem] outline-none focus-visible:ring-2 focus-visible:ring-green-400 lg:h-auto ${tile.className}`}
              >
                <Image
                  src={tile.image}
                  alt=""
                  fill
                  sizes={tile.sizes}
                  className="object-cover duration-500 group-hover:scale-105"
                  style={{ transitionProperty: 'transform' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors duration-200 group-hover:bg-green-500">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <h3 className="text-4xl leading-none text-white uppercase md:text-5xl" style={impact}>
                    {tile.title}
                  </h3>
                  <p className="mt-2 text-neutral-300">{tile.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
