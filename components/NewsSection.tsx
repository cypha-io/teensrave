import React from 'react';

const NewsSection: React.FC = () => {
  return (
    <section
      className="py-20 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('bg.webp')`
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-white/60"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

        <div className="text-center py-20">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-green-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h3>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Our news section is currently under development. Stay tuned for the latest updates, announcements, and behind-the-scenes content from TeensRave 2025.
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
};

export default NewsSection;