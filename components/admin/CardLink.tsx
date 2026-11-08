'use client';

import { IdCard } from 'lucide-react';
import LoginAccess from './LoginAccess';
import { useAdminSession } from './session-context';

export default function CardLink({ type, id, name }: { type: 'media' | 'performer' | 'vendor' | 'sponsor'; id: number; name: string }) {
  const { isAdmin } = useAdminSession();
  if (!isAdmin) return null;

  return (
    <>
      <a
        href={`/admin/id-cards?type=${type}&id=${id}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ID card for ${name}`}
        title="View ID card"
        className="inline-flex rounded-full p-2 text-green-400 hover:bg-green-500/10 hover:text-green-300"
      >
        <IdCard className="h-4 w-4" />
      </a>
      <LoginAccess type={type} id={id} name={name} />
    </>
  );
}
