'use client';

import { IdCard, Printer } from 'lucide-react';
import LoginAccess from './LoginAccess';
import ResourceManager, { type Row } from './ResourceManager';
import { useAdminSession } from './session-context';

type Props = { title: string; singular?: string; category?: string };

export default function MemberManager({ title, singular, category }: Props) {
  const { isAdmin } = useAdminSession();

  return (
    <ResourceManager
      resource="members"
      title={title}
      singular={singular}
      fixed={category ? { category } : undefined}
      headerActions={
        isAdmin ? (
          <a
            href={`/admin/id-cards${category ? `?category=${category}` : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print All ID Cards
          </a>
        ) : undefined
      }
      rowActions={
        isAdmin
          ? (row: Row) => (
              <>
                <a
                  href={`/admin/id-cards?id=${row.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ID card for ${row.fullName}`}
                  title="View ID card"
                  className="rounded-full p-2 text-green-400 hover:bg-green-500/10 hover:text-green-300"
                >
                  <IdCard className="h-4 w-4" />
                </a>
                <LoginAccess type="member" id={row.id} name={row.fullName} />
              </>
            )
          : undefined
      }
    />
  );
}
