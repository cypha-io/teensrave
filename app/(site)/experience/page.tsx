import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Image from 'next/image';
import CtaBand from '@/components/CtaBand';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = pageMetadata({
  title: "The Experience",
  description: "Step inside TeensRave: the sound, the lights, the crowd and the moments that define the festival.",
  path: "/experience",
});
export const revalidate = 60;

const photos = ['/1.jpg', '/2.jpg', '/3.jpg'];

export default function ExperiencePage() {
  return (
    <>
      <PageHero title="The" outline="Experience" longTitle video="/EXP.mp4" cta={{ label: 'See The Moments', href: '#moments' }} />

      <section id="moments" className="w-full scroll-mt-16 bg-black py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            className="mb-10 text-5xl leading-[.9] uppercase sm:text-6xl lg:text-7xl"
            style={{
              fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
              color: 'transparent',
              WebkitTextStroke: '1px #4ade80',
            }}
          >
            On Stage
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {photos.map((src) => (
              <div key={src} className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                <Image src={src} alt="Performers on stage at TeensRave" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
