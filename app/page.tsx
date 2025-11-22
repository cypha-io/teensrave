'use client';

import { useState, Suspense, lazy } from 'react';

// Lazy load heavy components
const Header = lazy(() => import('../components/Header'));
const AfrofutureHero = lazy(() => import('../components/AfrofutureHero'));
const EventsTicketsSection = lazy(() => import('../components/EventsTicketsSection'));
const NextSection = lazy(() => import('../components/NextSection'));
const ExperienceSection = lazy(() => import('../components/ExperienceSection'));
const ImageFadeSection = lazy(() => import('../components/ImageFadeSection'));
const Footer = lazy(() => import('../components/Footer'));

// Import ShopSection separately
const ShopSection = lazy(() => import('../components/NextSection').then(module => ({ default: module.ShopSection })));

// Import NewsSection
const NewsSection = lazy(() => import('../components/NewsSection'));

// Import ContactSection
const ContactSection = lazy(() => import('../components/ContactSection'));

// Import MediaAccreditationSection
const MediaAccreditationSection = lazy(() => import('../components/MediaAccreditationSection'));

// Import UndergroundArtistSection
const UndergroundArtistSection = lazy(() => import('../components/UndergroundArtistSection'));

// Import GallerySection
const GallerySection = lazy(() => import('../components/GallerySection'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400"></div>
  </div>
);

// Section wrapper with loading state
const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center py-20 bg-black">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400"></div>
    </div>
  }>
    {children}
  </Suspense>
);

export default function Home() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  return (
    <div className="min-h-screen bg-black">
      <Suspense fallback={<LoadingSpinner />}>
        <Header isVisible={isHeaderVisible} onClose={() => setIsHeaderVisible(false)} />
      </Suspense>

      <div className={isHeaderVisible ? "pt-8 sm:pt-10" : "pt-0"}>
        <SectionWrapper>
          <div id="home">
            <AfrofutureHero />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <div id="events">
            <EventsTicketsSection />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <div id="tickets">
            <NextSection />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <div id="media">
            <MediaAccreditationSection />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <div id="artists">
            <UndergroundArtistSection />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <div id="experience">
            <ExperienceSection />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <ImageFadeSection />
        </SectionWrapper>

        <SectionWrapper>
          <div id="gallery">
            <GallerySection />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <div id="shop">
            <ShopSection />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <div id="news">
            <NewsSection />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <div id="contact">
            <ContactSection />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <Footer />
        </SectionWrapper>
      </div>
    </div>
  );
}
