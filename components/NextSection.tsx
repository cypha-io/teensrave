'use client';

import { Calendar, MapPin } from 'lucide-react';

const NextSection = () => {
  const ticketOptions = [
    {
      id: 1,
      name: 'Early Bird',
      price: '₵35',
      description: 'Limited time offer',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      name: 'Regular',
      price: '₵45',
      description: 'Standard admission',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 3,
      name: 'VIP',
      price: '₵75',
      description: 'Premium experience',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="relative w-full py-20">
      {/* Background image with reduced opacity */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: 'url(/bg.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
      {/* White overlay for text visibility */}
      <div className="absolute inset-0 bg-white bg-opacity-5 z-5"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Event Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight uppercase stroke-1 sm:stroke-2"
            style={{
              color: 'transparent',
              WebkitTextStrokeWidth: '1px',
              WebkitTextStroke: '1px green',
              textTransform: 'uppercase',
              whiteSpace: 'pre',
              marginTop: 0,
              marginBottom: '3px',
              fontWeight: 800,
              lineHeight: '.9',
              fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
            }}
          >
            MEET ME IN VENICE
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-lg text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="uppercase font-semibold">29TH DECEMBER, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="uppercase font-semibold">EFUA SUTHERLAND PARK</span>
            </div>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Ticket Options */}
        <div className="max-w-4xl mx-auto">
          <h3
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-center mb-12"
            style={{
              fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
              WebkitTextStroke: '.5px #000',
              color: 'transparent',
            //   background: 'linear-gradient(45deg, #10b981, #059669)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            TICKET OPTIONS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ticketOptions.map((ticket) => (
              <div
                key={ticket.id}
                className="relative rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500 border border-white/20 backdrop-blur-sm overflow-hidden group"
                style={{
                  backgroundImage: 'url(/bg.webp)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Card overlay for better text readability */}
                <div className="absolute inset-0 bg-green-900/40 rounded-2xl"></div>
                
                <div className="relative z-10">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${ticket.color} flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white/30 backdrop-blur-sm`}>
                  <span className="text-white text-3xl font-bold">
                    {ticket.id === 1 ? '1' : ticket.id === 2 ? '2' : '3'}
                  </span>
                </div>

                <h4 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">{ticket.name}</h4>
                <div className="text-4xl font-black text-white mb-4 drop-shadow-lg">{ticket.price}</div>
                <p className="text-white/90 mb-8 drop-shadow-md">{ticket.description}</p>

                <button className={`w-full py-4 px-8 rounded-xl font-bold text-white transition-all duration-300 bg-gradient-to-r ${ticket.color} hover:scale-105 hover:shadow-xl border-2 border-white/30 backdrop-blur-sm`}>
                  Get Tickets
                </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default NextSection;