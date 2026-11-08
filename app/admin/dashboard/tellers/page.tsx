'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import LoginAccess from '@/components/admin/LoginAccess';
import { money, PageTitle, Tile } from '@/components/admin/ResourceManager';
import { useAdminSession } from '@/components/admin/session-context';

type Candidate = { memberId: number; name: string; category: string };

type Teller = {
  memberId: number;
  name: string;
  code: string | null;
  hasLogin: boolean;
  viaRole: boolean;
  ticketsAllocated: number;
  admitLimit: number;
  ticketsSold: number;
  peopleAdmitted: number;
  cash: number;
  typeLimits: Record<string, number>;
  typeSold: Record<string, number>;
};

type TicketOption = { id: number; name: string; tier: string };

const inputClass = 'w-24 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none disabled:opacity-60';

function Row({ teller, ticketTypes, canManage, isAdmin, onSaved }: { teller: Teller; ticketTypes: TicketOption[]; canManage: boolean; isAdmin: boolean; onSaved: () => void }) {
  const [tickets, setTickets] = useState(String(teller.ticketsAllocated));
  const [admits, setAdmits] = useState(String(teller.admitLimit));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const savedLimits = Object.fromEntries(ticketTypes.map((type) => [type.id, teller.typeLimits[type.id] == null ? '' : String(teller.typeLimits[type.id])]));
  const [limits, setLimits] = useState<Record<string, string>>(savedLimits);
  const [open, setOpen] = useState(Object.keys(teller.typeLimits).length > 0);
  const changed = tickets !== String(teller.ticketsAllocated) || admits !== String(teller.admitLimit) || ticketTypes.some((type) => (limits[type.id] ?? '') !== savedLimits[type.id]);
  const limitCount = Object.keys(teller.typeLimits).length;

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/pos/tellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: teller.memberId,
          ticketsAllocated: Number(tickets),
          admitLimit: Number(admits),
          typeLimits: Object.fromEntries(ticketTypes.map((type) => [type.id, (limits[type.id] ?? '').trim() === '' ? null : Number(limits[type.id])])),
        }),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'Could not save');
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save');
    }
    setSaving(false);
  };

  const remove = async () => {
    if (!window.confirm(`Remove ${teller.name} as a teller? Make sure their device has uploaded every sale first, or those sales can't upload.`)) return;
    setError('');
    const response = await fetch(`/api/pos/tellers?memberId=${teller.memberId}`, { method: 'DELETE' });
    if (response.ok) onSaved();
    else setError((await response.json().catch(() => null))?.error ?? 'Could not remove');
  };

  return (
    <>
    <tr className="text-neutral-200">
      <td className="px-5 py-3 whitespace-nowrap">
        <p className="font-semibold text-white">{teller.name}</p>
        <p className="text-xs text-neutral-400">{[teller.code, teller.viaRole ? 'Through role' : 'Assigned', teller.hasLogin ? null : 'No login yet'].filter(Boolean).join(' · ')}</p>
        <button type="button" aria-expanded={open} aria-label={`Per-ticket limits for ${teller.name}`} onClick={() => setOpen(!open)} className="mt-1 text-xs font-semibold text-green-400 hover:text-green-300">
          Per ticket{limitCount > 0 ? ` (${limitCount})` : ''} {open ? '▴' : '▾'}
        </button>
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
        <div className="flex items-center justify-end gap-1">
        {isAdmin && <LoginAccess type="member" id={teller.memberId} name={teller.name} />}
        {canManage && (
          <button onClick={save} disabled={!changed || saving} aria-label={`Save ${teller.name}`} className="rounded-full bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-40">
            {saving ? 'Saving…' : 'Save'}
          </button>
        )}
        {canManage && !teller.viaRole && (
          <button onClick={remove} aria-label={`Remove ${teller.name}`} className="rounded-full px-3 py-1.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300">
            Remove
          </button>
        )}
        </div>
        {error && <p role="alert" className="mt-1 text-xs text-red-300">{error}</p>}
      </td>
    </tr>
    {open && (
      <tr className="bg-black/30">
        <td colSpan={7} className="px-5 py-4">
          <p className="mb-3 text-xs text-neutral-400">Leave blank for no limit on that ticket. The overall limits above still apply.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ticketTypes.map((type) => (
              <label key={type.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2 text-sm text-neutral-200">
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-white">{type.name}</span>
                  <span className="block text-xs text-neutral-400">{type.tier} · {teller.typeSold[type.id] ?? 0} sold</span>
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder="No limit"
                  aria-label={`${type.name} ${type.tier} limit for ${teller.name}`}
                  disabled={!canManage}
                  value={limits[type.id] ?? ''}
                  onChange={(e) => setLimits((current) => ({ ...current, [type.id]: e.target.value }))}
                  className={inputClass}
                />
              </label>
            ))}
          </div>
        </td>
      </tr>
    )}
    </>
  );
}

