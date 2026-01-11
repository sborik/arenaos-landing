import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Disable React compiler to reduce memory usage during build
    reactCompiler: false,
    // Add empty turbopack config to silence warning about webpack config
    turbopack: {},
};

export default nextConfig;
