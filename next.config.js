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
        sizeLimit: '10mb' // Set the maximum allowed payload size to 10MB
      }
    }
  }
  
  module.exports = nextConfig
  
  