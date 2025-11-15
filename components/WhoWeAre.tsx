"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";

const WhoWeAre = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex flex-col md:flex-row"
    >
      <div className="w-full md:w-[40%] bg-[var(--main-color)] relative overflow-hidden flex items-center justify-center p-8 md:p-12 min-h-[50vh] md:min-h-screen">
        {/* Circular Text Element */}
        <div className="absolute rotating-text top-0 right-8 md:top-12 md:right-12 z-10 max-w-[230px] border-2 border-white  rounded-full">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 200"
            style={{ transform: "rotate(-90deg)" }}
          >
            <defs>
              <path
                id="circle-path"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                fill=""
              />
            </defs>
            <text
              className="text-white font-bold text-xs md:text-sm fill-white"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              <textPath
                href="#circle-path"
                startOffset="0%"
                className="tracking-widest"
                stroke="#fff"
                strokeWidth="1"
                fill="white"
              >
                OF THE YEAR. BUY TICKETS! DON&apos;T MISS THE BIGGEST FESTIVAL
              </textPath>
            </text>
          </svg>
        </div>

        {/* Concert Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-md aspect-square z-0"
          // style={{
          //   clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
          // }}
        >
          <Image
            src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1000"
            alt="Music Festival Stage"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </div>

      {/* Right Section - Dark Background */}
      <div className="w-full md:w-[60%] bg-[#1a1a1a] flex flex-col justify-center p-8 md:p-16 lg:p-24 relative min-h-[50vh] md:min-h-screen">
        {/* Vertical Navigation Indicators */}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {/* "WHO WE ARE" Heading */}
          <h2 className="text-white uppercase text-sm md:text-base tracking-[0.2em] mb-6 md:mb-8 font-sans">
            WHO WE ARE
          </h2>

          {/* Main Headline */}
          <h1 className="text-white text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-6 md:mb-8 font-sans uppercase">
            THE BIGGEST,
            <br />
            ultimate festival
            {/* <br /> */}
            {/* a Launchpad */}
            <br />
            for
            <br />
            unearthing talent
            {/* <br />
            THE PLANET */}
          </h1>

          {/* Paragraph Text */}
          <p className="text-white/80 text-base md:text-lg mb-8 md:mb-12 leading-relaxed font-sans max-w-lg">
            Adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco.
          </p>

          {/* Buy Tickets Button */}
          <Link
            href="#"
            className="inline-block bg-[#9c27b0] hover:bg-[#7b1fa2] text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-300 text-base md:text-lg"
          >
            Buy Tickets
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhoWeAre;
