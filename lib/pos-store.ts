// On-device storage for the POS. IndexedDB survives reloads, closed tabs and restarts.

export type PosTicket = { id: number; name: string; admits: string | null; admitsCount: number; tier: string; price: string; remaining: number | null };

/** null means no limit (admins). */
export type PosAllocation = { tickets: number | null; admits: number | null; usedElsewhereTickets: number; usedElsewhereAdmits: number };

export type PosSale = {
  clientRef: string;
  receiptCode: string;
  ticketTypeId: number;
  ticketLabel: string;
  quantity: number;
  /** People let in per ticket at the time of sale. */
  admits: number;
  amount: string;
  buyerName: string;
  soldAt: string;
  voided: boolean;
  synced: boolean;
};

export type PosConfig = {
  deviceLabel: string;
  deviceCode: string;
  pinHash: string;
  pinSalt: string;
  staff: string;
  eventName: string;
  tickets: PosTicket[];
  allocation: PosAllocation;
  preparedAt: string;
};

const DB_NAME = 'tr-pos';
const META = 'meta';
const SALES = 'sales';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(META);
      request.result.createObjectStore(SALES, { keyPath: 'clientRef' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<T>(stores: string[], mode: IDBTransactionMode, work: (tx: IDBTransaction) => IDBRequest<T> | void): Promise<T | undefined> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(stores, mode);
    const request = work(tx);
    tx.oncomplete = () => {
      db.close();
      resolve(request ? request.result : undefined);
    };
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export const getConfig = () => run<PosConfig>([META], 'readonly', (tx) => tx.objectStore(META).get('config'));
export const saveConfig = (config: PosConfig) => run([META], 'readwrite', (tx) => void tx.objectStore(META).put(config, 'config'));
export const allSales = async () => ((await run<PosSale[]>([SALES], 'readonly', (tx) => tx.objectStore(SALES).getAll())) ?? []).sort((a, b) => b.soldAt.localeCompare(a.soldAt));

export async function recordSale(deviceCode: string, sale: Omit<PosSale, 'clientRef' | 'receiptCode' | 'soldAt' | 'voided' | 'synced'>): Promise<PosSale> {
  const db = await open();
  return new Promise((resolve, reject) => {
    // The counter and the sale commit together, so a receipt number can never be reused.
    const tx = db.transaction([META, SALES], 'readwrite');
    let saved: PosSale;
    const counter = tx.objectStore(META).get('counter');
    counter.onsuccess = () => {
      const next = (counter.result ?? 0) + 1;
      tx.objectStore(META).put(next, 'counter');
      saved = { ...sale, clientRef: crypto.randomUUID(), receiptCode: `${deviceCode}-${String(next).padStart(4, '0')}`, soldAt: new Date().toISOString(), voided: false, synced: false };
      tx.objectStore(SALES).add(saved);
    };
    tx.oncomplete = () => {
      db.close();
      resolve(saved);
    };
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function voidSale(clientRef: string) {
  const sale = (await allSales()).find((s) => s.clientRef === clientRef);
  if (sale) await run([SALES], 'readwrite', (tx) => void tx.objectStore(SALES).put({ ...sale, voided: true, synced: false }));
}

/** Marks sales uploaded, unless one was voided while the upload was running. */
export async function markSynced(sent: PosSale[]) {
  const current = new Map((await allSales()).map((sale) => [sale.clientRef, sale]));
  await run([SALES], 'readwrite', (tx) => {
    for (const sale of sent) {
      const latest = current.get(sale.clientRef);
      if (latest && latest.voided === sale.voided) tx.objectStore(SALES).put({ ...latest, synced: true });
    }
  });
}

export const clearDevice = () => run([META, SALES], 'readwrite', (tx) => {
  tx.objectStore(META).clear();
  tx.objectStore(SALES).clear();
});

async function deriveHash(pin: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 150000 }, key, 256);
  return Array.from(new Uint8Array(bits), (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPin(pin: string) {
  const salt = crypto.randomUUID();
  return { pinSalt: salt, pinHash: await deriveHash(pin, salt) };
}

export const checkPin = async (pin: string, config: PosConfig) => (await deriveHash(pin, config.pinSalt)) === config.pinHash;

/** Stores the POS so it opens with no network. Must finish completely before a device counts as ready. */
export async function cachePos() {
  const cache = await caches.open('tr-pos-v1');
  const page = await fetch('/pos?fresh=1', { cache: 'no-store' });
  if (!page.ok || page.redirected) throw new Error('Could not download the POS.');
  const html = await page.clone().text();

  const fromHtml = html.match(/\/_next\/static\/[^"'\\\s)<>]+/g) ?? [];
  const loaded = performance.getEntriesByType('resource').map((entry) => new URL(entry.name)).filter((url) => url.origin === location.origin && url.pathname.startsWith('/_next/static/')).map((url) => url.pathname);
  const assets = Array.from(new Set([...fromHtml, ...loaded, '/icon.png']));

  await Promise.all(
    assets.map(async (asset) => {
      const response = await fetch(`${asset}${asset.includes('?') ? '&' : '?'}fresh=1`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not download part of the POS.');
      await cache.put(asset, response);
    })
  );
  await cache.put('/pos', page);
}
