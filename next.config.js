/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "matrimonyservicesapi-tdcu.onrender.com",
      "charming-hoover.65-254-80-213.plesk.page", // Production domain
      "images.pexels.com",
      "drive.google.com",
    ],
    remotePatterns: [
      // Local development pattern
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      // Production pattern
      {
        protocol: "https",
        hostname: "matrimonyservicesapi-tdcu.onrender.com",
        pathname: "/uploads/**",
      },
    ],
    // Optimized settings for better quality
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp", "image/avif"], // Only supported formats
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
