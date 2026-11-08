'use client';

import { useState } from 'react';
import { Camera, Mic, type LucideIcon } from 'lucide-react';
import MediaAccreditationSection from './MediaAccreditationSection';
import UndergroundArtistSection from './UndergroundArtistSection';

export type FormChoice = 'media' | 'perform';

const options: { id: FormChoice; title: string; text: string; icon: LucideIcon }[] = [
  {
    id: 'media',
    title: 'Media Accreditation',
    text: 'Register for press credentials to cover TeensRave.',
    icon: Camera,
  },
  {
    id: 'perform',
    title: 'Perform',
    text: 'Apply to perform as an underground artist.',
    icon: Mic,
  },
];

export default function GetInvolved({ initial }: { initial: FormChoice | null }) {
  const [choice, setChoice] = useState<FormChoice | null>(initial);

  const select = (id: FormChoice) => {
    setChoice(id);
    window.history.replaceState(null, '', `?form=${id}`);
    requestAnimationFrame(() => document.getElementById('form')?.scrollIntoView({ block: 'start' }));
  };

  return (
    <>
      <section className={`w-full bg-black px-4 pt-16 sm:px-6 md:pt-24 lg:px-8 ${choice ? '' : 'pb-16 md:pb-24'}`}>
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-10 text-center text-5xl leading-[.9] uppercase sm:text-6xl"
            style={{
              fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
              color: 'transparent',
              WebkitTextStroke: '1px #4ade80',
            }}
          >
            Choose One
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {options.map(({ id, title, text, icon: Icon }) => {
              const isSelected = choice === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => select(id)}
                  aria-pressed={isSelected}
                  className={`rounded-[2rem] border p-6 text-left transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-green-400 md:p-8 ${
                    isSelected
                      ? 'border-white/30 bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500'
                      : 'border-white/10 bg-white/5 hover:border-green-500/50 hover:bg-white/10'
                  }`}
                >
                  <span
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full ${
                      isSelected ? 'bg-black text-white' : 'bg-green-500/15 text-green-400'
                    }`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span
                    className="block text-4xl leading-none text-white uppercase md:text-5xl"
                    style={{ fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' }}
                  >
                    {title}
                  </span>
                  <span className={`mt-3 block ${isSelected ? 'text-white/90' : 'text-neutral-400'}`}>{text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {choice === 'media' && <MediaAccreditationSection />}
      {choice === 'perform' && <UndergroundArtistSection />}
    </>
  );
}