function AssignTeller({ candidates, onAssigned }: { candidates: Candidate[]; onAssigned: () => void }) {
  const [memberId, setMemberId] = useState('');
  const [tickets, setTickets] = useState('0');
  const [admits, setAdmits] = useState('0');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/pos/tellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: Number(memberId), ticketsAllocated: Number(tickets), admitLimit: Number(admits) }),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'Could not assign');
      setMemberId('');
      setTickets('0');
      setAdmits('0');
      onAssigned();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not assign');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="dark-form mb-4 rounded-[2rem] border border-white/10 bg-white/5 p-5">
      <h2 className="mb-3 text-lg font-bold text-white">Assign a Teller</h2>
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <label className="min-w-0 flex-1 text-xs font-medium text-neutral-400">
          Person
          <select aria-label="Person to assign" required value={memberId} onChange={(e) => setMemberId(e.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-green-500 focus:outline-none">
            <option value="">{candidates.length === 0 ? 'Everyone is already a teller' : 'Choose someone…'}</option>
            {candidates.map((person) => (
              <option key={person.memberId} value={person.memberId}>{person.name} ({person.category})</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-neutral-400">
          Tickets
          <input aria-label="Tickets to allocate" type="number" min={0} value={tickets} onChange={(e) => setTickets(e.target.value)} className={`${inputClass} mt-1 block`} />
        </label>
        <label className="text-xs font-medium text-neutral-400">
          Can admit
          <input aria-label="People they can admit" type="number" min={0} value={admits} onChange={(e) => setAdmits(e.target.value)} className={`${inputClass} mt-1 block`} />
        </label>
        <button disabled={saving || !memberId} className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-40">
          {saving ? 'Assigning…' : 'Assign Teller'}
        </button>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
    </form>
  );
}

export default function TellersPage() {
  const session = useAdminSession();
  const canManage = session.isAdmin || session.can('tellers', 'manage');
  const [tellers, setTellers] = useState<Teller[] | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketOption[]>([]);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    fetch('/api/pos/tellers')
      .then((response) => {
        if (!response.ok) throw new Error('load failed');
        return response.json();
      })
      .then((data) => {
        setTellers(data.tellers);
        setCandidates(data.candidates);
        setTicketTypes(data.ticketTypes);
      })
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

      {canManage && <AssignTeller candidates={candidates} onAssigned={load} />}

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
              <Row key={`${teller.memberId}-${teller.ticketsAllocated}-${teller.admitLimit}-${JSON.stringify(teller.typeLimits)}`} teller={teller} ticketTypes={ticketTypes} canManage={canManage} isAdmin={session.isAdmin} onSaved={load} />
            ))}
          </tbody>
        </table>
        {tellers?.length === 0 && <p className="px-5 py-12 text-center text-sm text-neutral-400">No tellers yet. Assign someone above.</p>}
        {tellers === null && !error && <p className="px-5 py-12 text-center text-sm text-neutral-400">Loading…</p>}
      </div>
    </div>
  );
}
