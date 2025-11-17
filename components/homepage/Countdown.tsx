"use client";
import { useEffect, useState } from "react";

const Countdown = () => {
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
  return (
    <section className="countdown md:bg-fixed bg-[url('https://festy.ancorathemes.com/wp-content/uploads/2020/04/image-77.jpg')] bg-center bg-cover">
      <div className="cover px-8 py-16 min-h-[70vh] flex items-center justify-center w-full">
        <div className="bg-[#000000c4] banner px-8 uppercase text-center rounded-lg w-full h-full gap-3 justify-between flex flex-col items-center py-16">
          <h2 className="font-rubik text-[2.3rem] md:text-[3.3rem] lg:text-[4.5rem] tracking-wider">
            Countdown to the rave !!
          </h2>
          <h3 className="font-rubik text-[1.6rem] md:text-[2.6rem] lg:text-[3rem]">
            December 29, 2025
          </h3>
          <div className=" grid grid-cols-2 mt-8 max-w-4xl w-full mx-auto  md:grid-cols-4 gap-4 md:gap-8 ">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div
                key={unit}
                className="flex flex-col items-center bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-[#00d7ac]/20 max-w-[200px] place-self-center w-full"
              >
                <span className="text-2xl md:text-4xl font-bold text-(--main-color) font-mono">
                  {value.toString().padStart(2, "0")}
                </span>
                <span className="text-xs md:text-sm uppercase tracking-wider text-white/80">
                  {unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Countdown;
