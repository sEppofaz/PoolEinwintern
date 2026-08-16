const CACHE = 'pool-einwintern-v1'; // bei Breaking Changes hochzählen

const SHELL = ['/PoolEinwintern/', '/PoolEinwintern/manifest.json', '/PoolEinwintern/icon-192.png',
               '/PoolEinwintern/icon-512.png', '/PoolEinwintern/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.destination === 'document') {            // HTML: network-first
    e.respondWith(fetch(e.request).catch(() => caches.match('/PoolEinwintern/')));
    return;
  }
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});
