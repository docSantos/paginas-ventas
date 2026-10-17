const CACHE_NAME = 'casasgaby-v3';

self.addEventListener('install', (event) => {
  // Fuerza a que este Service Worker reemplace al viejo de inmediato
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Purga TODAS las cachés anteriores (incluso las auto-generadas por next-pwa antes)
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma control de los clientes abiertos sin requerir recargar la página
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptar GET
  if (request.method !== 'GET') {
    return;
  }

  // Rutas que JAMÁS deben almacenarse en caché (Network Only)
  if (
    url.pathname.startsWith('/rest/v1/') || 
    url.pathname.startsWith('/api/') || 
    url.pathname.startsWith('/casasgaby/admin/') || 
    url.pathname.startsWith('/auth/') || 
    url.searchParams.has('v') // Prevent caching dynamic queries
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // Assets estáticos de Next.js u otras imágenes (Stale While Revalidate)
  if (url.pathname.startsWith('/_next/static/') || url.pathname.match(/\.(png|jpg|jpeg|svg|ico|woff|woff2)$/)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Network-First para páginas web públicas dinámicas
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Guarda copia en caché
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, resClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback a caché si no hay red
        return caches.match(request);
      })
  );
});
