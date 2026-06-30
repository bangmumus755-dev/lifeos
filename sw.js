const CACHE_NAME = "lifeos-v1";
const FILES = [
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES))
      .catch(() => {}) // don't fail install if a file is missing
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // Never cache API calls — always go to network
  if (event.request.url.includes("api.anthropic.com")) return;

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
