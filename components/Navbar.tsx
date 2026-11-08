'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { name: 'Home', href: '/' },
  { name: 'Events & Tickets', href: '/events' },
  { name: 'Experience', href: '/experience' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Shop', href: '/shop' },
  { name: 'News', href: '/news' },
  { name: 'Get Involved', href: '/get-involved' },
  { name: 'Contact', href: '/contact' },
];

const Navbar = ({ belowBanner }: { belowBanner: boolean }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Main"
        className={`pointer-events-none fixed inset-x-0 z-40 flex justify-center px-4 transition-[top] duration-300 ${
          belowBanner ? 'top-12' : 'top-4 md:top-6'
        }`}
      >
        <div className="pointer-events-auto flex w-full items-center rounded-full border border-white/15 bg-[#030303]/70 px-4 py-2 shadow-lg shadow-black/10 backdrop-blur-xl md:w-max md:p-1.5">
          {/* Mobile header */}
          <div className="flex w-full items-center justify-between md:hidden">
            <Link href="/" className="flex items-center gap-2 pl-1 text-lg font-bold tracking-tight text-white">
              <Image src="/logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
              TEENSRAVE
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-full p-2 text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-green-400"
              aria-label="Open menu"
              aria-expanded={isOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop links */}
          <div className="hidden items-center gap-0.5 md:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold tracking-wide outline-none transition-colors focus-visible:ring-2 focus-visible:ring-green-400 ${
                    isActive
                      ? 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white shadow-sm'
                      : 'text-neutral-300 hover:bg-white/10 hover:text-green-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu. Kept outside the bar so it covers the whole viewport. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 rounded-full p-2 transition-colors duration-200 hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="h-8 w-8 text-white" />
            </button>

            <nav aria-label="Mobile" className="space-y-5 text-center" onClick={(e) => e.stopPropagation()}>
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`block py-2 text-2xl font-bold transition-colors duration-200 sm:text-3xl ${
                      isActive ? 'text-green-400' : 'text-white hover:text-green-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
