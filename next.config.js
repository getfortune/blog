/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 只在生产环境使用 basePath 和 assetPrefix
  ...(process.env.NODE_ENV === 'production' ? {
    basePath: '/blog',
    assetPrefix: '/blog/',
  } : {})
}

module.exports = nextConfig 