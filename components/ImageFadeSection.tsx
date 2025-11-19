'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';

const ImageFadeSection = memo(() => {
  const images = [
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Optimized Images with Next.js Image component */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
            index === currentImageIndex && loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`Background image ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0} // Only prioritize the first image
            loading={index === 0 ? 'eager' : 'lazy'}
            onLoad={() => handleImageLoad(index)}
            sizes="100vw"
            quality={85}
          />
        </div>
      ))}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
    </section>
  );
});

ImageFadeSection.displayName = 'ImageFadeSection';

export default ImageFadeSection;