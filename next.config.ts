import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/onboarding/start',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
