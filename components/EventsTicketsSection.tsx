'use client';

const EventsTicketsSection = () => {
  const ticketTypes = [
    {
      id: 1,
      name: 'VIP Experience',
      price: '$75',
      description: 'Premium seating, exclusive areas, complimentary drinks',
      color: 'from-purple-500 to-pink-500',
      popular: true,
    },
    {
      id: 2,
      name: 'Regular Admission',
      price: '$45',
      description: 'Standard entry, access to all main areas',
      color: 'from-green-500 to-emerald-500',
      popular: false,
    },
    {
      id: 3,
      name: 'Group Package',
      price: '$35/person',
      description: 'Special pricing for groups of 4+',
      color: 'from-blue-500 to-cyan-500',
      popular: false,
    },
  ];

  return (
    <section className="relative w-full bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight uppercase"
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
            Events & Tickets
          </h2>
        </div>

        {/* Big White Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto">
          {/* Event Header */}
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              TEENSRAVE FESTIVAL 2025
            </h3>
            <p className="text-xl text-gray-600 font-semibold">
              December 15, 2025 • Downtown Convention Center
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Ticket Widget Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg">
            <div className="text-center mb-6">
              <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Choose Your Ticket
              </h4>
              <p className="text-gray-600">
                Select the perfect ticket for your TEENSRAVE experience
              </p>
            </div>

            {/* Ticket Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ticketTypes.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                    ticket.popular
                      ? 'border-green-300 ring-2 ring-green-500 ring-opacity-20'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  {ticket.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${ticket.color} flex items-center justify-center mb-4 mx-auto shadow-md`}>
                    <span className="text-white font-bold text-lg">
                      {ticket.id === 1 ? '👑' : ticket.id === 2 ? '🎫' : '👥'}
                    </span>
                  </div>

                  <h5 className="text-lg font-bold text-gray-900 mb-2 text-center">{ticket.name}</h5>
                  <div className="text-2xl font-black text-gray-900 mb-3 text-center">{ticket.price}</div>
                  <p className="text-sm text-gray-600 mb-4 text-center leading-relaxed">{ticket.description}</p>

                  <button
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg bg-gradient-to-r ${ticket.color} hover:opacity-90`}
                  >
                    Select Ticket
                  </button>
                </div>
              ))}
            </div>

            {/* Event Details */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Event Date</h5>
                  <p className="text-gray-600">December 15, 2025</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Venue</h5>
                  <p className="text-gray-600">Downtown Convention Center</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsTicketsSection;