'use client';

import React from 'react';
import { X } from 'lucide-react';

interface HeaderProps {
  isVisible: boolean;
  onClose: () => void;
}

const Header: React.FC<HeaderProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-center h-10">
          {/* Centered Content */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-xs sm:text-sm md:text-base text-white tracking-wide">
              TEENSRAVE 2025
            </h1>
            <span className="text-white/60 hidden sm:inline">→</span>
            <a
              href="#tickets"
              className="text-xs sm:text-sm md:text-base text-white hover:text-white/80 transition-colors duration-200 underline"
            >
              BUY TICKETS NOW
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 ml-2 sm:ml-4"
              aria-label="Close header"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;