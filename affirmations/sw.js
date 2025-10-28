const AFFAPP_CACHE = 'affapp-shell-v1';
const AFFAPP_SCOPE = self.registration.scope;
const AFFAPP_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './manifest.webmanifest',
  './assets/favicon.svg',
  './assets/icon-192.svg',
  './assets/icon-512.svg',
  './js/app.js',
  './js/ui.js',
  './js/db.js',
  './js/storage.js',
  './js/templates.js',
  './js/pwa.js',
  './js/supabase-client.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(AFFAPP_CACHE).then((cache) => cache.addAll(AFFAPP_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== AFFAPP_CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (!url.pathname.startsWith(new URL(AFFAPP_SCOPE).pathname)) {
    return;
  }
  if (url.origin === self.location.origin && request.method === 'GET') {
    if (url.pathname.includes('/supabase.co')) {
      return;
    }
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(AFFAPP_CACHE).then((cache) => cache.put(request, clone));
          return response;
        }).catch(() => caches.match('./index.html'));
      })
    );
  }
});
