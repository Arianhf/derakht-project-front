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
};

module.exports = nextConfig;