/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['localhost', 'rewealed.com'],
    },
    async headers() {
      return [
        {
          source: '/uploads/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
          ],
        },
      ]
    },
  }
  
  module.exports = nextConfig
  
  