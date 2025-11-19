'use client';

import { useState } from 'react';
import Header from '../components/Header';
import AfrofutureHero from '../components/AfrofutureHero';
import EventsTicketsSection from '../components/EventsTicketsSection';
import NextSection from '../components/NextSection';

export default function Home() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  return (
    <div className="min-h-screen bg-black">
      <Header isVisible={isHeaderVisible} onClose={() => setIsHeaderVisible(false)} />
      <div className={isHeaderVisible ? "pt-8 sm:pt-10" : "pt-0"}>
        <AfrofutureHero />
        <EventsTicketsSection />
        <NextSection />
      </div>
    </div>
  );
}
