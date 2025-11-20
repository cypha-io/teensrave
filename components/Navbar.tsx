'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');

  // Active section detection based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['#home', '#events', '#shop', '#news', '#contact'];
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
    { name: 'HOME', href: '#home' },
    { name: 'EVENTS & TICKETS', href: '#events' },
    { name: 'SHOP', href: '#shop' },
    { name: 'NEWS', href: '#news' },
    { name: 'CONTACT', href: '#contact' },
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
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-purple-900/95 via-black/90 to-orange-900/95 backdrop-blur-lg border-b border-white/20 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-28">
          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <button
                  onClick={() => scrollToSection(item.href)}
                  className={`relative py-4 px-2 font-black text-xl uppercase transition-all duration-300 ${
                    activeSection === item.href
                      ? 'text-yellow-400'
                      : 'text-white hover:text-orange-300'
                  }`}
                  style={{ textTransform: 'uppercase' }}
                  onMouseEnter={handleHover}
                  onMouseLeave={handleLeave}
                >
                  {item.name}
                  <span className={`underline absolute bottom-0 left-0 h-1 transition-all duration-300 ${
                    activeSection === item.href ? 'w-full bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-white'
                  }`}></span>
                </button>
                {index < menuItems.length - 1 && (
                  <span className="text-orange-400 mx-3 text-2xl font-bold">•</span>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 relative">
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="absolute top-0 left-0 w-full h-0.5 bg-white transform transition-all duration-300"
                />
                <motion.span
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="absolute top-2 left-0 w-full h-0.5 bg-white transform transition-all duration-300"
                />
                <motion.span
                  animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="absolute top-4 left-0 w-full h-0.5 bg-white transform transition-all duration-300"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden fixed top-0 right-0 w-80 max-w-[90vw] h-screen bg-gradient-to-b from-black/95 to-gray-900/95 backdrop-blur-md border-l border-white/20 shadow-2xl z-40"
          >
            {/* Close button */}
            <div className="flex justify-end p-6">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                aria-label="Close mobile menu"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="px-6 pb-6">
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    onClick={() => scrollToSection(item.href)}
                    className={`block w-full text-left px-4 py-4 text-xl font-bold uppercase transition-all duration-300 rounded-xl border ${
                      activeSection === item.href
                        ? 'text-green-400 bg-green-400/10 border-green-400/30 shadow-lg shadow-green-400/20'
                        : 'text-white hover:text-green-300 hover:bg-white/10 border-transparent hover:border-white/20'
                    }`}
                    style={{ textTransform: 'uppercase' }}
                  >
                    <span className="flex items-center justify-between">
                      {item.name}
                      {activeSection === item.href && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-green-400 rounded-full"
                        />
                      )}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Social Links or Additional Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="mt-12 pt-6 border-t border-white/20"
              >
                <p className="text-white/60 text-sm uppercase tracking-wider mb-4">Follow Us</p>
                <div className="flex space-x-4">
                  <a href="#" className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300 group" aria-label="Follow us on Facebook">
                    <Facebook size={20} className="text-white group-hover:text-blue-400 transition-colors duration-300" />
                  </a>
                  <a href="#" className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300 group" aria-label="Follow us on X">
                    <Twitter size={20} className="text-white group-hover:text-gray-300 transition-colors duration-300" />
                  </a>
                  <a href="#" className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300 group" aria-label="Follow us on Instagram">
                    <Instagram size={20} className="text-white group-hover:text-pink-400 transition-colors duration-300" />
                  </a>
                  <a href="#" className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300 group" aria-label="Follow us on TikTok">
                    <svg className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </a>
                  <a href="#" className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300 group" aria-label="Follow us on YouTube">
                    <Youtube size={20} className="text-white group-hover:text-red-500 transition-colors duration-300" />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;