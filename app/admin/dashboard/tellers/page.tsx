'use client';

import { useCallback, useEffect, useState } from 'react';
import { money, PageTitle, Tile } from '@/components/admin/ResourceManager';
import { useAdminSession } from '@/components/admin/session-context';

type Teller = {
  memberId: number;
  name: string;
  code: string | null;
  hasLogin: boolean;
  ticketsAllocated: number;
  admitLimit: number;
  ticketsSold: number;
  peopleAdmitted: number;
  cash: number;
};

const inputClass = 'w-24 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none disabled:opacity-60';

function Row({ teller, canManage, onSaved }: { teller: Teller; canManage: boolean; onSaved: () => void }) {
  const [tickets, setTickets] = useState(String(teller.ticketsAllocated));
  const [admits, setAdmits] = useState(String(teller.admitLimit));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const changed = tickets !== String(teller.ticketsAllocated) || admits !== String(teller.admitLimit);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/pos/tellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: teller.memberId, ticketsAllocated: Number(tickets), admitLimit: Number(admits) }),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'Could not save');
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save');
    }
    setSaving(false);
  };

  return (
    <tr className="text-neutral-200">
      <td className="px-5 py-3 whitespace-nowrap">
        <p className="font-semibold text-white">{teller.name}</p>
        <p className="text-xs text-neutral-400">{teller.code ?? ''}{teller.hasLogin ? '' : ' · No login yet'}</p>
      </td>
      <td className="px-5 py-3">
        <input type="number" min={0} aria-label={`Tickets for ${teller.name}`} disabled={!canManage} value={tickets} onChange={(e) => setTickets(e.target.value)} className={inputClass} />
      </td>
      <td className="px-5 py-3">
        <input type="number" min={0} aria-label={`People ${teller.name} can admit`} disabled={!canManage} value={admits} onChange={(e) => setAdmits(e.target.value)} className={inputClass} />
      </td>
      <td className="px-5 py-3 whitespace-nowrap">{teller.ticketsSold} sold · {Math.max(0, teller.ticketsAllocated - teller.ticketsSold)} left</td>
      <td className="px-5 py-3 whitespace-nowrap">{teller.peopleAdmitted} in · {Math.max(0, teller.admitLimit - teller.peopleAdmitted)} left</td>
      <td className="px-5 py-3 whitespace-nowrap">{money(teller.cash)}</td>
      <td className="px-5 py-3 text-right whitespace-nowrap">
        {canManage && (
          <button onClick={save} disabled={!changed || saving} aria-label={`Save ${teller.name}`} className="rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-40">
            {saving ? 'Saving…' : 'Save'}
          </button>
        )}
        {error && <p role="alert" className="mt-1 text-xs text-red-300">{error}</p>}
      </td>
    </tr>
  );
}

export default function TellersPage() {
  const session = useAdminSession();
  const canManage = session.isAdmin || session.can('tellers', 'manage');
  const [tellers, setTellers] = useState<Teller[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    fetch('/api/pos/tellers')
      .then((response) => {
        if (!response.ok) throw new Error('load failed');
        return response.json();
      })
      .then((data) => setTellers(data.tellers))
      .catch(() => setError(true));
  }, []);

  useEffect(load, [load]);

  const sum = (key: 'ticketsAllocated' | 'ticketsSold' | 'peopleAdmitted' | 'cash') => (tellers ?? []).reduce((total, teller) => total + teller[key], 0);

  return (
    <div>
      <PageTitle title="POS Tellers" />
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Tile label="Tickets allocated" value={sum('ticketsAllocated').toLocaleString()} />
        <Tile label="Tickets sold" value={sum('ticketsSold').toLocaleString()} />
        <Tile label="People admitted" value={sum('peopleAdmitted').toLocaleString()} />
        <Tile label="Cash collected" value={money(sum('cash'))} detail="Uploaded sales only" />
      </div>

      {error && <p role="alert" className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">Tellers couldn&apos;t be loaded. Refresh to try again.</p>}

      <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-semibold text-neutral-400">
              {['Teller', 'Tickets', 'Can admit', 'Sold', 'Admitted', 'Cash', ''].map((heading) => (
                <th key={heading} className="px-5 py-3 whitespace-nowrap">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {tellers?.map((teller) => (
              <Row key={`${teller.memberId}-${teller.ticketsAllocated}-${teller.admitLimit}`} teller={teller} canManage={canManage} onSaved={load} />
            ))}
          </tbody>
        </table>
        {tellers?.length === 0 && <p className="px-5 py-12 text-center text-sm text-neutral-400">No tellers yet. Give someone the Ticket Team role in Users and they&apos;ll appear here.</p>}
        {tellers === null && !error && <p className="px-5 py-12 text-center text-sm text-neutral-400">Loading…</p>}
      </div>
    </div>
  );
}
