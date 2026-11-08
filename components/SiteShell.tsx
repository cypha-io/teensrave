'use client';

import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Navbar from './Navbar';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  return (
    <div className="site-shell flex min-h-screen flex-col bg-black">
      <Header isVisible={isHeaderVisible} onClose={() => setIsHeaderVisible(false)} />
      <main className={`flex-1 ${isHeaderVisible ? 'pt-8 sm:pt-10' : 'pt-0'}`}>{children}</main>
      <Footer />
      <Navbar belowBanner={isHeaderVisible} />
    </div>
  );
}
