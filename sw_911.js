const CACHE_NAME = 'sos-911-offline-v1';
const ASSETS_TO_CACHE = [
    'sos_911.html',
    'sos_911.css?v=2.0',
    'sos_911.js?v=2.0',
    'videos/space.mp4',
    'img/tower_bg.png',
    'https://code.jquery.com/jquery-3.6.0.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching SOS assets for offline use...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Strategy: Cache First, then Network
    // This allows the page to load even if the server is down
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request);
        })
    );
});
