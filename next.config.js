const path = require('path')
const nextConfig = {
  basePath: '',
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ['antd-mobile'],
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // experimental: { optimizeCss: true },
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
      {
        protocol: 'https',
        hostname: 'drive.google.com',
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
  webpack(config, context) {
    const { isServer, dev } = context
    if (!isServer && !dev) {
      config.optimization.splitChunks.cacheGroups.asyncChunks = {
        enforce: true,
        type: 'css/mini-extract',
        chunks: 'async',
      }
    }
    return config
  },
}

module.exports = nextConfig
