"use client";

import { button } from "framer-motion/client";
import Link from "next/link";
import { useState, useEffect } from "react";

const HeroCard = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const targetDate = new Date("2025-12-29T23:59:59").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const heroBtns = [
    {
      ref: "get tickets",
      refLink: "#",
      styling: "bg-[var(--main-color)]",
    },
    {
      ref: "experiences",
      refLink: "#",
      styling: "bg-[#000] text-[var]",
    },
  ];

  return (
    <section className="relative min-h-screen w-full  bg-[url('https://festy.ancorathemes.com/wp-content/uploads/2020/04/image-77.jpg')] bg-cover bg-center">
      <div className="cover_gradient min-h-screen bg-linear-to-tr from-[#000]  via-[#002107bd] to-[#000] bg- w-full h-full flex items-center justify-center">
        <div className="content px-8 py-12 max-w-4xl mx-auto w-full flex flex-col items-center justify-center gap-9">
          <div className="text-center justify-center items-center flex flex-col">
            <h1 className="lg:text-[7rem] text-[3rem] max-w-[4xl] md:text-[6rem] md:leading-[6rem]  lg:leading-[7rem] font-rubik text-shadow-lg text-shadow-[#00d7ac]">
              TEENSRAVE <br /> FESTIVAL
            </h1>
            {/* <h1 className="text-[7rem] text-shadow-lg text-shadow-[#00d7ac] font-rubik">
            </h1> */}
          </div>
          <div className="countdown grid grid-cols-2 md:grid-cols-4 w-full gap-4 md:gap-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div
                key={unit}
                className="flex flex-col items-center bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-[#00d7ac]/20 max-w-[200px] place-self-center w-full"
              >
                <span className="text-2xl md:text-4xl font-bold text-[#00d7ac] font-mono">
                  {value.toString().padStart(2, "0")}
                </span>
                <span className="text-xs md:text-sm uppercase tracking-wider text-white/80">
                  {unit}
                </span>
              </div>
            ))}
          </div>
          <div className="buttons w-full flex items-center justify-center gap-7">
            {heroBtns.map((btn) => (
              <button className="capitalize" key={btn.ref}>
                <Link
                  href={btn.refLink}
                  className={` ${btn.styling} capitalize px-5 py-3 text-[1.3rem] font-semibold rounded-4xl`}
                >
                  {btn.ref}
                </Link>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCard;
