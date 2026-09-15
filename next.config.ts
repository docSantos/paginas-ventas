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
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.174', '192.168.0.174:3000', '*.loca.lt', '*.ngrok-free.dev'],
  crossOrigin: 'anonymous',
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

export default withPWA(nextConfig);