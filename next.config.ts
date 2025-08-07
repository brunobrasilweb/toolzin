import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'toolzin.site',
          },
        ],
        destination: 'https://toolizio.com/:path*',
        permanent: true, // 301 redirect
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.toolzin.site',
          },
        ],
        destination: 'https://toolizio.com/:path*',
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
