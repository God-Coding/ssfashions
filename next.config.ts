import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['ssfashions.vercel.app', 'secure.payu.in'],
    },
  },
};

export default nextConfig;
