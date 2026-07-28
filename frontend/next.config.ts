import type { NextConfig } from "next";

// The browser only ever talks to this Next.js app's own origin. Requests to
// /api/* are proxied server-side to the Spring Boot backend, so cookie-based
// auth works same-origin and the backend never needs CORS configured.
//
// BACKEND_ORIGIN defaults to localhost:8080 for running `pnpm dev` outside
// Docker. Inside docker-compose it's set to the backend service name
// (http://backend:8080), the same override-via-env-var pattern application.yaml
// uses for POSTGRES_HOST/REDIS_HOST.
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  // Docker Desktop's bind mount on Windows doesn't forward native file-change
  // events into the container, so the dev server never notices edits without
  // this. Polling works the same outside Docker too, so it's left unconditional.
  watchOptions: {
    pollIntervalMs: 500,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
