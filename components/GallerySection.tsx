'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    { src: '/1.jpg', alt: 'TeensRave Gallery Image 1' },
    { src: '/2.jpg', alt: 'TeensRave Gallery Image 2' },
    { src: '/3.jpg', alt: 'TeensRave Gallery Image 3' },
    // { src: '/bg.webp', alt: 'TeensRave Background Image' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-wider">
            Gallery
          </h2>
          <div className="w-24 h-1 bg-green-400 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the vibrant energy and unforgettable moments from TeensRave events
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="aspect-square relative">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal for full-size image */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Gallery image"
              width={1200}
              height={800}
              className="w-full h-auto object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Close gallery modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default GallerySection;