import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { ShoppingBag } from 'lucide-react';
import ComingSoon from '@/components/ComingSoon';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = pageMetadata({
  title: "Shop",
  description: "Official TeensRave merchandise, including apparel, accessories and collectibles. Coming soon.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <>
      <PageHero compact title="Official" outline="Merch" image="/1.jpg" />
      <ComingSoon
        icon={ShoppingBag}
        text="Our official merchandise store is currently under development. Get ready for exclusive TeensRave apparel, accessories, and collectibles."
      />
    </>
  );
}
