// sw.js — MSH Laws & Regulations PWA
// Strategy: cache-first (instant offline load) + background network fetch.
// When a newer version is found, the page is notified and prompts the user to reload.

const CACHE_NAME = 'msh-regs-v1';

const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ── Install: pre-cache all assets ──────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // Activate immediately — don't wait for old SW to finish
  self.skipWaiting();
});

// ── Activate: delete old caches ────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: cache-first, then background update ─────────────────────
self.addEventListener('fetch', event => {
  // Only handle same-origin GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(event.request);

      // Background revalidation
      const networkFetch = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
          // Check if the response has changed vs what we cached
          const cloned = networkResponse.clone();
          cache.put(event.request, cloned);

          // If this was index.html and we already had a cached copy,
          // tell all clients there may be an update available
          if (cached && event.request.url.endsWith('index.html')) {
            networkResponse.clone().text().then(newText => {
              cached.text().then(oldText => {
                if (newText !== oldText) {
                  self.clients.matchAll().then(clients => {
                    clients.forEach(client =>
                      client.postMessage({ type: 'UPDATE_AVAILABLE' })
                    );
                  });
                }
              });
            });
          }
        }
        return networkResponse;
      }).catch(() => null); // Network unavailable — silently ignore

      // Return cached immediately if available, otherwise wait for network
      return cached || networkFetch;
    })
  );
});
