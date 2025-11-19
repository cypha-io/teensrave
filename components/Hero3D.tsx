'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Zap, Star } from 'lucide-react';

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

// Main Hero3D component - AfroFuture inspired design
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
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

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
    const threshold = 50;
    if (deltaX > threshold) nextSlide();
    if (deltaX < -threshold) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <motion.div
      ref={ref}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-purple-900 via-black to-orange-900"
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
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.1,
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* AfroFuture inspired overlay with cultural patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/60 to-orange-900/80" />

      {/* Animated geometric patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-20 left-10 w-32 h-32 border-2 border-gold-400/30 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-32 right-16 w-24 h-24 border-2 border-orange-400/40 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-sm"
        />
      </div>

      {/* Navigation Arrows - AfroFuture styled */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-purple-600/80 to-orange-600/80 hover:from-purple-700 hover:to-orange-700 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 border border-white/20 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-purple-600/80 to-orange-600/80 hover:from-purple-700 hover:to-orange-700 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 border border-white/20 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Overlay content - AfroFuture inspired */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none px-4 sm:px-6 md:px-8">
        <div className="text-center text-white max-w-4xl relative pointer-events-auto w-full">

          {/* Title - AfroFuture bold typography */}
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 leading-none"
            style={{
              fontFamily: 'dream, dreamFont Fallback, sans-serif',
              textShadow: '0 0 20px rgba(251,191,36,0.8), 0 0 40px rgba(251,191,36,0.5), 0 0 60px rgba(251,191,36,0.2)',
              WebkitTextStroke: '1px rgba(251,191,36,0.3)'
            }}
          >
            {imageTitles[currentSlide]}
          </motion.h1>

          {/* Subtitle - Cultural accent */}
          <motion.h2
            key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-8"
            style={{
              fontFamily: 'dream, dreamFont Fallback, sans-serif',
              textShadow: '0 0 15px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.6), 0 0 45px rgba(255,255,255,0.3)',
              WebkitTextStroke: '0.5px rgba(255,255,255,0.2)'
            }}
          >
            {imageSubtitles[currentSlide]}
          </motion.h2>

          {/* AfroFuture tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-orange-200 mb-12 font-medium tracking-wide"
            style={{
              textShadow: '0 0 10px rgba(251,146,60,0.5)'
            }}
          >
            IGNITING OUR FUTURE • UNITING OUR STORIES
          </motion.p>

          {/* Buttons - AfroFuture vibrant styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex justify-center mt-8 px-2"
          >
            <div className="backdrop-blur-lg bg-gradient-to-r from-purple-600/20 to-orange-600/20 border border-white/20 rounded-2xl p-2 inline-flex items-center gap-4 shadow-2xl">
              <motion.button
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 xs:px-10 sm:px-12 py-4 xs:py-4.5 sm:py-5 rounded-xl text-base xs:text-lg sm:text-xl font-black transition-all duration-300 transform hover:scale-105 shadow-lg pointer-events-auto w-full sm:w-auto min-h-[56px] touch-manipulation flex items-center justify-center gap-3 border-2 border-white/30"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(251,191,36,0.6)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap size={20} aria-hidden className="text-black" />
                <span>GET TICKETS NOW</span>
              </motion.button>
              <motion.button
                className="border-3 border-white/40 text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white px-8 xs:px-10 sm:px-12 py-4 xs:py-4.5 sm:py-5 rounded-xl text-base xs:text-lg sm:text-xl font-bold transition-all duration-300 transform hover:scale-105 pointer-events-auto w-full sm:w-auto min-h-[56px] touch-manipulation flex items-center justify-center gap-3 backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: "linear-gradient(to right, #9333ea, #ec4899)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Star size={20} aria-hidden className="text-white" />
                <span>EXPERIENCES</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Cultural accent elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute -top-8 -left-8 w-16 h-16 border-2 border-orange-400/50 rounded-full animate-pulse"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute -bottom-8 -right-8 w-12 h-12 border-2 border-purple-400/50 rounded-full animate-pulse"
          />

          {/* Visually hidden live region for SRs */}
          <div className="sr-only" aria-live="polite">
            {`Slide ${currentSlide + 1} of ${images.length}: ${imageTitles[currentSlide]} ${imageSubtitles[currentSlide]}`}
          </div>
        </div>
      </div>
    </motion.div>
  );
}