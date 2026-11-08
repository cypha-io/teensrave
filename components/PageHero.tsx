'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  outline: string;
  text?: string;
  image?: string;
  video?: string;
  cta?: { label: string; href: string };
  /** Shorter hero for utility pages such as forms. */
  compact?: boolean;
  /** Smaller type for titles with a long word that would overflow on phones. */
  longTitle?: boolean;
};

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: 'easeOut' as const },
});

export default function PageHero({ eyebrow, title, outline, text, image, video, cta, compact, longTitle }: PageHeroProps) {
  const CtaIcon = cta?.href.startsWith('#') ? ArrowDown : ArrowRight;
  const lineStyle = {
    whiteSpace: 'pre',
    lineHeight: '.9',
    fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
    fontSize: longTitle ? 'clamp(2.75rem, 11.5vw, 8rem)' : 'clamp(4rem, 18vw, 8rem)',
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`relative w-full overflow-hidden ${compact ? 'h-[70vh] min-h-[520px]' : 'h-screen'}`}
    >
      {video ? (
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata">
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        image && <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      )}
      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute top-4 left-4 z-20 hidden lg:block">
        <Image src="/logo.png" alt="TeensRave Logo" width={80} height={80} className="h-20 w-20 object-contain" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-16 text-center">
        {eyebrow && (
          <motion.p {...fade(0.3)} className="mb-5 text-sm font-bold tracking-[0.2em] text-green-400 uppercase md:text-base">
            {eyebrow}
          </motion.p>
        )}

        <h1 className="uppercase">
          <motion.span {...fade(0.5)} className="mb-1 block text-white" style={lineStyle}>
            {title}
          </motion.span>
          <motion.span
            {...fade(0.8)}
            className="block"
            style={{ ...lineStyle, color: 'transparent', WebkitTextStroke: '1px white' }}
          >
            {outline}
          </motion.span>
        </h1>

        {text && (
          <motion.p {...fade(1)} className="mt-6 max-w-2xl text-base text-neutral-200 md:text-lg">
            {text}
          </motion.p>
        )}

        {cta && (
          <motion.div {...fade(1.1)} className="mt-10">
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-green-500/30"
            >
              {cta.label}
              <CtaIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
