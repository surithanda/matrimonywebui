/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      "localhost",
      "matrimonyservicesapi-tdcu.onrender.com",
      "charming-hoover.65-254-80-213.plesk.page", // Production domain
      "images.pexels.com",
      "drive.google.com",
      "lh3.googleusercontent.com", // Google Drive CDN
      "lh4.googleusercontent.com", // Google Drive CDN
      "lh5.googleusercontent.com", // Google Drive CDN
      "lh6.googleusercontent.com", // Google Drive CDN
      "docs.google.com", // Google Docs/Drive
    ],
    remotePatterns: [
      // Local development patterns
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**", // Legacy path
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/photos/**", // New Render persistent storage path
      },
      // Production patterns
      {
        protocol: "https",
        hostname: "matrimonyservicesapi-tdcu.onrender.com",
        pathname: "/uploads/**", // Legacy path
      },
      {
        protocol: "https",
        hostname: "matrimonyservicesapi-tdcu.onrender.com",
        pathname: "/photos/**", // New Render persistent storage path
      },
      // Google Drive patterns
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/file/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "docs.google.com",
        pathname: "/**",
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
  // Add headers for better cross-origin handling
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "img-src 'self' data: https: http: blob:; object-src 'none';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
