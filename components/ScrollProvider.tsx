'use client';

import { useEffect } from 'react';

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Enable smooth scrolling with CSS
    document.documentElement.style.scrollBehavior = 'smooth';

    // Optional: Add Lenis for better smooth scrolling if needed
    // For now, let's use native smooth scrolling to avoid conflicts

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div>
      {children}
    </div>
  );
}