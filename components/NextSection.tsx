'use client';

import { Calendar, MapPin, ChevronDown } from 'lucide-react';
import { useState, memo } from 'react';

// Move ticket options outside component to prevent recreation on every render
const ticketOptions = [
  {
    id: 1,
    name: 'General Admission',
    price: '₵90',
    description: 'Standard admission for TeensRave 2025',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 2,
    name: 'VIP',
    price: '₵130',
    description: 'Premium experience with VIP access',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    name: 'SQUAD PASS (Admits 3 Squad) General Admission',
    price: '₵250',
    description: 'General admission for 3 people',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 4,
    name: 'SQUAD PASS (Admits 3 Squad) VIP',
    price: '₵360',
    description: 'VIP access for 3 people',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 5,
    name: 'GENG PASS (Admits 5 Geng) General Admission',
    price: '₵420',
    description: 'General admission for 5 people',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 6,
    name: 'GENG PASS (Admits 5 Geng) VIP',
    price: '₵600',
    description: 'VIP access for 5 people',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 7,
    name: 'FAMILY PASS (Admits 7 Fam) General Admission',
    price: '₵580',
    description: 'General admission for 7 people',
    color: 'from-teal-500 to-green-500',
  },
  {
    id: 8,
    name: 'FAMILY PASS (Admits 7 Fam) VIP',
    price: '₵805',
    description: 'VIP access for 7 people',
    color: 'from-pink-500 to-rose-500',
  },
];

const NextSection = memo(() => {
  const [selectedTicket, setSelectedTicket] = useState<typeof ticketOptions[0] | null>(null);

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
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="uppercase font-semibold">11:00 AM - 10:00 PM</span>
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

          <div className="max-w-2xl mx-auto">
            <div
              className="relative rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500 border border-white/20 backdrop-blur-sm overflow-hidden"
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
                {/* Ticket Selection Dropdown */}
                <div className="mb-8">
                  <label htmlFor="ticket-select" className="block text-white text-lg font-semibold mb-4 drop-shadow-lg">
                    Select Your Ticket Type
                  </label>
                  <div className="relative">
                    <select
                      id="ticket-select"
                      value={selectedTicket?.id || ''}
                      onChange={(e) => {
                        const ticket = ticketOptions.find(t => t.id === parseInt(e.target.value));
                        setSelectedTicket(ticket || null);
                      }}
                      className="w-full py-4 px-6 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-lg font-semibold appearance-none cursor-pointer hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    >
                      <option value="" className="bg-gray-800 text-white">Choose a ticket...</option>
                      {ticketOptions.map((ticket) => (
                        <option key={ticket.id} value={ticket.id} className="bg-gray-800 text-white">
                          {ticket.name} - {ticket.price}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white pointer-events-none" />
                  </div>
                </div>

                {/* Selected Ticket Details */}
                {selectedTicket && (
                  <div className="animate-in fade-in duration-500">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${selectedTicket.color} flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white/30 backdrop-blur-sm`}>
                      <span className="text-white text-3xl font-bold">
                        {selectedTicket.id}
                      </span>
                    </div>

                    <h4 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">{selectedTicket.name}</h4>
                    <div className="text-4xl font-black text-white mb-4 drop-shadow-lg">{selectedTicket.price}</div>
                    <p className="text-white/90 mb-8 drop-shadow-md">{selectedTicket.description}</p>

                    <a
                      href="https://chaleapp.com/eventcheck/teens-rave/137"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block w-full py-4 px-8 rounded-xl font-bold text-white text-center transition-all duration-300 bg-gradient-to-r ${selectedTicket.color} hover:scale-105 hover:shadow-xl border-2 border-white/30 backdrop-blur-sm`}
                    >
                      Get Tickets
                    </a>
                  </div>
                )}

                {/* Placeholder when no ticket selected */}
                {!selectedTicket && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white/30 backdrop-blur-sm">
                      <span className="text-white text-3xl font-bold">?</span>
                    </div>
                    <p className="text-white/70 text-lg drop-shadow-md">
                      Select a ticket type above to see details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// Shop Section Component
const ShopSection = memo(() => {
  return (
    <section
      className="relative w-full py-20 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('bg.webp')`
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-white/60"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Shop Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight uppercase bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            style={{
              textTransform: 'uppercase',
              whiteSpace: 'pre',
              marginTop: 0,
              marginBottom: '3px',
              fontWeight: 800,
              lineHeight: '.9',
              fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif',
            }}
          >
            Official Merchandise
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="text-center py-20">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-green-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h3>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Our official merchandise store is currently under development. Get ready for exclusive TeensRave apparel, accessories, and collectibles.
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-lg font-medium">In Development</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

ShopSection.displayName = 'ShopSection';

NextSection.displayName = 'NextSection';

export { ShopSection };
export default NextSection;