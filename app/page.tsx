'use client';

import Hero3D from '../components/Hero3D';
import EventsTicketsSection from '../components/EventsTicketsSection';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <section id="home">
        <Hero3D />
      </section>
      
      {/* Events & Tickets Section */}
      <section id="events">
        <EventsTicketsSection />
      </section>
    </div>
  );
}
