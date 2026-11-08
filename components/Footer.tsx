'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const socials = [
  { label: 'Ig', name: 'Instagram', href: 'https://www.instagram.com/teensrave_festival/' },
  { label: 'Tt', name: 'TikTok', href: 'https://www.tiktok.com/@teensrave?lang=en' },
  { label: 'Fb', name: 'Facebook', href: 'https://www.facebook.com/teensravegh/' },
  { label: 'X', name: 'X', href: 'https://x.com/Teensrave' },
];

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Experience', href: '/experience' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Shop', href: '/shop' },
    ],
  },
  {
    title: 'Involved',
    links: [
      { label: 'Events & Tickets', href: '/events' },
      { label: 'Perform', href: '/get-involved?form=perform' },
      { label: 'Media Accreditation', href: '/get-involved?form=media' },
      { label: 'News', href: '/news' },
      { label: 'Contact', href: '/contact' },
      { label: 'Sign In', href: '/login' },
    ],
  },
];

const Footer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    setSubmitError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe');
      }

      setSubmitMessage('Successfully subscribed to our newsletter!');
      formRef.current?.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while subscribing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative w-full overflow-hidden bg-[#030303] px-6 pt-24 pb-8 text-neutral-300 md:px-12">
      {/* Decorative background wordmark */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center opacity-5">
        <p className="text-[16vw] font-black tracking-tighter whitespace-nowrap text-white select-none" aria-hidden="true">
          TEENSRAVE
        </p>
      </div>

      <div className="relative z-10 mx-auto mb-20 grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
        {/* Brand */}
        <div className="flex flex-col lg:col-span-4">
          <div className="mb-8">
            <Image src="/logo.png" alt="TeensRave logo" width={64} height={64} className="h-16 w-16 object-contain" />
          </div>
          <p className="mb-8 max-w-sm text-sm leading-relaxed text-neutral-400">
            Experience the ultimate Teensrave Festival with mind-blowing visuals and immersive experiences in Accra, Ghana.
          </p>
          <div className="mt-auto flex gap-3">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${social.name}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 text-xs font-bold transition-colors hover:border-green-500 hover:bg-green-500 hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {columns.map((column, index) => (
          <div key={column.title} className={`lg:col-span-2 ${index === 0 ? 'lg:ml-auto' : ''}`}>
            <h3 className="mb-6 text-xs font-bold tracking-wide text-white uppercase">{column.title}</h3>
            <ul className="space-y-4">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div className="lg:col-span-4 lg:pl-8">
          <h3 className="mb-6 text-xs font-bold tracking-wide text-white uppercase">Subscribe</h3>
          <p className="mb-6 text-sm text-neutral-400">
            Get the latest festival news, lineup updates, and ticket drops delivered right to your inbox.
          </p>
          <form ref={formRef} onSubmit={handleSubmit} className="relative mt-2">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              aria-label="Email address"
              required
              disabled={isSubmitting}
              className="w-full rounded-none border-b border-neutral-800 bg-transparent py-3 pr-20 text-white placeholder-neutral-600 transition-colors focus:border-green-500 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute top-1/2 right-0 -translate-y-1/2 text-sm font-bold tracking-wider text-green-500 uppercase transition-colors hover:text-green-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Joining…' : 'Join'}
            </button>
          </form>
          {submitMessage && <p className="mt-3 text-sm text-green-400">{submitMessage}</p>}
          {submitError && <p className="mt-3 text-sm text-red-400">{submitError}</p>}
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-neutral-900 pt-8 md:flex-row">
        <p className="text-sm text-neutral-500">© {new Date().getFullYear()} Teensrave. All rights reserved.</p>
        <a href="mailto:infousteensrave@gmail.com" className="text-sm text-neutral-500 transition-colors hover:text-white">
          infousteensrave@gmail.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;
