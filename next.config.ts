import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.optimization.moduleIds = "named";
    return config;
  },
};

export default nextConfig;
