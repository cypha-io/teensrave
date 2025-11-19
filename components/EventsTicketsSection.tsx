'use client';

const EventsTicketsSection = () => {
  return (
    <section className="relative w-full bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block px-8 py-4 rounded-lg">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight uppercase text-white"
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
              Events & Tickets
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsTicketsSection;