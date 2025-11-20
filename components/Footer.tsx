'use client';

import { useState, useRef } from 'react';

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
    <footer className="bg-gradient-to-r from-green-900/30 via-emerald-800/30 to-green-700/30 backdrop-blur-md text-white border-t border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Signup */}
        <div className="text-center space-y-6">
          <div className="space-y-3 max-w-md mx-auto">
            <p className="text-white text-lg font-bold">SUBSCRIBE TO OUR NEWSLETTER</p>
            
            {submitMessage && (
              <div className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
                <p className="text-green-200 text-sm">{submitMessage}</p>
              </div>
            )}
            
            {submitError && (
              <div className="p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
                <p className="text-red-200 text-sm">{submitError}</p>
              </div>
            )}
            
            <form ref={formRef} onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-400 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-500 disabled:cursor-not-allowed text-white rounded-r-lg transition-colors duration-300 font-medium flex items-center"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
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