"use client";

import Link from "next/link";

const HeroCard = () => {
  const heroBtns = [
    {
      ref: "get tickets",
      refLink: "#",
      styling:
        "bg-white text-[var(--main-color)] border-2 border-white hover:text-white hover:bg-[#000] cursor-pointer",
    },
    {
      ref: "official lineup",
      refLink: "#",
      styling:
        "bg-[var(--main-color)] text-white border-2 border-[var(--main-color)] hover:text-[var(--main-color)] hover:bg-transparent cursor-pointer",
    },
  ];

  return (
    // <section className="relative min-h-screen w-full  bg-[url('https://festy.ancorathemes.com/wp-content/uploads/2020/04/image-77.jpg')] bg-cover bg-center">
    //   <div className="cover_gradient min-h-screen bg-linear-to-tr from-[#000]  via-[#002107bd] to-[#000] bg- w-full h-full flex items-center justify-center">
    //     <div className="content px-8 py-12 max-w-4xl mx-auto w-full flex flex-col items-center justify-center gap-9">
    //       <div className="text-center justify-center items-center flex flex-col">
    //         <h1 className="lg:text-[7rem] text-[3rem] max-w-[4xl] md:text-[6rem] md:leading-[5rem]  lg:leading-[6rem] font-rubik  ">
    //           <span className=" text-shadow-md text-shadow-[#00d7ac]">
    //             {" "}
    //             TEENSRAVE
    //           </span>{" "}
    //           <br />{" "}
    //           <span className="lg:text-[5rem] text-[1.8rem] md:text-[4rem] text-shadow-md text-shadow-[#fff]">
    //             FESTIVAL
    //           </span>
    //         </h1>
    //         {/* <h1 className="text-[7rem] text-shadow-lg text-shadow-[#00d7ac] font-rubik">
    //         </h1> */}
    //       </div>
    //       <div className="countdown grid grid-cols-2 md:grid-cols-4 w-full gap-4 md:gap-8">
    //         {Object.entries(timeLeft).map(([unit, value]) => (
    //           <div
    //             key={unit}
    //             className="flex flex-col items-center bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-[#00d7ac]/20 max-w-[200px] place-self-center w-full"
    //           >
    //             <span className="text-2xl md:text-4xl font-bold text-[#00d7ac] font-mono">
    //               {value.toString().padStart(2, "0")}
    //             </span>
    //             <span className="text-xs md:text-sm uppercase tracking-wider text-white/80">
    //               {unit}
    //             </span>
    //           </div>
    //         ))}
    //       </div>
    //       <div className="buttons w-full flex items-center justify-center gap-7">
    //         {heroBtns.map((btn) => (
    //           <button className="capitalize" key={btn.ref}>
    //             <Link
    //               href={btn.refLink}
    //               className={` ${btn.styling} capitalize px-5 py-3 text-[1.3rem] font-semibold rounded-4xl`}
    //             >
    //               {btn.ref}
    //             </Link>
    //           </button>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </section>
    <section className="relative min-h-screen w-full">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="videoBg  object-center object-cover min-h-screen w-full "
      >
        <source
          src="https://bhimfestival.com/wp-content/themes/bhimfestival/html/assets/video/bhim_home_video.mp4"
          type="video/mp4"
        />
      </video>
      <div className="hero_cover absolute top-0 bottom-0 right-0 left-0 bg-[#0000007a] h-full w-full flex flex-col items-center justify-center text-center p-3 gap-2">
        <div className="content px-8 py-12 max-w-4xl mx-auto w-full flex flex-col items-center justify-center gap-9">
          <div className="text-center justify-center items-center flex flex-col">
            <h1 className="lg:text-[7rem]  text-[3rem]   max-w-[4xl] md:text-[6rem] md:leading-[5rem]  lg:leading-[6rem] font-rubik  ">
              TEENSRAVE
              <br />
              <span className="lg:text-[5rem] md:text-[3.5rem] neon2">
                FESTIVAL
              </span>
            </h1>
            {/* <h1 className="text-[7rem] text-shadow-lg text-shadow-[#00d7ac] font-rubik">
             </h1> */}
          </div>

          <div className="buttons w-full flex items-center flex-col md:flex-row justify-center gap-7">
            {heroBtns.map((btn) => (
              <button
                className={` ${btn.styling} capitalize px-5 py-3 md:text-[1.3rem] font-semibold rounded-sm`}
                key={btn.ref}
              >
                <Link href={btn.refLink}>{btn.ref}</Link>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCard;
