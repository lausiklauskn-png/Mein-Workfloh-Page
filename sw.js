/* Muster Werbetechnik — Service Worker (Offline + Installierbarkeit)
   Cache-Name als Versionsstempel: bei jeder Auslieferung +1.
   HTML = Network-First (frische Seite, sonst Cache), Assets = Cache-First. */
/* 2026-08-15, drei Erhöhungen an einem Tag:
     v3  Kontrast-Farben, Logo-Maße, Hintergrund nach dem Laden
     v4  mycel-bg.js hat den Grafikchip-Wächter + die Selbst-Bremse bekommen
     v5  Fußzeilen-Wort auf eine kontraststarke Marken-Abstufung
   Ohne die Erhöhung liefert der Vorrat jedem Wiederbesucher weiter die alte
   Fassung — und eine neue Messung sähe unverändert aus. */
const CACHE = 'werbetechnik-page-v5';
/* three.module.min.js steht mit Absicht NICHT mehr hier (2026-08-15, dieselbe
   Entscheidung wie in family-project/sw.js).
   Seit der Hintergrund den Grafikchip prüft, wird die Bibliothek auf jedem
   Gerät ohne Grafikbeschleunigung GAR NICHT geholt — sie vorsorglich in den
   Vorrat zu legen hieße, jedem Erstbesucher 165 KiB für etwas aufzuladen, das
   er womöglich nie benutzt. Wird sie doch angefordert, legt der fetch-Handler
   weiter unten sie ganz normal ab.
   Ehrlich dazu: das verbessert den Lighthouse-Wert nicht. Lighthouse misst den
   ersten Aufbau, der Service Worker legt erst danach los. Es spart echten
   Besuchern Datenvolumen — mehr nicht, aber auch nicht weniger. */
const ASSETS = [
  './', 'index.html', 'effects.js', 'manifest.webmanifest',
  'assets/mycel-bg.js',
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
