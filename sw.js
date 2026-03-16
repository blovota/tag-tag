var CACHE = 'tagtag-v2';
var ASSETS = ['/'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(k) { return k !== CACHE; })
          .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;

  // Never cache Supabase calls — always fetch live data
  if (e.request.url.includes('supabase.co')) return;

  e.respondWith(
    fetch(e.request)
      .then(function(r) {
        var copy = r.clone();
        caches.open(CACHE).then(function(cache) {
          cache.put(e.request, copy);
        });
        return r;
      })
      .catch(function() {
        return caches.match(e.request).then(function(r) {
          return r || caches.match('/');
        });
      })
  );
});
