import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

const pages: [string, number][] = [
  ['/', 1],
  ['/events', 0.9],
  ['/experience', 0.8],
  ['/gallery', 0.8],
  ['/get-involved', 0.8],
  ['/contact', 0.7],
  ['/news', 0.6],
  ['/shop', 0.6],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(([path, priority]) => ({ url: `${SITE_URL}${path === '/' ? '' : path}`, priority }));
}
