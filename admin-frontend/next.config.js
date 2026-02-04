/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // 이미지 도메인 설정 (외부 이미지 허용)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
