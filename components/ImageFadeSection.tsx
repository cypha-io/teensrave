'use client';

import { memo } from 'react';

const ImageFadeSection = memo(() => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="https://res.cloudinary.com/dsj8rtjjn/video/upload/v1764832293/teensrave/TR24_5TH_DIMENSION.mov" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
    </section>
  );
});

ImageFadeSection.displayName = 'ImageFadeSection';

export default ImageFadeSection;