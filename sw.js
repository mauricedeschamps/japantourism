const CACHE_NAME = 'japan-travel-v1';
const urlsToCache = [
  
  'index.html',
  'manifest.json',
  'sw.js',
'icons/icon-192.jpg',
'icons/icon-512.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        // オフライン時に何か表示したい場合はここで fallback ページを返せる
        return new Response('Offline - ネットワークに接続してください', { status: 503 });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});