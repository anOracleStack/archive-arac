import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
