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
  },
};

module.exports = nextConfig;