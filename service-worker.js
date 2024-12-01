const CACHE_NAME = 'my-app-cache-v1.20'; // Update version when there are changes
const ASSETS_TO_CACHE = [
    '/',
    '/index.html'
];

const cacheFiles = [
    '.css',
    'IDB.js',
    'API.js',
    'client',
    'TokenLibrary.tsx',
    'default.tsx',
    'images.js'
];

self.addEventListener('install', event => {// Cache on install
    console.log("install")
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[Service Worker] Caching static assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting(); // Force the waiting service worker to activate
});

self.addEventListener('fetch', event => {
    const ReqUrl = event.request.url
    const shouldCache = cacheFiles.some(extension => ReqUrl.endsWith(extension)) 
    || ReqUrl.includes('vite')
    // || ReqUrl.includes('images.js');
    if (!shouldCache) {
        //console.log("Not cached", event.request.url);
        return
    }
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        // First, try to get the cached response
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          // console.log("cached - Response", cachedResponse)
          // If the file is in the cache, return it
          return cachedResponse;
        }

        // Otherwise, fetch the file from the network
        const networkResponse = await fetch(event.request);
        console.log("network - Response", networkResponse)
        // Cache the network response for future use
        cache.put(event.request, networkResponse.clone());
        
        // Return the network response
        return networkResponse;
      })
    );
});

self.addEventListener('activate', event => {// Handle version updates by deleting old caches
    console.log('activate')
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', key);
                        return caches.delete(key);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('message', event => {// Reload app on version change
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});