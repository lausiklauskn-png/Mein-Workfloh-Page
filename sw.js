/* Muster Werbetechnik — Service Worker (Offline + Installierbarkeit)
   Cache-Name als Versionsstempel: bei jeder Auslieferung +1.
   HTML = Network-First (frische Seite, sonst Cache), Assets = Cache-First. */
/* v3 (2026-08-15): index.html und assets/mycel-bg.js haben sich geändert
   (Hintergrund wird erst nach dem Laden geholt, Kontrast-Farben, Logo-Maße).
   Ohne diese Erhöhung liefert der Vorrat bei jedem Wiederbesucher weiter die
   alte Fassung — und die Messung sähe unverändert aus. */
const CACHE = 'werbetechnik-page-v3';
const ASSETS = [
  './', 'index.html', 'effects.js', 'manifest.webmanifest',
  'assets/mycel-bg.js', 'vendor/three.module.min.js',
  'icon-192.png', 'icon-512.png', 'icon-512-maskable.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(ASSETS.map(a => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isNavigation(req) {
  return req.mode === 'navigate' ||
    (req.method === 'GET' && (req.headers.get('accept') || '').includes('text/html'));
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  if (isNavigation(e.request)) {
    e.respondWith(
      fetch(e.request).then(resp => {
        try { const copy = resp.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); } catch (_) {}
        return resp;
      }).catch(() => caches.match(e.request).then(c => c || caches.match('index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      try { const copy = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } catch (_) {}
      return resp;
    }).catch(() => caches.match('index.html')))
  );
});
