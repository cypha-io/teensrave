'use client';

import { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import { fetchRows, impact, PageTitle, type Row } from '@/components/admin/ResourceManager';

type Counts = Record<string, number>;

async function applications(url: string): Promise<Row[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not load data');
  return (await response.json()).applications ?? [];
}

export default function IdCardsHubPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([fetchRows('members'), applications('/api/media-accreditation'), applications('/api/artists'), fetchRows('vendors'), fetchRows('sponsors')])
      .then(([members, media, artists, vendors, sponsors]) => {
        const active = members.filter((m) => m.status === 'active');
        const inGroup = (group: string) => active.filter((m) => m.category === group).length;
        setCounts({
          everyone: active.length,
          executive: inGroup('executive'),
          volunteer: inGroup('volunteer'),
          staff: inGroup('staff'),
          crew: inGroup('crew'),
          media: media.filter((a) => a.status === 'approved').length,
          performer: artists.filter((a) => a.status === 'approved').length,
          vendor: vendors.filter((v) => v.status !== 'cancelled').length,
          sponsor: sponsors.filter((s) => s.status !== 'declined').length,
        });
      })
      .catch(() => setError(true));
  }, []);

  const groups = [
    { key: 'everyone', label: 'All Team', query: '' },
    { key: 'executive', label: 'Executives', query: '?category=executive' },
    { key: 'volunteer', label: 'Volunteers', query: '?category=volunteer' },
    { key: 'staff', label: 'Staff', query: '?category=staff' },
    { key: 'crew', label: 'Crew', query: '?category=crew' },
    { key: 'media', label: 'Media', query: '?type=media' },
    { key: 'performer', label: 'Performers', query: '?type=performer' },
    { key: 'vendor', label: 'Vendors', query: '?type=vendor' },
    { key: 'sponsor', label: 'Sponsors', query: '?type=sponsor' },
  ];

  return (
    <div>
      <PageTitle title="ID Cards" />
      {error && (
        <p role="alert" className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          The card counts couldn&apos;t be loaded. Refresh to try again.
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <a
            key={group.key}
            data-card-group={group.key}
            href={`/admin/id-cards${group.query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[2rem] border border-white/10 bg-white/5 p-5 transition-colors hover:border-green-500/50 md:p-6"
          >
            <span className="flex items-center justify-between text-sm font-semibold text-neutral-300">
              {group.label}
              <Printer className="h-4 w-4 text-green-400" aria-hidden="true" />
            </span>
            <span className="mt-3 block text-5xl leading-none text-white" style={impact}>
              {counts ? counts[group.key] : '–'}
            </span>
            <span className="mt-2 block text-sm text-neutral-400">View and print cards</span>
          </a>
        ))}
      </div>
    </div>
  );
}
