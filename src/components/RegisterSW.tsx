'use client';
import { useEffect } from 'react';

export function RegisterSW() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Registrar el Service Worker
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Hay un nuevo SW disponible y listo para tomar el control.
                // Como configuramos skipWaiting en el sw.js, este nuevo worker
                // forzará el cambio de controlador.
              }
            });
          }
        });
      }).catch((err) => {
        console.error('SW registration failed: ', err);
      });

      let refreshing = false;
      // Escuchar el momento exacto en que el nuevo worker toma el control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  return null;
}
