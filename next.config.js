/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/type-soul-code',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
