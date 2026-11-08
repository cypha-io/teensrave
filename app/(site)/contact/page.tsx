import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import ContactSection from '@/components/ContactSection';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: "Get in touch with TeensRave. Whether you have a question or want to partner or collaborate, we'd love to hear from you.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero compact title="Contact" outline="Us" image="/3.jpg" cta={{ label: 'Send A Message', href: '#form' }} />
      <ContactSection />
    </>
  );
}
