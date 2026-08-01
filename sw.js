const CACHE = 'face-a-la-mer-v1';
const SHELL = [
  './',
  'index.html',
  'menu.html',
  'avis.html',
  'galerie.html',
  'contact.html',
  'reservation.html',
  'css/style.css',
  'js/i18n.js',
  'js/data.js',
  'js/main.js',
  'js/reservation.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'data/menu.json',
  'data/reviews.json',
  'data/gallery.json',
  'data/settings.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
