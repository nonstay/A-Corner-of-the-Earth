const V = 'hmt-v2';
const CORE = ['/', '/index.html', '/manifest.webmanifest', '/img/symbol.png', '/img/logo.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin) return;
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(res => { caches.open(V).then(c => c.put('/index.html', res.clone())); return res; }).catch(() => caches.match('/index.html'))); return; }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) caches.open(V).then(c => c.put(r, res.clone())); return res; })));
});
