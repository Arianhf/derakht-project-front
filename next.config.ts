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
  output: 'standalone',
  // Enable React Compiler for automatic memoization and performance optimization
  reactCompiler: true,
};

module.exports = nextConfig;