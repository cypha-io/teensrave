'use client';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-900/30 via-emerald-800/30 to-green-700/30 backdrop-blur-md text-white border-t border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Signup */}
        <div className="text-center space-y-6">
          <div className="space-y-3 max-w-md mx-auto">
            <p className="text-white text-lg font-bold">SUBSCRIBE TO OUR NEWSLETTER</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
              />
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-r-lg transition-colors duration-300 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="text-center">
            <div className="text-gray-400 text-sm">
              © 2025 Teensrave. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;