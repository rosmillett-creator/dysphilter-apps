const CACHE_NAME = 'hoawairua-v2';
const ASSETS = [
  '/hoa-wairua.html',
  '/icons/hoa-192.png',
  '/icons/hoa-512.png',
  '/hoa-manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS).catch(function() {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.map(function(name) {
        if (name !== CACHE_NAME) return caches.delete(name);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request).then(function(resp) {
        if (resp.status === 200 && e.request.method === 'GET') {
          var respClone = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, respClone).catch(function() {});
          });
        }
        return resp;
      }).catch(function() {
        return caches.match('/hoa-wairua.html');
      });
    })
  );
});
