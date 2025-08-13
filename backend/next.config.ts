import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
//   experimental: {
//     outputFileTracingRoot: process.cwd(),
//   },
};

export default nextConfig;