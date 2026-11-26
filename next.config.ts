import type { NextConfig } from "next";

// BUILD_TARGET=cpanel produces a self-contained server (output: "standalone") for
// cPanel's Node.js app manager, with image optimisation off so no native sharp
// binary is needed on the shared host.
const isCpanel = process.env.BUILD_TARGET === "cpanel";

const nextConfig: NextConfig = {
  // Trace from this folder so server.js lands at the root of .next/standalone.
  ...(isCpanel ? { output: "standalone" as const, outputFileTracingRoot: process.cwd() } : {}),
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    unoptimized: isCpanel,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
