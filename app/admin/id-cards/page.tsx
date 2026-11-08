'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Printer } from 'lucide-react';
import { CardBack, CardFront } from '@/components/IdCardFaces';
import { resizePhoto } from '@/components/admin/ResourceManager';
import { eventCardLabel, toCardPerson, type CardPerson, type CardType } from '@/lib/id-card';

type Row = Record<string, any>;
type Person = CardPerson;
function PhotoControl({ person, onSaved }: { person: Person; onSaved: (photo: string | null) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async (photo: string | null) => {
    const response = await fetch('/api/admin/card-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: person.type, id: person.id, photo }),
    });
    if (!response.ok) throw new Error('The photo could not be saved.');
    onSaved(photo);
  };

  return (
    <div className="mt-2 flex items-center gap-3 text-xs print:hidden">
      <label className="cursor-pointer font-semibold text-green-400 hover:text-green-300">
        {busy ? 'Saving…' : person.photo ? 'Change photo' : 'Add photo'}
        <input
          type="file"
          accept="image/*"
          aria-label={`Photo for ${person.name}`}
          className="sr-only"
          disabled={busy}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBusy(true);
            setError('');
            try {
              await save(await resizePhoto(file));
            } catch (err) {
              setError(err instanceof Error ? err.message : 'The photo could not be saved.');
            }
            setBusy(false);
          }}
        />
      </label>
      {person.photo && (
        <button
          type="button"
          className="font-semibold text-red-400 hover:text-red-300"
          onClick={() => save(null).catch(() => setError('The photo could not be removed.'))}
        >
          Remove
        </button>
      )}
      {error && <span role="alert" className="text-red-300">{error}</span>}
    </div>
  );
}

function Cards() {
  const params = useSearchParams();
  const id = params.get('id');
  const category = params.get('category');
  const typeParam = params.get('type');
  const type: CardType = typeParam === 'media' || typeParam === 'performer' || typeParam === 'vendor' || typeParam === 'sponsor' ? typeParam : 'member';

  const [rows, setRows] = useState<Row[] | null>(null);
  const [roles, setRoles] = useState<Row[]>([]);
  const [eventLabel, setEventLabel] = useState('Not set');
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = (url: string) =>
      fetch(url).then((response) => {
        if (response.status === 401) window.location.href = '/login';
        if (!response.ok) throw new Error('load failed');
        return response.json();
      });
    const resourceFor = { member: 'members', vendor: 'vendors', sponsor: 'sponsors' } as const;
    const main =
      type === 'media' || type === 'performer'
        ? load(type === 'media' ? '/api/media-accreditation' : '/api/artists').then((d) => d.applications ?? [])
        : load(`/api/admin/resources/${resourceFor[type]}`).then((d) => d.rows);
    Promise.all([main, load('/api/admin/resources/roles'), load('/api/admin/resources/events')])
      .then(([people, roleData, eventData]) => {
        setRows(people);
        setRoles(roleData.rows);
        const current = eventData.rows.find((event: Row) => event.isCurrent);
        if (current) setEventLabel(eventCardLabel(current));
      })
      .catch(() => setError(true));
  }, [type]);

  const toPerson = (row: Row): Person => toCardPerson(type, row, { roleName: roles.find((r) => r.id === row.roleId)?.name, eventLabel });

  // Media and performers only get a card once approved.
  const selected = (rows ?? []).filter((row) => {
    if (type === 'media' || type === 'performer') return row.status === 'approved' && (!id || String(row.id) === id);
    if (type === 'vendor') return id ? String(row.id) === id : row.status !== 'cancelled';
    if (type === 'sponsor') return id ? String(row.id) === id : row.status !== 'declined';
    return id ? String(row.id) === id : row.status === 'active' && (!category || row.category === category);
  });
  const people = selected.map(toPerson);

  const updatePhoto = (person: Person, photo: string | null) =>
    setRows((current) => (current ?? []).map((row) => (row.id === person.id ? { ...row, cardPhoto: photo } : row)));

  return (
    <div className="min-h-screen bg-neutral-900 p-6 [print-color-adjust:exact] print:bg-white print:p-0">
      <style>{'@page { size: A4; margin: 10mm; }'}</style>
      <div className="mb-6 flex items-center justify-between print:hidden">
        <p className="text-sm text-neutral-300">{rows === null && !error ? 'Loading…' : `${people.length} ID card${people.length === 1 ? '' : 's'}`}</p>
        <button
          onClick={() => window.print()}
          disabled={people.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-40"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print
        </button>
      </div>

      {error && <p role="alert" className="text-red-300">The ID cards couldn&apos;t be loaded. Refresh to try again.</p>}
      {rows !== null && people.length === 0 && (
        <p className="text-neutral-400">{type === 'member' ? 'No active users to show.' : type === 'media' || type === 'performer' ? 'No approved applications to show.' : 'Nothing to show yet.'}</p>
      )}

      <div className="flex flex-wrap gap-6 print:gap-[6mm]">
        {people.map((person) => (
          <div key={person.key} className="break-inside-avoid">
            <div data-id-card className="flex gap-[3mm]">
              <CardFront person={person} />
              <CardBack person={person} />
            </div>
            {(person.type === 'media' || person.type === 'performer') && <PhotoControl person={person} onSaved={(photo) => updatePhoto(person, photo)} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IdCardsPage() {
  return (
    <Suspense fallback={null}>
      <Cards />
    </Suspense>
  );
}
