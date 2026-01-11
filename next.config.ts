import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Disable React compiler to reduce memory usage during build
    reactCompiler: false,
    // Reduce memory during build
    experimental: {
        // Reduce memory usage for large projects
        webpackMemoryOptimizations: true,
    },
    // Webpack optimization to reduce memory
    webpack: (config, { isServer }) => {
        // Reduce memory usage during build
        config.optimization = {
            ...config.optimization,
            moduleIds: 'deterministic',
            splitChunks: isServer ? false : config.optimization?.splitChunks,
        };
        return config;
    },
};

export default nextConfig;
