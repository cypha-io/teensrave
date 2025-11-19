import React from 'react';

const NewsSection: React.FC = () => {
  const newsItems = [
    {
      id: 1,
      title: "TeensRave 2025 Lineup Announced",
      date: "November 15, 2025",
      excerpt: "Get ready for an unforgettable night with our incredible lineup of artists spanning genres and cultures.",
      image: "/api/placeholder/800/400"
    },
    {
      id: 2,
      title: "Early Bird Tickets Now Available",
      date: "November 10, 2025",
      excerpt: "Limited early bird tickets are now on sale. Don't miss out on the best prices for TeensRave 2025.",
      image: "/api/placeholder/800/400"
    },
    {
      id: 3,
      title: "New Merchandise Collection Dropped",
      date: "November 5, 2025",
      excerpt: "Check out our latest collection featuring exclusive TeensRave apparel and accessories.",
      image: "/api/placeholder/800/400"
    }
  ];

  return (
    <section 
      className="py-20 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('bg.webp')`
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-white/60"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            LATEST NEWS
          </h2>
        </div>

        <div className="space-y-8">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="relative h-96 rounded-xl overflow-hidden group cursor-pointer bg-white"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="text-green-400 text-sm mb-2 font-medium">{item.date}</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                  {item.title}
                </h3>
                <p className="text-green-200 text-base leading-relaxed mb-4 max-w-2xl drop-shadow-md">
                  {item.excerpt}
                </p>
                <button className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors duration-200 font-semibold self-start bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30">
                  Read More
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-500 transition-colors duration-200 shadow-lg hover:shadow-xl">
            View All News
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;