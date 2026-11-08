import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Newspaper } from 'lucide-react';
import ComingSoon from '@/components/ComingSoon';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = pageMetadata({
  title: "News",
  description: "Get the latest TeensRave news, announcements and behind-the-scenes updates.",
  path: "/news",
});

export default function NewsPage() {
  return (
    <>
      <PageHero compact title="Latest" outline="News" image="/bg.jpg" />
      <ComingSoon
        icon={Newspaper}
        text="Our news section is currently under development. Stay tuned for the latest updates, announcements, and behind-the-scenes content from TeensRave."
      />
    </>
  );
}
