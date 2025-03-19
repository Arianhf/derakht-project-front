/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['derakht-storage.darkube.app', 'darakht.darkube.app'],
  },
  output: 'standalone',
};

module.exports = nextConfig;