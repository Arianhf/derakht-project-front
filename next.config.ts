/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['derakht-storage.darkube.app', 'darakht.darkube.app', 'picsum.photos'],
  },
  output: 'standalone',
};

module.exports = nextConfig;