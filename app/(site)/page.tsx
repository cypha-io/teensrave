import AfrofutureHero from '@/components/AfrofutureHero';
import HomeHighlights from '@/components/HomeHighlights';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, pageMetadata, SITE_DESCRIPTION, SITE_TITLE, websiteSchema } from '@/lib/seo';

export const metadata = pageMetadata({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: '/', absoluteTitle: true });
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <AfrofutureHero />
      <HomeHighlights />
    </>
  );
}
