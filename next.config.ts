import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 🚀 Allows dev mode Hot Module Replacement (HMR) over Ngrok tunnels
  allowedDevOrigins: ['*.ngrok-free.dev', 'localhost:3000', '127.0.0.1:3000'],

  // Empty turbopack config prevents Next.js 16 build conflict errors
  turbopack: {},

  // Allow Server Actions and cross-origin requests from Ngrok tunnels
  experimental: {
    serverActions: {
      allowedOrigins: ['*.ngrok-free.dev', 'localhost:3000', '127.0.0.1:3000'],
    },
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;