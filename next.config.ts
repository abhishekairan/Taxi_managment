import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Required for static site generation
  basePath: '/Taxi_managment', // Replace with your repository name
  images: {
    unoptimized: true, // Required for static export
  },
  allowedDevOrigins: ['*'],
};

export default nextConfig;
