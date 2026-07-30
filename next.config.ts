import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Enable high-compression next-gen image formats
    formats: ['image/avif', 'image/webp'],

    // Set image cache duration to 7 days for fast repeated page loads
    minimumCacheTTL: 60 * 60 * 24 * 7,

    // Allow Next.js Image Optimization for external asset hosts
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Wildcard match for all Supabase Storage project domains
      },
    ],
  },
};

export default nextConfig;