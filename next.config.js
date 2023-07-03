const path = require('path')

const nextConfig = {
  basePath: '/v3',
  poweredByHeader: false,
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  compiler: {
    styledComponents: true,
  },
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
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com/www.images.dev.torqio.com',
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

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA(nextConfig)
