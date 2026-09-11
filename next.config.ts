/*
================================================================================
CÓDIGO ORIGINAL (DESACTIVADO / DEPRECADOS)
================================================================================
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
================================================================================
*/

// ================================================================================
// CÓDIGO NUEVO (ACTIVO - Con soporte para acceso local desde celular / allowedDevOrigins)
// ================================================================================
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.174', '192.168.0.174:3000'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;