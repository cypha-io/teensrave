import type { TicketPass } from '@/lib/site-event';

const impact = { fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' };

function TicketRow({ pass, tier, price, featured, url }: { pass: string; tier: string; price: string; featured: boolean; url: string }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl p-5 ${
        featured ? 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500' : 'bg-white/5'
      }`}
    >
      <div>
        <p className={`text-xs font-bold tracking-wider uppercase ${featured ? 'text-white/80' : 'text-neutral-400'}`}>{tier}</p>
        <p className="mt-1 text-4xl leading-none text-white" style={impact}>
          {price}
        </p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Get ${pass} ${tier} tickets`}
        className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors duration-200 ${
          featured ? 'bg-black text-white hover:bg-neutral-900' : 'bg-white text-black hover:bg-green-400'
        }`}
      >
        Get Tickets
      </a>
    </div>
  );
}

export default function TicketOptions({ passes, ticketUrl }: { passes: TicketPass[]; ticketUrl: string }) {
  return (
    <section id="tickets" className="w-full scroll-mt-16 bg-black py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          className="mb-10 text-5xl leading-[.9] uppercase sm:text-6xl lg:text-7xl"
          style={{ ...impact, color: 'transparent', WebkitTextStroke: '1px #4ade80' }}
        >
          Ticket Options
        </h2>

        {passes.length === 0 && <p className="text-lg text-neutral-400">Tickets aren&apos;t on sale right now. Check back soon.</p>}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {passes.map((pass) => (
            <article key={pass.name} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 md:p-6">
              <div className="mb-5 px-1">
                <h3 className="text-3xl leading-none text-white uppercase md:text-4xl" style={impact}>
                  {pass.name}
                </h3>
                <p className="mt-2 text-sm font-semibold tracking-wide text-green-400 uppercase">{pass.admits}</p>
              </div>
              <div className="space-y-3">
                {pass.tiers.map(({ tier, price }) => (
                  <TicketRow key={tier} pass={pass.name} tier={tier} price={price} featured={tier === 'VIP'} url={ticketUrl} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
