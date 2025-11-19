'use client';

import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-900/30 via-emerald-800/30 to-green-700/30 backdrop-blur-md text-white border-t border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content - Centered */}
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="TeensRave Logo"
              width={250}
              height={250}
              // className="brightness-0 invert"
            />
          </div>

          {/* Social Icons */}
          <div className="flex justify-center">
            <div className="flex space-x-6">
              <a href="#" aria-label="Follow us on Facebook" className="text-white hover:text-green-400 transition-colors duration-300 hover:scale-110 transform">
                <Facebook className="w-7 h-7" />
              </a>
              <a href="#" aria-label="Follow us on Instagram" className="text-white hover:text-green-400 transition-colors duration-300 hover:scale-110 transform">
                <Instagram className="w-7 h-7" />
              </a>
              <a href="#" aria-label="Follow us on Twitter" className="text-white hover:text-green-400 transition-colors duration-300 hover:scale-110 transform">
                <Twitter className="w-7 h-7" />
              </a>
              <a href="#" aria-label="Subscribe to our YouTube channel" className="text-white hover:text-green-400 transition-colors duration-300 hover:scale-110 transform">
                <Youtube className="w-7 h-7" />
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Connected</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <Mail className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-400">info@teensrave.com</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-400">+233 XX XXX XXXX</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-3 max-w-md mx-auto">
              <p className="text-gray-400 text-sm">Subscribe to our newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                />
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-r-lg transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="text-center">
            <div className="text-gray-400 text-sm">
              © 2025 TeensRave Festival. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;