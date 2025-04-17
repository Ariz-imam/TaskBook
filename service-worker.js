self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("taskbook-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/script.js",
        "/style.css",
        "/manifest.json",
        "/icons/icon-192.png",
        "/icons/icon-512.png"
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
