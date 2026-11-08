'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { CloudOff, CloudUpload, Download, Lock, Minus, Plus, RefreshCw } from 'lucide-react';
import {
  allSales, cachePos, checkPin, clearDevice, getConfig, hashPin, markSynced, recordSale, saveConfig, voidSale,
  type PosAllocation, type PosConfig, type PosSale, type PosTicket,
} from '@/lib/pos-store';

const impact = { fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' };
const field = 'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-green-500 focus:outline-none';
const BATCH = 50;
// Short limits: under jamming a request can hang for minutes and must never hold up a sale.
const TIMEOUT_MS = 10000;
// Uploads run in the background, so they can wait longer on a weak connection and retry often.
const UPLOAD_TIMEOUT_MS = 25000;
const SYNC_EVERY_MS = 15000;

const money = (value: number) => `₵${value.toLocaleString('en-GB', { maximumFractionDigits: 2 })}`;
const limit = (value: number) => (Number.isFinite(value) ? String(Math.max(0, value)) : 'No limit');
type SyncState = 'idle' | 'uploading' | 'uploaded' | 'unreachable' | 'signin';
type Setup = { staff: string; eventName: string; tickets: PosTicket[]; allocation: PosAllocation };

async function fetchSetup(deviceCode: string) {
  const response = await fetch(`/api/pos/bootstrap?device=${deviceCode}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (response.status === 401 || response.status === 403) throw new Error('Your session has ended. Sign in again, then come back here.');
  if (!response.ok) throw new Error('Could not reach the server.');
  return response.json() as Promise<Setup>;
}

function Prepare({ onReady }: { onReady: (config: PosConfig) => void }) {
  const [deviceLabel, setDeviceLabel] = useState('');
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{4,8}$/.test(pin)) return setError('Choose a PIN of 4 to 8 digits.');
    if (pin !== confirm) return setError('The PINs don’t match.');
    setBusy(true);
    try {
      await navigator.serviceWorker.ready;
      const deviceCode = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32]).join('');
      const setup = await fetchSetup(deviceCode);
      await navigator.storage?.persist?.();
      await cachePos();
      const config: PosConfig = { deviceLabel: deviceLabel.trim(), deviceCode, ...setup, preparedAt: new Date().toISOString(), ...(await hashPin(pin)) };
      await saveConfig(config);
      onReady(config);
    } catch (err) {
      setError(err instanceof Error && err.name !== 'TimeoutError' ? err.message : 'Could not reach the server. Prepare this device where there is good signal.');
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-8 max-w-md space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div>
        <h1 className="text-4xl uppercase" style={impact}>Prepare This Device</h1>
        <p className="mt-2 text-sm text-neutral-400">Do this before the event, where there is good signal. Afterwards the POS works with no network.</p>
      </div>
      <div>
        <label htmlFor="device" className="mb-1.5 block text-sm font-medium text-neutral-300">Device name</label>
        <input id="device" required maxLength={60} placeholder="e.g. Gate 1" value={deviceLabel} onChange={(e) => setDeviceLabel(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="pin" className="mb-1.5 block text-sm font-medium text-neutral-300">Choose a PIN (4 to 8 digits)</label>
        <input id="pin" type="password" inputMode="numeric" autoComplete="new-password" value={pin} onChange={(e) => setPin(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-neutral-300">Confirm PIN</label>
        <input id="confirm" type="password" inputMode="numeric" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
      </div>
      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      <button disabled={busy} className="w-full rounded-full bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 px-6 py-3 font-bold text-white disabled:opacity-60">
        {busy ? 'Preparing…' : 'Prepare Device'}
      </button>
    </form>
  );
}

function Unlock({ config, onUnlock }: { config: PosConfig; onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const failures = useRef(0);
  const [waiting, setWaiting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (waiting) return;
    if (await checkPin(pin, config)) return onUnlock();
    setPin('');
    failures.current += 1;
    if (failures.current >= 5) {
      failures.current = 0;
      setWaiting(true);
      setError('Too many wrong PINs. Wait 30 seconds.');
      setTimeout(() => { setWaiting(false); setError(''); }, 30000);
    } else {
      setError('Wrong PIN.');
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-16 max-w-sm space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center">
      <h1 className="text-4xl uppercase" style={impact}>{config.deviceLabel}</h1>
      <p className="text-sm text-neutral-400">Enter this device&apos;s PIN to open the POS.</p>
      <input aria-label="PIN" type="password" inputMode="numeric" autoComplete="off" autoFocus value={pin} onChange={(e) => setPin(e.target.value)} className={`${field} text-center text-2xl tracking-[0.4em]`} />
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <button disabled={waiting} className="w-full rounded-full bg-green-600 px-6 py-3 font-bold text-white disabled:opacity-50">Open POS</button>
    </form>
  );
}

function Till({ config, setConfig, onLock, onReset }: { config: PosConfig; setConfig: (c: PosConfig) => void; onLock: () => void; onReset: () => void }) {
  const [sales, setSales] = useState<PosSale[]>([]);
  const [ticket, setTicket] = useState<PosTicket | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [buyer, setBuyer] = useState('');
  const [receipt, setReceipt] = useState<PosSale | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [sync, setSync] = useState<SyncState>('idle');
  const [rejected, setRejected] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const syncing = useRef(false);
  const latest = useRef(config);

  useEffect(() => {
    latest.current = config;
  }, [config]);

  const reload = useCallback(async () => setSales(await allSales()), []);

  const applySetup = useCallback(async (setup: Setup) => {
    const current = latest.current;
    if (JSON.stringify([setup.tickets, setup.allocation, setup.eventName]) === JSON.stringify([current.tickets, current.allocation, current.eventName])) return;
    const next = { ...current, ...setup };
    await saveConfig(next);
    setConfig(next);
  }, [setConfig]);

  const upload = useCallback(async () => {
    if (syncing.current) return;
    syncing.current = true;
    let reachable = false;
    try {
      let refused = 0;
      for (;;) {
        const pending = (await allSales()).filter((s) => !s.synced).reverse();
        const batch = pending.slice(refused, refused + BATCH);
        if (batch.length === 0) {
          setSync(pending.length === 0 ? 'uploaded' : 'idle');
          reachable = pending.length === 0;
          break;
        }
        setSync('uploading');
        const response = await fetch('/api/pos/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceLabel: latest.current.deviceLabel, sales: batch }),
          signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
        });
        if (response.status === 401 || response.status === 403) {
          setSync('signin');
          break;
        }
        if (!response.ok) throw new Error('upload failed');
        const result = await response.json();
        const accepted = new Set<string>(result.accepted);
        await markSynced(batch.filter((s) => accepted.has(s.clientRef)));
        refused += batch.filter((s) => !accepted.has(s.clientRef)).length;
        await reload();
      }
      setRejected(refused);
      // Whenever there's a connection, pick up any change to this teller's allowance.
      if (reachable) await fetchSetup(latest.current.deviceCode).then(applySetup).catch(() => undefined);
    } catch {
      setSync('unreachable');
    } finally {
      syncing.current = false;
      await reload();
    }
  }, [applySetup, reload]);

  useEffect(() => {
    let cancelled = false;
    allSales().then((list) => { if (!cancelled) setSales(list); });
    const first = setTimeout(upload, 500);
    const timer = setInterval(upload, SYNC_EVERY_MS);
    window.addEventListener('online', upload);
    return () => {
      cancelled = true;
      clearTimeout(first);
      clearInterval(timer);
      window.removeEventListener('online', upload);
    };
  }, [upload]);

  const active = useMemo(() => sales.filter((s) => !s.voided), [sales]);
  const pending = sales.filter((s) => !s.synced).length;
  const cash = active.reduce((sum, s) => sum + Number(s.amount), 0);
  const ticketsSold = active.reduce((sum, s) => sum + s.quantity, 0);
  const peopleIn = active.reduce((sum, s) => sum + s.quantity * s.admits, 0);
  const { allocation } = config;
  const ticketsLeft = allocation.tickets == null ? Infinity : allocation.tickets - allocation.usedElsewhereTickets - ticketsSold;
  const admitsLeft = allocation.admits == null ? Infinity : allocation.admits - allocation.usedElsewhereAdmits - peopleIn;
  const maxQuantity = (option: PosTicket) => Math.max(0, Math.min(50, ticketsLeft, Math.floor(admitsLeft / option.admitsCount)));
  const soldOnDevice = (id: number) => active.filter((s) => s.ticketTypeId === id).reduce((sum, s) => sum + s.quantity, 0);
  const lineTotal = ticket ? Number(ticket.price) * quantity : 0;

  const resetSale = () => {
    setTicket(null);
    setQuantity(1);
    setBuyer('');
    setError('');
  };

  const confirmSale = async () => {
    if (!ticket || saving) return;
    if (quantity > maxQuantity(ticket)) return setError('This is more than your allowance. Ask an admin to increase it.');
    setSaving(true);
    setError('');
    try {
      const sale = await recordSale(config.deviceCode, {
        ticketTypeId: ticket.id,
        ticketLabel: `${ticket.name} · ${ticket.tier}`,
        quantity,
        admits: ticket.admitsCount,
        amount: lineTotal.toFixed(2),
        buyerName: buyer.trim(),
      });
      setReceipt(sale);
      resetSale();
      await reload();
      upload();
    } catch {
      setError('This sale could not be saved on the device. Do not take payment. Try again.');
    }
    setSaving(false);
  };

  const refresh = async () => {
    setRefreshing(true);
    setError('');
    try {
      const setup = await fetchSetup(config.deviceCode);
      await cachePos();
      await applySetup(setup);
    } catch {
      setError('Couldn’t update. The POS keeps working with what it already has.');
    }
    setRefreshing(false);
  };

  const backup = () => {
    const cell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = [['Receipt', 'Time', 'Ticket', 'Quantity', 'People admitted', 'Cash', 'Buyer', 'Voided', 'Uploaded'], ...sales.map((s) => [s.receiptCode, s.soldAt, s.ticketLabel, s.quantity, s.quantity * s.admits, s.amount, s.buyerName, s.voided ? 'Yes' : 'No', s.synced ? 'Yes' : 'No'])];
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([rows.map((row) => row.map(cell).join(',')).join('\n')], { type: 'text/csv' }));
    link.download = `pos-${config.deviceLabel.replace(/\W+/g, '-').toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const status =
    pending === 0 && sync !== 'unreachable'
      ? { text: 'All sales uploaded', tone: 'text-green-300 border-green-500/30 bg-green-500/10', icon: CloudUpload }
      : sync === 'signin'
        ? { text: `${pending} saved on this device. Sign in to upload.`, tone: 'text-yellow-300 border-yellow-500/30 bg-yellow-500/10', icon: CloudOff }
        : sync === 'uploading'
          ? { text: `Uploading ${pending}…`, tone: 'text-neutral-200 border-white/15 bg-white/5', icon: CloudUpload }
          : { text: pending > 0 ? `${pending} saved on this device. Will upload when connected.` : 'No connection. Sales will save on this device.', tone: 'text-yellow-300 border-yellow-500/30 bg-yellow-500/10', icon: CloudOff };
  const StatusIcon = status.icon;

  if (receipt) {
    return (
      <div className="mx-auto mt-6 max-w-md rounded-[2rem] border border-green-500/30 bg-white/5 p-6 text-center">
        <p className="text-sm font-bold tracking-[0.2em] text-green-400 uppercase">Sale Saved</p>
        <p data-admit className="mt-2 text-7xl uppercase" style={impact}>Admit {receipt.quantity * receipt.admits}</p>
        <p data-receipt className="mt-3 text-3xl tracking-wide" style={impact}>{receipt.receiptCode}</p>
        <p className="mt-4 text-lg font-semibold">{receipt.ticketLabel} × {receipt.quantity}</p>
        <p className="mt-1 text-4xl" style={impact}>{money(Number(receipt.amount))}</p>
        <p className="mt-1 text-sm text-neutral-400">Cash</p>
        <button onClick={() => setReceipt(null)} className="mt-6 w-full rounded-full bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 px-6 py-4 text-lg font-bold text-white">New Sale</button>
      </div>
    );
  }

  const outOfAllowance = ticketsLeft <= 0 || admitsLeft <= 0;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${status.tone}`}>
        <span data-sync-status className="flex items-center gap-2"><StatusIcon className="h-4 w-4 shrink-0" aria-hidden="true" />{status.text}</span>
        {pending > 0 && sync !== 'signin' && <button onClick={upload} className="shrink-0 underline">Retry</button>}
        {sync === 'signin' && <a href="/login?redirect=/pos" className="shrink-0 underline">Sign in</a>}
      </div>
      {rejected > 0 && <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{rejected} sale(s) were refused by the server and stay on this device. Download a backup and tell an admin.</p>}

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-neutral-400">Tickets left</p>
          <p data-tickets-left className="text-3xl" style={impact}>{limit(ticketsLeft)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-neutral-400">People you can admit</p>
          <p data-admits-left className="text-3xl" style={impact}>{limit(admitsLeft)}</p>
        </div>
      </div>

      {outOfAllowance && <p data-out-of-allowance role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">You&apos;ve reached your allowance. Ask an admin to increase it. It updates when this device next has a connection.</p>}

      {!ticket ? (
        <section>
          <h1 className="mb-3 text-4xl uppercase" style={impact}>Sell &amp; Admit</h1>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {config.tickets.map((option) => {
              const left = option.remaining == null ? null : Math.max(0, option.remaining - soldOnDevice(option.id));
              const available = maxQuantity(option) >= 1;
              return (
                <button key={option.id} data-ticket={`${option.name} ${option.tier}`} disabled={!available} onClick={() => setTicket(option)} className={`rounded-2xl p-5 text-left disabled:opacity-35 ${option.tier === 'VIP' ? 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500' : 'border border-white/10 bg-white/5'}`}>
                  <span className="block text-sm font-semibold text-white/80">{option.name} · {option.tier}</span>
                  <span className="mt-1 block text-4xl" style={impact}>{money(Number(option.price))}</span>
                  <span className="mt-1 block text-xs text-white/70">{[option.admits, left == null ? null : `about ${left} left`].filter(Boolean).join(' · ') || ' '}</span>
                </button>
              );
            })}
          </div>
          {config.tickets.length === 0 && <p className="text-neutral-400">No tickets are on sale. Update when you have signal.</p>}
        </section>
      ) : (
        <section className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl uppercase" style={impact}>{ticket.name} · {ticket.tier}</h1>
            <button onClick={resetSale} className="text-sm font-semibold text-neutral-400 underline">Change</button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-300">Quantity</span>
            <div className="flex items-center gap-4">
              <button aria-label="Fewer" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-full bg-white/10 p-3"><Minus className="h-5 w-5" /></button>
              <span data-quantity className="w-8 text-center text-3xl" style={impact}>{quantity}</span>
              <button aria-label="More" disabled={quantity >= maxQuantity(ticket)} onClick={() => setQuantity(quantity + 1)} className="rounded-full bg-white/10 p-3 disabled:opacity-30"><Plus className="h-5 w-5" /></button>
            </div>
          </div>

          <input aria-label="Buyer name" placeholder="Buyer name (optional)" value={buyer} onChange={(e) => setBuyer(e.target.value)} className={field} />

          {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

          <button onClick={confirmSale} disabled={saving} className="w-full rounded-full bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 px-6 py-4 text-xl font-bold text-white disabled:opacity-60">
            Cash {money(lineTotal)} · Admit {quantity * ticket.admitsCount}
          </button>
        </section>
      )}

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
        <h2 className="mb-3 text-lg font-bold">This Device</h2>
        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div><dt className="text-xs text-neutral-400">Tickets sold</dt><dd data-device-tickets className="text-xl font-bold">{ticketsSold}</dd></div>
          <div><dt className="text-xs text-neutral-400">People admitted</dt><dd data-device-admits className="text-xl font-bold">{peopleIn}</dd></div>
          <div><dt className="text-xs text-neutral-400">Cash to hand in</dt><dd data-device-cash className="text-xl font-bold">{money(cash)}</dd></div>
        </dl>
      </section>

      {sales.length > 0 && (
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <h2 className="mb-2 text-lg font-bold">Recent Sales</h2>
          <ul className="divide-y divide-white/10">
            {sales.slice(0, 15).map((sale) => (
              <li key={sale.clientRef} className="flex items-center justify-between gap-3 py-2 text-sm">
                <div className={`min-w-0 ${sale.voided ? 'line-through opacity-50' : ''}`}>
                  <p className="font-semibold">{sale.receiptCode}</p>
                  <p className="truncate text-xs text-neutral-400">{sale.ticketLabel} × {sale.quantity} · {money(Number(sale.amount))} · Admit {sale.quantity * sale.admits}</p>
                </div>
                {!sale.voided && (
                  <button
                    aria-label={`Void ${sale.receiptCode}`}
                    className="shrink-0 text-xs font-semibold text-red-400"
                    onClick={async () => {
                      if (!window.confirm(`Void sale ${sale.receiptCode}?`)) return;
                      await voidSale(sale.clientRef);
                      await reload();
                      upload();
                    }}
                  >
                    Void
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-2 pb-6 text-sm font-semibold">
        <button onClick={onLock} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2"><Lock className="h-4 w-4" aria-hidden="true" />Lock</button>
        <button onClick={backup} disabled={sales.length === 0} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 disabled:opacity-40"><Download className="h-4 w-4" aria-hidden="true" />Download Backup</button>
        <button onClick={refresh} disabled={refreshing} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 disabled:opacity-40"><RefreshCw className="h-4 w-4" aria-hidden="true" />{refreshing ? 'Updating…' : 'Update'}</button>
        <button
          disabled={pending > 0}
          title={pending > 0 ? 'Upload every sale first' : undefined}
          onClick={async () => {
            if (!window.confirm('Remove this device’s POS and sales history?')) return;
            await clearDevice();
            onReset();
          }}
          className="rounded-full border border-red-500/30 px-4 py-2 text-red-300 disabled:opacity-40"
        >
          Reset Device
        </button>
      </div>
    </div>
  );
}

export default function PosPage() {
  const [config, setConfig] = useState<PosConfig | null | undefined>(undefined);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    navigator.serviceWorker?.register('/sw-pos.js', { scope: '/pos' }).catch(() => undefined);
    getConfig().then((saved) => setConfig(saved ?? null)).catch(() => setConfig(null));
  }, []);

  return (
    <div className="dark-form min-h-screen bg-black p-4 text-white sm:p-6">
      <header className="mx-auto mb-4 flex max-w-3xl items-center justify-between">
        <p className="text-lg uppercase" style={impact}>TeensRave POS</p>
        {config && <p className="text-xs text-neutral-400">{config.deviceLabel}</p>}
      </header>
      {config === null && <Prepare onReady={(ready) => { setConfig(ready); setUnlocked(true); }} />}
      {config && !unlocked && <Unlock config={config} onUnlock={() => setUnlocked(true)} />}
      {config && unlocked && <Till config={config} setConfig={setConfig} onLock={() => setUnlocked(false)} onReset={() => { setConfig(null); setUnlocked(false); }} />}
    </div>
  );
}
