'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { useAdminSession } from '@/components/admin/session-context';
import ResourceManager, { fetchRows, money, PageTitle, saveRow, Tile, type Row } from '@/components/admin/ResourceManager';

const tabs = ['Overview', 'Ticket Types', 'Sales'] as const;

function Overview() {
  const [data, setData] = useState<{ types: Row[]; sales: Row[] } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([fetchRows('ticket-types'), fetchRows('ticket-sales')])
      .then(([types, sales]) => setData({ types, sales }))
      .catch(() => setError(true));
  }, []);

  if (error) return <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">Ticket data couldn&apos;t be loaded. Refresh to try again.</p>;
  if (!data) return <p className="text-neutral-400">Loading…</p>;

  const paid = data.sales.filter((s) => s.status === 'paid');
  const sold = paid.reduce((sum, s) => sum + s.quantity, 0);
  const revenue = paid.reduce((sum, s) => sum + Number(s.amount ?? 0), 0);
  const checkedIn = paid.filter((s) => s.checkedIn).reduce((sum, s) => sum + s.quantity, 0);
  const pending = data.sales.filter((s) => s.status === 'pending').length;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Tile label="Tickets sold" value={sold.toLocaleString()} detail={`${paid.length} paid orders`} />
        <Tile label="Revenue" value={money(revenue)} detail="Paid orders only" />
        <Tile label="Checked in" value={checkedIn.toLocaleString()} detail={`of ${sold.toLocaleString()} sold`} />
        <Tile label="Pending orders" value={pending.toLocaleString()} detail="Awaiting payment" />
      </div>

      <div className="mt-4 overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-semibold text-neutral-400">
              {['Ticket', 'Tier', 'Price', 'Sold', 'Remaining', 'Revenue'].map((heading) => (
                <th key={heading} className="px-5 py-3 whitespace-nowrap">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-neutral-200">
            {data.types.map((type) => {
              const orders = paid.filter((s) => s.ticketTypeId === type.id);
              const typeSold = orders.reduce((sum, s) => sum + s.quantity, 0);
              const typeRevenue = orders.reduce((sum, s) => sum + Number(s.amount ?? 0), 0);
              const percent = type.capacity ? Math.min(100, (typeSold / type.capacity) * 100) : null;
              return (
                <tr key={type.id}>
                  <td className="px-5 py-3 font-semibold whitespace-nowrap text-white">{type.name}</td>
                  <td className="px-5 py-3 whitespace-nowrap">{type.tier}</td>
                  <td className="px-5 py-3">{money(type.price)}</td>
                  <td className="px-5 py-3">{typeSold}</td>
                  <td className="px-5 py-3">
                    {type.capacity == null ? (
                      <span className="text-neutral-400">No limit</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="w-10">{Math.max(0, type.capacity - typeSold)}</span>
                        <span className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                          <span className="block h-full rounded-full bg-green-500" style={{ width: `${percent}%` }} />
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3">{money(typeRevenue)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {data.types.length === 0 && <p className="px-5 py-12 text-center text-sm text-neutral-400">No ticket types yet.</p>}
      </div>
    </>
  );
}

export default function TicketsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview');
  const session = useAdminSession();
  const canManage = session.isAdmin || session.can('tickets', 'manage');

  return (
    <div>
      <PageTitle title="Tickets" />
      <div className="mb-6 flex flex-wrap gap-1" role="tablist">
        {tabs.map((name) => (
          <button
            key={name}
            role="tab"
            aria-selected={tab === name}
            onClick={() => setTab(name)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === name ? 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <Overview />}
      {tab === 'Ticket Types' && <ResourceManager resource="ticket-types" />}
      {tab === 'Sales' && (
        <ResourceManager
          resource="ticket-sales"
          rowActions={!canManage ? undefined : (row, reload) => (
            <button
              aria-label={`${row.checkedIn ? 'Undo check-in for' : 'Check in'} ${row.buyerName}`}
              title={row.checkedIn ? 'Undo check-in' : 'Check in'}
              onClick={async () => {
                try {
                  await saveRow('ticket-sales', row.id, { checkedIn: !row.checkedIn });
                  reload();
                } catch (error) {
                  window.alert(error instanceof Error ? error.message : 'Could not update');
                }
              }}
              className={`rounded-full p-2 hover:bg-green-500/10 ${row.checkedIn ? 'text-green-400' : 'text-neutral-400 hover:text-green-300'}`}
            >
              {row.checkedIn ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </button>
          )}
        />
      )}
    </div>
  );
}
