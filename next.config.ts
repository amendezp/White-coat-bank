import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/White-coat-bank",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
