/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['rewealed.com'],
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          crypto: false,
        }
      }
      config.externals = [...(config.externals || []), 'formidable'];
      return config
    },
    api: {
      bodyParser: {
        sizeLimit: '50mb' // Increase from 10mb to 50mb
      }
    }
  }
  
  module.exports = nextConfig
  
  