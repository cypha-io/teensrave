'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AfrofutureHero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Video */}
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://res.cloudinary.com/dsj8rtjjn/video/upload/q_auto/background-video_hxuv6m.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}

      {/* Image Background */}
      <Image
        src="/bg.jpg"
        alt="Afrofuture Hero Background"
        fill
        className="absolute inset-0 w-full h-full object-cover bg-top"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
 
      {/* Logo */}
      <div className="absolute top-4 left-4 z-20 hidden lg:block">
        <Image
          src="/logo.png"
          alt="TeensRave Logo"
          width={80}
          height={80}
          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
        />
      </div>


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
            Elevate Your Voice.
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
            Redefine the Culture.
          </motion.h2>

        </div>
      </div>
    </motion.div>
  );
}