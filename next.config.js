/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'charming-hoover.65-254-80-213.plesk.page', // Production domain
    ],
    remotePatterns: [
      // Local development pattern
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/account/photos/**',
      },
      // Production pattern
      {
        protocol: 'https',
        hostname: 'charming-hoover.65-254-80-213.plesk.page',
        pathname: '/api/account/photos/**',
      },
    ],
    // Optimized settings for better quality
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'], // Only supported formats
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;