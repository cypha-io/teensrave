import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import GetInvolved, { type FormChoice } from '@/components/GetInvolved';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = pageMetadata({
  title: "Get Involved",
  description: "Apply to perform at TeensRave as an underground artist, or register for media accreditation to cover the festival.",
  path: "/get-involved",
});

export default async function GetInvolvedPage({ searchParams }: { searchParams: Promise<{ form?: string }> }) {
  const { form } = await searchParams;
  const initial: FormChoice | null = form === 'media' || form === 'perform' ? form : null;

  return (
    <>
      <PageHero
        compact
        title="Get"
        outline="Involved"
        image="/2.jpg"
        text="Cover the festival or take the stage. Pick your path and apply below."
      />
      <GetInvolved key={initial ?? 'none'} initial={initial} />
    </>
  );
}
