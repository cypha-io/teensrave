'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock, KeyRound, LogOut, MapPin } from 'lucide-react';
import { CardBack, CardFront } from '@/components/IdCardFaces';
import type { CardPerson } from '@/lib/id-card';

type Task = { id: number; title: string; priority: string; status: string; dueDate: string | null; notes: string | null };
type Portal = {
  userType: string;
  name: string;
  card: CardPerson;
  event: { name: string; date: string | null; venue: string | null; time: string | null; ticketUrl: string | null } | null;
  details: { title: string; rows: [string, string][] };
  tasks: Task[] | null;
  summary: { label: string; value: string }[] | null;
  manage: { label: string; href: string }[];
};

const impact = { fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' };

const titles: Record<string, string> = {
  executive: 'Executive Dashboard',
  volunteer: 'Volunteer Dashboard',
  staff: 'Staff Dashboard',
  crew: 'Crew Dashboard',
  media: 'Media Dashboard',
  performer: 'Performer Dashboard',
  vendor: 'Vendor Dashboard',
  sponsor: 'Sponsor Dashboard',
};

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 md:p-6">
      <h2 className="mb-4 text-lg font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function DashboardPage() {
  const [data, setData] = useState<Portal | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    fetch('/api/portal/me')
      .then((response) => {
        if (response.status === 401) window.location.href = '/login';
        if (!response.ok) throw new Error('load failed');
        return response.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  useEffect(load, [load]);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/login';
    }
  };

  const setTaskStatus = async (id: number, status: string) => {
    const response = await fetch(`/api/portal/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (response.ok) load();
    else setError(true);
  };

  return (
    <div className="dark-form min-h-screen bg-black text-white">
      <header className="flex items-center justify-between border-b border-white/10 bg-[#030303] px-4 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
          <span className="text-sm font-bold tracking-tight">TEENSRAVE</span>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/change-password" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-neutral-300 hover:bg-white/10 hover:text-white">
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Password</span>
          </Link>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-neutral-300 hover:bg-red-500/10 hover:text-red-300">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 sm:p-8">
        {error && (
          <p role="alert" className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            Your dashboard couldn&apos;t be loaded. Refresh to try again.
          </p>
        )}
        {!data && !error && <p className="text-neutral-400">Loading…</p>}

        {data && (
          <>
            <p className="text-sm font-bold tracking-[0.2em] text-green-400 uppercase">{titles[data.userType] ?? 'Dashboard'}</p>
            <h1 className="mt-2 mb-8 text-5xl leading-none uppercase md:text-6xl" style={impact}>
              Welcome, {data.name}
            </h1>

            {data.summary && (
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {data.summary.map((tile) => (
                  <div key={tile.label} className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-sm font-semibold text-neutral-300">{tile.label}</p>
                    <p className="mt-2 text-5xl leading-none" style={impact}>
                      {tile.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">
              <Panel title="Your ID Card">
                <div data-portal-card className="flex flex-wrap justify-center gap-3">
                  <CardFront person={data.card} />
                  <CardBack person={data.card} />
                </div>
              </Panel>

              <div className="space-y-4">
                {data.event && (
                  <Panel title={data.event.name}>
                    <ul className="space-y-3 text-sm text-neutral-200">
                      <li className="flex items-center gap-3"><CalendarDays className="h-4 w-4 text-green-400" aria-hidden="true" />{data.event.date ? formatDate(data.event.date) : 'Date to be announced'}</li>
                      <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-green-400" aria-hidden="true" />{data.event.venue || 'Venue to be announced'}</li>
                      <li className="flex items-center gap-3"><Clock className="h-4 w-4 text-green-400" aria-hidden="true" />{data.event.time || 'Time to be announced'}</li>
                    </ul>
                  </Panel>
                )}

                <Panel title={data.details.title}>
                  <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    {data.details.rows.map(([label, value]) => (
                      <div key={label} className="min-w-0">
                        <dt className="text-xs text-neutral-400">{label}</dt>
                        <dd className="truncate font-semibold text-white">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </Panel>
              </div>
            </div>

            {data.tasks && (
              <div className="mt-4">
                <Panel title="Your Tasks">
                  {data.tasks.length === 0 ? (
                    <p className="text-sm text-neutral-400">No tasks assigned to you yet.</p>
                  ) : (
                    <ul className="divide-y divide-white/10">
                      {data.tasks.map((task) => (
                        <li key={task.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="font-semibold text-white">{task.title}</p>
                            <p className="text-xs text-neutral-400 capitalize">
                              {task.priority} priority{task.dueDate ? ` · Due ${formatDate(task.dueDate)}` : ''}
                            </p>
                            {task.notes && <p className="mt-1 text-sm text-neutral-300">{task.notes}</p>}
                          </div>
                          <select
                            aria-label={`Status of ${task.title}`}
                            value={task.status}
                            onChange={(e) => setTaskStatus(task.id, e.target.value)}
                            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white capitalize"
                          >
                            {['open', 'in progress', 'done'].map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>
              </div>
            )}

            {data.manage.length > 0 && (
              <div className="mt-4">
                <Panel title="Your Access">
                  <div className="flex flex-wrap gap-2">
                    {data.manage.map((item) => (
                      <Link key={item.href} href={item.href} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-green-500/50 hover:bg-white/10">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </Panel>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
