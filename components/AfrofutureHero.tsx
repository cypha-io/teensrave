'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const images = [
  '/1.jpg',
  '/2.jpg',
  '/3.jpg'
];

export default function AfrofutureHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-screen w-full overflow-hidden"
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
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Logo */}
      <div className="absolute top-4 left-4 z-20">
        <Image
          src="/logo.png"
          alt="TeensRave Logo"
          width={80}
          height={80}
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
        />
      </div>

      {/* Navbar Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => setIsMenuOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(false);
              }}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
              aria-label="Close navigation menu"
            >
              <X className="w-8 h-8 text-white" />
            </button>

            <nav className="text-center space-y-8" onClick={(e) => e.stopPropagation()}>
              <a href="#home" className="block text-white hover:text-purple-300 transition-colors duration-200 text-2xl sm:text-3xl md:text-4xl font-bold py-2">
                Home
              </a>
              <a href="#events" className="block text-white hover:text-purple-300 transition-colors duration-200 text-2xl sm:text-3xl md:text-4xl font-bold py-2">
                Events & Tickets
              </a>
              <a href="#experience" className="block text-white hover:text-purple-300 transition-colors duration-200 text-2xl sm:text-3xl md:text-4xl font-bold py-2">
                Experience
              </a>
              <a href="#shop" className="block text-white hover:text-purple-300 transition-colors duration-200 text-2xl sm:text-3xl md:text-4xl font-bold py-2">
                Shop
              </a>
              <a href="#news" className="block text-white hover:text-purple-300 transition-colors duration-200 text-2xl sm:text-3xl md:text-4xl font-bold py-2">
                News
              </a>
              <a href="#contact" className="block text-white hover:text-purple-300 transition-colors duration-200 text-2xl sm:text-3xl md:text-4xl font-bold py-2">
                Contact
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-6xl mx-auto w-full">

          {/* First Line - Uniting Our Stories */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black mb-4 sm:mb-6 text-white leading-tight uppercase stroke-1 sm:stroke-2"
            style={{
              color: 'var(--off-white)',
              WebkitTextStrokeWidth: '1px',
              textTransform: 'uppercase',
              whiteSpace: 'pre',
              marginTop: 0,
              marginBottom: '3px',
              fontWeight: 800,
              lineHeight: '.9',
              fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
            }}
          >
            Uniting Our Stories
          </motion.h1>

          {/* Second Line - Igniting Our Future (Outline Only) */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black leading-tight uppercase stroke-1 sm:stroke-2"
            style={{
              color: 'transparent',
              WebkitTextStrokeWidth: '1px',
              WebkitTextStroke: '1px var(--off-white)',
              textTransform: 'uppercase',
              whiteSpace: 'pre',
              marginTop: 0,
              marginBottom: '3px',
              fontWeight: 800,
              lineHeight: '.9',
              fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
            }}
          >
            Igniting Our Future
          </motion.h2>

        </div>
      </div>
    </motion.div>
  );
}