'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const SlidingInfoSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const infoItems = [
    "Meet me In Venice",
    "Efua Sutherland Park",
    "29th December, 2025"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % infoItems.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(timer);
  }, [infoItems.length]);

  return (
    <section className="relative w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="relative flex-1 overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ x: '100%' }}
              animate={{ x: '-100%' }}
              transition={{
                duration: 8,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="absolute whitespace-nowrap flex items-center h-full"
            >
              <span
                className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text"
                style={{
                  WebkitBackgroundClip: 'text'
                }}
              >
                {infoItems[currentIndex]}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SlidingInfoSection;