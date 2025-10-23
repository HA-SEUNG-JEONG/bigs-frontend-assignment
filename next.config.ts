import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://front-mission.bigs.or.kr/:path*"
      }
    ];
  }
};

export default nextConfig;
