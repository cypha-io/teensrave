import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = { title: 'POS', robots: { index: false, follow: false }, manifest: '/pos.webmanifest' };

export default function PosLayout({ children }: { children: ReactNode }) {
  return children;
}
