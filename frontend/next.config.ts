import type { NextConfig } from "next";

// The browser only ever talks to this Next.js app's own origin. Requests to
// /api/* are proxied server-side to the Spring Boot backend, so cookie-based
// auth works same-origin and the backend never needs CORS configured.
//
// BACKEND_ORIGIN points at localhost:8080 for local dev against the existing
// docker-compose backend. Once the frontend itself joins docker-compose,
// this becomes the compose service name, e.g. http://backend:8080.
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN ?? "http://localhost:8080";

const nextConfig: NextConfig = {
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
