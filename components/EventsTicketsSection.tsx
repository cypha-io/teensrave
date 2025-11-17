'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, Clock, Ticket, Star, Users, Crown } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Main Stage Performance',
    date: 'December 15, 2025',
    time: '8:00 PM - 12:00 AM',
    location: 'Central Plaza',
    description: 'Experience the ultimate rave atmosphere with world-class DJs and performers.',
    price: '$45',
    featured: true,
  },
  {
    id: 2,
    title: 'VIP After Party',
    date: 'December 15, 2025',
    time: '12:30 AM - 4:00 AM',
    location: 'Sky Lounge',
    description: 'Exclusive after-party for VIP ticket holders with premium drinks and entertainment.',
    price: '$75',
    featured: false,
  },
  {
    id: 3,
    title: 'Day Festival',
    date: 'December 16, 2025',
    time: '2:00 PM - 10:00 PM',
    location: 'Outdoor Arena',
    description: 'Full day of music, food, and fun under the sun.',
    price: '$35',
    featured: false,
  },
];

const ticketTypes = [
  {
    id: 1,
    name: 'General Admission',
    price: '$45',
    icon: Ticket,
    color: 'from-green-500 to-emerald-500',
    features: ['Access to all main events', 'Basic amenities', 'Standard viewing areas'],
    popular: false,
  },
  {
    id: 2,
    name: 'VIP Experience',
    price: '$75',
    icon: Crown,
    color: 'from-purple-500 to-pink-500',
    features: ['Premium seating', 'Exclusive areas', 'Complimentary drinks', 'VIP merchandise'],
    popular: true,
  },
  {
    id: 3,
    name: 'Group Package',
    price: '$35/person',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    features: ['Group discounts', 'Shared experiences', 'Special perks', 'Minimum 4 people'],
    popular: false,
  },
];

export default function EventsTicketsSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-green-50 to-transparent"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6"
          >
            <Star size={16} />
            TEENSRAVE FESTIVAL 2025
          </motion.div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Events & <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Tickets</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover the lineup of unforgettable experiences at TEENSRAVE Festival.
            Get your tickets now for the best night of your life!
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200 ${
                event.featured ? 'ring-2 ring-green-500 ring-opacity-50' : ''
              }`}
            >
              {event.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    FEATURED
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                  {event.title}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Calendar size={18} className="text-green-600" />
                    </div>
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Clock size={18} className="text-blue-600" />
                    </div>
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <MapPin size={18} className="text-purple-600" />
                    </div>
                    <span className="font-medium">{event.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-8 leading-relaxed">{event.description}</p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div>
                  <div className="text-3xl font-black text-gray-900">{event.price}</div>
                  <div className="text-sm text-gray-500">per person</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Ticket size={18} />
                  Get Tickets
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ticket Types */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
        >
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Experience</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect ticket package for your TEENSRAVE adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ticketTypes.map((ticket, index) => {
              const IconComponent = ticket.icon;
              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${
                    ticket.popular
                      ? 'border-green-300 ring-2 ring-green-500 ring-opacity-20'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  {ticket.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${ticket.color} flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                    <IconComponent size={32} className="text-white" />
                  </div>

                  <h4 className="text-2xl font-bold text-gray-900 mb-2 text-center">{ticket.name}</h4>
                  <div className="text-4xl font-black text-gray-900 mb-6 text-center">{ticket.price}</div>

                  <ul className="space-y-3 mb-8">
                    {ticket.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r ${ticket.color} hover:opacity-90`}
                  >
                    Select Package
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}