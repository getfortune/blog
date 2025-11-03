/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 仅在生产环境中使用 basePath
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/blog',
    assetPrefix: '/blog/',
  }),
}

module.exports = nextConfig