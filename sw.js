let cacheName = 'Component',
    filesToCache = [
  'index.html'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName)
    .then(cache => {
      filesToCache.map(offlineCache => {
        cache.add(offlineCache);
      })
    })
  )
})

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request)
    .then(request => {
      return request || fetchAndCache(evt.request);
    })
  );
});

const fetchAndCache = url => {
  return fetch(url)
  .then(response => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return caches.open(cacheName)
    .then(cache => {
      cache.put(url, response.clone());
      return response;
    });
  })
  .catch(err => {
    console.error('Request failed:', err);
  });
}

self.addEventListener('activate', evt => {
  const cacheWhitelist = [cacheName];

  evt.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});