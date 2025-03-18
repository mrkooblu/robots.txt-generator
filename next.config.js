/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Disable cache in development to prevent caching errors
      config.cache = false;
    }
    return config;
  },
}

module.exports = nextConfig 