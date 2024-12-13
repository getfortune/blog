/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 如果是本地开发，可以先注释掉这两行
  // basePath: '/my-blog',
  // assetPrefix: '/my-blog/',
}

module.exports = nextConfig 