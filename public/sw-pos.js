// Keeps the POS working with no network. Scoped to /pos only.
// Under jamming requests hang rather than fail, so the POS is always served from the
// cache and never waits on the network. The cache is only refreshed by "Prepare" on the page.
const CACHE = 'tr-pos-v1';
const empty = (type) => new Response('', { status: 200, headers: { 'content-type': type } });

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

async function fromCache(request, url) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request, { ignoreSearch: true, ignoreVary: true });
  if (hit) return hit;
  if (request.mode === 'navigate') {
    const shell = await cache.match('/pos', { ignoreSearch: true, ignoreVary: true });
    if (shell) return shell;
  }
  const response = await fetch(request);
  if (response.ok && !response.redirected && url.pathname.startsWith('/_next/static/')) await cache.put(request, response.clone());
  return response;
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

  event.respondWith(fromCache(request, url));
});
