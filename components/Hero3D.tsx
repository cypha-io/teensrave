'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

// Main Hero3D component - now a slider
export default function Hero3D() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <motion.div
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-black"
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

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none px-2 sm:px-4">
        <div className="text-center text-white max-w-4xl relative pointer-events-auto w-full">

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-2 sm:mb-4 text-white leading-tight"
            style={{
              fontFamily: 'dream, dreamFont Fallback, sans-serif',
              textShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.6), 0 0 60px rgba(255,255,255,0.3)',
              WebkitTextStroke: '1px rgba(255,255,255,0.1)'
            }}
          >
            {imageTitles[currentSlide]}
          </motion.h1>

          <motion.h2
            key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-purple-300 leading-tight"
            style={{
              fontFamily: 'dream, dreamFont Fallback, sans-serif',
              textShadow: '0 0 20px rgba(168,85,247,0.9), 0 0 40px rgba(168,85,247,0.6), 0 0 60px rgba(168,85,247,0.3)',
              WebkitTextStroke: '1px rgba(168,85,247,0.1)'
            }}
          >
            {imageSubtitles[currentSlide]}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8"
          >
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg pointer-events-auto w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Tickets
            </motion.button>
            <motion.button
              className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 pointer-events-auto w-full sm:w-auto"
              whileHover={{ scale: 1.05, backgroundColor: "white", color: "#581c87" }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Experiences
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}