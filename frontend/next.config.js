/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurazione per risolvere il warning cross-origin
  allowedDevOrigins: [
    '10.10.10.15',
    'localhost',
    '127.0.0.1',
    '10.10.10.0/24', // Tutta la rete 10.10.10.x
  ],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://10.10.10.15:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
