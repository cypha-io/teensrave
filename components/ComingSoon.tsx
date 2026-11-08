import type { LucideIcon } from 'lucide-react';

export default function ComingSoon({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <section className="w-full bg-black px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-14 text-center md:px-12 md:py-20">
        <span className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 shadow-lg shadow-green-500/30">
          <Icon className="h-9 w-9 text-white" aria-hidden="true" />
        </span>
        <h2
          className="text-5xl leading-none text-white uppercase md:text-6xl"
          style={{ fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' }}
        >
          Coming Soon
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-neutral-400">{text}</p>
        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" aria-hidden="true" />
          In Development
        </p>
      </div>
    </section>
  );
}
