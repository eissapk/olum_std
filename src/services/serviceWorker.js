//! Cache the assets
const staticMyNote = "mynote-v2.0.0";
const assets = [
    "index.html"
];

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticMyNote).then(cache => {
            cache.addAll(assets);
        })
    );
});

//* Fetch the assets
self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request);
        })
    );
});