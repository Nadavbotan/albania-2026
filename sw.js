const CACHE_NAME = "albania-trip-v3";

const PRECACHE_URLS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/style.css",
  "js/data.js",
  "js/weather.js",
  "js/maps.js",
  "js/app.js",
  "icons/icon-192.png",
  "icons/icon-512.png",
  ...Array.from({ length: 15 }, (_, i) => `day.html?d=${i + 1}`)
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache the weather API — always go to network, fall back to nothing (app handles offline via localStorage).
  if (url.hostname.includes("open-meteo.com")) {
    event.respondWith(fetch(event.request).catch(() => new Response("{}", { status: 200 })));
    return;
  }

  if (event.request.method !== "GET" || url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: false }).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
