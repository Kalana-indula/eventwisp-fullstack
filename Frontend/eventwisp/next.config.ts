import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "example.com",
            },
            {
                protocol: "https",
                hostname: "xrknenyvgilkrnglxdqo.supabase.co",
            },
        ],
    },
};

export default nextConfig;
