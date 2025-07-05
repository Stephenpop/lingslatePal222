const CACHE_NAME = 'polyglot-pal-v2'; // Updated version to invalidate old cache

const urlsToCache = [
  '/',
  '/translate',
  '/offline',
  '/manifest.json',
  // Add other static assets as needed, e.g., '/globals.css', '/icon-192x192.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  // Force immediate activation of the new service worker
  self.skipWaiting();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response or fetch from network
      return response || fetch(event.request).catch(() => {
        // Fallback to offline page for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/offline');
        }
      });
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    }).then(() => {
      // Force clients to use the new service worker immediately
      return self.clients.claim();
    })
  );
});
