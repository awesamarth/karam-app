import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  eslint: {
      ignoreDuringBuilds: true,
    },
  allowedDevOrigins: ['pseudocrystalline-leigh-unvulgarly.ngrok-free.dev', 'localhost:3000'], // Add your dev origin here
  reactStrictMode: false,
};

export default nextConfig;
