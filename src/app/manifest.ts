import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Casas Gaby - Gestión & Reservas',
    short_name: 'Casas Gaby',
    description: 'Sistema de reservas, CRM y administración de alojamientos Casas Gaby',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0d9488', // teal-600 para coincidir con el layout viewport
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  }
}
