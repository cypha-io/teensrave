'use client';

import { Calendar, MapPin, ChevronDown } from 'lucide-react';
import { useState, memo } from 'react';

// Move ticket options outside component to prevent recreation on every render
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

                    <button className={`w-full py-4 px-8 rounded-xl font-bold text-white transition-all duration-300 bg-gradient-to-r ${selectedTicket.color} hover:scale-105 hover:shadow-xl border-2 border-white/30 backdrop-blur-sm`}>
                      Get Tickets
                    </button>
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
  const shopItems = [
    {
      id: 1,
      name: 'TeensRave T-Shirt',
      price: '₵45',
      image: '/logo.png', // Using logo as placeholder
      description: 'Premium cotton tee with festival logo',
    },
    {
      id: 2,
      name: 'Festival Hoodie',
      price: '₵85',
      image: '/logo.png',
      description: 'Comfortable hoodie for cool nights',
    },
    {
      id: 3,
      name: 'Glow Sticks Pack',
      price: '₵15',
      image: '/logo.png',
      description: 'Pack of 10 colorful glow sticks',
    },
    {
      id: 4,
      name: 'VIP Lanyard',
      price: '₵25',
      image: '/logo.png',
      description: 'Exclusive VIP access lanyard',
    },
  ];

  return (
    <section className="relative w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shop Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight uppercase text-black"
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

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {shopItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 group"
            >
              {/* Item Image */}
              <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Item Details */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="text-2xl font-black text-green-600 mb-4">{item.price}</div>

                <button className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 shadow-md">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Shop Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">Limited edition merchandise - Get yours before they're gone!</p>
          <button className="px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
});

ShopSection.displayName = 'ShopSection';

// Combined component that includes both sections
const NextSectionWithShop = memo(() => {
  return (
    <>
      <NextSection />
      <ShopSection />
    </>
  );
});

NextSectionWithShop.displayName = 'NextSectionWithShop';

export default NextSectionWithShop;