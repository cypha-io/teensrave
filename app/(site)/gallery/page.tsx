import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import CtaBand from '@/components/CtaBand';
import GallerySection from '@/components/GallerySection';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description: "See photos of the energy and unforgettable moments from TeensRave events.",
  path: "/gallery",
});
export const revalidate = 60;

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="The"
        outline="Gallery"
        image="/2.jpg"
        text="Explore the vibrant energy and unforgettable moments from TeensRave events."
        cta={{ label: 'View Photos', href: '#photos' }}
      />
      <GallerySection />
      <CtaBand />
    </>
  );
}
