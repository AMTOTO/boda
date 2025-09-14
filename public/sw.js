// Service Worker for ParaBoda Health Ecosystem
const CACHE_NAME = 'paraboda-cache-v1';
const OFFLINE_URL = '/offline.html';
const OFFLINE_IMG = '/offline-image.jpg';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  OFFLINE_URL,
  OFFLINE_IMG,
  '/Rider mother and child.jpg',
  '/src/index.css',
  '/src/main.tsx'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests differently - network first, then fallback
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If it's an API request and we can't get from network or cache,
              // return a JSON error response
              return new Response(
                JSON.stringify({ 
                  error: 'Network error', 
                  message: 'You are currently offline' 
                }),
                { 
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // For page navigations - try network first, fall back to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then((cachedResponse) => {
              // If we have a cached version, return it
              if (cachedResponse) {
                return cachedResponse;
              }
              // Otherwise return the offline page
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For images - try cache first, fall back to network, then offline image
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          return cachedResponse || fetch(event.request)
            .then((networkResponse) => {
              // Cache the fetched response
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            })
            .catch(() => {
              // If both cache and network fail, return offline image
              return caches.match(OFFLINE_IMG);
            });
        })
    );
    return;
  }

  // For other assets - stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response immediately
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Update the cache with the new response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            return networkResponse;
          });
        return cachedResponse || fetchPromise;
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/Rider mother and child.jpg',
    badge: '/Rider mother and child.jpg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then((clientList) => {
        // If a window client is already open, focus it
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});

// Helper function to sync forms
async function syncForms() {
  try {
    // Get all stored form submissions
    const formData = await getStoredFormData();
    
    // Send each form submission
    const promises = formData.map(async (data) => {
      try {
        const response = await fetch(data.url, {
          method: data.method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data.body)
        });
        
        if (response.ok) {
          // If successful, remove from storage
          await removeStoredFormData(data.id);
        }
      } catch (error) {
        console.error('Sync failed for form:', data.id, error);
      }
    });
    
    await Promise.all(promises);
  } catch (error) {
    console.error('Form sync error:', error);
  }
}

// Mock functions for form data storage
// In a real app, you would use IndexedDB
async function getStoredFormData() {
  return [];
}

async function removeStoredFormData(id) {
  // Implementation would use IndexedDB
}