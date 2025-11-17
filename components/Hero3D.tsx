'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Ticket, Compass } from 'lucide-react';

const images = [
  '/1.jpg',
  '/2.jpg',
  '/3.jpg'
];

const imageTitles = [
  'TEENSRAVE',
  'TEENSRAVE',
  'TEENSRAVE'
];

const imageSubtitles = [
  'FESTIVAL',
  'FESTIVAL',
  'FESTIVAL'
];

// Main Hero3D component - now a slider optimized for mobile
export default function Hero3D() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Auto-play functionality
  useEffect(() => {
    // Autoplay always enabled unless user navigates; keep simple and reliable for now
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000); // Slightly longer for mobile viewing

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  // Note: indicator-based navigation removed to keep mobile UI clean

  // Touch handlers for swipe support on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum px for swipe
    if (deltaX > threshold) nextSlide(); // swipe left -> next
    if (deltaX < -threshold) prevSlide(); // swipe right -> previous
    touchStartX.current = null;
    touchEndX.current = null;
  };


  return (
    <motion.div
      ref={ref}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative h-screen w-full overflow-hidden bg-black"
      role="region"
      aria-label="Hero slideshow"
    >
      {/* Background Images Slider */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${image})`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Navigation Arrows - Hidden on mobile, shown on larger screens */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Mobile Top logo + controls */}
      {/* Removed for unified UI */}

      {/* Indicators removed for a cleaner mobile UI */}

      {/* Indicators removed for a cleaner desktop UI */}

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none px-4 sm:px-6 md:px-8">
        <div className="text-center text-white max-w-4xl relative pointer-events-auto w-full">

          {/* Title */}
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-7xl lg:text-8xl xl:text-9xl font-extrabold mb-4 text-white leading-tight"
            style={{
              fontFamily: 'dream, dreamFont Fallback, sans-serif',
              textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.5), 0 0 45px rgba(255,255,255,0.2)',
              WebkitTextStroke: '0.5px rgba(255,255,255,0.1)'
            }}
          >
            {imageTitles[currentSlide]}
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl lg:text-6xl xl:text-7xl font-semibold text-green-300 leading-tight"
            style={{
              fontFamily: 'dream, dreamFont Fallback, sans-serif',
              textShadow: '0 0 15px rgba(34,197,94,0.8), 0 0 30px rgba(34,197,94,0.5), 0 0 45px rgba(34,197,94,0.2)',
              WebkitTextStroke: '0.5px rgba(34,197,94,0.1)'
            }}
          >
            {imageSubtitles[currentSlide]}
          </motion.h2>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex justify-center mt-8 px-2"
          >
            {/* Frosted container for desktop / tablet CTAs */}
            <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-full p-1 inline-flex items-center gap-3">
                <motion.button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 xs:px-8 sm:px-10 py-3 xs:py-3.5 sm:py-4 rounded-full text-sm xs:text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg pointer-events-auto w-full sm:w-auto min-h-[48px] touch-manipulation flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Ticket size={18} aria-hidden className="text-white" />
                  <span>Get Tickets</span>
                </motion.button>
              <motion.button
                className="border-2 border-white/30 text-white hover:bg-white hover:text-green-900 px-6 xs:px-8 sm:px-10 py-3 xs:py-3.5 sm:py-4 rounded-full text-sm xs:text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 pointer-events-auto w-full sm:w-auto min-h-[48px] touch-manipulation flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02, backgroundColor: "white", color: "#14532d" }}
                whileTap={{ scale: 0.98 }}
              >
                <Compass size={18} aria-hidden className="text-white" />
                <span>Explore Experiences</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Mobile swipe hint */}
          {/* Removed for unified UI */}
          {/* Visually hidden live region for SRs to announce slide changes */}
          <div className="sr-only" aria-live="polite">
            {`Slide ${currentSlide + 1} of ${images.length}: ${imageTitles[currentSlide]} ${imageSubtitles[currentSlide]}`}
          </div>
        </div>
      </div>
    </motion.div>
  );
}