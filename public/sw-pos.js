// Keeps the POS working with no network. Scoped to /pos only.
// Under jamming requests hang rather than fail, so a prepared device always serves the POS
// from the cache and never waits on the network. Nothing is stored here: only "Prepare"
// and "Update" on the page write to the cache, so an unprepared device always runs current code.
const CACHE = 'tr-pos-v2';
const MATCH = { ignoreSearch: true, ignoreVary: true };
const empty = (type) => new Response('', { status: 200, headers: { 'content-type': type } });

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const outdated = (await caches.keys()).filter((name) => name.startsWith('tr-pos-') && name !== CACHE);
      await Promise.all(outdated.map((name) => caches.delete(name)));
      await self.clients.claim();
      // Open pages may be running code from a deleted cache, so bring them up to date.
      if (outdated.length > 0) {
        const pages = await self.clients.matchAll({ type: 'window' });
        await Promise.all(pages.map((page) => page.navigate(page.url).catch(() => undefined)));
      }
    })()
  );
});

async function respond(request) {
  const cache = await caches.open(CACHE);
  const shell = await cache.match('/pos', MATCH);
  if (!shell) return fetch(request);
  if (request.mode === 'navigate') return shell;
  return (await cache.match(request, MATCH)) ?? fetch(request);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Fonts and analytics from other sites would otherwise block the page while the network hangs.
  if (url.origin !== self.location.origin) {
    event.respondWith(empty(request.destination === 'style' ? 'text/css' : 'text/plain'));
    return;
  }
  if (url.pathname.startsWith('/_vercel/')) {
    event.respondWith(empty('text/javascript'));
    return;
  }
  if (url.pathname.startsWith('/api/') || url.searchParams.has('fresh')) return;

  event.respondWith(respond(request));
});
