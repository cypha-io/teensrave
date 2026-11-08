'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const images = [
  { src: '/1.jpg', alt: 'TeensRave Gallery Image 1', className: 'md:col-span-2 aspect-video', sizes: '(min-width: 768px) 80vw, 100vw' },
  { src: '/2.jpg', alt: 'TeensRave Gallery Image 2', className: 'aspect-[4/3]', sizes: '(min-width: 768px) 40vw, 100vw' },
  { src: '/3.jpg', alt: 'TeensRave Gallery Image 3', className: 'aspect-[4/3]', sizes: '(min-width: 768px) 40vw, 100vw' },
  // { src: '/bg.webp', alt: 'TeensRave Background Image' },
];

const GallerySection = () => {
  const [selected, setSelected] = useState<(typeof images)[number] | null>(null);

  return (
    <section id="photos" className="w-full scroll-mt-16 bg-black py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        {images.map((image, index) => (
          <motion.button
            key={image.src}
            type="button"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            onClick={() => setSelected(image)}
            aria-label={`View ${image.alt}`}
            className={`group relative block w-full cursor-pointer overflow-hidden rounded-[2rem] outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${image.className}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={image.sizes}
              className="object-cover duration-500 group-hover:scale-105"
              style={{ transitionProperty: 'transform' }}
            />
          </motion.button>
        ))}
      </div>

      {/* Rendered on body so it covers the viewport instead of this section */}
      {selected &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Close gallery modal"
            >
              <X className="h-7 w-7" />
            </button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
              <Image
                src={selected.src}
                alt={selected.alt}
                width={1200}
                height={800}
                className="h-auto max-h-[85vh] w-auto rounded-2xl object-contain"
              />
            </motion.div>
          </motion.div>,
          document.body
        )}
    </section>
  );
};

export default GallerySection;
