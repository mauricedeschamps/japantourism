const CACHE_NAME = 'japan-travel-picks-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.jpg',
  './icon-512.jpg'
];

// インストール時：キャッシュ追加
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// フェッチ時：キャッシュファースト、フォールバック
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        // オフライン時に index.html を返す (ナビゲーション要求の場合)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('Offline content not available', { status: 404 });
      })
  );
});

// アクティベート：古いキャッシュ削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});