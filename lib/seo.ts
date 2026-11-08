import type { Metadata } from 'next';

export const SITE_URL = 'https://teensrave.com';
export const SITE_NAME = 'TeensRave';
export const SITE_TITLE = 'TeensRave | Celebrating Teen Music, Art & Culture in Ghana';
export const SITE_DESCRIPTION =
  'TeensRave brings young people together through music, art and culture, with live festivals, performances and unforgettable experiences in Accra, Ghana.';

const shareImage = { url: '/opengraph-image', width: 1200, height: 630, alt: 'TeensRave' };

export function pageMetadata({ title, description, path, absoluteTitle }: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description, url: path, siteName: SITE_NAME, type: 'website', locale: 'en_GH', images: [shareImage] },
    twitter: { card: 'summary_large_image', site: '@teensrave', title: fullTitle, description, images: [shareImage.url] },
  };
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: SITE_DESCRIPTION,
  email: 'infousteensrave@gmail.com',
  sameAs: [
    'https://www.instagram.com/teensrave_festival/',
    'https://www.tiktok.com/@teensrave',
    'https://www.facebook.com/teensravegh/',
    'https://x.com/Teensrave',
  ],
};

// Tells Google which name to show above the site's search result.
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: ['Teens Rave', 'TeensRave Festival'],
  url: `${SITE_URL}/`,
};
