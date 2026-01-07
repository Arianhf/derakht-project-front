/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'derakht-storage.darkube.app',
      },
      {
        protocol: 'https',
        hostname: 'darakht.darkube.app',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // Temporarily disabled due to Next.js 16.1.0 issue with middleware + standalone
  // See: https://github.com/vercel/next.js/issues/...
  output: 'standalone',
  // Enable React Compiler for automatic memoization and performance optimization
  reactCompiler: true,
};

module.exports = nextConfig;