import React from 'react';

const UndergroundArtistSection: React.FC = () => {
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
            ARTIST REGISTRATION
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Are you an underground artist ready to showcase your talent? Apply to perform at TeensRave 2025 and be part of an unforgettable music experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Registration Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Apply to Perform</h3>

            <form className="space-y-6">
              {/* Artist/Act Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="artistName" className="block text-sm font-medium text-gray-700 mb-2">
                    Artist/Act Name *
                  </label>
                  <input
                    type="text"
                    id="artistName"
                    name="artistName"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="Your artist or band name"
                  />
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="artistFirstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="artistFirstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="artistLastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="artistLastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="artistEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="artistEmail"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="artist@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="artistPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="artistPhone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Music Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                    Music Genre *
                  </label>
                  <select
                    id="genre"
                    name="genre"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  >
                    <option value="">Select your genre</option>
                    <option value="hip-hop">Hip-Hop/Rap</option>
                    <option value="rnb">R&B/Soul</option>
                    <option value="electronic">Electronic/Dance</option>
                    <option value="reggae">Reggae/Dancehall</option>
                    <option value="afrobeat">Afrobeat</option>
                    <option value="alternative">Alternative/Indie</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="performanceType" className="block text-sm font-medium text-gray-700 mb-2">
                    Performance Type *
                  </label>
                  <select
                    id="performanceType"
                    name="performanceType"
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  >
                    <option value="">Select performance type</option>
                    <option value="solo">Solo Artist</option>
                    <option value="duo">Duo/Group</option>
                    <option value="band">Full Band</option>
                    <option value="dj">DJ Set</option>
                    <option value="producer">Live Production</option>
                  </select>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="soundcloud" className="block text-sm font-medium text-gray-700 mb-2">
                    SoundCloud/Spotify Link
                  </label>
                  <input
                    type="url"
                    id="soundcloud"
                    name="soundcloud"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="https://soundcloud.com/your-profile"
                  />
                </div>
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="@yourhandle"
                  />
                </div>
              </div>

              {/* Experience & Bio */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <select
                  id="experience"
                  name="experience"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">0-2 years</option>
                  <option value="intermediate">3-5 years</option>
                  <option value="experienced">6-10 years</option>
                  <option value="veteran">10+ years</option>
                </select>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about yourself and your music *
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none"
                  placeholder="Describe your musical journey, influences, and what makes your sound unique..."
                ></textarea>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  required
                  className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the terms and conditions and understand that submission does not guarantee performance at TeensRave 2025. *
                </label>
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UndergroundArtistSection;