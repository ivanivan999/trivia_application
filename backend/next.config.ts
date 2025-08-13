// backend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
      // Serve all other frontend assets
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'accept',
            value: '(.*text/html.*)',
          },
        ],
        destination: '/index.html',
      },
    ];
  },
};

export default nextConfig;