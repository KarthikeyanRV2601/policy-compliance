import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["tsx", "ts", "jsx", "js"], // Ensure Next.js looks for these file extensions
};

export default nextConfig;
