'use client';

import { Printer } from 'lucide-react';
import CardLink from './CardLink';
import ResourceManager, { type Row } from './ResourceManager';

export default function PartnerManager({ resource, type, title }: { resource: 'vendors' | 'sponsors'; type: 'vendor' | 'sponsor'; title: string }) {
  return (
    <ResourceManager
      resource={resource}
      title={title}
      headerActions={
        <a
          href={`/admin/id-cards?type=${type}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print All ID Cards
        </a>
      }
      rowActions={(row: Row) => <CardLink type={type} id={row.id} name={row.name} />}
    />
  );
}
