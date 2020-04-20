const CACHE_NAME = 1;
const assets = ["/", "/main.js", "/english.js", "/swedish.js", "/index.html"];

const getCatchOrFetch = async (event) => {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(event.request);
  if (response) {
    return response;
  }
  const networkResponse = await fetch(event.request);
  cache.put(event.request, networkResponse.clone());
  return networkResponse;
};

self.addEventListener("activate", function (event) {
  event.waitUntil(async () => {
    const cacheNames = await caches.keys();
    return Promise.all(
      cacheNames.map((cacheName) => {
        if (CACHE_NAME !== cacheName) {
          return caches.delete(cacheName);
        }
      })
    );
  });
});

self.addEventListener("fetch", (event) => {
  event.respondWith(getCatchOrFetch(event));
});
