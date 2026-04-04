import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/wp-json/wp/v2/:path*',
        destination: '/api/v1/:path*',
      },
      {
        source: '/wp-json',
        destination: '/api/v1',
      },
    ];
  },
};

export default nextConfig;
