'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');

  // Active section detection based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['#home', '#events', '#experience', '#shop', '#news', '#contact'];
      const scrollPosition = window.scrollY + 100; // Offset for navbar height

      for (const section of sections) {
        const element = document.querySelector(section) as HTMLElement;
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const underline = e.currentTarget.querySelector('.underline');
    if (underline) {
      gsap.fromTo(
        underline,
        { width: 0 },
        { width: '100%', duration: 0.3, ease: 'power2.out' }
      );
    }
  };

  const handleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const underline = e.currentTarget.querySelector('.underline');
    if (underline) {
      gsap.to(underline, { width: 0, duration: 0.3, ease: 'power2.out' });
    }
  };

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Events & Tickets', href: '#events' },
    { name: 'Experience', href: '#experience' },
    { name: 'Shop', href: '#shop' },
    { name: 'News', href: '#news' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 lg:bg-white/10 lg:backdrop-blur-md lg:border-b lg:border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-28">
          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <button
                  onClick={() => scrollToSection(item.href)}
                  className={`relative py-3 px-1 font-bold text-lg uppercase transition-colors duration-300 ${
                    activeSection === item.href
                      ? 'text-green-400'
                      : 'text-white hover:text-gray-300 lg:text-gray-800 lg:hover:text-green-600'
                  }`}
                  onMouseEnter={handleHover}
                  onMouseLeave={handleLeave}
                >
                  {item.name}
                  <span className={`underline absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                    activeSection === item.href ? 'w-full bg-green-400' : 'bg-white lg:bg-gray-800'
                  }`}></span>
                </button>
                {index < menuItems.length - 1 && (
                  <span className="text-white mx-2 lg:text-gray-600">•</span>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300 focus:outline-none lg:text-gray-800 lg:hover:text-gray-600"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/90 border-t border-white/20"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full text-left px-3 py-2 text-lg font-bold uppercase transition-colors duration-300 ${
                    activeSection === item.href
                      ? 'text-green-400'
                      : 'text-white hover:text-gray-300'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;