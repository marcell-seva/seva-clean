/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.sslpots.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.seva.id',
      },
      {
        protocol: 'https',
        hostname: 'images.prod.seva.id',
      },
      {
        protocol: 'https',
        hostname: 'cdn.seva.id',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.prod.torq.id',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|otf|woff2)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=30000, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
