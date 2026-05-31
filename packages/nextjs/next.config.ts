import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // MetaMask SDK requires this React Native package as a peer dep in browser builds.
    // Stub it out rather than installing an irrelevant native package.
    if (!isServer) {
      config.resolve.alias["@react-native-async-storage/async-storage"] = false;
    }

    // Suppress "Critical dependency: the request of a dependency is an expression"
    // warnings from @reown/appkit and @coinbase/cdp-sdk (harmless dynamic requires).
    config.ignoreWarnings = [{ message: /Critical dependency/ }];

    return config;
  },
};

module.exports = nextConfig;
