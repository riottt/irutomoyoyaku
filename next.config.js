const withNextIntl = require('next-intl/plugin')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['tgcpbvxqnyjnfxjcpbki.supabase.co', 'images.unsplash.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = withNextIntl(nextConfig)
