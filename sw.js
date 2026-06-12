const CACHE_NAME = 'sos-master-v44';
const ASSETS_TO_CACHE = [
    'sos_radar.html',
    'sos_radar.css',
    'sos_radar.js',
    'calling.html',
    'videos/space.mp4',
    'img/tower_bg.png',
    'audio/sos/ring.mpeg',
    'audio/sos/answering.mpeg',
    'audio/sos/reply.mpeg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Master Caching: SOS Suite v44.0 (Robust Strategy)');
            return cache.addAll(ASSETS_TO_CACHE).catch(err => {
                console.warn("Satellite assets failed to cache, proceeding anyway.");
            });
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
    const url = new URL(event.request.url);

    // Skip server-check pings
    if (url.pathname.includes('check_server.php')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({ status: 'offline' }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // ROBUST CACHE MATCH (Ignore query strings)
    // This solves the 'style missing' issue by matching 'css?v=XX' to 'css'
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            
            return fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('sos_radar.html');
                }
            });
        })
    );
});
